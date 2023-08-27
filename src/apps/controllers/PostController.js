const Posts = require("../models/Posts");
const Users = require("../models/Users");
class PostController {
  async create(req, res) {
    const { image, description } = req.body;

    const newPost = await Posts.create({
      image,
      description,
      author_id: req.userId,
    });

    return res.status(200).json({ posts: newPost });
  }

  async delete(req, res) {
    const { id } = req.params;

    const verifyPost = await Posts.findOne({
      where: {
        id,
      },
    });
    if (!verifyPost) {
      return res.status(404).json({ message: "Post does not exist ! " });
    }

    if (verifyPost.author_id !== req.userId) {
      return res.status(401).json({
        message: "You don 't have permission to delete this post! ",
      });
    }
    const deletePost = await Posts.destroy({
      where: {
        id,
      },
    });
    if (!deletePost) {
      return res.status(500).json({ message: "Failed to delete the post" });
    }
    return res.status(200).json({ message: "post deleted ! " });
  }
  async update(req, res) {
    const { id } = req.params;

    const verifyPost = await Posts.findOne({
      where: {
        id,
      },
    });
    if (!verifyPost) {
      return res.status(404).json({ message: "Post does not exist ! " });
    }

    if (verifyPost.author_id !== req.userId) {
      return res.status(401).json({
        message: "You don 't have permission to update this post! ",
      });
    }
    const postUpdate = await Posts.update(req.body, { where: { id } });
    if (!postUpdate) {
      return res.status(400).json({ massege: "Failed to update this post !" });
    }
    return res.status(200).json({ message: "Post updated! " });
  }

  async addLike(req, res) {
    const { id } = req.params;

    const verifyPost = await Posts.findOne({
      where: {
        id,
      },
    });
    if (!verifyPost) {
      return res.status(404).json({ message: "Post does not exist ! " });
    }
    const postUpdate = await Posts.update(
      {
        number_likes: verifyPost.number_likes + 1,
      },
      { where: { id } }
    );

    if (!postUpdate) {
      return res
        .status(400)
        .json({ message: "fail to add like in this post!" });
    }
    return res.status(200).json({
      message: "like Storege",
    });
  }
  async listMyPosts(req, res) {
    const allPosts = await Posts.findAll({
      order: [["id", "DESC"]],
      where: { author_id: req.userId },
    });
    if (!allPosts) {
      return res.status(400).json({ message: "Failed to list all posts" });
    }
    const formatData = [];
    for (const item of allPosts) {
      formatData.push({
        id: item.id,
        image: item.image,
        description: item.description,
        number_likes: item.number_likes,
      });
    }

    return res.status(200).json({ data: formatData });
  }

  async listAllPosts(req, res) {
    const allPosts = await Posts.findAll({
      order: [["id", "DESC"]],
      attributes: ["id", "description", "image", "number_likes"],
      include: [
        {
          model: Users,
          as: "user",
          required: true,
          attributes: ["id", "user_name"],
        },
      ],
    });

    return res.status(200).json({
      data: allPosts,
    });
  }
}

module.exports = new PostController();
