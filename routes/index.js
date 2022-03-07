var express = require("express");
var router = express.Router();
const { getAllPosts } = require("./posts/controller/postsController");
const { aboutPage, postFormPage } = require("./pages/viewController");
const array = [
	{ name: "ginny" },
	{ name: "michael" },
	{ name: "chris" },
	{ name: "victoria" },
	{ name: "tony" },
];
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("home", { title: "Weblog", data: array });
});
router.get("/show-all-post", getAllPosts);
router.get("/about", aboutPage);
router.get("/post-form", postFormPage);

module.exports = router;
