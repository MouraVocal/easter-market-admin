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
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface AdminLayoutProps {
  tabIndex: number;
  onTabChange: (index: number) => void;
  productContent: ReactNode;
  settingsContent: ReactNode;
}

export function AdminLayout({
  tabIndex,
  onTabChange,
  productContent,
  settingsContent,
}: AdminLayoutProps) {
  return (
    <Container maxW="container.xl" py={[2, 4]} px={[2, 4, 6]}>
      <Heading mb={[4, 6, 8]} fontSize={["xl", "2xl", "3xl"]}>
        Admin Panel
      </Heading>
      <Tabs index={tabIndex} onChange={onTabChange}>
        <TabList>
          <Tab>Products</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={[2, 4]} py={4}>
            <VStack spacing={6} align="stretch">
              {productContent}
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