var express = require("express");
var router = express.Router();
const { jwtMiddleware, checkIfEmpty } = require("../utils/index");
const {
	createPost,
	getAllPosts,
	updatePost,
	deletePost,
} = require("./controller/postsController");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("hello from postsRouter");
});

router.post("/create-post", jwtMiddleware, checkIfEmpty, createPost);
router.get("/get-all-post", getAllPosts);
router.put("/update-post/:postId", jwtMiddleware, checkIfEmpty, updatePost);
router.delete("/delete-post/:id", jwtMiddleware, deletePost);

module.exports = router;
