import React, { useState, useRef } from "react";
import { Box, IconButton, InputAdornment, useTheme } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ProgressCard } from "./ProgressCard";

interface DateOfBirthInputProps {
  onSubmit: (dob: string) => void;
  addMessage: (role: "user" | "bot", content: string) => void;
}

export function DateOfBirthInput({
  onSubmit,
  addMessage,
}: DateOfBirthInputProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [openPicker, setOpenPicker] = useState(false);
  const datePickerRef = useRef();

  const handleSubmit = () => {
    if (selectedDate) {
      const today = dayjs();
      const minDate = today.subtract(120, "year");

      if (selectedDate.isAfter(today)) {
        addMessage("bot", "Please select a date that is not in the future.");
        setSelectedDate(null);
        return;
      }

      if (selectedDate.isBefore(minDate)) {
        addMessage(
          "bot",
          "Please select a date that is not more than 120 years ago."
        );
        setSelectedDate(null);
        return;
      }

      const formattedDate = selectedDate.format("DD/MM/YYYY");
      onSubmit(formattedDate);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProgressCard title="Personal Information - Step 2 of 3" value={66.66} />

      <Box
        sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
        className="relative"
      >
        <Box
          className="w-full"
          sx={{
            "& .MuiPickersInputBase-root": {
              border: "1px solid #e4e4e7 !important",
              borderRadius: "8px",
            },
          }}
        >
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            open={openPicker}
            onClose={() => setOpenPicker(false)}
            onOpen={() => setOpenPicker(true)}
            maxDate={dayjs()}
            minDate={dayjs().subtract(120, "year")}
            shouldDisableDate={(date) => {
              const today = dayjs();
              const minDate = today.subtract(120, "year");
              return date.isAfter(today) || date.isBefore(minDate);
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fafafa",
                "& fieldset": {
                  borderColor: theme.palette.grey[300],
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
                fontWeight: 500,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              "& .MuiInputBase-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
            slotProps={{
              textField: {
                placeholder: "DD/MM/YYYY",
                fullWidth: true,
                helperText: selectedDate
                  ? "Selected date - Click the arrow to continue"
                  : "Click the calendar icon to select your date of birth",
                variant: "outlined",
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={() => setOpenPicker(true)}>
                        <CalendarMonthIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                inputRef: datePickerRef,
              },
              actionBar: {
                actions: ["clear", "accept"],
              },
              popper: {
                placement: "bottom-start",
                sx: {
                  "& .MuiPaper-root": {
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: `1px solid ${theme.palette.grey[200]}`,
                    overflow: "hidden",
                  },
                  "& .MuiPickersCalendarHeader-root": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    borderRadius: "0",
                    padding: "16px 24px",
                    margin: 0,
                  },
                  "& .MuiPickersCalendarHeader-label": {
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "white",
                  },
                  "& .MuiPickersArrowSwitcher-button": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  },
                  "& .MuiPickersDay-root": {
                    fontSize: "14px",
                    fontWeight: 500,
                    width: "36px",
                    height: "36px",
                    margin: "2px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease-in-out",
                  },
                  "& .MuiPickersDay-root.Mui-disabled": {
                    color: "#bdbdbd !important",
                    backgroundColor: "#f5f5f5 !important",
                    opacity: "0.5 !important",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "15%",
                      right: "15%",
                      height: "1.5px",
                      backgroundColor: "#bdbdbd",
                      transform: "translateY(-50%) rotate(-15deg)",
                    },
                    "&:hover": {
                      backgroundColor: "#f5f5f5 !important",
                      cursor: "not-allowed",
                    },
                  },
                  "& .MuiPickersDay-today": {
                    border: `2px solid ${theme.palette.primary.main}`,
                    fontWeight: 600,
                    backgroundColor: "transparent",
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: "white !important",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.dark} !important`,
                    },
                  },
                  "& .MuiPickersDay-root:not(.Mui-disabled):not(.Mui-selected)":
                    {
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.light}20`,
                        color: theme.palette.primary.main,
                        transform: "scale(1.05)",
                      },
                    },
                  "& .MuiDayCalendar-weekDayLabel": {
                    fontSize: "12px",
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                    margin: "4px",
                  },
                  "& .MuiDayCalendar-monthContainer": {
                    padding: "16px",
                  },
                  "& .MuiDialogActions-root": {
                    padding: "8px 16px 16px 16px",
                    gap: "8px",
                  },
                  "& .MuiButton-root": {
                    borderRadius: "6px",
                    textTransform: "none",
                    fontWeight: 500,
                  },
                },
              },
            }}
            slots={{ openPickerIcon: () => null }}
            format="DD/MM/YYYY"
            views={["year", "month", "day"]}
            openTo="year"
          />
        </Box>
        {selectedDate && (
          <IconButton
            color="primary"
            className="absolute right-3 top-2"
            onClick={handleSubmit}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              width: "40px",
              height: "40px",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <SendIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
