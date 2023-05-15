const { Router } = require("express");
const getUploadController = require("../controllers/uploadController");
const { loginRoute } = require("./loginRoute/loginRoute");
module.exports = (logger) => {
  const router = Router();
  const controller = getUploadController(logger);

  const loginRoutes = loginRoute(router);
  router.use("/auth", loginRoutes);
  router.post("/upload", controller.csvUpload);
  router.put("/upload/:meetingId", controller.csvUploadForMeeting);

  return router;
};
