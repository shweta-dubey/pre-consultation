"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import { LocalHospital as MedicalIcon } from "@mui/icons-material";

import { getRandomMedicalQuestions } from "@/ai/flows/random-medical-questions";
import { submitPreConsultData } from "./actions";
import {
  Message,
  DemographicsData,
  MedicalResponse,
  PreConsultStep,
  initialMessages,
  medicalAnswerSchema,
} from "../types/preconsult";
import {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
  clearStorage,
} from "../utils/storage";
import {
  ChatMessage,
  AgreementInput,
  NameInput,
  DateOfBirthInput,
  GenderInput,
  MedicalQuestionInput,
  LoadingState,
  ActionButtons,
  ProcessingIndicator,
} from "../components/preconsult";
import { useToast } from "../hooks/useToast";
import { z } from "zod";

export default function PreConsultChat() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<PreConsultStep>("initial");
  const [demographics, setDemographics] = useState<Partial<DemographicsData>>(
    {}
  );
  const [medicalQuestions, setMedicalQuestions] = useState<string[]>([]);
  const [medicalResponses, setMedicalResponses] = useState<MedicalResponse[]>(
    []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(false);

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((role: "user" | "bot", content: string) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, role, content }]);
  }, []);

  // Auto-save effects
  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEYS.STEP, step);
    }
  }, [step, mounted]);

  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEYS.DEMOGRAPHICS, demographics);
    }
  }, [demographics, mounted]);

  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEYS.MEDICAL_QUESTIONS, medicalQuestions);
    }
  }, [medicalQuestions, mounted]);

  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEYS.MEDICAL_RESPONSES, medicalResponses);
    }
  }, [medicalResponses, mounted]);

  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEYS.CURRENT_QUESTION_INDEX, currentQuestionIndex);
    }
  }, [currentQuestionIndex, mounted]);

  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
    }
  }, [messages, mounted]);

  // Initialize component
  useEffect(() => {
    setMounted(true);

    const savedStep = loadFromStorage(STORAGE_KEYS.STEP, "initial");
    const savedDemographics = loadFromStorage(STORAGE_KEYS.DEMOGRAPHICS, {});
    const savedMedicalQuestions = loadFromStorage(
      STORAGE_KEYS.MEDICAL_QUESTIONS,
      []
    );
    const savedMedicalResponses = loadFromStorage(
      STORAGE_KEYS.MEDICAL_RESPONSES,
      []
    );
    const savedCurrentQuestionIndex = loadFromStorage(
      STORAGE_KEYS.CURRENT_QUESTION_INDEX,
      0
    );
    const savedMessages = loadFromStorage(STORAGE_KEYS.MESSAGES, []);

    if (savedStep !== "initial" && savedMessages.length > 0) {
      setIsRestoringSession(true);

      setTimeout(() => {
        setStep(savedStep);
        setDemographics(savedDemographics);
        setMedicalQuestions(savedMedicalQuestions);
        setMedicalResponses(savedMedicalResponses);
        setCurrentQuestionIndex(savedCurrentQuestionIndex);
        setMessages(savedMessages);

        setIsRestoringSession(false);
        toast({
          title: "Session Restored",
          description: "Your previous session has been restored.",
        });
      }, 1000);
    } else {
      const timer = setTimeout(() => {
        setMessages(initialMessages);
        setStep("agreement");
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mounted]);

  if (!mounted || isRestoringSession) {
    return (
      <LoadingState
        title={isRestoringSession ? "Restoring session..." : "Loading..."}
        description="Please wait while we prepare your consultation"
      />
    );
  }

  const handleAgreement = async (agreed: boolean) => {
    setIsProcessing(true);
    addMessage(
      "user",
      agreed ? "Yes, I agree." : "No, I don't want to continue."
    );

    await new Promise((r) => setTimeout(r, 800));

    if (agreed) {
      addMessage(
        "bot",
        "Great! Let's start with your name. What's your full name?"
      );
      setStep("demographics_name");
    } else {
      addMessage(
        "bot",
        "I understand. Please let me know when you're ready to begin."
      );
      setStep("ended_by_user");
    }
    setIsProcessing(false);
  };

  const onNameSubmit = async (name: string) => {
    setIsProcessing(true);
    addMessage("user", name);
    setDemographics((prev) => ({ ...prev, name }));

    await new Promise((r) => setTimeout(r, 800));
    addMessage("bot", "Great! Now, what's your date of birth?");
    setStep("demographics_dob");
    setIsProcessing(false);
  };

  const onDobSubmit = async (dob: string) => {
    setIsProcessing(true);
    addMessage("user", dob);
    setDemographics((prev) => ({ ...prev, dob }));

    await new Promise((r) => setTimeout(r, 800));
    addMessage("bot", "Thank you! Please select your gender:");
    setStep("demographics_gender");
    setIsProcessing(false);
  };

  const onGenderSubmit = async (gender: string) => {
    setIsProcessing(true);
    addMessage("user", gender);
    setDemographics((prev) => ({ ...prev, gender }));

    await new Promise((r) => setTimeout(r, 800));
    addMessage(
      "bot",
      "Perfect! Now I'll ask you some medical questions to help your doctor."
    );
    setStep("loading_questions");

    try {
      const result = await getRandomMedicalQuestions({ numberOfQuestions: 5 });
      if (result.questions && result.questions.length > 0) {
        setMedicalQuestions(result.questions);
        await new Promise((r) => setTimeout(r, 800));
        addMessage("bot", result.questions[0]);
        setStep("medical_questions");
      } else {
        throw new Error("Failed to generate questions.");
      }
    } catch (error) {
      console.error(error);
      addMessage(
        "bot",
        "I'm having trouble right now. Please try again in a moment."
      );
      setStep("error");
    }
    setIsProcessing(false);
  };

  const onMedicalAnswerSubmit = async (
    data: z.infer<typeof medicalAnswerSchema>
  ) => {
    setIsProcessing(true);
    const currentQuestion = medicalQuestions[currentQuestionIndex];
    addMessage("user", data.answer);

    const newResponses = [
      ...medicalResponses,
      { question: currentQuestion, answer: data.answer },
    ];
    setMedicalResponses(newResponses);

    await new Promise((r) => setTimeout(r, 800));

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < medicalQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      addMessage("bot", medicalQuestions[nextIndex]);
      setIsProcessing(false);
    } else {
      addMessage(
        "bot",
        "Thank you for answering all questions. I'm now submitting your information."
      );
      setStep("submitting");

      const finalData = {
        demographics: demographics as DemographicsData,
        responses: newResponses,
      };

      const result = await submitPreConsultData(finalData);

      if (result.success) {
        addMessage(
          "bot",
          "Perfect! Your information has been saved. Your doctor will review it before your appointment."
        );
        setStep("finished");
      } else {
        addMessage(
          "bot",
          "There was an issue saving your information. Please try again."
        );
        setStep("error");
      }
      setIsProcessing(false);
    }
  };

  const handleRestart = () => {
    clearStorage();
    setMessages([]);
    setStep("initial");
    setDemographics({});
    setMedicalQuestions([]);
    setMedicalResponses([]);
    setCurrentQuestionIndex(0);

    setTimeout(() => {
      setMessages(initialMessages);
      setStep("agreement");
    }, 300);
  };

  const renderInputArea = () => {
    if (isProcessing) {
      return <ProcessingIndicator />;
    }

    switch (step) {
      case "agreement":
        return <AgreementInput onAgreement={handleAgreement} />;

      case "demographics_name":
        return <NameInput onSubmit={onNameSubmit} />;

      case "demographics_dob":
        return (
          <DateOfBirthInput onSubmit={onDobSubmit} addMessage={addMessage} />
        );

      case "demographics_gender":
        return <GenderInput onSubmit={onGenderSubmit} />;

      case "medical_questions":
        return (
          <MedicalQuestionInput
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={5}
            onSubmit={onMedicalAnswerSubmit}
            isProcessing={isProcessing}
          />
        );

      case "finished":
      case "error":
      case "ended_by_user":
        return <ActionButtons onRestart={handleRestart} />;

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 500,
        maxWidth: 500,
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        "@media (max-width: 767px)": {
          width: "100%",
          maxWidth: "100%",
          height: "fit-content",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
        className="p-4 text-center flex flex-col gap-2"
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          className="flex items-center gap-1"
        >
          <MedicalIcon />
          <Typography
            variant="h5"
            className="text-white font-bold text-base sm:text-xl"
          >
            Pre-Consultation Assistant
          </Typography>
        </Stack>
        <Typography variant="body2" className="text-white text-base">
          Your personal health assistant
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role}>
            {msg.content}
          </ChatMessage>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      <Box sx={{ bgcolor: theme.palette.background.paper }}>
        {renderInputArea()}
      </Box>
    </Paper>
  );
}
