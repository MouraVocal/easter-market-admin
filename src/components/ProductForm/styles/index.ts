import styled from "styled-components";

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

export const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.white};
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue[500]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const InputLeftAddon = styled.span`
  padding: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-right: none;
  border-radius: ${({ theme }) => theme.radii.md} 0 0 ${({ theme }) => theme.radii.md};
`;

export const NumberInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0;
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

export const FileInput = styled.input`
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
`;

export const ImagePreview = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.space[2]};
  width: 200px;
  height: 200px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const SubmitButton = styled.button`
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