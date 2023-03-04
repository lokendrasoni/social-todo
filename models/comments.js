const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
});

module.exports = mongoose.model("Comment", schema, "comments");