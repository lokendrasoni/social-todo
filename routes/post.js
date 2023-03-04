const router = require("express").Router();
const postController = require("../controllers/post");

router.route("/")
    .get(postController.list)
    .post(postController.create);

router.route("/:id")
    .get(postController.get)
    .put(postController.editPost)
    .delete(postController.deletePost);

router.route("/:id/comment")
    .post(postController.createComment);

module.exports = router;