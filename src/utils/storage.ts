export const STORAGE_KEYS = {
  STEP: "preconsult_step",
  DEMOGRAPHICS: "preconsult_demographics",
  MEDICAL_QUESTIONS: "preconsult_medical_questions",
  MEDICAL_RESPONSES: "preconsult_medical_responses",
  CURRENT_QUESTION_INDEX: "preconsult_current_question_index",
  MESSAGES: "preconsult_messages",
} as const;

export const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const loadFromStorage = (key: string, defaultValue: unknown = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

export const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
