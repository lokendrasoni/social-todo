const router = require("express").Router();
const todoController = require("../controllers/todo");

router.route("/")
    .get(todoController.list)
    .post(todoController.create);

router.route("/:id")
    .get(todoController.get)
    .put(todoController.editTodo)
    .delete(todoController.deleteTodo);

module.exports = router;