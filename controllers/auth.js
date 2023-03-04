const authService = require("../services/auth");
const sessionService = require("../services/sessions");
const catchAsync = require("../utilities/catch-async");
const { sendResponse } = require("../utilities/responses");

exports.login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const { user } = await authService.login(username, password);
    const ip = (
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        ""
    );
    const user_agent = req.headers['user-agent'];

    const token = await sessionService.create(user.id, ip, user_agent);
    
    return sendResponse(res, token);
});

exports.register = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const { user } = await authService.register(username, password);
    const ip = (
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        ""
    );
    const user_agent = req.headers['user-agent'];

    const token = await sessionService.create(user.id, ip, user_agent);

    return sendResponse(res, token);
});

exports.changePassword = catchAsync(async (req, res) => {
    await authService.updatePassword(req.auth.user.id, req.body);

    res.json({
        success: true,
        message: "Password reset successfully."
    });
});