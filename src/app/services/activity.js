const { Activity } = require("../../models/activity");
const { v4: uuidv4 } = require("uuid");
const Logger = require("../../utils/logger");

const addActivity = async (id, body) => {
    try {
        const addActvty = await Activity.create({
            _id: uuidv4(),
            userId: id,
            body: body
        });
    } catch (error) {
        console.error(error);
        // throw new Error(error);
        
    }
};

const getActivity = async (id, query) => {
    try {
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        const listCount = await Activity.countDocuments({userId: id});
        if (!listCount) return null;
        let pages = Math.ceil(listCount / limit);
        let skip = limit * (page - 1) || 0;
        const fetchActivity = await Activity.find({userId: id})
        .limit(limit)
        .skip(skip);
        if (!fetchActivity) return null;
        let response ={
            page,
            pages,
            skip,
            activities: fetchActivity
          };
        return response;
    } catch (error) {
        Logger.error(error);
        return null;
    }
};

module.exports = {
    addActivity,
    getActivity
}