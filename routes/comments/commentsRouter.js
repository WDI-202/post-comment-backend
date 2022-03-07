var express = require("express");
var router = express.Router();
const {
	getComment,
	createComment,
	updateComment,
	deleteComment,
} = require("./controller/commentsController");
const { jwtMiddleware } = require("../utils/index");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("hello from commentsRouter");
});
router.get("/get-comment", getComment);
router.post("/create-comment/:postId", jwtMiddleware, createComment);
router.put("/update-comment/:id", jwtMiddleware, updateComment);
router.delete("/delete-comment/:id", jwtMiddleware, deleteComment);

module.exports = router;
