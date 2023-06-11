const subjectServ = require("../services/subject.service");
const utils = require("../utils/utils");

module.exports = {
  add: async function (req, res) {
    let faq = req.body;
    let result = await subjectServ.save(faq);
    utils.sendResponse(result, req, res);
  },

  edit: async function (req, res) {
    let result = await subjectServ.edit(req.body);
    utils.sendResponse(result, req, res);
  },

  delete: async function (req, res) {
    let result = await subjectServ.delete(req.params.id);
    utils.sendResponse(result, req, res);
  },

  listAll: async function (req, res) {
    let result = await subjectServ.listAll(req.body, req.currUser);
    utils.sendResponse(result, req, res);
  },

  getDetail: async function (req, res) {
    let result = await subjectServ.getDetail(req.params.id);
    utils.sendResponse(result, req, res);
  },
};
