const Comment = require("../model/Comment");
const User = require("../../users/model/User");
const Post = require("../../posts/model/Post");
const { errorHandler } = require("../../utils/index");

const getComment = async (req, res) => {
	try {
		const getAllComments = await Comment.find({});
		res.json(getAllComments);
	} catch (error) {
		console.log(error);
	}
};
const createComment = async (req, res) => {
	try {
		const { postId } = req.params;
		const { comment } = req.body;
		const decodedToken = res.locals.decodedToken;
		console.log(decodedToken);

		let foundUser = await User.findOne({ email: decodedToken.email });

		const newComment = new Comment({
			comment: comment,
			post: postId,
			owner: foundUser.id,
		});

		const savedComment = await newComment.save();

		foundUser.commentHistory.push(savedComment.id);
		await foundUser.save();

		let foundPost = await Post.findById(postId);
		foundPost.commentHistory.push(savedComment.id);
		await foundPost.save();

		res.status(200).json({ message: "saved comment", payload: savedComment });
	} catch (error) {
		res.status(500).json({ message: "error", error: error });
	}
};

const updateComment = async (req, res) => {
	try {
		const { id } = req.params;
		let foundComment = await Comment.findById(id);
		console.log(foundComment);

		//You also need to check if you are the owner of the comment!
		const decodedToken = res.locals.decodedToken;

		let foundUser = await User.findOne({ email: decodedToken.email });

		if (foundComment.owner.toString() === foundUser._id.toString()) {
			let updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
				new: true,
			});

			res.json({ message: "success", payload: updatedComment });
		} else {
			res
				.status(500)
				.json({ message: "error", error: "You don't have permission" });
		}
	} catch (e) {
		res.status(500).json({ message: "error", error: errorHandler(e) });
	}
};

const deleteComment = async (req, res) => {
	try {
		const foundComment = await Comment.findById(req.params.id);
		if (foundComment.owner.toString() === foundUser._id.toString()) {
			let deletedComment = await Comment.findByIdAndDelete(req.params.id);

			let foundPost = await Post.findById(deletedComment.post);

			await foundPost.commentHistory.pull(req.params.id);
			await foundPost.save();

			const decodedData = res.locals.decodedToken;
			let foundUser = await User.findOne({ email: decodedData.email });
			await foundUser.commentHistory.pull(req.params.id);
			await foundUser.save();

			res.json({ message: "success", payload: deletedComment });
		} else {
			throw { message: "you do not have permission" };
		}
	} catch (e) {
		res.status(500).json({ message: "error", error: errorHandler(e) });
	}
};

module.exports = {
	getComment,
	createComment,
	updateComment,
	deleteComment,
};
