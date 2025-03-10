import { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
  isLeaving?: boolean;
}

interface ToastContextData {
  addToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
`;

const ToastItem = styled.div<{ type: Toast['type']; isLeaving: boolean }>`
  min-width: 300px;
  margin-bottom: 8px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme, type }) =>
    type === 'success' ? theme.colors.blue[500] : theme.colors.blue[700]};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  animation: ${({ isLeaving }) => (isLeaving ? slideOut : slideIn)} 0.3s ease-in-out;

  svg {
    margin-right: 8px;
  }
`;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString();
    setToasts((state) => [...state, { id, message, type }]);

    setTimeout(() => {
      setToasts((state) => state.map((toast) => 
        toast.id === id ? { ...toast, isLeaving: true } : toast
      ));
      
      setTimeout(() => {
        setToasts((state) => state.filter((toast) => toast.id !== id));
      }, 300);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} type={toast.type} isLeaving={toast.isLeaving || false}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}