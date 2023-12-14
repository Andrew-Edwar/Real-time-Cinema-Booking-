module.exports = app => {
  const cinemas = require("../controllers/cinema.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", cinemas.create);

  // Retrieve all Tutorials
  router.get("/", cinemas.findAll);

  // Retrieve all published Tutorials
  router.get("/published", cinemas.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", cinemas.findOne);

  // Update a Tutorial with id
  router.put("/:id", cinemas.update);

  // Delete a Tutorial with id
  router.delete("/:id", cinemas.delete);

  // Create a new Tutorial
  router.delete("/", cinemas.deleteAll);

  app.use("/api/cinemas", router);
};

