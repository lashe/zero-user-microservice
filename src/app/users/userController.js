const { jsonFailed, jsonS } = require("../../utils");
const { getActivity } = require("../services/activity");
const { createNewUser, getUser, updateUser } = require("./userServices");

let controller = {
    signUp: async (req, res) => {
        const { email, fullName, phoneNumber, password } = req.body;
        if (!email) return jsonFailed(res, {}, "No email Provided", 400);
        const newUser = { email, fullName, phoneNumber, password };
        const createUser = await createNewUser(newUser);
        if (!createUser) return jsonFailed(res, {}, "Error Creating New User", 400);
        if(createUser === "exists")return jsonFailed(res, {}, "An account already exists with this email", 400);
        return jsonS(res, 201, "Successfully Created User");
    },

    getUserbyId: async(req, res) => {
        const { id } = req.user;
        const fetchUser = await getUser(id);
        if(!fetchUser) return jsonFailed(res, {}, "Unable to find User", 400);
        return jsonS(res, 200, "successful", fetchUser);
    },

    updateUserProfile: async (req, res) => {
        const { id } = req.user;
        let userData = req.body;
        const updteUser = await updateUser(id, userData);
        if (!updteUser) return jsonFailed(res, {}, "Error: Profile update failed", 400);
        return jsonS(res, 200, "successful", {});
    },

    getUserActivities: async(req, res) => {
        const { id } = req.user;
        const fetchUserActivities = await getActivity(id, req.query);
        // if(!fetchUserActivities) return jsonFailed(res, {}, "Unable to find User", 400);
        return jsonS(res, 200, "successful", fetchUserActivities);
    },

    logout: (req, res) => {
        if (req.session) {
          req.session.user = null;
          return jsonS(res, 200, "logged out successfully");
        }
        return jsonS(res, 200, "logged out successfully");
      },
};

module.exports = controller;