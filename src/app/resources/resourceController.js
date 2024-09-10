const { jsonFailed, jsonS } = require("../../utils");
const { addActivity } = require("../services/activity");


let controller = {

    getResource: async(req, res) => {
        
        return jsonS(res, 200, "successful");
    },

    createResource: (req, res) => {
        const { id } = req.user;
        const data = req.body;
        addActivity(id, "created resource");
        return jsonS(res, 201, "successfully created resource", data);
    },

    updateResource: (req, res) => {
        const { id } = req.user;
        const data = req.body;
        addActivity(id, "updated resource");
        return jsonS(res, 201, "successfully updated resource", data);
    },

    deleteResource: async(req, res) => {
        const { id } = req.user;
        addActivity(id, "deleted resource");
        return jsonS(res, 200, "successfully deleted resource");
    }
};

module.exports = controller;