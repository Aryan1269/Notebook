const mongoose = require("mongoose");

// @ts-ignore
mongoose.connect("mongodb://127.0.0.1:27017/notebook");

const db = mongoose.connection;

db.on("error", (err) => console.log("Connection error:", err));
db.on("open", () => console.log("Connected to MongoDB"));

module.exports = mongoose;
