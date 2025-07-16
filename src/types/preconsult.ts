import { z } from "zod";

export type ToastActionElement = React.ReactElement<unknown>;

export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export type Message = {
  id: number;
  role: "user" | "bot";
  content: string;
};

export type DemographicsData = {
  name: string;
  dob: string;
  gender: string;
};

export type MedicalResponse = {
  question: string;
  answer: string;
};

export type PreConsultStep =
  | "initial"
  | "agreement"
  | "demographics_name"
  | "demographics_dob"
  | "demographics_gender"
  | "loading_questions"
  | "medical_questions"
  | "submitting"
  | "finished"
  | "error"
  | "ended_by_user";

export const demographicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Please select a valid date"
    )
    .refine((dateString) => {
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 120);

      if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
      ) {
        return false;
      }

      if (date > today) {
        return false;
      }

      if (date < minDate) {
        return false;
      }

      return true;
    }, "Please enter a valid date of birth (not in future, not more than 120 years ago)"),
  gender: z.string().nonempty("Please select a gender."),
});

export const medicalAnswerSchema = z.object({
  answer: z.string().min(1, "Please provide an answer."),
});

export const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    content:
      "Hello! I'm here to ask you some questions before your doctor's visit to help them prepare. Do you agree to proceed?",
  },
];
