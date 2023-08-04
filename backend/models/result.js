const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  questionResponses: [],
  score: {}, //correct, incorrect, non attempted
  topicScore: {}//{topicName:{correct, incorrect, non attempted, suggestion}}
});

resultSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Results', resultSchema);
