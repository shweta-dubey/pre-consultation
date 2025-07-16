import { Box } from "@mui/material";
import PreConsultChat from "./preconsult-chat";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: { xs: 2, sm: 3, lg: 4 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(124, 58, 237, 0.2) 0%, transparent 50%)
          `,
          zIndex: 1,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
          zIndex: 1,
        },
        "@keyframes float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
      }}
    >
      {/* Floating decoration elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: "100px",
          height: "100px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "20%",
          width: "150px",
          height: "150px",
          background: "rgba(124, 58, 237, 0.1)",
          borderRadius: "50%",
          animation: "float 7s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          zIndex: 2,
          position: "relative",
        }}
      >
        <PreConsultChat />
      </Box>
    </Box>
  );
}
