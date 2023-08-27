const { Router } = require("express");
const { upload } = require("./configs/multer");
const routes = new Router();
const schemaValidator = require("../src/apps/middlewares/schemaValidator");
const AuthenticationMiddleware = require("../src/apps/middlewares/authentication");

const authSchema = require("../src/schema/auth.schema.json");
const AuthenticationController = require("../src/apps/controllers/AuthenticationController");
const UserControler = require("./apps/controllers/UserControllesrs");

const userSchema = require("../src/schema/create.user.schema.json");
const FileController = require("./apps/controllers/FileController");

const PostController = require("./apps/controllers/PostController");
const PostSchema = require("./schema/posts.creat.schema.json");

routes.get("/users", schemaValidator(userSchema), UserControler.create);
routes.post(
  "/auth",
  schemaValidator(authSchema),
  AuthenticationController.authenticate
);

routes.get("/test", (req, res) => {
  return res.send({ message: "connect with success! :) " });
});

routes.use(AuthenticationMiddleware);
routes.put("/user", UserControler.update);
routes.delete("/user", UserControler.delete);
routes.get("/user-profile", UserControler.userProfile);
routes.post("/upload", upload.single("image"), FileController.upload);
routes.post("/new-posts", schemaValidator(PostSchema), PostController.create);
routes.delete("/delete-posts/:id", PostController.delete);
routes.put("/post/:id", PostController.update);
routes.put("/add-like/:id", PostController.addLike);
routes.get("/list-posts", PostController.listMyPosts);
routes.get("/all-posts", PostController.listAllPosts);
module.exports = routes;
