"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Typography,
  Button,
  Box,
  Avatar,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import {
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  SmartToy as BotIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { ComponentProps } from "react";
import dayjs from "dayjs";

import { getRandomMedicalQuestions } from "@/ai/flows/random-medical-questions";
import { submitPreConsultData } from "./actions";

type ToastActionElement = React.ReactElement<any>;

type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    console.log(`Toast: ${title} - ${description}`);
  };

  return { toast };
};

type Message = {
  id: number;
  role: "user" | "bot";
  content: string;
};

type DemographicsData = {
  name: string;
  dob: string;
  gender: string;
};

type MedicalResponse = {
  question: string;
  answer: string;
};

const demographicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Please use DD/MM/YYYY format."
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

const medicalAnswerSchema = z.object({
  answer: z.string().min(1, "Please provide an answer."),
});

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    content:
      "Hello! I'm here to ask you some questions before your doctor's visit to help them prepare. Do you agree to proceed?",
  },
];

function ChatMessage({
  role,
  children,
}: {
  role: "user" | "bot";
  children: string;
}) {
  const theme = useTheme();
  const isBot = role === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        mb: 2,
        justifyContent: isBot ? "flex-start" : "flex-end",
      }}
    >
      {isBot && (
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 34,
            height: 34,
            mt: 0.3,
          }}
        >
          <BotIcon sx={{ fontSize: 20 }} />
        </Avatar>
      )}

      <Paper
        elevation={0}
        sx={{
          py: 1,
          px: 2,
          maxWidth: "80%",
          bgcolor: isBot ? theme.palette.grey[100] : theme.palette.primary.main,
          borderRadius: 4,
          border: isBot ? `1px solid ${theme.palette.divider}` : "none",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.5,
            color: isBot
              ? theme.palette.text.primary
              : theme.palette.primary.contrastText,
          }}
        >
          {children}
        </Typography>
      </Paper>

      {!isBot && (
        <Avatar
          sx={{
            bgcolor: theme.palette.success.main,
            width: 34,
            height: 34,
            mt: 0.3,
          }}
        >
          <PersonIcon sx={{ fontSize: 20 }} />
        </Avatar>
      )}
    </Box>
  );
}

export default function PreConsultChat() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<
    | "initial"
    | "agreement"
    | "demographics"
    | "loading_questions"
    | "medical_questions"
    | "submitting"
    | "finished"
    | "error"
    | "ended_by_user"
  >("initial");
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

  const STORAGE_KEYS = {
    STEP: "preconsult_step",
    DEMOGRAPHICS: "preconsult_demographics",
    MEDICAL_QUESTIONS: "preconsult_medical_questions",
    MEDICAL_RESPONSES: "preconsult_medical_responses",
    CURRENT_QUESTION_INDEX: "preconsult_current_question_index",
    MESSAGES: "preconsult_messages",
  };

  const saveToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const loadFromStorage = (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return defaultValue;
    }
  };

  const clearStorage = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

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

  const {
    control: demographicsControl,
    handleSubmit: handleDemographicsSubmit,
    formState: { errors: demographicsErrors },
    setValue: setDemographicsValue,
    reset: resetDemographicsForm,
  } = useForm<z.infer<typeof demographicsSchema>>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: { name: "", dob: "", gender: "" },
  });

  const {
    control: medicalControl,
    handleSubmit: handleMedicalSubmit,
    reset: resetMedicalForm,
    formState: { errors: medicalErrors },
  } = useForm<z.infer<typeof medicalAnswerSchema>>({
    resolver: zodResolver(medicalAnswerSchema),
    defaultValues: { answer: "" },
  });

  const addMessage = (role: "user" | "bot", content: string) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, role, content }]);
  };

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

        if (savedDemographics.name) {
          setDemographicsValue("name", savedDemographics.name);
        }
        if (savedDemographics.dob) {
          setDemographicsValue("dob", savedDemographics.dob);
        }
        if (savedDemographics.gender) {
          setDemographicsValue("gender", savedDemographics.gender);
        }

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
  }, []);

  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mounted]);

  if (!mounted || isRestoringSession) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <CircularProgress sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            {isRestoringSession ? "Restoring session..." : "Loading..."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we prepare your consultation
          </Typography>
        </Card>
      </Box>
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
      addMessage("bot", "Great! Let's start with a few basic questions.");
      setStep("demographics");
    } else {
      addMessage(
        "bot",
        "That's okay. Feel free to come back anytime. Have a great day!"
      );
      setStep("ended_by_user");
    }
    setIsProcessing(false);
  };

  const onDemographicsSubmit = async (
    data: z.infer<typeof demographicsSchema>
  ) => {
    setIsProcessing(true);
    addMessage(
      "user",
      `My name is ${data.name}, born on ${data.dob}, and I'm ${data.gender}.`
    );
    setDemographics(data);

    await new Promise((r) => setTimeout(r, 800));
    addMessage(
      "bot",
      "Thank you! Now I'll ask you some medical questions to help your doctor."
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
    resetMedicalForm();

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
    resetMedicalForm();
    resetDemographicsForm();

    setTimeout(() => {
      setMessages(initialMessages);
      setStep("agreement");
    }, 300);
  };

  const renderInputArea = () => {
    if (isProcessing) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Processing...
          </Typography>
        </Box>
      );
    }

    switch (step) {
      case "agreement":
        return (
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="center" gap={7}>
              <Button
                onClick={() => handleAgreement(true)}
                startIcon={<CheckIcon />}
                className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
              >
                Yes, I agree
              </Button>
              <Button
                onClick={() => handleAgreement(false)}
                startIcon={<CloseIcon />}
                color="error"
                className="py-2 px-4 rounded-md cursor-pointer hover:bg-red-600 hover:text-white"
              >
                No, thanks
              </Button>
            </Stack>
          </Box>
        );

      case "demographics":
        return (
          <Box
            component="form"
            onSubmit={handleDemographicsSubmit(onDemographicsSubmit)}
            className="p-4 flex flex-col gap-4"
          >
            <Box className="flex flex-col gap-1">
              <Typography
                variant="h5"
                className="text-lg font-medium"
                textAlign="center"
              >
                Personal Information
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Please provide your basic information to continue
              </Typography>
            </Box>
            <Controller
              name="name"
              control={demographicsControl}
              render={({ field }) => (
                <Box className="flex flex-col gap-1">
                  <label className="text-base text-gray-500">Full Name</label>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter Full Name"
                    className="w-full outline-none border border-gray-300 rounded-md py-2 px-3"
                  />
                  {demographicsErrors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      {demographicsErrors.name.message}
                    </span>
                  )}
                </Box>
              )}
            />
            <Controller
              name="dob"
              control={demographicsControl}
              render={({ field }) => (
                <Box className="flex flex-col gap-1">
                  <label className="text-base text-gray-500">
                    Date of Birth
                  </label>
                  <input
                    {...field}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full outline-none border border-gray-300 rounded-md py-2 px-3"
                    value={
                      field.value
                        ? (() => {
                            const [d, m, y] = field.value.split("/");
                            return y && m && d
                              ? `${y}-${m.padStart(2, "0")}-${d.padStart(
                                  2,
                                  "0"
                                )}`
                              : "";
                          })()
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        const [y, m, d] = val.split("-");
                        field.onChange(`${d}/${m}/${y}`);
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
                  {demographicsErrors.dob && (
                    <span className="text-red-500 text-xs mt-1">
                      {demographicsErrors.dob.message}
                    </span>
                  )}
                </Box>
              )}
            />

            <Box className="flex flex-col gap-1">
              <label className="text-base text-gray-500">Gender</label>
              <Controller
                name="gender"
                control={demographicsControl}
                render={({ field }) => (
                  <Box className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        value="Male"
                        checked={field.value === "Male"}
                        onChange={() => field.onChange("Male")}
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        value="Female"
                        checked={field.value === "Female"}
                        onChange={() => field.onChange("Female")}
                      />
                      Female
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        value="Other"
                        checked={field.value === "Other"}
                        onChange={() => field.onChange("Other")}
                      />
                      Other
                    </label>
                  </Box>
                )}
              />
              {demographicsErrors.gender && (
                <span className="text-red-500 text-xs mt-1">
                  {demographicsErrors.gender.message}
                </span>
              )}
            </Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="p-3"
            >
              Continue
            </Button>
          </Box>
        );

      case "medical_questions":
        return (
          <Box sx={{ p: 2 }}>
            <Card sx={{ mb: 2 }} className="rounded-md shadow-none p-0">
              <CardContent className="p-0">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Question {currentQuestionIndex + 1} of 5
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((currentQuestionIndex + 1) / 5) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>

            <Box
              component="form"
              onSubmit={handleMedicalSubmit(onMedicalAnswerSubmit)}
              sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
              className="relative"
            >
              <Controller
                name="answer"
                control={medicalControl}
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
                            handleMedicalSubmit(onMedicalAnswerSubmit)();
                          }
                        }
                      }}
                    ></textarea>
                    {medicalErrors.answer && (
                      <span className="text-red-500 text-xs mt-1">
                        {medicalErrors.answer.message}
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

      case "finished":
      case "error":
      case "ended_by_user":
        return (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Button
              onClick={handleRestart}
              variant="contained"
              startIcon={<RefreshIcon />}
              className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
            >
              Start New Session
            </Button>
          </Box>
        );

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
          className="flex items-center gap-1  "
        >
          <MedicalIcon />
          <Typography variant="h5" className="text-white font-bold text-xl">
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
