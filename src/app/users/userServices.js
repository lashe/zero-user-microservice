const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../../models/users");

const createNewUser = async (userData) =>{
    const { email, fullName, ageRange, gender, phoneNumber, password } = userData;
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if(userExists){
        return "exists";
    }
    let hashedPassword = bcrypt.hashSync(password, 8);
    const addUser = await User.create({
        _id: uuidv4(),
        email: email.toLowerCase(), 
        fullName, 
        ageRange, 
        gender,
        phoneNumber, 
        password: hashedPassword
    })
    if(!addUser){
        return null;
    }
    return addUser;

};


module.exports = {
    createNewUser
}