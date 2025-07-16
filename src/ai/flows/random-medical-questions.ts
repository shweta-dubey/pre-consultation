import { z } from "zod";

const medicalQuestions = [
  "Do you have any allergies to medications or other substances?",
  "Are you currently taking any medications or supplements?",
  "Have you experienced any recent weight loss or gain?",
  "Have you had any surgeries or hospitalizations in the past?",
  "Do you have a family history of any medical conditions, such as heart disease, diabetes, or cancer?",
  "How would you describe your sleep patterns? Do you have trouble falling asleep or staying asleep?",
  "Are you experiencing any pain or discomfort? If so, please describe the location and severity.",
  "Do you smoke, drink alcohol, or use any recreational substances?",
  "Do you have any digestive issues, such as nausea, heartburn, or changes in bowel movements?",  
  "Have you noticed any unusual symptoms recently, such as fatigue, dizziness, or changes in appetite?",
];

const inputSchema = z.object({
  numberOfQuestions: z.number().min(1).max(10),
});

const outputSchema = z.object({
  questions: z.array(z.string()),
});

export async function getRandomMedicalQuestions(
  input: z.infer<typeof inputSchema>
): Promise<z.infer<typeof outputSchema>> {
  const { numberOfQuestions } = input;

  const shuffled = [...medicalQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, numberOfQuestions);

  return { questions: selectedQuestions };
}
