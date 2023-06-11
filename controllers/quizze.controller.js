const quizzeServ = require("../services/quizze.service");
const utils = require("../utils/utils");

module.exports = {
  add: async function (req, res) {
    let faq = req.body;
    let result = await quizzeServ.save(faq);
    utils.sendResponse(result, req, res);
  },

  edit: async function (req, res) {
    let result = await quizzeServ.edit(req.body);
    utils.sendResponse(result, req, res);
  },

  delete: async function (req, res) {
    let result = await quizzeServ.delete(req.params.id);
    utils.sendResponse(result, req, res);
  },

  listAll: async function (req, res) {
    let result = await quizzeServ.listAll(req.body, req.currUser);
    utils.sendResponse(result, req, res);
  },

  getDetail: async function (req, res) {
    let result = await quizzeServ.getDetail(req.params.id);
    utils.sendResponse(result, req, res);
  },
};
