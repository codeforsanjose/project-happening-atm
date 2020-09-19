var express = require("express");
var router = express.Router();
var apiResponse = require("../utilities/apiResponse");

// TODO:
router.get("/id/:id", function(req, res) {
    var id = req.params.id;
    return apiResponse.jsonWithStatusCode(res, 
        {
            item_id: id
        }, 
        200
    );
});

module.exports = router;