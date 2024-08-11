const { jsonFailed, jsonS } = require("../../utils");
const { phoneNubmerVerification, otpVerification, passwordChange, passwordUpdate } = require("./authServices");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/jwt");
const { User } = require("../../models/users");
const { googleVerify, googleAuthSignIn } = require("../services/google");

let controller = {
    verifyPhoneNumber: async (req, res) => {
        const { phoneNumber } = req.body;
        const verifyNumber = await phoneNubmerVerification(phoneNumber);
        if(!verifyNumber) return jsonFailed(res, {}, "Error Verifying Phone Number", 400);
        return jsonS(res, 200, "Verification successfully sent");
    },

    verifyOTP: async (req, res) => {
        const { phoneNumber, otp } = req.body;
        const verifyOtp = await otpVerification(phoneNumber, otp);
        if(!verifyOtp) return jsonFailed(res, {}, "Error Verifying OTP", 400);
        return jsonS(res, 200, "Phone Number Susseccfully Verified");
    },

    signin: async (req, res) => {
      try {
        const { email, password } = req.body;
        const isUser = await User.findOne({ email: email.toLowerCase() }).select(
          "+password"
        );
        if(!isUser){
            return jsonFailed(res, {}, "Invalid Credentials", 400);
        }
        // compare hashed password against password from request body;
        let passwordIsValid = bcrypt.compareSync(
            password,
            isUser.password
          );
          if (!passwordIsValid){
            return jsonFailed(res, {}, "Invalid Credentials", 400);
          }
          req.session.user = isUser;
          const data = controller.getToken(isUser);
        return jsonS(res, 200, "Successful", data);
      } catch (error) {
        console.error(error)
      }
    },

    googleAuth: async (req, res) => {
      const googleSignin = await googleAuthSignIn();
      req.session.state = googleSignin.state;
      res.redirect(googleSignin.authUrl);
    },

    googleSignUp: async (req, res) => {
      const { code } = req.body;
      const verifyIdtoken = await googleVerify(code);
      if (verifyIdtoken) {
        // save user details to database
        return jsonS(res, 200, "success", verifyIdtoken, {});
      }
      return jsonFailed(res, null, "error verifying google account", 400);
    },
  
    googleLogin: async (req, res) => {
      const { code } = req.body;
      const verifyIdtoken = await verify(code);
      if (verifyIdtoken) {
        return jsonS(res, 200, "success", verifyIdtoken, {});
      }
      return jsonFailed(res, null, "error verifying google account", 400);
    },

    googleRedirect: async (req, res) => {
      const { authuser, code, hd, prompt, scope, state} = req.query;
      console.log(req.query);
      if (req.session.state === state) {
        const verifyIdtoken = await googleVerify(code);
      if (verifyIdtoken) {
        return jsonS(res, 200, "success", verifyIdtoken, {});
      }
      return jsonFailed(res, null, "error verifying google account", 400);
      }
      console.log("incorrect");
      return jsonFailed(res, null, "error verifying google account: unverrified attempt", 400);
    },

    // get authentication json web token
    getToken: (user) => {
        let token = jwt.sign(
          { id: user._id, email: user.email },
          config.jwt_secret,
          {
            expiresIn: 2630000, // expires in 1 month
          }
        );
        let refreshToken = jwt.sign({ id: user._id, email: user.email }, config.jwt_secret);
        let data = {
        token: token,
        refreshToken: refreshToken,
        token_type: "jwt",
        expiresIn: 2630000,
      };
      return data;
      },

      changePassword: async (req, res) =>{
        const { id } = req.user;
        const { oldPassword, newPassword } = req.body;
        const changeUserPassword = await passwordChange(id, oldPassword, newPassword);
        if(changeUserPassword) return jsonS(res, 200, "Password Changed Susseccfully"); 
        if(!changeUserPassword) return jsonFailed(res, {}, "Password does not match", 400);
      },

      updatePassword: async (req, res) =>{
        const { id } = req.user;
        const { newPassword } = req.body;
        const updateUserPassword = await passwordUpdate(id, newPassword);
        if(updateUserPassword) return jsonS(res, 200, "Password Updated Susseccfully"); 
        if(!updateUserPassword) return jsonFailed(res, {}, "Password does not match", 400);
      }
}

module.exports = controller;