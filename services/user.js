const User = require("../models/users");
const { throwError } = require("../utilities/responses");
const toJson = require("../utilities/mongo-to-json");
const generatePagination = require("../utilities/generate-pagination");

exports.list = async ({ page = 1, limit = 15, sortField, sortOrder }) => {
    const { page: p, limit: l, skip, sort } = generatePagination.getPagination({ page, limit, sortField, sortOrder });
    page = p;
    limit = l;

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