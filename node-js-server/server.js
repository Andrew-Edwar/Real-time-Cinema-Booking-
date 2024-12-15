const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();

// app.use(cors());
/* for Angular Client (withCredentials) */
 app.use(
   cors({
     credentials: true,
     origin: ["http://localhost:4200"],
   })
 );

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb+srv://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/turorial.routes")(app);
require("./app/routes/cinema.routes")(app);
require("./app/routes/booking.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const { graphqlHTTP } = require('express-graphql');
const cinemaSchema = require('./app/graphql/cinema.graphql');

// Add GraphQL route
app.use('/graphql', graphqlHTTP({
  schema: cinemaSchema,
  graphiql: true // Enable GraphiQL for testing
}));

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "Customer"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Customer' to roles collection");
      });

      new Role({
        name: "Vendor"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Vendor' to roles collection");
      });
    }
  });
}
