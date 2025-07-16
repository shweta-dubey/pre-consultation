import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

interface AgreementInputProps {
  onAgreement: (agreed: boolean) => void;
}

export function AgreementInput({ onAgreement }: AgreementInputProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} justifyContent="center" gap={7}>
        <Button
          onClick={() => onAgreement(true)}
          startIcon={<CheckIcon />}
          className="py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Yes, I agree
        </Button>
        <Button
          onClick={() => onAgreement(false)}
          startIcon={<CloseIcon />}
          color="error"
          className="py-2 px-4 rounded-md cursor-pointer hover:bg-red-600 hover:text-white"
        >
          No, thanks
        </Button>
      </Stack>
    </Box>
  );
}
