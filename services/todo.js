const mongoose = require("mongoose");
const Todo = require("../models/todos");
const generatePagination = require("../utilities/generate-pagination");
const toJson = require("../utilities/mongo-to-json");
const { throwError } = require("../utilities/responses");

exports.list = async ({ user_id, page = 1, limit = 15, sortField, sortOrder }) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = limit * (page - 1);
    sortOrder = sortOrder ? (sortOrder === "asc" ? 1 : -1) : -1;
    const sort = { [sortField || "created_at"]: sortOrder };

    const query = [
        ...(user_id ? [
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(user_id)
                }
            }
        ] : []),
        {
            $facet: {
                data: [
                    {
                        $sort: sort
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },
                    {
                        $project: {
                            id: "$_id",
                            _id: 0,
                            title: 1,
                            body: 1,
                            status: 1,
                            user_id: 1,
                            created_at: 1,
                            updated_at: 1
                        }
                    }
                ],
                total: [
                    {
                        $count: "total"
                    }
                ]
            }
        },
        {
            $set: {
                total: {
                    $ifNull: [
                        {
                            $arrayElemAt: ['$total.total', 0]
                        },
                        0
                    ]
                }
            }
        }
    ];

    const todos = await Todo.aggregate(query);

    const data = todos[0].data;
    const total = todos[0].total;

    const pagination = generatePagination({ page, limit, skip, total });

    return { data, pagination };
};

exports.get = async (id) => {
    let todo = await Todo.findById(id).populate("user_id");

    if (todo) {
        todo = toJson(todo);
        todo.user = toJson(todo.user_id);
        delete todo["user_id"];

        return todo;
    }
    else {
        throw throwError("Todo does not exist", "NOT_FOUND", 404);
    }
};

exports.create = async ({ user_id, title, body }) => {
    let todo = await new Todo({
        user_id,
        title,
        body
    }).save();

    todo = toJson(todo);

    return todo;
};

exports.editTodo = async ({ user_id, todo_id, title, body, status, user_type }) => {
    let todo = await findTodoAccess({ todo_id, user_id, user_type });

    todo.title = title || todo.title;
    todo.body = body || todo.body;
    todo.status = status || todo.status;

    await todo.save();

    todo = toJson(todo);

    return todo;
};

const findTodoAccess = async ({ todo_id, user_id, user_type }) => {
    let todo = await Todo.findById(todo_id);

    if (todo) {
        if (user_id.toString() === todo.user_id.toString() || user_type === "admin") {
            return todo;
        }
        else {
            throw throwError("User is not allowed to edit the todo", "NOT_ALLOWED", 405);
        }
    }
    else {
        throw throwError("Todo does not exist", "NOT_FOUND", 404);
    }
};

exports.deleteTodo = async ({ todo_id, user_id, user_type }) => {
    const todo = await findTodoAccess({ todo_id, user_id, user_type });

    await Todo.deleteOne({ _id: todo._id });

    return true;
};