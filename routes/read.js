const express = require('express');
const { noteModel } = require('../models/notes');
const router = express.Router();

router.get('/read',(req,res)=>{
    res.render('read',{id : req.query.id})
})

router.get('/read/pass', async (req,res)=>{
    try {
        let note = await noteModel.findById(req.query.id)
        
        res.json(note);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router ;