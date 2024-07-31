const { jsonS } = require("../../../utils");

const Controller = {
  FirstRoute:async(req, res)=>{
    return jsonS(res, 200, "success", {}, {});
  }
};

module.exports = Controller;