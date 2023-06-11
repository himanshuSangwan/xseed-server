const quizzeresultServ = require("../services/quizzeResult.service");
const utils = require("../utils/utils");

module.exports = {
  add: async function (req, res) {
    let faq = req.body;
    let result = await quizzeresultServ.save(faq);
    utils.sendResponse(result, req, res);
  },

  edit: async function (req, res) {
    let result = await quizzeresultServ.edit(req.body);
    utils.sendResponse(result, req, res);
  },

  delete: async function (req, res) {
    let result = await quizzeresultServ.delete(req.params.id);
    utils.sendResponse(result, req, res);
  },

  listAll: async function (req, res) {
    let result = await quizzeresultServ.listAll(req.body, req.currUser);
    utils.sendResponse(result, req, res);
  },

  getDetail: async function (req, res) {
    let result = await quizzeresultServ.getDetail(req.params.id);
    utils.sendResponse(result, req, res);
  },
};
