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
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
});

module.exports = mongoose.model("Todo", schema, "todos");