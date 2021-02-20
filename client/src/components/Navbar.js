import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";

import {
  Box,
  Text,
  Stack,
  Flex,
  MenuIcon,
  useColorModeValue,
} from "@chakra-ui/react";

import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const AppNavbar = () => {
  // set modal display state
  // const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  // const { isOpen, onToggle } = useDisclosure();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        mb={8}
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
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </Box>

        <Box
          display={{ base: isOpen ? "block" : "none", md: "block" }}
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
            <Link>
              <Text display="block" as={Link} to="/saved">
                Your Movies
              </Text>
            </Link>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default AppNavbar;
