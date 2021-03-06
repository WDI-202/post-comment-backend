const Post = require("../model/Post");
const User = require("../../users/model/User");
const Comment = require("../../comments/model/Comment");
const {
	errorHandler
} = require("../../utils/index");

const createPost = async (req, res) => {
	try {
		// i need the current user and its id to save
		// i need my req.body
		const decodedUser = res.locals.decodedToken;
		const foundUser = await User.findOne({
			email: decodedUser.email
		});

		const {
			title,
			post
		} = req.body;

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
			.json({
				message: "post has been saved",
				payload: savedPost
			});
	} catch (error) {
		res.status(500).json({
			message: error,
			error: errorHandler(error)
		});
	}
};

const getAllPosts = async (req, res) => {
	try {
		const foundAllPosts = await Post.find({})
			.populate("owner", "username")
			.populate("commentHistory", "comment");

		// res.status(200).json(foundAllPosts);

		res.render("show-all-posts", {
			posts: foundAllPosts
		});
		// render index.ejs page. pass in the foundAllPosts information as posts
		// IN index.ejs page console.log(posts)
		// forEach of the posts and display each post's title and post
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: error,
			error: error
		});
	}
};

const getPostById = async (req, res) => {
	try {
		const {
			postId
		} = req.params

		const onePost = await Post.findById(postId).populate("commentHistory")
		//you can also a Comment.find for all comments with postId
		//Comment.find({ post: postId}).populate("owner", "username")
		if (!onePost) throw {
			message: "can't find post"
		}

		res.status(200).render("show-one-post", {
			post: onePost
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: error,
			error: error
		});
	}
}

const updatePost = async (req, res) => {
	try {
		const {
			postId
		} = req.params;

		const decodedUser = res.locals.decodedToken;
		const foundUser = await User.findOne({
			email: decodedUser.email
		});

		const foundPost = await Post.findById(postId);

		if (foundUser._id.toString() === foundPost.owner.toString()) {
			const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
				new: true,
			});
			res.status(200).json({
				message: "updated Post",
				payload: updatedPost
			});
		} else {
			throw {
				message: "You are not authorized"
			};
		}
	} catch (error) {
		res.status(500).json({
			message: error,
			error: errorHandler(error)
		});
	}
};

const deletePost = async (req, res) => {
	try {
		const {
			id
		} = req.params;

		const decodedUser = res.locals.decodedToken;
		const foundUser = await User.findOne({
			email: decodedUser.email
		});
		const foundPost = await Post.findById(id);
		if (!foundPost) throw {
			message: "Post not found"
		}


		if (foundUser._id.toString() === foundPost.owner.toString()) {

			//we will use deleteMany({ post: id })
			//find other comments based on user
			//looks for those comments, find the users of those comments
			//delete based on id
			if (foundPost.commentHistory.length > 0) {
				const foundComments = await Comment.find({
					post: id
				});
				if (!foundComments) throw {
					message: "Post not found"
				}

				await foundComments.forEach(async (comment) => {
					console.log(comment);
					let commentUser = await User.findById(comment.owner);
					await commentUser.commentHistory.pull(comment._id.toString());
					await commentUser.save();
				});
				await Comment.deleteMany({
					post: id
				});
			}
			const deletedPost = await Post.findByIdAndDelete(id);
			await foundUser.postHistory.pull(id);
			await foundUser.save();

			res.status(200).json({
				message: "post was deleted",
				deletePost: deletedPost,
				deletedInUser: foundUser,
			});
		} else {
			throw {
				message: "You do not have the permission to delete"
			};
		}
		//delete post
		//delete post id from user postHistory
		//check if there are comments under this post, and delete those comments if its there
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "error",
			error: error
		});
	}
};

module.exports = {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
};