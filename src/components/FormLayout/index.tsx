import { Form } from "./styles";

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormLayout({ children, onSubmit }: FormLayoutProps) {
  return <Form onSubmit={onSubmit}>{children}</Form>;
}