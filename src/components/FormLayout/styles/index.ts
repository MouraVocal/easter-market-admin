import styled from "styled-components";

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;