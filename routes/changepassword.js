const express = require("express");
// @ts-ignore
const isAuth = require("../middleware/isAuth");
const { UserModel } = require("../models/users");
const crypto = require("crypto");

const uuid = crypto.randomUUID();

const router = express.Router();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "malinda99@ethereal.email",
    pass: "UetVHkrgChnp5xyfzW",
  },
});

// @ts-ignore
router.get("/rest", (req, res) => {
  res.render("forgetPassord");
});

router.post("/rest", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("<script>alert('user not found')</script>");
    }

    user.restToken = uuid;

    // @ts-ignore
    user.restSession = Date.now() + 300000;
    await user.save();

    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <mac52@ethereal.email>',
      to: user.email,
      subject: "Rest",
      text: "Password Reset",
      html: `<strong>password rest link</strong><a href='http://localhost:3000/changepassword/${user.restToken}'>click here</a>`,
    });

    // Save the updated user document

    res.send(`<script>alert("check email")
    
    </script>`);
  } catch (error) {
    res.send(error);
  }
});

router.get("/changepassword/:restId", async (req, res) => {
  try {
    const user = await UserModel.findOne({
      restToken: req.params.restId,
    });

    let datenow = Date.now();
    // @ts-ignore
    if (user.restSession > datenow) {
      res.render("changepassword", {
        // @ts-ignore
        email: user.email,
        // @ts-ignore
        restToken: user.restToken,
      });
    } else {
      // @ts-ignore
      user.restToken = null;
      // @ts-ignore
      user.restSession = undefined;
      // @ts-ignore
      await user.save();
      res.send("token expired");
    }
  } catch (error) {
    console.log(error);
  }
});

// @ts-ignore
router.post("/rest/submit", async (req, res) => {
  
  try {
    const user = await UserModel.findOneAndUpdate(
      {
        $and: [
          { email: req.body.email },
          {
            restToken: req.body.restToken,
          },
        ],
      },
      {
        password: req.body.newPassword,
      },{
        new : true
      }
    );

    // @ts-ignore
    user.restToken = undefined;
    // @ts-ignore
    user.restSession = undefined;
    // @ts-ignore
    await user.save();
    res.redirect('/');
   
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
