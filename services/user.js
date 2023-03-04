const User = require("../models/users");
const { throwError } = require("../utilities/responses");
const toJson = require("../utilities/mongo-to-json");

exports.list = async ({ page = 1, limit = 15, sortField, sortOrder }) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = limit * (page - 1);
    sortOrder = sortOrder ? (sortOrder === "asc" ? 1 : -1) : -1;
    const sort = { [sortField]: sortOrder };

    const query = [
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
                            username: 1,
                            created_at: 1,
                            updated_at: 1
                        }
                    }
                ],
                total: {
                    $count: "total"
                }
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

    const users = await User.aggregate(query);

    const data = users[0].data;
    const total = users[0].total;

    const pagination = generatePagination({ page, limit, skip, total });

    return { data, pagination };
};

exports.get = async (id) => {
    let user = await User.findById(id);

    if (user) {
        user = toJson(user);
    
        return user;
    }
    else {
        throw throwError("User does not exist", "NOT_FOUND", 404);
    }
};