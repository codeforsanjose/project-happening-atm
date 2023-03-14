const { Router } = require('express');
const getUploadController = require('../controllers/uploadController');

module.exports = (logger) => {
  const router = Router();
  const controller = getUploadController(logger);

  router.post('/upload', controller.csvUpload);
  router.put('/upload/:meetingId', controller.csvUploadForMeeting);

  return router;
};
