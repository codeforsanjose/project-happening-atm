var express = require("express");
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./utilities/apiResponse");
var PORT = process.env.PORT || 3000;

var app = express();

app.use("/", indexRouter);
app.use("/api/", apiRouter);

app.all("*", function(req, res) {
	return apiResponse.pageNotFound(res);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});