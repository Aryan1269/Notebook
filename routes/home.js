const express = require('express');
const isAuth = require('../middleware/isAuth');
const { noteModel } = require('../models/notes');

const router = express.Router();

router.get("/home", isAuth, async (req, res) => {

  // @ts-ignore
  const notes = await noteModel.find({user : req.session.user});

  res.render("home",{data : notes});
});



module.exports = router;