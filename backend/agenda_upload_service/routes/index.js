const { Router } = require("express");
const getUploadController = require("../controllers/uploadController");
const loginRouter = require("./loginRoute/loginRoute");
module.exports = (logger) => {
  const router = Router();
  const controller = getUploadController(logger);

  router.use(loginRouter());
  router.post("/loginS", function (req, res) {
    console.log("what be params - joey", req);
    res.status(200).json({ msg: "loginS post here in server" });
  });
  router.post("/upload", controller.csvUpload);
  router.put("/upload/:meetingId", controller.csvUploadForMeeting);

  return router;
};
