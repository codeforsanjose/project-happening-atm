const apiResponse = require("../utilities/apiResponse");
const path = require("path");
const express = require('express');
const router = express.Router({ mergeParams: true });

// TODO: Utilize controllers here

// Expose frontend
router.route("/").get( (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Handle 404s
router.route("*").all( (req, res) => {
	return apiResponse.pageNotFound(res);
});

module.exports = router;