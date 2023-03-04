const router = require("express").Router();
const userController = require("../controllers/user");

router.route("/")
    .get(userController.list);

router.route("/:id")
    .get(userController.get);

router.route("/:id/posts")
    .get(userController.getPosts);

router.route("/:id/todos")
    .get(userController.getTodos);

module.exports = router;