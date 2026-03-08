import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Load exam data
  useEffect(() => {
    const loadExamData = async () => {
      setIsLoading(true);
      setError(null);

      // DEMO MODE: Use mock data
      setTimeout(() => {
        const examTypes = {
          '1': {
            id: 1,
            title: 'TPA - Tes Potensi Akademik',
            total_questions: 15,
            duration: 90,
          },
          '2': {
            id: 2,
            title: 'TBI - Tes Bahasa Inggris',
            total_questions: 12,
            duration: 60,
          },
          '3': {
            id: 3,
            title: 'TPU - Tes Pengetahuan Umum',
            total_questions: 20,
            duration: 75,
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
          },
          bobot: 1,
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
        // Load questions from API
        const result = await examApi.getSoal(examId);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        // Map API response to frontend format
        const mappedQuestions = result.data.questions.map((q, index) => ({
          id: q.id,
          number: index + 1,
          question: q.pertanyaan,
          image: q.gambar || null,
          options: {
            A: q.opsi_a,
            B: q.opsi_b,
            C: q.opsi_c,
            D: q.opsi_d,
          },
          bobot: q.bobot || 1,
        }));

        // Create exam object
        const examData = {
          id: examId,
          title: result.data.ujian,
          total_questions: mappedQuestions.length,
          duration: 90, // Default 90 minutes, adjust if API provides duration
        };

        setExam(examData);
        setQuestions(mappedQuestions);
        setTimeRemaining(examData.duration * 60); // Convert to seconds

        // Try to restore previous state
        const savedState = examStateStorage.get(examId);
        if (savedState) {
          setAnswers(savedState.answers || {});
          setDoubtfulQuestions(new Set(savedState.doubtfulQuestions || []));
          setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
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

  // Auto-save state to localStorage only (backend doesn't support incremental saves)
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

  // Set answer
  const setAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

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
  }, []);

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

    // DEMO MODE: Mock submit
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate mock results
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Math.floor(answeredQuestions * 0.7); // 70% correct
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(2) : 0;
    
    setIsSaving(false);
    
    // Clear saved state
    examStateStorage.remove(examId);
    
    return { 
      success: true, 
      results: {
        score: parseFloat(score),
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        earned_raw_score: correctAnswers * 5,
        max_raw_score: totalQuestions * 5
      }
    };

    /* REAL API INTEGRATION (uncomment when backend ready):
    try {
      // Convert answers to lowercase format (A → a, B → b, etc.)
      const formattedAnswers = {};
      Object.keys(answers).forEach(questionId => {
        formattedAnswers[questionId] = answers[questionId].toLowerCase();
      });

      // Submit to API
      const result = await examApi.submitJawaban(examId, formattedAnswers);
      
      setIsSaving(false);

      if (result.success) {
        // Clear saved state
        examStateStorage.remove(examId);
        return { 
          success: true, 
          results: result.data 
        };
      } else if (result.alreadySubmitted) {
        // User already submitted this exam
        examStateStorage.remove(examId);
        return { 
          success: false, 
          error: result.error,
          alreadySubmitted: true,
          score: result.score
        };
      } else {
        return { 
          success: false, 
          error: result.error 
        };
      }
    } catch (err) {
      setIsSaving(false);
      return { 
        success: false, 
        error: err.message 
      };
    }
    */
  }, [examId, answers, questions.length]);

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
