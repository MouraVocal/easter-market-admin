import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      addToast(error.message, "error");
      setIsLoading(false);
      return;
    }
    navigate("/");
    setIsLoading(false);
  };

  return (
    <Container maxW="container.sm" py={[8, 16]}>
      <Box
        p={[6, 8]}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6}>
          <Heading size="lg">Login</Heading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                Logar
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
}
