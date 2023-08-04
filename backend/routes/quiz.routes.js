const express = require("express");

const quizController = require("../controllers/quiz.controller");
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.use(checkAuth);


router.get("/", quizController.getUserQuiz);
router.get("/:id", quizController.getQuizById);

router.post("/", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);

module.exports = router;
