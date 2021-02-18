const express = require("express");
// get our Apollo server hooked into our existing Express.js server
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
// and set it up with our type definitions and resolvers
const { typeDefs, resolvers } = require("./schemas");
// middleware verifying the JWT
const { authMiddleware } = require("./utils/auth");
// import the mongoose.connection object
const db = require("./config/connection");
// const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
// wildcard GET route for the server
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
// we listen for that connection to be made
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
