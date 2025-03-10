import styled from "styled-components";

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