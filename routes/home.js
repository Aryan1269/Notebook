const express = require('express');
const isAuth = require('../middleware/isAuth');
const { noteModel } = require('../models/notes');

const router = express.Router();

function dateStyle(date) {
  const f = new Intl.DateTimeFormat("en-in", {
    dateStyle: "short",
  });
  return f.format(date);
}

router.get("/home", isAuth, async (req, res) => {

  // @ts-ignore
  const notes = await noteModel.find({user : req.session.user});

  res.render("home",{data : notes,dateStyle});
});



module.exports = router;