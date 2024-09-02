const express = require("express");
const isAuth = require("../middleware/isAuth");
const  noteSchema = require('../models/notes')
const  userSchema = require('../models/users')
const router = express.Router();


// @ts-ignore
router.get('/create',isAuth,(req,res)=>{
    res.render('create',{error: req.flash('error')})
})

router.post('/submit',isAuth, async (req,res)=>{
  // @ts-ignore
  
  let {title,description,passcode,encrypt} = req.body;
 
    const user = await userSchema.UserModel.findById(req.session.user);
    
    // @ts-ignore
    console.log(typeof encrypt);
    const { error } = noteSchema.noteValidate({ title, description , passcode});
    if(error){
      req.flash('error',`${error.details[0].message}`)
      return res.status(400).redirect('/create'); // Send validation error message
    }
    try {
      // @ts-ignore
      if(!passcode.length>0) { passcode=undefined}
      
      const noteData = await new noteSchema.noteModel({
        // @ts-ignore
        user: user._id,
        title,
        description,
        passcode,
        encrypt: encrypt,
      });

      // @ts-ignore
      user.notes.push(noteData._id);
      // @ts-ignore
      await user.save();
      await noteData.save();
      res.redirect('/home');
    }
    catch(err){

        res.send(err);
    }

})


module.exports = router;