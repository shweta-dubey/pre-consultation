"use server";

import { z } from "zod";

// Patient data validation schema
const PatientDataSchema = z.object({
  demographics: z.object({
    name: z.string(),
    dob: z.string(),
    gender: z.string(),
  }),
  responses: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

type PatientData = z.infer<typeof PatientDataSchema>;

export async function submitPreConsultData(data: PatientData) {
  try {
    // Validate the data
    PatientDataSchema.parse(data);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would save to database here
    console.log("Submitted patient data:", data);

    return { success: true };
  } catch (error) {
    console.error("Error submitting data:", error);
    return { success: false, error: "Failed to submit data" };
  }
}
