import React from "react";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";

interface LoadingStateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: LoadingStateProps) {
  const theme = useTheme();

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
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Card>
    </Box>
  );
}
