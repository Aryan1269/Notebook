const db = require("../config/mongodb");
const joi = require("joi");

const Note = new db.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: db.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  encrypt: { type: Boolean, default: false },
  passcode: {
    type: String,
    default: undefined,
  },
});

function noteValidate(data) {
  return joi
    .object({
      title: joi.string().max(10).required(),
      description: joi.string().required(),
      passcode: joi.string().allow("").optional(),
    })
    .validate(data);
}

let noteModel = db.model("note", Note);

module.exports = { noteValidate, noteModel };
