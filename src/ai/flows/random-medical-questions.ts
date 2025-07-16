import { z } from "zod";

export async function getRandomMedicalQuestions({
  numberOfQuestions = 5,
}: {
  numberOfQuestions?: number;
} = {}): Promise<{
  questions: string[];
}> {
  // Input validation
  const inputSchema = z.object({
    numberOfQuestions: z.number().min(1).max(20).default(5),
  });

  // Output validation
  const outputSchema = z.object({
    questions: z.array(z.string()),
  });

  // Validate input
  inputSchema.parse({ numberOfQuestions });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const medicalQuestions = [
    "Do you have any known allergies to medications, foods, or environmental factors?",
    "Are you currently taking any prescription medications, over-the-counter drugs, or supplements?",
    "Have you had any surgeries or hospitalizations in the past year?",
    "Do you have any chronic medical conditions such as diabetes, high blood pressure, or heart disease?",
    "Have you experienced any recent changes in your appetite, weight, or sleep patterns?",
    "Do you smoke, drink alcohol, or use any recreational substances?",
    "Have you traveled to any foreign countries recently?",
    "Are you experiencing any pain, discomfort, or unusual symptoms currently?",
    "Do you have a family history of any significant medical conditions?",
    "Are you up to date with your routine vaccinations and screenings?",
    "Have you been exposed to anyone with contagious illnesses recently?",
    "Do you have any concerns about your mental health or stress levels?",
    "Are you currently pregnant or could you be pregnant?",
    "Have you noticed any changes in your vision, hearing, or other senses?",
    "Do you have any mobility issues or physical limitations?",
  ];

  // Randomly select questions
  const shuffled = [...medicalQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, numberOfQuestions);

  const result = { questions: selectedQuestions };

  // Validate output
  outputSchema.parse(result);

  return result;
}
