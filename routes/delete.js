const isAuth = require("../middleware/isAuth");
const { noteModel } = require("../models/notes");
const { UserModel } = require("../models/users");

const express = require("express");

const router = express.Router();

router.get("/delete/:id", isAuth, async (req, res) => {
  const noteId = req.params.id; // Extract the ID from req.params
 
  try {
    await noteModel.findByIdAndDelete(noteId);
    await UserModel.updateMany(
      { notes: noteId }, 
      { $pull: { notes: noteId } } // Remove the noteId from the notes array
    );

    res.redirect("/home");
  } catch (error) {
 
    console.error("Error deleting note:", error);
    res.status(500).send("Error deleting note");
  }
});

module.exports = router;
