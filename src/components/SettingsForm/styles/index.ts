import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: ${({ theme }) =>
    `${theme.space[4]} ${theme.space[6]} ${theme.space[8]}`};
`;

export const LoadingBox = styled.div`
  height: 40px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s infinite;
`;

export const FormControl = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

export const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue[500]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.blue[500]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;