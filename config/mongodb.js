const mongoose = require("mongoose");


// @ts-ignore
mongoose
  .connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const db = mongoose.connection;

db.on("error", (err) => console.log("Connection error:", err));
db.on("open", () => console.log("Connected to MongoDB"));

module.exports = mongoose;
