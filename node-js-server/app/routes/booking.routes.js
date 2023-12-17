module.exports = app => {
  const bookings = require("../controllers/booking.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", bookings.create);

  // Retrieve all Tutorials
  router.get("/", bookings.findAll);
  router.get("/VendorID", bookings.findAllByVendorID);
  router.get("/CustomerID", bookings.findAllByCustomerID);
  // Retrieve all published Tutorials
  // router.get("/published", bookings.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", bookings.findOne);

  // Update a Tutorial with id
  router.put("/:id", bookings.update);

  // Delete a Tutorial with id
  router.delete("/:id", bookings.delete);

  // Create a new Tutorial
  router.delete("/", bookings.deleteAll);

  router.delete("/CustomerIDdel/CustomerID", bookings.deleteAllByCustomerID);
  app.use("/api/bookings", router);
};

