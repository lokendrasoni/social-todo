const todoService = require("../services/todo");
const catchAsync = require("../utilities/catch-async");
const { sendResponse } = require("../utilities/responses");

exports.list = catchAsync(async (req, res) => {
    const { page, limit, sortField, sortOrder } = req.query;

    const { data, pagination } = await todoService.list({ page, limit, sortField, sortOrder });
    
    return sendResponse(res, data, { pagination });
});

exports.get = catchAsync(async (req, res) => {
    const { id } = req.params;

    const data = await todoService.get(id);
    
    return sendResponse(res, data);
});

exports.create = catchAsync(async (req, res) => {
    const { title, body } = req.body;
    const { user } = req.auth;

    const data = await todoService.create({ title, body, user_id: user.id });
    
    return sendResponse(res, data);
});

exports.editTodo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, body, status } = req.body;
    const { user } = req.auth;

    const data = await todoService.editTodo({ user_id: user.id, todo_id: id, body, title, status, user_type: user.type });
    
    return sendResponse(res, data);
});

exports.deleteTodo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { user } = req.auth;

    const data = await todoService.deleteTodo({ user_id: user.id, todo_id: id, user_type: user.type });
    
    return sendResponse(res, data);
});