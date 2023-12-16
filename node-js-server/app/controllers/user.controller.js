const db = require("../models");
const User = db.user;
const Role = require("../models/role.model"); // Adjust this import based on your actual model file path

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Customer Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Vendor Content.");
};
exports.findAllUsersByRole = async (req, res) => {
  try {
    const roleName = "Vendor"; // Change this to the case-sensitive role you want to filter

    const role = await Role.findOne({ name: roleName }, '_id');

    const users = await User.find({ roles: role }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};