require("dotenv").config();
const express = require("express");
const app = express();
const schema = require("./models/users");
const flash = require("connect-flash");
const session = require("express-session");
const mongodb_session = require("connect-mongodb-session")(session);
const isAuth = require("./middleware/isAuth");
const createPage = require("./routes/create");
const deletePage = require("./routes/delete");
const changePassword = require("./routes/changepassword");
const edit = require("./routes/edit");
const read = require("./routes/read");

let store = new mongodb_session({
  uri: process.env.MONGODB_URL,
  collection: "Sessions",
});

store.on("connected", async () => {
  await store.db
    .collection("Sessions")
    .createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
});

//routes importing
const homeRoutes = require("./routes/home");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash());

//pages
app.use(homeRoutes);
app.use(createPage);
app.use(deletePage)
app.use(changePassword)
app.use(edit)
app.use(read)

//



//routes
app.get("/", (req, res) => {
  res.render("login", { error: req.flash("wrong") });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await schema.UserModel.findOne({ email: email });
    if (user?.email == email && user?.password == password) {
      // @ts-ignore
      req.session.isLoggedIn = true;
      // @ts-ignore
      req.session.user = user._id;

      res.redirect("/home");
    } else {
      req.flash("wrong", "check email and password");
      res.redirect("/");
    }
  } catch (error) {}
});

app.get("/sign_up", (req, res) => {
  res.render("sign_up", {
    error: req.flash("error")[0] || req.flash("user_exists")[0],
  });
});

app.post("/sign_up/new", async (req, res) => {
  const { email, password } = req.body;

  let { error } = schema.validateModel({ email, password });
  if (error) {
    req.flash("error", `${error.details[0].message}`);
    return res.status(400).redirect("/sign_up"); // Send validation error message
  }
  // @ts-ignore

  try {
    let users = await schema.UserModel.findOne({ email: email });
   
    if (!users) {
      const user = await new schema.UserModel({
        //.create and new does the same thing
        email,
        password,
      });

      await user.save(); // to see changes

      // @ts-ignore
      req.session.isLoggedIn = true;
      // @ts-ignore
      req.session.user = user._id;

      // If user is created successfully, render the home page
      res.redirect("/home");
    } else {
      req.flash("user_exists", "user already exists");
      res.redirect("/sign_up");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) console.log(err);
    else return res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;


app.get('/rest',(req,res)=>{
  res.render('forgetPassord')
})

app.listen(PORT);
