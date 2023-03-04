const authRoutes = require("./auth");
const postRoutes = require("./post");
const todoRoutes = require("./todo");
const userRoutes = require("./user");
const { isAuth } = require("../middlewares");

module.exports = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/posts", isAuth, postRoutes);
    app.use("/api/todos", isAuth, todoRoutes);
    app.use("/api/users", isAuth, userRoutes);

    app.all('/*', (req, res) => {
        res.status(404).send({ errno: 404, message: 'Endpoint not found', type: "INVALID_ENDPOINT" });
    });
}