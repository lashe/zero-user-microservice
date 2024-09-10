const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../../models/users");
const { addActivity } = require("../services/activity");
const Logger = require("../../utils/logger");

const createNewUser = async (userData) =>{
    const { email, fullName, password } = userData;
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if(userExists){
        return "exists";
    }
    let hashedPassword = bcrypt.hashSync(password, 8);
    const addUser = await User.create({
        _id: uuidv4(),
        email: email.toLowerCase(), 
        fullName,
        phoneNumber, 
        password: hashedPassword,
        isVerified: 1
    })
    if(!addUser){
        return null;
    }
    return addUser;

};

const createNewUserGoogle = async (userData) =>{
    const { email, name } = userData;
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if(userExists){
        return "exists";
    }
    const addUser = await User.create({
        _id: uuidv4(),
        email: email.toLowerCase(), 
        fullName: name,  
        googleSignin: 1,
        isVerified: 1
    })
    if(!addUser){
        return null;
    }
    return addUser;
};

const updateUser = async(id, userData) => {
    try {
        const updateUserData = await User.updateOne({ _id: id },
            {
                $set: userData
            }
        );
        if (!updateUserData) return false;
        await addActivity(id, "profile updated");
        return true;
    } catch (error) {
        // console.error(error);
        Logger.error(error);
        return false;
    }
};

const getUser = async(id) => {
    try {
        const getUserData = await User.findOne({ _id: id });
    if (!getUserData) return null;
    return getUserData;
    } catch (error) {
        console.log(error);
        return null;
    }
};


module.exports = {
    createNewUser,
    createNewUserGoogle,
    updateUser,
    getUser
}