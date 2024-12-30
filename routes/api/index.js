const router = require('express').Router();


const homeRouter = require("./home");
const usersRouter = require('./users');
const questionsRouter = require('./questions');
const answersRouter = require('./answers');
const commentsRouter = require('./comments');
const topicRouter = require('./topics');
const searchRouter = require('./search');


router.use(homeRouter);
router.use(usersRouter);
router.use(questionsRouter);
router.use(answersRouter);
router.use(commentsRouter);
router.use(topicRouter);
router.use(searchRouter);

module.exports = router;