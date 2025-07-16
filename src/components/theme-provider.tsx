"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", 
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#7c3aed",
      light: "#8b5cf6",
      dark: "#6d28d9",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    h4: {
      fontWeight: 700,
      background: "linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h6: {
      fontWeight: 600,
      color: "#1e293b",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      color: "#64748b",
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.25)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          overflow: "hidden",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 16,
          fontWeight: 600,
          padding: "14px 28px",
          fontSize: "1rem",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.3)",
          },
          "&:active": {
            transform: "translateY(-1px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          color: "white",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
            boxShadow: "0 12px 48px rgba(37, 99, 235, 0.4)",
          },
        },
        outlined: {
          borderColor: "#2563eb",
          color: "#2563eb",
          borderWidth: 2,
          background: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            borderColor: "#1d4ed8",
            backgroundColor: "rgba(37, 99, 235, 0.08)",
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
            "&.Mui-focused": {
              transform: "translateY(-2px)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 8px 32px rgba(37, 99, 235, 0.2)",
            },
            "& fieldset": {
              borderWidth: 2,
              borderColor: "rgba(148, 163, 184, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(37, 99, 235, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
            color: "#64748b",
            "&.Mui-focused": {
              color: "#2563eb",
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
            "&.Mui-focused": {
              transform: "translateY(-2px)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 8px 32px rgba(37, 99, 235, 0.2)",
            },
            "& fieldset": {
              borderWidth: 2,
              borderColor: "rgba(148, 163, 184, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(37, 99, 235, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
            color: "#64748b",
            "&.Mui-focused": {
              color: "#2563eb",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "all 0.3s ease",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.3)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.1)",
            background: "rgba(37, 99, 235, 0.1)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
  },
  cssVariables: true,
});

export function MUIThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
