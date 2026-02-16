import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { examApi } from '../api/examApi';
import { examStateStorage } from '../utils/storage';

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

  // Refs for auto-save
  const saveTimeoutRef = useRef(null);
  const pendingSavesRef = useRef(new Map());

  // Load exam data
  // Load exam data
  useEffect(() => {
    const loadExamData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load questions
        const questionsResult = await examApi.getSoal(examId);
        if (!questionsResult.success) throw new Error(questionsResult.error);

        // Map API format to frontend format
        const apiData = questionsResult.data;
        let mappedQuestions = apiData.questions.map((q) => ({
          id: q.id,
          // number will be assigned after shuffle
          question: q.pertanyaan,
          image: q.gambar,
          options: {
            A: { text: q.opsi_a, image: q.opsi_a_image },
            B: { text: q.opsi_b, image: q.opsi_b_image },
            C: { text: q.opsi_c, image: q.opsi_c_image },
            D: { text: q.opsi_d, image: q.opsi_d_image },
            E: { text: q.opsi_e, image: q.opsi_e_image },
          },
          bobot: q.bobot
        }));

        // Shuffle questions
        for (let i = mappedQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mappedQuestions[i], mappedQuestions[j]] = [mappedQuestions[j], mappedQuestions[i]];
        }

        // Re-index questions to be sequential (1, 2, 3...)
        mappedQuestions = mappedQuestions.map((q, index) => ({
          ...q,
          number: index + 1
        }));

        // Set exam metadata (duration is not in API response for getSoal, assume default or derive from known types)
        // Since API doesn't provide exam details like duration, we might need a lookup or update API.
        // For strictly following API, we use what we have. 
        // Ideally we would fetch exam details from a specific endpoint or look it up from a list we fetched earlier.
        // Assuming we rely on frontend constants for metadata like duration for now as the API doc is sparse on that.
        // Let's use a default duration or try to match with ID.
        const examTypes = {
          '1': { duration: 90, title: 'Ujian Akademik' },
          '2': { duration: 60, title: 'Ujian Psikotes' },
          '3': { duration: 75, title: 'Ujian Lainnya' }
        };
        const defaultDuration = 60;
        const examMeta = examTypes[examId] || { duration: defaultDuration, title: apiData.ujian };

        setExam({
          id: examId,
          title: apiData.ujian || examMeta.title,
          description: 'Ujian Online', // API doesn't provide description
          duration: examMeta.duration,
          total_questions: mappedQuestions.length,
        });

        setQuestions(mappedQuestions);
        setTimeRemaining(examMeta.duration * 60);

        // Try to restore previous state
        const savedState = examStateStorage.get(examId);
        if (savedState) {
          setAnswers(savedState.answers || {});
          setDoubtfulQuestions(new Set(savedState.doubtfulQuestions || []));
          setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      loadExamData();
    }
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(); // Auto-submit when time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Auto-save state to localStorage
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

  // Debounced auto-save to API
  const saveAnswerToAPI = useCallback(async (questionId, answer, isDoubtful) => {
    // TEMPORARY: Mock auto-save untuk demo
    // TODO: Uncomment code di bawah untuk real API integration

    // Add to pending saves
    pendingSavesRef.current.set(questionId, { answer, isDoubtful });

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);

      // Mock save (just clear pending)
      pendingSavesRef.current.clear();

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsSaving(false);
    }, 3000);

    /* REAL API INTEGRATION (uncomment when backend ready):
    // Add to pending saves
    pendingSavesRef.current.set(questionId, { answer, isDoubtful });

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);

      // Process all pending saves
      const saves = Array.from(pendingSavesRef.current.entries());
      pendingSavesRef.current.clear();

      for (const [qId, data] of saves) {
        await examApi.submitAnswer(examId, qId, data.answer, data.isDoubtful);
      }

      setIsSaving(false);
    }, 3000);
    */
  }, [examId]);

  // Set answer
  const setAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    const isDoubtful = doubtfulQuestions.has(questionId);
    saveAnswerToAPI(questionId, answer, isDoubtful);
  }, [doubtfulQuestions, saveAnswerToAPI]);

  // Toggle doubtful
  const toggleDoubtful = useCallback((questionId) => {
    setDoubtfulQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });

    const answer = answers[questionId];
    if (answer) {
      const isDoubtful = !doubtfulQuestions.has(questionId);
      saveAnswerToAPI(questionId, answer, isDoubtful);
    }
  }, [answers, doubtfulQuestions, saveAnswerToAPI]);

  // Navigate questions
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  const nextQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex + 1);
  }, [currentQuestionIndex, goToQuestion]);

  const previousQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex - 1);
  }, [currentQuestionIndex, goToQuestion]);


  // Submit exam
  const handleSubmitExam = useCallback(async () => {
    setIsSaving(true);

    try {
      // Transform answers to API format (lowercase options)
      const apiAnswers = {};
      Object.entries(answers).forEach(([qId, option]) => {
        if (option) {
          apiAnswers[qId] = option.toLowerCase();
        }
      });

      // Submit to API
      const result = await examApi.submitJawaban(examId, apiAnswers);

      if (result.success) {
        // Clear saved state
        examStateStorage.remove(examId);

        // You might want to return the score/result here or navigate
        return { success: true, data: result.data };
      } else if (result.alreadySubmitted) {
        // Handle specifically if desired
        examStateStorage.remove(examId);
        return { success: false, error: result.error, alreadySubmitted: true, score: result.score };
      }

      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: err.message || 'Submission failed' };
    } finally {
      setIsSaving(false);
    }
  }, [examId, answers]);

  // Get question status
  const getQuestionStatus = useCallback((questionId) => {
    if (doubtfulQuestions.has(questionId)) return 'doubtful';
    if (answers[questionId]) return 'answered';
    return 'unanswered';
  }, [answers, doubtfulQuestions]);

  const value = {
    exam,
    questions,
    answers,
    doubtfulQuestions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    timeRemaining,
    isLoading,
    error,
    isSaving,
    setAnswer,
    toggleDoubtful,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    handleSubmitExam,
    getQuestionStatus,
    answeredCount: Object.keys(answers).length,
    doubtfulCount: doubtfulQuestions.size,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within ExamProvider');
  }
  return context;
};
