import styled from "styled-components";

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormLayout({ children, onSubmit }: FormLayoutProps) {
  return <Form onSubmit={onSubmit}>{children}</Form>;
}