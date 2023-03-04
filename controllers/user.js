const userService = require("../services/user");
const postService = require("../services/post");
const todoService = require("../services/todo");
const catchAsync = require("../utilities/catch-async");
const { sendResponse } = require("../utilities/responses");

exports.list = catchAsync(async (req, res) => {
    const { page, limit, sortField, sortOrder } = req.query;

    const { data, pagination } = await userService.list({ page, limit, sortField, sortOrder });
    
    return sendResponse(res, data, { pagination });
});

exports.get = catchAsync(async (req, res) => {
    const { id } = req.params;

    const data = await userService.get(id);
    
    return sendResponse(res, data);
});

exports.getPosts = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { page, limit, sortField, sortOrder } = req.query;

    const { data, pagination } = await postService.list({ user_id: id, page, limit, sortField, sortOrder });
    
    return sendResponse(res, data, { pagination });
});

exports.getTodos = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { page, limit, sortField, sortOrder } = req.query;

    const { data, pagination } = await todoService.list({ user_id: id, page, limit, sortField, sortOrder });
    
    return sendResponse(res, data, { pagination });
});