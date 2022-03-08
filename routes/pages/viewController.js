const aboutPage = (req, res) => {
	res.render("about");
};
const postFormPage = (req, res) => {
	res.render("post-form");
};
const loginFormPage = (req, res) => {
	res.render("login-form")
}
const signUpFormPage = (req, res) => {
	res.render("sign-up-form")
}
const commentFormPage = (req, res) => {
	res.render('comment-form')
}

module.exports = {
	aboutPage,
	postFormPage,
	loginFormPage,
	signUpFormPage,
	commentFormPage
};