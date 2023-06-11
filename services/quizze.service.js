const Quizze = require("../models/Quizze.model");

module.exports = {
  save: async function (quizzeObj) {
    let result = {};
    try {
      result.data = await new Quizze(quizzeObj).save();
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body) {
    let result = {};
    try {
      if (body && body._id) {
        result.data = await Quizze.findByIdAndUpdate(body._id, { $set: body }, { new: true });
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
      result.data = await Quizze.findByIdAndDelete(id);
      return { message: "Record deleted successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  listAll: async function (quizzeObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};

    const { start, length } = quizzeObj;
    if (quizzeObj.filter !== undefined) {
      if (quizzeObj.filter.searchText !== undefined) {
        condition["title"] = {
          $regex: ".*" + quizzeObj.filter.searchText + ".*",
          $options: "i",
        };
      }
      if (
        quizzeObj.filter.is_active !== undefined &&
        quizzeObj.filter.is_active !== null &&
        quizzeObj.filter.is_active != ""
      ) {
        condition["is_active"] = quizzeObj.filter.is_active;
      }
    }
    try {
      if (start === undefined || length === undefined) {
        data = await Quizze.find(condition).sort({
          name: "asc",
        });
      } else {
        data = await Quizze.find(condition).limit(parseInt(length)).skip(start).sort({
          name: "asc",
        });
      }

      count = await Quizze.countDocuments(condition);
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
        result.data = await Quizze.findById(id);
      } else {
        result.err = ["Record not found"];
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
};
