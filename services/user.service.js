const User = require("../models/User.model");
// const UserOtp = require("../models/UserOtp.model");
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const { ObjectId } = require("mongodb");
module.exports = {
  add: async function (user, currUser) {
    let result = {};
    const saltRounds = 10;
    let randompwd = "";
    try {
      if (user.password) {
        randompwd = user.password;
      }
      let CheckEmail = await User.find({ email: user.email });
      let checkUserName = await User.find({ user_name: user.user_name });
      if (checkUserName.length === 0) {
        if (CheckEmail.length === 0) {
          let salt = bcrypt.genSaltSync(saltRounds);

          let hash = bcrypt.hashSync(randompwd, salt);
          user.password = hash;
          user.setting = {};
          result.data = await new User(user).save();
          result.data = await User.findOne({ _id: result.data._id });
          // this.signupActiveLink(user.email);
          result.token = utils.jwtEncode({ email: result.data.email, userId: result.data._id });
        } else {
          throw Error("This email is already registered.");
        }
      } else {
        throw Error("This user name is already registered.");
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  edit: async function (body, currUser) {
    let result = { data: null };
    const { password, verifyPassword, newPassword, email, _id, user_name } = body;
    const saltRounds = 10;
    let randompwd = "";

    try {
      const usr = await User.findById(_id).select("+password");
      if (email !== usr.email) {
        const checkEmail = await User.findOne({ email: email });
        //checking both users email from database to body email
        if (checkEmail) {
          throw Error("Email already registered");
        }
      }
      if (user_name !== usr.user_name) {
        const checkUserName = await User.findOne({ user_name: user_name });
        if (checkUserName) {
          throw Error("User name already registered");
        }
      }

      //compare the old password with new password if body contain password
      if (password && verifyPassword && newPassword) {
        //checking  new password and old password
        if (newPassword !== verifyPassword) {
          throw Error("Password does't match.");
        }
        const check = await bcrypt.compare(password, usr.password);
        if (!check) {
          throw Error("Old password does't match.");
        }

        //check the current user id is equal to body user id
        // if (currUser._id.toString() != _id) {
        //   return { error: "Permission Denied." };
        // }

        let salt = bcrypt.genSaltSync(saltRounds); // creating salt
        let hash = bcrypt.hashSync(newPassword, salt); // create hash
        body.password = hash; // setting hash password to the original password

        //saving the new data
        result.data = await User.findByIdAndUpdate(body._id, { $set: body }, { new: true });
      } else {
        delete body.password;
        result.data = await User.findByIdAndUpdate(body._id, { $set: body }, { new: true });
      }
      return {
        result: result.data,
        message: "Updated Successfully",
      };
      // return { message: "Updated Successfully" };
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  getDetail: async function (id) {
    let result = {
      data: null,
      err: null,
    };
    try {
      if (id) {
        result.data = await User.findById(id);
      } else {
        throw Error("User not found");
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },

  delete: async function (id) {
    let result = {};
    let toBeDeleted = [];
    try {
      result.data = await User.findByIdAndDelete(id);
      if (result.data) {
        toBeDeleted.push(result.data.profile_img);
        return { toBeDeleted, message: "Record deleted successfully" };
      } else {
        throw Error("Record not found");
      }
    } catch (err) {
      result.err = err.message;
    }
    return result;
  },
  listAll: async function (userObj, currUser) {
    let result = {};
    let data = null;
    let count;
    let condition = {};
    let sortBy = { createdAt: "desc" };
    if (userObj.sort) {
      sortBy = userObj.sort;
    }
    if (userObj.filter !== undefined) {
      if (userObj.filter.searchText !== undefined) {
        condition = {
          $or: [
            {
              user_name: {
                $regex: ".*" + userObj.filter.searchText + ".*",
                $options: "i",
              },
            },
            {
              email: {
                $regex: ".*" + userObj.filter.searchText + ".*",
                $options: "i",
              },
            },
          ],
        };
      }
      if (userObj.filter.role !== undefined && userObj.filter.role !== null && userObj.filter.role != "") {
        condition["role"] = userObj.filter.role;
      }

      if (userObj.filter.searchId !== undefined && userObj.filter.searchId !== null && userObj.filter.searchId != "") {
        condition["_id"] = userObj.filter.searchId;
      }
    }

    try {
      if (userObj.start === undefined || userObj.length === undefined) {
        data = await User.find(condition).sort(sortBy);
      } else {
        data = await User.find(condition).limit(parseInt(userObj.length)).skip(userObj.start).sort(sortBy);
      }
      count = await User.countDocuments(condition);
      result = {
        data: data,
        total: count,
        currPage: parseInt(userObj.start / userObj.length) + 1,
      };
    } catch (err) {
      result.err = err.message;
    }

    return result;
  },
  login: async function (email, password, logintype, body) {
    let result = {};
    try {
      let user = await User.findOne({ $or: [{ email: email }, { user_name: email }] }).select("+password");

      if (user && user.is_active === false) {
        throw Error("Account is inactive.");
      } else {
        let check = false;
        if (user) {
          check = await bcrypt.compare(password, user.password);
          user.password = undefined;
        }
        if (check === true) {
          result.data = user;
          result.token = utils.jwtEncode({ email: user.email, userId: user._id });
          await User.findByIdAndUpdate({ _id: user._id }, { loginAt: new Date() });
        } else {
          throw Error("Email or password is incorrect.");
        }
      }
    } catch (err) {
      return (result.err = err.message);
    }
    return result;
  },
  logout: async function (body) {
    let result = {};
    try {
    } catch (err) {
      return (result.err = err.message);
    }
    return result;
  },
  forgetPassword: async function (email) {
    let validation = true;
    let result = {};
    try {
      if (validation) {
        let data = await User.findOne({ $or: [{ email: email }, { user_name: email }] });

        if (data) {
          let otp = Math.floor(100000 + Math.random() * 900000);
          // Mail for forgot password
          let newSub = "Vestorgrow password help arrived";

          let newContent = "Please verify this otp " + otp + " to reset password ";

          let newContenta = `<div style="padding: 40px; background-color: #eee; font-family: Helvetica">
          <div style="margin-bottom: 35px">
            <img src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateVG-bluIcon.png" alt="" />
          </div>
          <div style="padding: 45px 30px; background-color: #fff; border-radius: 15px; max-width: 100%">
            <div style="margin-bottom: 20px">
              <img src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateSpinIcon.png" />
            </div>
            <div>
              <h5 style="margin-bottom: 30px; font-size: 20px; font-weight: 700; color: #000">Login Verification</h5>
              <p style="margin-bottom: 30px; font-size: 16px; font-weight: 500; color: #000">Hello ${data.user_name},</p>
              <p style="margin: 0px; font-size: 16px; font-weight: 400; color: #000; line-height: 1.4">
                Please use the OTP below to reset your email.
              </p>
            </div>
            <h4 style="margin: 45px 0px; font-size: 36px; color: #00808b; letter-spacing: 5px">${otp}</h4>
            <div>
              <p style="margin: 0px; font-size: 16px; font-weight: 400; color: #384860; line-height: 1.4">
                If you have problems accessing the link above, please copy and paste the URL below into your browser:
              </p>
              <a
                href="https://vestorgrow.com/"
                target="_blank"
                style="
                  font-size: 16px;
                  font-weight: 400;
                  color: #2969ff;
                  padding-bottom: 1px;
                  border-bottom: 1px solid #2969ff;
    
                  text-decoration: none;
                "
                >www.vestorgrow.com</a
              >
            </div>
          </div>
          <div style="margin: 36px 0 20px">
            <p style="margin: 0px; font-size: 16px; font-weight: 400; color: #494747; line-height: 1.4">
              Want to give us feedback? Let us know what you think
              <span style="color: #3964ea"
                ><a
                  href="${process.env.FRONTEND_BASE_URL}"
                  target="_blank"
                  style="color: #3964ea; padding-bottom: 1px; border-bottom: 1px solid #3964ea; text-decoration: none"
                >
                  here</a
                >.</span
              >
            </p>
          </div>
          <div>
        <div style="width: calc(100% - 152px); display: inline-block">
          <img src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateVG-bl-Icon.png" alt="" />
        </div>
        <ul style="width: 140px; display: inline-block; padding: 0px">
          <li style="margin: 0px; width: 17px; display: inline-block; height: 17px; margin-right: 22px">
            <img
              src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateInstagramIcon.png"
              alt=""
              style="height: 16px; width: 16px"
            />
          </li>
          <li style="margin: 0px; display: inline-block; height: 17px; margin-right: 22px">
            <img
              src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateFbIcon.png"
              alt=""
              style="height: 16px"
            />
          </li>
          <li style="margin: 0px; width: 17px; display: inline-block; height: 17px; margin-right: 22px">
            <img
              src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateTwitterIcon.png"
              alt=""
              style="height: 20px; width: 20px"
            />
          </li>
          <li style="margin: 0px; width: 17px; display: inline-block; height: 17px">
            <img
              src="${process.env.FRONTEND_BASE_URL}/images/profile/emailTemplateYoutubeIcon.png"
              alt=""
              style="height: 20px; width: 20px"
            />
          </li>
        </ul>
      </div>
        </div>`;

          let params = {
            to: data.email,
            subject: newSub,
            text: newContenta,
          };
          utils.emailSend(params);
          let email_otp = { otp: otp, email: data.email };
          // data = await new UserOtp(email_otp).save();
          return {
            result: true,
            message: "Mail has been sent, please check your inbox or spam folder",
          };
        } else {
          throw Error("Email Id does not exists");
        }
      }
    } catch (err) {
      result.err = err.message;
      return result;
    }
  },
};
