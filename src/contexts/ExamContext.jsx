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
  useEffect(() => {
    const loadExamData = async () => {
      setIsLoading(true);
      setError(null);

      // TEMPORARY: Mock data untuk demo/testing UI
      // TODO: Uncomment code di bawah untuk real API integration
      
      setTimeout(() => {
        // Mock exam data based on examId
        const examTypes = {
          '1': {
            id: 1,
            title: 'TPA - Tes Potensi Akademik',
            description: 'Tes kemampuan berpikir logis, analitis, dan pemecahan masalah',
            duration: 90, // minutes
            total_questions: 15,
          },
          '2': {
            id: 2,
            title: 'TBI - Tes Bahasa Inggris',
            description: 'Tes kemampuan bahasa Inggris meliputi reading, listening, dan grammar',
            duration: 60, // minutes
            total_questions: 12,
          },
          '3': {
            id: 3,
            title: 'TPU - Tes Pengetahuan Umum',
            description: 'Tes pengetahuan umum tentang berbagai bidang ilmu',
            duration: 75, // minutes
            total_questions: 20,
          },
        };

        const mockExam = examTypes[examId] || examTypes['1'];

        // Mock questions
        const mockQuestions = Array.from({ length: mockExam.total_questions }, (_, i) => ({
          id: i + 1,
          number: i + 1,
          question: `Soal ${mockExam.title} nomor ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?`,
          options: {
            A: `Opsi A untuk soal ${i + 1}`,
            B: `Opsi B untuk soal ${i + 1}`,
            C: `Opsi C untuk soal ${i + 1}`,
            D: `Opsi D untuk soal ${i + 1}`,
            E: `Opsi E untuk soal ${i + 1}`,
          },
        }));

        setExam(mockExam);
        setQuestions(mockQuestions);
        setTimeRemaining(mockExam.duration * 60);

        // Try to restore previous state
        const savedState = examStateStorage.get(examId);
        if (savedState) {
          setAnswers(savedState.answers || {});
          setDoubtfulQuestions(new Set(savedState.doubtfulQuestions || []));
          setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
        }

        setIsLoading(false);
      }, 1000);

      /* REAL API INTEGRATION (uncomment when backend ready):
      try {
        // Load exam details
        const examResult = await examApi.getExam(examId);
        if (!examResult.success) throw new Error(examResult.error);

        // Load questions
        const questionsResult = await examApi.getQuestions(examId);
        if (!questionsResult.success) throw new Error(questionsResult.error);

        setExam(examResult.data);
        setQuestions(questionsResult.data.questions || []);
        setTimeRemaining(examResult.data.duration * 60); // Convert to seconds

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
      */
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
    // TEMPORARY: Mock submit untuk demo
    // TODO: Uncomment code di bawah untuk real API integration
    
    setIsSaving(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);

    // Clear saved state
    examStateStorage.remove(examId);
    
    return { success: true };

    /* REAL API INTEGRATION (uncomment when backend ready):
    // Force save any pending answers
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);

    // Save all pending
    const saves = Array.from(pendingSavesRef.current.entries());
    for (const [qId, data] of saves) {
      await examApi.submitAnswer(examId, qId, data.answer, data.isDoubtful);
    }

    // Submit exam
    const result = await examApi.submitExam(examId);
    
    setIsSaving(false);

    if (result.success) {
      // Clear saved state
      examStateStorage.remove(examId);
      return { success: true };
    }

    return { success: false, error: result.error };
    */
  }, [examId]);

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
