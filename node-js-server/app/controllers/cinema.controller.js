const db = require("../models");
const Cinema= db.Cinemas

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const cinema = new Cinema({
    name: req.body.name,
    vendorID: req.body.vendorID,
    locations: req.body.locations || [],
  });

  // Save Tutorial in the database
  cinema
    .save(cinema)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the cinema."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Cinema.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cinemas."
      });
    });
};
exports.findAllByVendorID = (req, res) => {
  // Get vendorID from the query parameters
  const vendorID = req.query.vendorID;

  // Validate that vendorID is provided
  if (!vendorID) {
    res.status(400).send({
      message: "VendorID is required to retrieve cinemas.",
    });
    return;
  }

  // Find cinemas by vendorID
  Cinema.find({ vendorID })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({
          message: `No cinemas found for vendorID: ${vendorID}`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving cinemas.",
      });
    });
};


// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Cinema.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Cinema with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Cinema with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;


  // Update the tutorial with the new show time array
  Cinema.findByIdAndUpdate(id, {...req.body}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update cinema with id=${id}. Maybe Cinema was not found!`
        });
      } else res.send({ message: "Cinema was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};


// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Cinema.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Cinema with id=${id}. Maybe Cinema was not found!`
        });
      } else {
        res.send({
          message: "Cinema was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Cinema with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Cinema.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Cinemas were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Cinemas."
      });
    });
};
// Delete all Tutorials from the database.
exports.deleteAllByVendorID = (req, res) => {
  const vendorID = req.query.vendorID;
  var condition = vendorID ? { vendorID  } : {};
  Cinema.deleteMany(condition)
    .then(data => {
      res.send({
        message: `${data.deletedCount} Cinemas were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Cinemas."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Cinema.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cinemas."
      });
    });
};
// exports.findByVendorID = (req, res) => {
//   const vendorID = req.query.vendorID;

//   if (!vendorID) {
//     res.status(400).send({ message: "VendorID parameter is required." });
//     return;
//   }

//   Cinema.find({ vendorID: vendorID })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving cinemas by vendorID."
//       });
//     });
// };

exports.findAll = (req, res) => {
  Cinema.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving cinemas.',
      });
    });
};