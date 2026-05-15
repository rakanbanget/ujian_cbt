import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { examApi } from '../api/examApi';
import { examStateStorage, timerStorage } from '../utils/storage';

const ExamContext = createContext(null);

export const ExamProvider = ({ children, examId }) => {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [doubtfulQuestions, setDoubtfulQuestions] = useState(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const pendingSavesRef = useRef(new Map());
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const loadExamData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await examApi.getSoal(examId);

        if (result.success) {
          const { ujian, questions: apiQuestions } = result.data;
          
          // Map API questions to frontend format
          const formattedQuestions = apiQuestions.map((q, index) => ({
            id: q.id,
            number: index + 1,
            question: q.pertanyaan || q.soal || q.question || 'Pertanyaan tidak tersedia.',
            image: q.gambar || q.image,
            options: {
              A: { 
                text: q.pilihan_a || q.option_a || q.opsi_a,
                image: q.pilihan_a_gambar || q.gambar_a || q.opsi_a_gambar || q.opsi_a_image || q.option_a_image || q.option_a_gambar
              },
              B: { 
                text: q.pilihan_b || q.option_b || q.opsi_b,
                image: q.pilihan_b_gambar || q.gambar_b || q.opsi_b_gambar || q.opsi_b_image || q.option_b_image || q.option_b_gambar
              },
              C: { 
                text: q.pilihan_c || q.option_c || q.opsi_c,
                image: q.pilihan_c_gambar || q.gambar_c || q.opsi_c_gambar || q.opsi_c_image || q.option_c_image || q.option_c_gambar
              },
              D: { 
                text: q.pilihan_d || q.option_d || q.opsi_d,
                image: q.pilihan_d_gambar || q.gambar_d || q.opsi_d_gambar || q.opsi_d_image || q.option_d_image || q.option_d_gambar
              },
              E: { 
                text: q.pilihan_e || q.option_e || q.opsi_e,
                image: q.pilihan_e_gambar || q.gambar_e || q.opsi_e_gambar || q.opsi_e_image || q.option_e_image || q.option_e_gambar
              },
            }
          }));

          setExam(ujian);
          setQuestions(formattedQuestions);

          // --- FIX TIMER: Pulihkan sisa waktu dari localStorage ---
          const savedTime = timerStorage.get(examId);
          if (savedTime !== null && savedTime > 0) {
            // Lanjutkan dari waktu yang tersisa (sudah dikoreksi waktu berlalu)
            setTimeRemaining(savedTime);
          } else {
            // Mulai dari awal hanya jika belum ada timer tersimpan
            setTimeRemaining((ujian.duration || 60) * 60);
          }

          // Restore state
          const savedState = examStateStorage.get(examId);
          if (savedState) {
            setAnswers(savedState.answers || {});
            setDoubtfulQuestions(new Set(savedState.doubtfulQuestions || []));
            setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
          }
        } else {
          setError(result.error || 'Gagal memuat soal ujian.');
        }
      } catch (err) {
        console.error('Error loading exam:', err);
        setError('Terjadi kesalahan jaringan atau server.');
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) loadExamData();
  }, [examId]);

  // Tick timer dan simpan ke localStorage tiap 10 detik
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          timerStorage.remove(examId);
          handleSubmitExam();
          return 0;
        }
        const next = prev - 1;
        // Simpan ke localStorage tiap 10 detik agar tidak terlalu sering write
        if (next % 10 === 0) {
          timerStorage.set(examId, next);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining === null, examId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!examId || isLoading) return;
    const state = {
      answers,
      doubtfulQuestions: Array.from(doubtfulQuestions),
      currentQuestionIndex,
      lastSaved: new Date().toISOString(),
    };
    examStateStorage.set(examId, state);
  }, [examId, answers, doubtfulQuestions, currentQuestionIndex, isLoading]);

  const saveAnswerToAPI = useCallback(async (questionId, answer, isDoubtful) => {
    pendingSavesRef.current.set(questionId, { answer, isDoubtful });
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      pendingSavesRef.current.clear();
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsSaving(false);
    }, 3000);
  }, [examId]);

  const setAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    saveAnswerToAPI(questionId, answer, doubtfulQuestions.has(questionId));
  }, [saveAnswerToAPI, doubtfulQuestions]);

  const toggleDoubtful = useCallback((questionId) => {
    setDoubtfulQuestions((prev) => {
      const newSet = new Set(prev);
      const isNowDoubtful = !newSet.has(questionId);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      saveAnswerToAPI(questionId, answers[questionId], isNowDoubtful);
      return newSet;
    });
  }, [saveAnswerToAPI, answers]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) setCurrentQuestionIndex(index);
  }, [questions.length]);

  const nextQuestion = useCallback(() => goToQuestion(currentQuestionIndex + 1), [currentQuestionIndex, goToQuestion]);
  const previousQuestion = useCallback(() => goToQuestion(currentQuestionIndex - 1), [currentQuestionIndex, goToQuestion]);

  const handleSubmitExam = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await examApi.submitJawaban(examId, answers);
      
      setIsSaving(false);
      
      if (result.success) {
        // Bersihkan semua state lokal termasuk timer
        examStateStorage.remove(examId);
        timerStorage.remove(examId);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Gagal mengirim jawaban.');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Submission error:', err);
      setIsSaving(false);
      setError('Terjadi kesalahan saat mengirim jawaban.');
      return { success: false, error: 'Terjadi kesalahan jaringan.' };
    }
  }, [examId, answers]);

  const getQuestionStatus = useCallback((questionId) => {
    if (doubtfulQuestions.has(questionId)) return 'doubtful';
    if (answers[questionId]) return 'answered';
    return 'unanswered';
  }, [answers, doubtfulQuestions]);

  const value = {
    exam, questions, answers, doubtfulQuestions, currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    timeRemaining, isLoading, error, isSaving,
    setAnswer, toggleDoubtful, goToQuestion, nextQuestion, previousQuestion,
    handleSubmitExam, getQuestionStatus,
    answeredCount: Object.keys(answers).length,
    doubtfulCount: doubtfulQuestions.size,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within ExamProvider');
  return context;
};
