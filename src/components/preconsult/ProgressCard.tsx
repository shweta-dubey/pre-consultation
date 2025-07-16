import React from "react";
import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

interface ProgressCardProps {
  title: string;
  value: number;
}

export function ProgressCard({ title, value }: ProgressCardProps) {
  return (
    <Card sx={{ mb: 2 }} className="rounded-md shadow-none p-0">
      <CardContent className="p-0">
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );
}
