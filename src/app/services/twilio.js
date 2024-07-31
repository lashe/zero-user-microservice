const { TWILIO } = require("../../config/app");
const accountSid = TWILIO.ACCOUNT_SID;
const authToken = TWILIO.AUTH_TOKEN;
const serviceSid = TWILIO.VERIFY_SERVICE_SID;
const twilio = require("twilio")(accountSid, authToken);

const getOtp = (phone_number)=>{
  twilio.verify.v2.services(serviceSid)
    .verifications
    .create({ to: phone_number, channel: "sms" });
};

const verifyOtp = async (phone_number, otp)=>{
  const verification = await twilio.verify.v2.services(serviceSid)
    .verificationChecks
    .create({ to: phone_number, code: otp });
  return verification;
};

module.exports = {
  getOtp,
  verifyOtp
};