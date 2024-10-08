const db = require('../config/mongodb')// Ensure the path is correct
const joi = require("joi");

const userSchema = new db.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: [
    {
      type: db.Schema.Types.ObjectId,
      ref: "note",
    },
  ],
  
  restToken: String,
  restSession: Date,
});

function validateModel(data) {
  return joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().min(6).max(30).required(),
    })
    .validate(data);
}

let UserModel = db.model("User", userSchema);

module.exports = { validateModel, UserModel }; // Capitalize the model name for consistency
