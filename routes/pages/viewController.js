const aboutPage = (req, res) => {
	res.render("about");
};
const postFormPage = (req, res) => {
	res.render("post-form");
};

module.exports = {
	aboutPage,
	postFormPage,
};
