import React from "react";
import { Box, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

interface ActionButtonsProps {
  onRestart: () => void;
}

export function ActionButtons({ onRestart }: ActionButtonsProps) {
  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Button
        onClick={onRestart}
        variant="contained"
        startIcon={<RefreshIcon />}
        className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
      >
        Start New Session
      </Button>
    </Box>
  );
}
