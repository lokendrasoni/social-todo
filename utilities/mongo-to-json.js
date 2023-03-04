module.exports = (data) => {
    data = data.toObject ? data.toObject() : data;

    data.id = data._id;
    delete data["password"];
    delete data["_id"];
    delete data["__v"];

    return data;
}