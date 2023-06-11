const Lesson = require("../models/Lesson.model");

module.exports = {
  save: async function (lessonObj) {
    let result = {};
    try {
      result.data = await new Lesson(lessonObj).save();
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body) {
    let result = {};
    try {
      if (body && body._id) {
        result.data = await Lesson.findByIdAndUpdate(body._id, { $set: body }, { new: true });
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
      result.data = await Lesson.findByIdAndDelete(id);
      return { message: "Record deleted successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  listAll: async function (lessonObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};

    const { start, length } = lessonObj;
    if (lessonObj.filter !== undefined) {
      if (lessonObj.filter.searchText !== undefined) {
        condition["title"] = {
          $regex: ".*" + lessonObj.filter.searchText + ".*",
          $options: "i",
        };
      }
      if (
        lessonObj.filter.is_active !== undefined &&
        lessonObj.filter.is_active !== null &&
        lessonObj.filter.is_active != ""
      ) {
        condition["is_active"] = lessonObj.filter.is_active;
      }
      if (
        lessonObj.filter.subject_id !== undefined &&
        lessonObj.filter.subject_id !== null &&
        lessonObj.filter.subject_id != ""
      ) {
        condition["subject_id"] = lessonObj.filter.subject_id;
      }
      if (
        lessonObj.filter.class_id !== undefined &&
        lessonObj.filter.class_id !== null &&
        lessonObj.filter.class_id != ""
      ) {
        condition["class_id"] = lessonObj.filter.class_id;
      }
    }
    try {
      if (start === undefined || length === undefined) {
        data = await Lesson.find(condition).sort({
          name: "asc",
        });
      } else {
        data = await Lesson.find(condition).limit(parseInt(length)).skip(start).sort({
          name: "asc",
        });
      }

      count = await Lesson.countDocuments(condition);
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
        result.data = await Lesson.findById(id);
      } else {
        result.err = ["Record not found"];
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
};
