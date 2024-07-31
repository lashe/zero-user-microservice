const { User } = require("../../mongodb/users");
const { getOtp, verifyOtp } = require("../services/twilio");
const bcrypt = require("bcryptjs");

const phoneNubmerVerification = async (phoneNumber) => {
    // if(!phoneNumber) return false;
    // return true;

    try {
        const verifyNumber = await getOtp(phoneNumber);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const otpVerification = async (phoneNumber, otp) => {
    // if(!phoneNumber && !otp) return false;
    // return true;
    const verifyotpp = await verifyOtp(phoneNumber, otp);
    if (verifyotpp.status === "approved") return true;
    console.error(verifyotpp.status);
    return false;
};

const passwordChange = async (id, oldPassword, newPassword) =>{
    const user = await User.findOne({ _id: id }).select(
        "+password"
      );
      const passwordIsValid = await bcrypt.compareSync(
        oldPassword,
        user.password
      );
      if (passwordIsValid) {
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        await User.updateOne({ _id: id },{ $set: { password: hashedPassword } });
        return true;
      }
      return false;
};

const passwordUpdate = async (id, newPassword) =>{
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    await User.updateOne({ _id: id },{ $set: { password: hashedPassword } });
    return true;
};

module.exports = {
    phoneNubmerVerification,
    otpVerification,
    passwordChange,
    passwordUpdate
}