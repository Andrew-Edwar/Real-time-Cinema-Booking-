const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbConfig = require("../config/db.config.js");
const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);
db.Cinemas = require("./cinema.model.js")(mongoose);
db.ROLES = ["user","Customer", "Vendor"];

module.exports = db;





