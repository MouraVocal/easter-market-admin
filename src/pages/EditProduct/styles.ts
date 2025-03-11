import styled from "styled-components";
import { Box, Container } from "@chakra-ui/react";

export const EditProductContainer = styled(Container)`
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (min-width: 48em) {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
`;

export const LoadingBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;