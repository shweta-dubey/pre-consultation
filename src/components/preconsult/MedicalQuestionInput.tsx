import React from "react";
import { Box, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProgressCard } from "./ProgressCard";
import { medicalAnswerSchema } from "../../types/preconsult";

interface MedicalQuestionInputProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onSubmit: (data: z.infer<typeof medicalAnswerSchema>) => void;
  isProcessing: boolean;
}

export function MedicalQuestionInput({
  currentQuestionIndex,
  totalQuestions,
  onSubmit,
  isProcessing,
}: MedicalQuestionInputProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof medicalAnswerSchema>>({
    resolver: zodResolver(medicalAnswerSchema),
    defaultValues: { answer: "" },
  });

  return (
    <Box sx={{ p: 2 }}>
      <ProgressCard
        title={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
        value={((currentQuestionIndex + 1) / totalQuestions) * 100}
      />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
        className="relative"
      >
        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <Box className="w-full">
              <textarea
                {...field}
                placeholder="Type your answer here... (Press Enter to submit, Shift+Enter for new line)"
                rows={3}
                className="resize-none w-full py-2 px-3 pr-10 rounded-md border border-gray-300 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isProcessing && field.value?.trim()) {
                      handleSubmit(onSubmit)();
                    }
                  }
                }}
              />
              {errors.answer && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.answer.message}
                </span>
              )}
            </Box>
          )}
        />
        <IconButton
          type="submit"
          color="primary"
          className="absolute right-3 bottom-3"
          disabled={isProcessing}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
