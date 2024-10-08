const express = require("express");
const { noteModel } = require("../models/notes");
const { UserModel } = require("../models/users");
const router = express.Router();

router.get("/edit", async (req, res) => {
  try {
    const notes = await noteModel.findById(req.query.id);
    res.render("edit", { data: notes });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit/submit",async (req,res)=>{
  let { id, title, description, passcode, encrypt } = req.body;

    try {
        const note = await noteModel.findById(id);
        note.title = title;
        note.description = description;
        note.passcode = passcode;
        note.encrypt = encrypt;
        await note.save();
        res.redirect('/home');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
