const Class = require("../models/Class.model");

module.exports = {
  save: async function (classObj) {
    let result = {};
    try {
      result.data = await new Class(classObj).save();
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body) {
    let result = {};
    try {
      if (body && body._id) {
        result.data = await Class.findByIdAndUpdate(body._id, { $set: body }, { new: true });
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
      result.data = await Class.findByIdAndDelete(id);
      return { message: "Record deleted successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  listAll: async function (classObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};

    const { start, length } = classObj;
    if (classObj.filter !== undefined) {
      if (classObj.filter.searchText !== undefined) {
        condition["title"] = {
          $regex: ".*" + classObj.filter.searchText + ".*",
          $options: "i",
        };
      }
      if (
        classObj.filter.is_active !== undefined &&
        classObj.filter.is_active !== null &&
        classObj.filter.is_active != ""
      ) {
        condition["is_active"] = classObj.filter.is_active;
      }
    }
    try {
      if (start === undefined || length === undefined) {
        data = await Class.find(condition).populate("subject_list").sort({
          name: "asc",
        });
      } else {
        data = await Class.find(condition).populate("subject_list").limit(parseInt(length)).skip(start).sort({
          name: "asc",
        });
      }

      count = await Class.countDocuments(condition);
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
        result.data = await Class.findById(id);
      } else {
        result.err = ["Record not found"];
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
};
