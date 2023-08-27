const bcryptjs = require("bcryptjs");
const Users = require("../models/Users");

class UserControler {
  async create(req, res) {
    const verifyUser = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (verifyUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await Users.create(req.body);
    if (!user) {
      return res.status(400).json({ message: "Failed to create a user ! " });
    }
    return res.send({ message: "User Created!" });
  }

  async update(req, res) {
    const {
      name,
      avatar,
      bio,
      gender,
      old_password,
      new_password,
      confirm_new_password,
    } = req.body;

    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });
    if (!user) {
      return res.status(400).json({ messege: "User not exists" });
    }
    let encryptedPassword = "";
    if (old_password) {
      if (!(await user.checkPassword(old_password))) {
        return res.status(401).json({ messege: "Invalid password" });
      }
      if (!new_password || !confirm_new_password) {
        return res.status(422).json({
          messege: "New Password and Confirm New Password are required",
        });
      }
      if (new_password != confirm_new_password) {
        return res.status(401).json({
          massege: "New password and confirm new password dows not match!",
        });
      }
      encryptedPassword = await bcryptjs.hash(new_password, 8);
    }
    await Users.update(
      {
        name: name || user.name,
        avatar: avatar || user.avatar,
        bio: bio || user.bio,
        gender: gender || user.gender,
        password_hash: encryptedPassword || user.password_hash,
      },

      {
        where: {
          id: user.id,
        },
      }
    );
    return res.status(200).json({ mesaage: "User Update" });
  }
  async delete(req, res) {
    const userToDelete = await Users.findOne({
      where: {
        id: req.userId,
      },
    });
    if (!userToDelete) {
      return res.status(400).json({ messege: "User to Delete Not Exists" });
    }
    await Users.destroy({
      where: {
        id: req.userId,
      },
    });
    return res.status(200).json({ messege: "User Deleted Successfully!" });
  }
  async userProfile(req, res) {
    const user = await Users.findOne({
      attributes: [
        "id",
        "name",
        "user_name",
        "email",
        "avatar",
        "bio",
        "gender",
      ],
      where: {
        id: req.userId,
      },
    });
    if (!user) {
      return res.status(400).json({ messege: "User Does Not Exist" });
    }
    const { id, name, user_name, email, avatar, bio, gender } = user;
    return res
      .status(200)
      .json({ id, name, user_name, email, avatar, bio, gender });
  }
}

module.exports = new UserControler();
