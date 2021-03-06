var express = require("express");
var router = express.Router();
const {
	getAllPosts,
	getPostById
} = require("./posts/controller/postsController");
const {
	aboutPage,
	postFormPage,
	loginFormPage,
	signUpFormPage,
	commentFormPage
} = require("./pages/viewController");
const array = [{
		name: "ginny"
	},
	{
		name: "michael"
	},
	{
		name: "chris"
	},
	{
		name: "victoria"
	},
	{
		name: "tony"
	},
];
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("home", {
		title: "Weblog",
		data: array
	});
});
router.get("/show-all-post", getAllPosts);
router.get("/get-one-post-by-id/:postId", getPostById)
router.get("/about", aboutPage);
router.get("/post-form", postFormPage);
router.get("/login-form", loginFormPage)
router.get("/signup-form", signUpFormPage)
router.get("/comment-form", commentFormPage)

module.exports = router;