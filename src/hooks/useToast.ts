import { ToastProps } from "../types/preconsult";

export const useToast = () => {
  const toast = ({ title, description }: ToastProps) => {
    console.log(`Toast: ${title} - ${description}`);
  };

  return { toast };
};
