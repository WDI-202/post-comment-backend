const Post = require("../model/Post");
const User = require("../../users/model/User");
const Comment = require("../../comments/model/Comment");
const { errorHandler } = require("../../utils/index");

const createPost = async (req, res) => {
	try {
		// i need the current user and its id to save
		// i need my req.body
		const decodedUser = res.locals.decodedToken;
		const foundUser = await User.findOne({ email: decodedUser.email });

		const { title, post } = req.body;

		const newPost = new Post({
			title: title,
			post: post,
			owner: foundUser.id,
		});

		const savedPost = await newPost.save();

		foundUser.postHistory.push(savedPost.id);
		await foundUser.save();

		res
			.status(200)
			.json({ message: "post has been saved", payload: savedPost });
	} catch (error) {
		res.status(500).json({ message: error, error: errorHandler(error) });
	}
};

const getAllPosts = async (req, res) => {
	try {
		const foundAllPosts = await Post.find({})
			.populate("owner", "username")
			.populate("commentHistory", "comment");

		// res.status(200).json(foundAllPosts);

		res.render("index", { posts: foundAllPosts });
		// render index.ejs page. pass in the foundAllPosts information as posts
		// IN index.ejs page console.log(posts)
		// forEach of the posts and display each post's title and post
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error, error: error });
	}
};

const updatePost = async (req, res) => {
	try {
		const { postId } = req.params;

		const decodedUser = res.locals.decodedToken;
		const foundUser = await User.findOne({ email: decodedUser.email });

		const foundPost = await Post.findById(postId);

		if (foundUser._id.toString() === foundPost.owner.toString()) {
			const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
				new: true,
			});
			res.status(200).json({ message: "updated Post", payload: updatedPost });
		} else {
			throw { message: "You are not authorized" };
		}
	} catch (error) {
		res.status(500).json({ message: error, error: errorHandler(error) });
	}
};

const deletePost = async (req, res) => {
	//6223b9e3f6bdeb39256340f5
	try {
		const { id } = req.params;

		const decodedUser = res.locals.decodedToken;
		const foundUser = await User.findOne({ email: decodedUser.email });
		const foundPost = await Post.findById(id);

		if (foundUser._id.toString() === foundPost.owner.toString()) {
			const deletedPost = await Post.findByIdAndDelete(id);

			//we will use deleteMany({ post: id })
			if (foundPost.commentHistory.length > 0) {
				await Comment.deleteMany({ post: id });
				await foundPost.commentHistory.map((e) => {
					foundUser.commentHistory.pull(e);
				});
			}
			await foundUser.postHistory.pull(id);
			await foundUser.save();

			res.status(200).json({
				message: "post was deleted",
				deletePost: deletedPost,
				deletedInUser: foundUser,
			});
		} else {
			throw { message: "You do not have the permission to delete" };
		}
		//delete post
		//delete post id from user postHistory
		//check if there are comments under this post, and delete those comments if its there
	} catch (error) {
		res.status(500).json({ message: "error", error: error });
	}
};

module.exports = {
	createPost,
	getAllPosts,
	updatePost,
	deletePost,
};
