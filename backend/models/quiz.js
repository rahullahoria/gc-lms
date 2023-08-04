const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  name: { type: String, required: true },
  questions: [],//{question,options:{a:"sadfsa",b:"sdaf",c:"dsafad",d:"asdf"}, answer:"a",topic}
  // mobiles: [],
  // emails: [],
  noOfQuestions: { type: Number, required: false },
  topics: [],
  duration: { type: Number, required: true },
  status: { type: String, defaultValue: "active"}
});

quizSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Quiz', quizSchema);
