import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { ProgressCard } from "./ProgressCard";

interface GenderInputProps {
  onSubmit: (gender: string) => void;
}

export function GenderInput({ onSubmit }: GenderInputProps) {
  return (
    <Box sx={{ p: 2 }}>
      <ProgressCard title="Personal Information - Step 3 of 3" value={100} />

      <Stack direction="row" spacing={2} justifyContent="center" gap={3}>
        <Button
          onClick={() => onSubmit("Male")}
          variant="outlined"
          className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Male
        </Button>
        <Button
          onClick={() => onSubmit("Female")}
          variant="outlined"
          className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Female
        </Button>
        <Button
          onClick={() => onSubmit("Other")}
          variant="outlined"
          className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Other
        </Button>
      </Stack>
    </Box>
  );
}
