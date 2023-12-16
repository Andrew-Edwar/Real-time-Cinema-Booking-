const db = require("../models");
const Tutorial = db.tutorials;


// Define a function to calculate the end time by adding the hours and the movie time
function calculateEndTime(hours, movieTime) {
  if (!hours || !movieTime) {
    // Return an empty string if hours or movieTime is not provided
    return '';
  }

  // Convert the hours and movie time to minutes
  var hoursInMinutes = parseInt(hours.split(':')[0]) * 60 + parseInt(hours.split(':')[1]);
  var movieTimeInMinutes = movieTime;
  // Add the minutes and convert back to hours and minutes
  var totalMinutes = hoursInMinutes + movieTimeInMinutes;
  var endHours = Math.floor(totalMinutes / 60);
  var endMinutes = totalMinutes % 60;
  // Format the end time as a string
  return ('0' + endHours).slice(-2) + ':' + ('0' + endMinutes).slice(-2);
}





// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Convert date strings in ShowTime to Date objects
  const ShowTime = req.body.ShowTime.map(ShowTime => ({
    date: ShowTime.date,
    hours: ShowTime.hours,
    endTime: calculateEndTime(ShowTime.hours, req.body.MovieTime) // Use the calculateEndTime function and the MovieTime property of the request body
  }));

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    MovieTime: req.body.MovieTime,
    ShowTime: ShowTime,
    published: req.body.published ? req.body.published : false,
    cinemas: req.body.cinemas,
    vendorID: req.body.vendorID,

  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
exports.findAllByVendorID = (req, res) => {
  const vendorID = req.query.vendorID;
  var condition = vendorID ? { vendorID  } : {};

  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving movies."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
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

  // Recalculate the end time for each show time
  const ShowTime = req.body.ShowTime.map(ShowTime => ({
    date: ShowTime.date,
    hours: ShowTime.hours,
    endTime: calculateEndTime(ShowTime.hours, req.body.MovieTime)
  }));

  // Get the selected cinema IDs from the request body
  const selectedCinemas = req.body.cinemas || [];

  // Find the existing tutorial
  Tutorial.findById(id)
    .then(existingTutorial => {
      if (!existingTutorial) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Tutorial not found!`
        });
        return;
      }

      // Update fields
      existingTutorial.title = req.body.title;
  existingTutorial.description = req.body.description;
  existingTutorial.MovieTime = req.body.MovieTime;
  existingTutorial.ShowTime = ShowTime;

  // Set the tutorial's cinemas to the selected cinemas
  existingTutorial.cinemas = selectedCinemas;

  // Update the published status
  existingTutorial.published = req.body.published;

      // Set the tutorial's cinemas to the selected cinemas

      // Save the updated tutorial
      existingTutorial.save()
        .then(data => {
          res.send({ message: "Tutorial was updated successfully.", data });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tutorial with id=" + id
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};
exports.deleteAllByVendorID = (req, res) => {
  const vendorID = req.query.vendorID;
  var condition = vendorID ? { vendorID  } : {};
  Tutorial.deleteMany(condition)
    .then(data => {
      res.send({
        message: `${data.deletedCount} movie were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all movie."
      });
    });
};
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
  
};
exports.findPublishedByVendorID = (req, res) => {
  const vendorID = req.query.vendorID;
  Tutorial.find({ vendorID, published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};