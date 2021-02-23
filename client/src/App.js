import React from "react";
// ApolloProvider is special type of React component, provides data to all other components
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchMovies from "./pages/SearchMovies";
import SavedMovies from "./pages/SavedMovies";
import Navbar from "./components/Navbar";
import { ChakraProvider } from "@chakra-ui/react"


const client = new ApolloClient({
  // retrieve the token from localStorage before each request
  request: (operation) => {
    const token = localStorage.getItem("id_token");
    // set the HTTP request headers so every request will include the token
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  // establish the connection to the back-end server's /graphql endpoint
  uri: "/graphql",
});

function App() {
  // passing the client variable so the JSX will have access to the server's API data
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchMovies} />
            <Route exact path="/saved" component={SavedMovies} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
        </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;
