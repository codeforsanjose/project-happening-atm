var express = require("express");
var router = express.Router();
var apiResponse = require("../utilities/apiResponse");

// Placeholder homepage
// TODO:
router.get("/", function(req, res) {
	return apiResponse.jsonWithStatusCode(res, 
        {
            placeholder: 'Blah blah blah'
        }, 
        200
    );
});

module.exports = router;