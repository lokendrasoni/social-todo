const mongoose = require("mongoose");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const generatePagination = require("../utilities/generate-pagination");
const toJson = require("../utilities/mongo-to-json");
const { throwError } = require("../utilities/responses");

exports.list = async ({ user_id, page = 1, limit = 15, sortField, sortOrder }) => {
    const { page: p, limit: l, skip, sort } = generatePagination.getPagination({ page, limit, sortField, sortOrder });
    page = p;
    limit = l;

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

    const posts = await Post.aggregate(query);

    const data = posts[0].data;
    const total = posts[0].total;

    const pagination = generatePagination({ page, limit, skip, total });

    return { data, pagination };
};

exports.get = async ({ id, page = 1, limit = 15, sortField, sortOrder }) => {
    let post = await Post.findById(id).populate("user_id");

    if (post) {
        post = toJson(post);
        post.user = toJson(post.user_id);
        delete post["user_id"];

        const comments = await getComments({ post_id: id, page, limit, sortField, sortOrder });

        post.comments = comments;

        return post;
    }
    else {
        throw throwError("Post does not exist", "NOT_FOUND", 404);
    }
};

const getComments = async ({ post_id, page, limit, sortField, sortOrder }) => {
    const { page: p, limit: l, skip, sort } = generatePagination.getPagination({ page, limit, sortField, sortOrder });
    page = p;
    limit = l;

    const query = [
        {
            $match: {
                post_id: new mongoose.Types.ObjectId(post_id)
            }
        },
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
                        $lookup: {
                            as: "user",
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id"
                        }
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $project: {
                            id: "$_id",
                            _id: 0,
                            comment: 1,
                            user: {
                                id: "$user._id",
                                username: 1
                            },
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

    const comments = await Comment.aggregate(query);

    const data = comments[0].data;
    const total = comments[0].total;

    const pagination = generatePagination({ page, limit, skip, total });

    return { data, pagination };
};

exports.create = async ({ user_id, title, body }) => {
    let post = await new Post({
        user_id,
        title,
        body
    }).save();

    post = toJson(post);

    return post;
};

exports.createComment = async ({ user_id, post_id, body }) => {
    const post = await Post.findById(post_id);

    if (post) {
        let comment = await new Comment({
            user_id,
            post_id,
            comment: body
        }).save();

        comment = toJson(comment);

        return comment;
    }
    else {
        throw throwError("Post does not exist", "NOT_FOUND", 404);
    }
};

exports.editPost = async ({ user_id, post_id, title, body, user_type }) => {
    let post = await findPostAccess({ post_id, user_id, user_type });

    post.title = title || post.title;
    post.body = body || post.body;

    await post.save();

    post = toJson(post);

    return post;
};

const findPostAccess = async ({ post_id, user_id, user_type }) => {
    let post = await Post.findById(post_id);

    if (post) {
        if (user_id.toString() === post.user_id.toString() || user_type === "admin") {
            return post;
        }
        else {
            throw throwError("User is not allowed to edit the post", "NOT_ALLOWED", 405);
        }
    }
    else {
        throw throwError("Post does not exist", "NOT_FOUND", 404);
    }
};

exports.deletePost = async ({ post_id, user_id, user_type }) => {
    const post = await findPostAccess({ post_id, user_id, user_type });

    await Post.deleteOne({ _id: post._id });
    await Comment.deleteMany({ post_id: post._id });

    return true;
};