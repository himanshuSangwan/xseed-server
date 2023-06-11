const UserServ = require("../services/user.service");
const utils = require("../utils/utils");
const fs = require("fs");

module.exports = {
  add: async function (req, res, next) {
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const tmp_path = req.files[i].path;
        let rendomNumber = Math.floor(1000 + Math.random() * 9000);
        let fileExtentsion = req.files[i].originalname.split(".");
        const file_final_name = `${new Date().getTime()}${rendomNumber}.${fileExtentsion[fileExtentsion.length - 1]}`;
        const final_path = process.env.BASE_PATH + process.env.IMAGE_DESTINATION + file_final_name;
        final_url = process.env.ENDPOINT + process.env.IMAGE_DESTINATION + file_final_name;
        fs.rename(tmp_path, final_path, (err) => {
          if (err) {
            return req.files[i].fieldname + " file linking failed";
          }
        });
        req.body[req.files[i].fieldname] = final_url;
      }
    }
    let user = req.body;
    let result = await UserServ.add(user, req.currUser);
    utils.sendResponse(result, req, res);
  },
  edit: async function (req, res, next) {
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const tmp_path = req.files[i].path;
        let rendomNumber = Math.floor(1000 + Math.random() * 9000);
        let fileExtentsion = req.files[i].originalname.split(".");
        const file_final_name = `${new Date().getTime()}${rendomNumber}.${fileExtentsion[fileExtentsion.length - 1]}`;
        const final_path = process.env.BASE_PATH + process.env.IMAGE_DESTINATION + file_final_name;
        final_url = process.env.ENDPOINT + process.env.IMAGE_DESTINATION + file_final_name;
        fs.rename(tmp_path, final_path, (err) => {
          if (err) {
            return req.files[i].fieldname + " file linking failed";
          }
        });
        req.body[req.files[i].fieldname] = final_url;
      }
    }
    let oldData = await UserServ.getDetail(req.body._id);
    let result = await UserServ.edit(req.body, req.currUser);
    if (result) {
      utils.deleteOldFile(oldData.data.profile_img, req.body.profile_img);
      utils.deleteOldFile(oldData.data.cover_img, req.body.cover_img);
    }
    utils.sendResponse(result, req, res);
  },
  getDetail: async function (req, res) {
    let result = await UserServ.getDetail(req.params.id);
    utils.sendResponse(result, req, res);
  },

  delete: async function (req, res) {
    let result = await UserServ.delete(req.params.id);
    if (result.toBeDeleted && result.toBeDeleted.length > 0) {
      utils.deleteFile(result.toBeDeleted);
      delete result.toBeDeleted;
    }
    utils.sendResponse(result, req, res);
  },

  listAll: async function (req, res) {
    let result = await UserServ.listAll(req.body, req.currUser);
    utils.sendResponse(result, req, res);
  },

  login: async function (req, res) {
    let logintype = "";
    if (req.body.type) {
      logintype = req.body.type;
    }
    let result = await UserServ.login(req.body.email, req.body.password, logintype, req.body);
    utils.sendResponse(result, req, res);
  },
  logout: async function (req, res) {
    let result = await UserServ.logout(req.body);
    utils.sendResponse(result, req, res);
  },
  forgetPassword: async function (req, res) {
    let result = await UserServ.forgetPassword(req.body.email);
    utils.sendResponse(result, req, res);
  },
};
