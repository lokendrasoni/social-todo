const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
});

schema.pre('deleteOne', function (next) {
    const post_id = this._id;

    mongoose.model("Comment").deleteMany({ post_id: post_id }, next);
});

module.exports = mongoose.model("Post", schema, "posts");