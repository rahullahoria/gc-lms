const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");

const Result = require("../models/result");


module.exports = {
  getUserQuiz: async (req, res, next) => {
    try {
      if (req.query.email) {
        console.log(req.query.email, req.query.mobile, req.userData);
        const takenQuiz = await Result.find({userId: req.userData.userId}).distinct('quizId');
        console.log("takenQuiz",takenQuiz);
        // find in email or mobile
        let userQuiz = await Quiz.findOne({
          "_id": { "$nin": takenQuiz }, status: "active"
        });

        console.log(userQuiz);

        res.status(201).json({
          _id: userQuiz._id,
          name: userQuiz.name,
          duration: userQuiz.duration,
          topics: userQuiz.topics,
          noOfQuestions: userQuiz.questions.length,
        });
      } else {
        let quiz = await Quiz.find({status: "active"});

        for (let i = 0; i < quiz.length; i++) {
          quiz[i].questions = null;
        }

        res.status(201).json(quiz);
      }
    } catch (err) {
      console.log(err.message);

      const error = new HttpError(
        "Fetching places failed, please try again later.",
        500
      );
      return next(error);
    }
  },
  getQuizById: async (req, res, next) => {
    try {
      console.log(req.params.id);
      // find in email or mobile
      let quiz = await Quiz.findById(req.params.id);

      for(let i = 0; i < quiz.questions.length; i++) {
        quiz.questions[i].answer = null;
        quiz.questions[i].qIndex = i;
        quiz.questions[i].optionsOrder = ['a','b','c','d'].sort( () => Math.random() - 0.5);
      }

      quiz.questions = quiz.questions.sort( () => Math.random() - 0.5);

      res.status(201).json({
        _id: quiz._id,
        name: quiz.name,
        duration: quiz.duration,
        questions: quiz.questions,
      });
    } catch (err) {
      console.log(err.message);
      const error = new HttpError(
        "Fetching places failed, please try again later.",
        500
      );
      return next(error);
    }
  },
  createQuiz: async (req, res, next) => {
    try {
      const questions = req.body.questions;

      let topics = [...new Set(questions.map((question) => question.topic))];

      const createdQuiz = new Quiz({
        ...req.body,
        topics,
        noOfQuestions: req.body.questions.length,
        status: "active",
      });

      await createdQuiz.save();
      res.status(201).json(createdQuiz);
    } catch (error) {
      console.log(error.message);
      return next(error);
    }
  },
  updateQuiz: async (req, res, next) => {
    
    try {
      console.log(req.params.id);
      let quiz = await Quiz.findById(req.params.id);
      quiz.status = req.body.status;
      res.status(200).json({ quiz: quiz.toObject({ getters: true }) });

      await quiz.save();
    } catch (err) {
      console.log(err.message);
      const error = new HttpError(
        "Something went wrong, could not update quiz.",
        500
      );
      return next(error);
    }
  },
};
