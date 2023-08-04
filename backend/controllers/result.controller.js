const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");
const Result = require("../models/result");

var mongoose = require('mongoose');


module.exports = {
  getUserResults: (req, res, next) => {},
  getResultById: async (req, res, next) => {
    try {
        console.log(req.params.id);
        // find in email or mobile
        let result = await Result.findById(req.params.id);
  
        res
          .status(201)
          .json(result);
      } catch (err) {
        const error = new HttpError(
          "Fetching places failed, please try again later.",
          500
        );
        return next(error);
      }
  },
  createResult: async (req, res, next) => {
    try {
      const quiz = await Quiz.findById(req.body.quizId);

      let result = [];
      let score = {
        correct: 0,
        incorrect: 0,
        nonAttempted: 0,
      };

      let topicScore = {};

      for (let i = 0; i < quiz.questions.length; i++) {
        if (!topicScore[quiz.questions[i].topic])
          topicScore[quiz.questions[i].topic.replace(".","-")] = {
            correct: 0,
            incorrect: 0,
            nonAttempted: 0,
          };

        if (quiz.questions[i].answer == req.body.questionResponses[i]) {
          score.correct++;
          topicScore[quiz.questions[i].topic.replace(".","-")].correct++;
        } else if (
          req.body.questionResponses[i] == "a" ||
          req.body.questionResponses[i] == "b" ||
          req.body.questionResponses[i] == "c" ||
          req.body.questionResponses[i] == "d"
        ) {
          score.incorrect++;
          topicScore[quiz.questions[i].topic.replace(".","-")].incorrect++;
        } else {
          score.nonAttempted++;
          topicScore[quiz.questions[i].topic.replace(".","-")].nonAttempted++;
        }
      }

      const createdResult = new Result({
        quizId: mongoose.Types.ObjectId(req.body.quizId),
        questionResponses: req.body.questionResponses,
        score: score,
        topicScore: topicScore,
        userId: mongoose.Types.ObjectId(req.userData.userId)
      });

      console.log(createdResult);

      await createdResult.save();
      res.status(201).json(createdResult);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
};
