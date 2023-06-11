const QuizzeResult = require("../models/QuizzeResult.model");

module.exports = {
  save: async function (quizzeresultObj, currUser) {
    let result = {};
    quizzeresultObj.userId = currUser._id;
    try {
      let oldData = await QuizzeResult.findOne({ userId: currUser._id, quizzeId: quizzeresultObj.quizzeId });
      if (oldData) {
        result.data = await QuizzeResult.updateOne(
          { userId: currUser._id, quizzeId: quizzeresultObj.quizzeId },
          { $set: quizzeresultObj }
        );
      } else {
        result.data = await new QuizzeResult(quizzeresultObj).save();
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body, currUser) {
    let result = {};
    body.userId = currUser._id;
    try {
      if (body && body._id) {
        result.data = await QuizzeResult.findByIdAndUpdate(body._id, { $set: body }, { new: true });
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
      result.data = await QuizzeResult.findByIdAndDelete(id);
      return { message: "Record deleted successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  listAll: async function (quizzeresultObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};

    const { start, length } = quizzeresultObj;
    if (quizzeresultObj.filter !== undefined) {
      if (quizzeresultObj.filter.searchText !== undefined) {
        condition["title"] = {
          $regex: ".*" + quizzeresultObj.filter.searchText + ".*",
          $options: "i",
        };
      }
      if (
        quizzeresultObj.filter.is_active !== undefined &&
        quizzeresultObj.filter.is_active !== null &&
        quizzeresultObj.filter.is_active != ""
      ) {
        condition["is_active"] = quizzeresultObj.filter.is_active;
      }
    }
    try {
      if (start === undefined || length === undefined) {
        data = await QuizzeResult.find(condition).sort({
          name: "asc",
        });
      } else {
        data = await QuizzeResult.find(condition).limit(parseInt(length)).skip(start).sort({
          name: "asc",
        });
      }

      count = await QuizzeResult.countDocuments(condition);
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
        result.data = await QuizzeResult.findById(id);
      } else {
        result.err = ["Record not found"];
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
};
