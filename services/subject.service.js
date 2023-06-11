const Subject = require("../models/Subject.model");

module.exports = {
  save: async function (subjectObj) {
    let result = {};
    try {
      result.data = await new Subject(subjectObj).save();
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body) {
    let result = {};
    try {
      if (body && body._id) {
        result.data = await Subject.findByIdAndUpdate(body._id, { $set: body }, { new: true });
        return { message: "Updated Successfully" };
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  delete: async function (id) {
    let result = {};
    try {
      result.data = await Subject.findByIdAndDelete(id);
      return { message: "Record deleted successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  listAll: async function (subjectObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};

    const { start, length } = subjectObj;
    if (subjectObj.filter !== undefined) {
      if (subjectObj.filter.searchText !== undefined) {
        condition["title"] = {
          $regex: ".*" + subjectObj.filter.searchText + ".*",
          $options: "i",
        };
      }
      if (
        subjectObj.filter.is_active !== undefined &&
        subjectObj.filter.is_active !== null &&
        subjectObj.filter.is_active != ""
      ) {
        condition["is_active"] = subjectObj.filter.is_active;
      }
    }
    try {
      if (start === undefined || length === undefined) {
        data = await Subject.find(condition).sort({
          name: "asc",
        });
      } else {
        data = await Subject.find(condition).limit(parseInt(length)).skip(start).sort({
          name: "asc",
        });
      }

      count = await Subject.countDocuments(condition);
      result = {
        data: data,
        total: count,
        currPage: parseInt(start / length) + 1,
      };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  getDetail: async function (id) {
    let result = {};
    try {
      if (id) {
        result.data = await Subject.findById(id);
      } else {
        result.err = ["Record not found"];
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
};
