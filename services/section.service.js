const Section = require("../models/Section.model");

module.exports = {
  save: async function (sectionObj) {
    let result = {};
    try {
      result.data = await new Section(sectionObj).save();
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body) {
    let result = {};
    try {
      if (body && body._id) {
        result.data = await Section.findByIdAndUpdate(body._id, { $set: body }, { new: true });
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
      result.data = await Section.findByIdAndDelete(id);
      return { message: "Record deleted successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  listAll: async function (sectionObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};

    const { start, length } = sectionObj;
    if (sectionObj.filter !== undefined) {
      if (sectionObj.filter.searchText !== undefined) {
        condition["title"] = {
          $regex: ".*" + sectionObj.filter.searchText + ".*",
          $options: "i",
        };
      }
      if (
        sectionObj.filter.is_active !== undefined &&
        sectionObj.filter.is_active !== null &&
        sectionObj.filter.is_active != ""
      ) {
        condition["is_active"] = sectionObj.filter.is_active;
      }
    }
    try {
      if (start === undefined || length === undefined) {
        data = await Section.find(condition).sort({
          name: "asc",
        });
      } else {
        data = await Section.find(condition).limit(parseInt(length)).skip(start).sort({
          name: "asc",
        });
      }

      count = await Section.countDocuments(condition);
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
        result.data = await Section.findById(id);
      } else {
        result.err = ["Record not found"];
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
};
