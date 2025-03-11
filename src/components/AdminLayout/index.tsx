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
import { SITE_STRINGS } from "../../constants";

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
        description:
          error instanceof Error ? error.message : "An error occurred",
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
        <Heading fontSize={["xl", "2xl", "3xl"]}>
          {SITE_STRINGS.ADMIN_PANEL}
        </Heading>
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          {SITE_STRINGS.LOGOUT}
        </Button>
      </HStack>
      <Tabs index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>{SITE_STRINGS.REGISTER_PRODUCT}</Tab>
          <Tab>{SITE_STRINGS.REGISTERED_PRODUCTS}</Tab>
          <Tab>{SITE_STRINGS.SETTINGS}</Tab>
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
                {SITE_STRINGS.SITE_SETTINGS}
              </Heading>
              {settingsContent}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
