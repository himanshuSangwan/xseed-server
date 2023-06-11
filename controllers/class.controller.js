const classServ = require("../services/class.service");
const utils = require("../utils/utils");

module.exports = {
  add: async function (req, res) {
    let faq = req.body;
    let result = await classServ.save(faq);
    utils.sendResponse(result, req, res);
  },

  edit: async function (req, res) {
    let result = await classServ.edit(req.body);
    utils.sendResponse(result, req, res);
  },

  delete: async function (req, res) {
    let result = await classServ.delete(req.params.id);
    utils.sendResponse(result, req, res);
  },

  listAll: async function (req, res) {
    let result = await classServ.listAll(req.body, req.currUser);
    utils.sendResponse(result, req, res);
  },

  getDetail: async function (req, res) {
    let result = await classServ.getDetail(req.params.id);
    utils.sendResponse(result, req, res);
  },
};
