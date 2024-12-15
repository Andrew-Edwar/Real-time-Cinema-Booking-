const db = require("../models");
const Booking= db.Bookings
const firebaseFunctions = require('../middlewares/firebaseNotfiy')

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.ShowTime || !Array.isArray(req.body.ShowTime) || req.body.ShowTime.length === 0) {
    res.status(400).send({ message: "ShowTime should be an array with at least one entry." });
    return;
  }

  // Create a new booking
  const booking = new Booking({
    CustomerID: req.body.CustomerID,
    vendorID: req.body.vendorID,
    MovieID: req.body.MovieID,
    ShowTime: req.body.ShowTime.map(show => ({
      date: show.date,
      hours: show.hours,
      endTime: show.endTime,
      selectedSeats: show.selectedSeats,
      cinema: show.cinema
    })),

  });

  // Save the booking to the database
  booking
    .save()
    .then(data => {
      res.send(data);
      // Send Firebase Notification (Uncomment and configure properly)
      // firebaseFunctions.sendFCMNotification("A New Booking Was Added!", `with Seats "${req.body.ShowTime[0].selectedSeats}".`, 'YOUR_FIREBASE_TOKEN');
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the booking."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Booking.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving booking."
      });
    });
};

exports.findAllByVendorID = (req, res) => {
  const vendorID = req.query.vendorID;
  var condition = vendorID ? { vendorID  } : {};

  Booking.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving booking."
      });
    });
};

exports.findAllByCustomerID = (req, res) => {
  const customerID = req.query.customerID;
  var condition = customerID ? { customerID  } : {};

  Booking.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving booking."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Booking.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Booking with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Booking with id=" + id });
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
  Booking.findByIdAndUpdate(id, {...req.body}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Booking with id=${id}. Maybe Booking was not found!`
        });
      } else res.send({ message: "Booking was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Booking with id=" + id
      });
    });
};


// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Booking.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Booking with id=${id}. Maybe Booking was not found!`
        });
      } else {
        res.send({
          message: "Booking was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Booking with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Booking.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Bookings were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Bookings."
      });
    });
};
// Delete all Tutorials from the database.
exports.deleteAllByCustomerID = (req, res) => {
  const customerID = req.query.customerID;
  var condition = customerID ? { customerID  } : {};
  Booking.deleteMany(condition)
    .then(data => {
      res.send({
        message: `${data.deletedCount} Bookings were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Bookings."
      });
    });
};

// Find all published Tutorials
// exports.findAllPublished = (req, res) => {
//   Cinema.find({ published: true })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Cinemas."
//       });
//     });
// };
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
  Booking.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Bookings.',
      });
    });
};