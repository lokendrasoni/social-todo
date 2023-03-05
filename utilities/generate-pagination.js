module.exports = ({ page, limit, skip, total }) => {
    const next_page = (total - skip) / limit > 1 ? page + 1 : null;
    const previous_page = page - 1 ? page - 1 : null;
    return { next_page, previous_page, total };
};

exports.getPagination = ({ page, limit, sortOrder, sortField }) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = limit * (page - 1);
    sortOrder = sortOrder === "asc" ? 1 : -1;
    const sort = { [sortField || "created_at"]: sortOrder };

    return { page, limit, skip, sort };
}