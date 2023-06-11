const sectionServ = require("../services/section.service");
const utils = require("../utils/utils");

module.exports = {
  add: async function (req, res) {
    let faq = req.body;
    let result = await sectionServ.save(faq);
    utils.sendResponse(result, req, res);
  },

  edit: async function (req, res) {
    let result = await sectionServ.edit(req.body);
    utils.sendResponse(result, req, res);
  },

  delete: async function (req, res) {
    let result = await sectionServ.delete(req.params.id);
    utils.sendResponse(result, req, res);
  },

  listAll: async function (req, res) {
    let result = await sectionServ.listAll(req.body, req.currUser);
    utils.sendResponse(result, req, res);
  },

  getDetail: async function (req, res) {
    let result = await sectionServ.getDetail(req.params.id);
    utils.sendResponse(result, req, res);
  },
};
