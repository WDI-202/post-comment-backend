var express = require("express");
var router = express.Router();

const array = [
	{ name: "ginny" },
	{ name: "ginny" },
	{ name: "ginny" },
	{ name: "ginny" },
	{ name: "ginny" },
];
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("home", { title: "Weblog", data: array });
});

module.exports = router;
