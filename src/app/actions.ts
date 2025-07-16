"use server";

import { z } from "zod";

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

export async function submitPreConsultData(
  data: z.infer<typeof PatientDataSchema>
) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const isSuccess = Math.random() > 0.1; // 90% success rate

  if (isSuccess) {
    return { success: true, message: "Data submitted successfully." };
  } else {
    return {
      success: false,
      message:
        "An error occurred while submitting your responses. Please try again.",
    };
  }
}
