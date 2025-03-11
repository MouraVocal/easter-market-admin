import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

interface AdminLayoutProps extends React.PropsWithChildren {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  productContent: ReactNode;
  productListContent: ReactNode;
  settingsContent: ReactNode;
}

export function AdminLayout({
  tabIndex,
  setTabIndex,
  productContent,
  productListContent,
  settingsContent,
}: AdminLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Container maxW="container.xl" py={[2, 4]} px={[2, 4, 6]}>
      <HStack justify="space-between" mb={[4, 6, 8]}>
        <Heading fontSize={["xl", "2xl", "3xl"]}>Admin Panel</Heading>
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </HStack>
      <Tabs index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>Cadastrar Produto</Tab>
          <Tab>Produtos Cadastrados</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={[2, 4]} py={4}>
            <VStack spacing={6} align="stretch">
              {productContent}
            </VStack>
          </TabPanel>

          <TabPanel px={[2, 4]} py={4}>
            <VStack spacing={6} align="stretch">
              {productListContent}
            </VStack>
          </TabPanel>

          <TabPanel px={[2, 4]} py={4}>
            <Box>
              <Heading size={["sm", "md"]} mb={[2, 4]}>
                Site Settings
              </Heading>
              {settingsContent}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
