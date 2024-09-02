const auth = (req, res, next) => {
    
  if (req.session.isLoggedIn) {
    next();
  }
  else
  return res.redirect("/sign_up");
};

module.exports = auth;
