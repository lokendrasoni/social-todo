const bcrypt = require("bcryptjs");
const User = require("../models/users");
const { throwError } = require("../utilities/responses");
const toJson = require("../utilities/mongo-to-json");

const saltRounds = 10;

exports.login = async (username, password) => {
    let res = await User.findOne({ username });
    if (res !== null) {
        const resp = await bcrypt.compare(password, res.password);
        if (resp === true) {
            res = toJson(res);
            return {
                user: res
            }
        }
        else {
            throw throwError("Password is incorrect", "BAD_REQUEST", 400);
        }
    }
    else {
        throw throwError("Username does not exist", "NOT_FOUND", 404);
    }
};

exports.register = async (username, password, type) => {
    let user = await User.findOne({ username });
    if (user) {
        throw throwError("Username is already taken", "BAD_REQUEST", 400);
    }
    else {
        const hash = await bcrypt.hash(password, saltRounds);
        let res = await (new User({
            password: hash,
            username,
            type
        })).save();

        res = toJson(res);

        return {
            user: res
        }
    }
};

exports.updatePassword = async (id, data) => {
    if (data.password === data.confirm_password) {
        const res = await User.findById(id);
        const resp = await bcrypt.compare(data.current_password, res.password);
        if (resp) {
            const hash = await bcrypt.hash(data.password, saltRounds);
            await User.updateOne({ _id: id }, { password: hash, updated_at: Date.now() });
            return {
                status: 1,
            }
        }
        else {
            throw throwError("Current password is incorrect.", "BAD_REQUEST", 400);
        }
    }
    else {
        throw throwError("New passwords must be same.", "BAD_REQUEST", 400);
    }
};