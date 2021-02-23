import React from "react"
import { Flex } from "@chakra-ui/react"
import Header from "../sections/Header"
import Hero from "../sections/Hero"
import LoginForm from "../LoginForm"
import SignupForm from "../SignupForm"

export default function LandingLayout(props) {
  return (
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1200px" }}
      m="0 auto"
      {...props}
    >
      <Header />
      {props.children}
      <Hero />
      <LoginForm />
      <SignupForm />
    
    </Flex>
  )
}
