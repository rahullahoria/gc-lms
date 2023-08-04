const express = require("express");

const checkAuth = require('../middleware/check-auth');


const resultController = require("../controllers/result.controller");

const router = express.Router();


router.get("/", resultController.getUserResults);
router.get("/:id", resultController.getResultById);

router.use(checkAuth);

router.post("/", resultController.createResult);

module.exports = router;
