const db = require("../models");
const Tutorial = db.tutorials;
const admin = require('firebase-admin');
const firebaseFunctions = require('../middlewares/firebaseNotfiy')
const redisClient = require('../config/redis.config'); // Adjust path as needed


// Path to your Firebase service account key JSON file
// const serviceAccount = require('../../../sw-2-313b8-firebase-adminsdk-uqhib-7b3dc51997.json');

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// function sendFCMNotification(title, body, token) {
//   const message = {
//     notification: {
//       title: title,
//       body: body,
//     },
//     token: token,
//   };

//   admin.messaging().send(message)
//     .then(response => {
//       console.log('Notification sent successfully:', response);
//     })
//     .catch(error => {
//       console.error('Error sending notification:', error);
//     });
// }

function calculateEndTime(hours, movieTime) {
  if (!hours || !movieTime) {
    return '';
  }

  var hoursInMinutes = parseInt(hours.split(':')[0]) * 60 + parseInt(hours.split(':')[1]);
  var movieTimeInMinutes = movieTime;
  var totalMinutes = hoursInMinutes + movieTimeInMinutes;
  var endHours = Math.floor(totalMinutes / 60);
  var endMinutes = totalMinutes % 60;
  return ('0' + endHours).slice(-2) + ':' + ('0' + endMinutes).slice(-2);
}

exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content or cinemas can not be empty!" });
    return;
  }


  // Create showtime for each cinema
  const ShowTime = 
    req.body.ShowTime.map(show => ({
      date: show.date,
      hours: show.hours,
      endTime: calculateEndTime(show.hours, req.body.MovieTime),
      totalBookedSeats: 0, // Initialize to 0
      bookedSeats: [], // Initialize to empty array
      cinema:show.cinema // Associate with the current cinema
    }));

  // Create the tutorial with multiple showtimes
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    MovieTime: req.body.MovieTime,
    ShowTime: ShowTime,
    published: req.body.published ? req.body.published : false,
    vendorID: req.body.vendorID,
  });

  tutorial
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Tutorial."
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
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!"
    });
  }

  const id = req.params.id;

  try {
    // Find the tutorial by ID
    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return res.status(404).send({
        message: `Cannot update Tutorial with id=${id}. Tutorial not found!`
      });
    }

    // Update the fields
    tutorial.title = req.body.title || tutorial.title;
    tutorial.description = req.body.description || tutorial.description;
    tutorial.MovieTime = req.body.MovieTime || tutorial.MovieTime;
    tutorial.published = req.body.published !== undefined ? req.body.published : tutorial.published;

    // Update ShowTime array
    if (req.body.ShowTime) {
      tutorial.ShowTime = req.body.ShowTime.map(show => ({
        date: show.date,
        hours: show.hours,
        endTime: calculateEndTime(show.hours, req.body.MovieTime || tutorial.MovieTime),
        totalBookedSeats: show.totalBookedSeats || 0,
        bookedSeats: show.bookedSeats || [],
        cinema: show.cinema // Expect the updated cinema ID to be provided
      }));
    }

    // Save the updated tutorial
    const updatedTutorial = await tutorial.save();

    res.send({
      message: "Tutorial was updated successfully.",
      data: updatedTutorial
    });

    // Optionally, send an FCM notification if the tutorial is published
    
      if (req.body.published) {
        const cacheKey = `published-tutorials:${tutorial.vendorID}`;
      await redisClient.del(cacheKey);
        firebaseFunctions.sendFCMNotification("New Tutorial Published!", `A new tutorial "${req.body.title}" has been published.`, 
        'fVM06kbH7oWRRO8CVHKk6w:APA91bHq8o4U9NpJrjoz8sMWRmsqwqNLE55LGnDixZ4I0dM_chRRZrJWCV1V8l_CUVOO8AnTGf2fDMrAWQBFkEU7xgh1Dv04BDGOXJy_JqOMEzAgeBNMhu8');
        }
  } catch (err) {
    console.error("Error updating tutorial:", err);
    res.status(500).send({
      message: "Error updating Tutorial with id=" + id
    });
  }
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
exports.findPublishedByVendorID = async (req, res) => {
  const vendorID = req.query.vendorID;

  if (!vendorID) {
    return res.status(400).send({ message: 'Vendor ID is required.' });
  }

  try {
    // Step 1: Check Redis Cache
    const cacheKey = `published-tutorials:${vendorID}`;
    const cachedData = await redisClient.get(cacheKey); // Waits until Redis operation is complete

    if (cachedData) {
      console.log('Cache hit');
      return res.send(JSON.parse(cachedData));
    }

    // Step 2: Fetch Data from MongoDB
    console.log('Cache miss');
    const tutorials = await Tutorial.find({ vendorID, published: true });

    if (tutorials.length === 0) {
      return res.status(404).send({ message: 'No published tutorials found for this vendor.' });
    }

    // Step 3: Save Result to Cache with Expiration (e.g., 1 hour)
    await redisClient.set(cacheKey, JSON.stringify(tutorials), {
      EX: 3600, // Cache expires in 1 hour
    });

    // Step 4: Return Data
    res.send(tutorials);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send({ message: 'An error occurred while retrieving tutorials.' });
  }
};
