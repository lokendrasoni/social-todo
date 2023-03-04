const postService = require("../services/post");
const catchAsync = require("../utilities/catch-async");
const { sendResponse } = require("../utilities/responses");

exports.list = catchAsync(async (req, res) => {
    const { page, limit, sortField, sortOrder } = req.query;

    const { data, pagination } = await postService.list({ page, limit, sortField, sortOrder });
    
    return sendResponse(res, data, { pagination });
});

exports.get = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { page, limit, sortField, sortOrder } = req.query;

    const data = await postService.get({ id, page, limit, sortField, sortOrder });
    
    return sendResponse(res, data);
});

exports.create = catchAsync(async (req, res) => {
    const { title, body } = req.body;
    const { user } = req.auth;

    const data = await postService.create({ title, body, user_id: user.id });
    
    return sendResponse(res, data);
});

exports.createComment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const { user } = req.auth;

    const data = await postService.createComment({ user_id: user.id, post_id: id, body: comment });
    
    return sendResponse(res, data);
});

exports.editPost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    const { user } = req.auth;

    const data = await postService.editPost({ user_id: user.id, post_id: id, body, title, user_type: user.type });
    
    return sendResponse(res, data);
});

exports.deletePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { user } = req.auth;

    const data = await postService.deletePost({ user_id: user.id, post_id: id, user_type: user.type });
    
    return sendResponse(res, data);
});