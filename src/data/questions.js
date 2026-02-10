// Temporary hardcoded questions for development/testing
// This will be replaced with API data in production

export const mockQuestions = [
  {
    id: 1,
    number: 1,
    question: "Apa ibu kota Indonesia?",
    options: {
      A: "Jakarta",
      B: "Bandung",
      C: "Surabaya",
      D: "Medan",
      E: "Yogyakarta"
    }
  },
  {
    id: 2,
    number: 2,
    question: "Berapa hasil dari 2 + 2?",
    options: {
      A: "3",
      B: "4",
      C: "5",
      D: "6",
      E: "7"
    }
  },
  {
    id: 3,
    number: 3,
    question: "Siapa presiden pertama Indonesia?",
    options: {
      A: "Soekarno",
      B: "Soeharto",
      C: "Habibie",
      D: "Megawati",
      E: "SBY"
    }
  },
  // Add more questions as needed for testing
];

export const mockExam = {
  id: 1,
  title: "Ujian Tengah Semester",
  description: "Ujian untuk mata pelajaran Matematika",
  duration: 60, // minutes
  total_questions: 40,
};
