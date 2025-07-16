import React from "react";
import { Box, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { ProgressCard } from "./ProgressCard";

interface NameInputProps {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: NameInputProps) {
  const handleSubmit = (value: string) => {
    if (value.length >= 2) {
      onSubmit(value);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProgressCard title="Personal Information - Step 1 of 3" value={33.33} />

      <Box
        sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
        className="relative"
      >
        <Box className="w-full">
          <input
            type="text"
            placeholder="Enter your full name..."
            className="resize-none w-full py-2 px-3 pr-10 rounded-md border border-gray-300 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                handleSubmit(value);
              }
            }}
          />
        </Box>
        <IconButton
          color="primary"
          className="absolute right-3 bottom-3"
          onClick={(e) => {
            const input = e.currentTarget.parentElement?.querySelector(
              "input"
            ) as HTMLInputElement;
            const value = input?.value.trim();
            if (value) {
              handleSubmit(value);
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
