import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export function ProcessingIndicator() {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <CircularProgress size={24} />
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        Processing...
      </Typography>
    </Box>
  );
}
