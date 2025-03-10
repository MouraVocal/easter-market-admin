import { createContext } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
  isLeaving?: boolean;
}

interface ToastContextData {
  addToast: (message: string, type: Toast["type"]) => void;
}

export const ToastContext = createContext<ToastContextData>({} as ToastContextData);
