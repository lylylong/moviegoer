import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";

import {
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
} from "@chakra-ui/react";

import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [isOpenToggle, setIsOpen] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef();
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
          p={8}
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
        >
          <Box w="100px" color={["primary.500", "primary.500"]}>
            <Text fontSize="lg" fontWeight="bold" as={Link} to="/">
              Moviegoer
            </Text>
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
              <Link>
                <Text display="block" as={Link} to="/">
                  Home
                </Text>
              </Link>

              {/* if user is logged in show saved movies and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Link>
                    <Text display="block" as={Link} to="/saved">
                      Your Watchlist
                    </Text>
                  </Link>
                  <Link onClick={Auth.logout}>Logout</Link>
                </>
              ) : (
                <Link onClick={() => setShowModal(true)}>Login/Sign Up</Link>
              )}
            </Stack>
          </Box>
        </Flex>
      </Box>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
      ;
    </>
  );
};

export default AppNavbar;
