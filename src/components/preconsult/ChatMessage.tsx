import React from "react";
import { Box, Avatar, Paper, Typography, useTheme } from "@mui/material";
import { SmartToy as BotIcon, Person as PersonIcon } from "@mui/icons-material";

interface ChatMessageProps {
  role: "user" | "bot";
  children: string;
}

export function ChatMessage({ role, children }: ChatMessageProps) {
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
