import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";

import {
  Link,
  Box,
  Text,
  Stack,
  Flex,
  useColorModeValue,
  useDisclosure,
  Button,
  // Lorem,
  // Modal,
  // ModalOverlay,
  // ModalContent,
  // ModalHeader,
  // ModalFooter,
  // ModalBody,
  // ModalCloseButton,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [isOpenToggle, setIsOpen] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toggle = () => setIsOpen(!isOpenToggle);

  return (
    <>
      <Box>
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          w="100%"
          p={6}
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
        >
          <Box w="300px" color={["primary.500", "primary.500"]}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                fontSize="2xl"
                className="main-header"
              >
                Moviegoer
              </Text>
            </Link>
          </Box>

          <Box display={{ base: "block", md: "none" }} onClick={toggle}>
            {isOpenToggle ? <CloseIcon /> : <HamburgerIcon />}
          </Box>

          <Box
            display={{ base: isOpenToggle ? "block" : "none", md: "block" }}
            flexBasis={{ base: "100%", md: "auto" }}
          >
            <Stack
              spacing={8}
              align="center"
              justify={["center", "space-between", "flex-end", "flex-end"]}
              direction={["column", "row", "row", "row"]}
              pt={[4, 4, 0, 0]}
            >
              <Link display="block" href="/">
                <Text>Home</Text>
              </Link>

              {/* if user is logged in show saved movies and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Link href="/saved">
                    <Text display="block">Your Watchlist</Text>
                  </Link>
                  <Link onClick={Auth.logout}>Logout</Link>
                </>
              ) : (
                <Button ref={btnRef} colorScheme="telegram" onClick={onOpen}>
                  Login/Sign Up
                </Button>
                /*<Link onClick={() => setShowModal(true)}>Login/Sign Up</Link>*/
              )}
            </Stack>
          </Box>
        </Flex>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />

            <Tabs>
              <TabList>
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <LoginForm handleModalClose={() => setShowModal(false)} />
                </TabPanel>
                <TabPanel>
                  <SignUpForm handleModalClose={() => setShowModal(false)} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default AppNavbar;
