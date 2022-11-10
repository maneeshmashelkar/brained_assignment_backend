const express = require("express");
const {
  getAllUsers,
  photo,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  getUser,
} = require("../controllers/user");
const router = express.Router();

router.param("userId", getUserById);

router.get("/users", getAllUsers);
router.get("/user/:userId", getUser);
router.get("/photo/:userId", photo);

router.post("/create", createUser);
router.delete("/delete/:userId", deleteUser);
router.put("/update/:userId", updateUser);

module.exports = router;
