const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    req.user = user;
    next();
  });
};

//create user
exports.createUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    const { name, age, education } = fields;

    if (!name || !age || !education) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let user = new User(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "photo size should be less tha 3 MB",
        });
      }
      user.photo.data = fs.readFileSync(file.photo.filepath);
      user.photo.contentType = file.photo.mimetype;
    }

    //save to the DB
    user.save((err, user) => {
      if (err) {
        res.status(400).json({
          error: "Saving user in DB failed",
        });
      }
      res.json(user);
    });
  });
};

exports.photo = (req, res, next) => {
  if (req.user.photo.data) {
    res.set("Content-Type", req.user.photo.contentType);
    return res.send(req.user.photo.data);
  }
  next();
};

// update user
exports.updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with photo",
      });
    }

    //update code
    let user = req.user;
    user = _.extend(user, fields);

    //handles files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "photo size should be less tha 3 MB",
        });
      }
      user.photo.data = fs.readFileSync(file.photo.filepath);
      user.photo.contentType = file.photo.mimetype;
    }

    //save user in DB
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "updating user in DB Failed",
        });
      }
      res.json(user);
    });
  });
};

//fetch users
exports.getAllUsers = (req, res) => {
  User.find()
    .select("-photo")
    .sort([["_id", "asc"]])
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "NO USER FOUND",
        });
      }
      res.json(user);
    });
};

//fetch user by id
exports.getUser = (req, res) => {
  res.json(req.user);
};

// delete user
exports.deleteUser = (req, res) => {
  const _id = req.user._id;
  User.deleteOne({ _id }, (err, deleteduser) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the user",
      });
    }
    res.json({
      message: "Deletion was a success",
      deleteduser,
    });
  });
};
