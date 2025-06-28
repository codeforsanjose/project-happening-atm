const axios = require('axios');

//Health check function
function healthCheck(req, res, next) {
  try {
    return res.json(200, 'Success', "API is running");
  } catch (error) {
    console.log(error);
  }
}
//Get user detail of host user
async function zoomUserInfo(req, res, next) {
  try {
    const token = req.body.token;
    const email = 'enguyen6208@gmail.com'; //host email id
    const result = await axios.get("https://api.zoom.us/v2/users/" + email, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
      }
    });
    res.json(200, 'Success', result.data);
    return sendResponse.send(res);
  } catch (error) {
    console.log(error.message);
    next();
  }
}
//Create a zoom meeting
async function createZoomMeeting(req, res, next) {
  try {
    const token = req.body.token;
    const email = 'enguyen6208@gmail.com'; //host email id;
    const result = await axios.post("https://api.zoom.us/v2/users/" + email + "/meetings", {
      "topic": "Discussion about today's Demo",
      "type": 2,
      "start_time": "2021-03-18T17:00:00",
      "duration": 20,
      "timezone": "India",
      "password": "1234567",
      "agenda": "We will discuss about Today's Demo process",
      "settings": {
        "host_video": true,
        "participant_video": true,
        "cn_meeting": false,
        "in_meeting": true,
        "join_before_host": false,
        "mute_upon_entry": false,
        "watermark": false,
        "use_pmi": false,
        "approval_type": 2,
        "audio": "both",
        "auto_recording": "local",
        "enforce_login": false,
        "registrants_email_notification": false,
        "waiting_room": true,
        "allow_multiple_devices": true
      }
    }, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
      }
    });
    return res.json(200, 'Success', result.data);
  } catch (error) {
    console.log(error.message);
    next();
  }
}
//Update a zoom meeting
async function updateMeeting(req, res, next) {
  try {
    const token = req.body.token;
    const meetingId = req.body.meetingId;
    const result = await axios.patch("https://api.zoom.us/v2/meetings/" + meetingId, {
      "topic": "UPDATE: Discussion about today's Demo",
      "type": 2,
      "start_time": "2021-03-18T17:00:00",
      "duration": 20,
      "timezone": "India",
      "password": "1234567",
      "agenda": "Discussion about how to update zoome meeting programatically",
      "settings": {
        "host_video": true,
        "participant_video": true,
        "cn_meeting": false,
        "in_meeting": true,
        "join_before_host": false,
        "mute_upon_entry": false,
        "watermark": false,
        "use_pmi": false,
        "approval_type": 2,
        "audio": "both",
        "auto_recording": "local",
        "enforce_login": false,
        "registrants_email_notification": false,
        "waiting_room": true,
        "allow_multiple_devices": true
      }
    }, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
      }
    });
    return res.json(200, 'Success', result.data);
  } catch (error) {
    console.log(error.message);
    next();
  }
}
//Delete a zoom meeting
async function deleteMeeting(req, res, next) {
  try {
    const token = req.body.token;
    const meetingId = req.body.meetingId;
    const result = await axios.delete("https://api.zoom.us/v2/meetings/" + meetingId, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
      }
    });
    res.json(200, 'Success', result.data);
  } catch (error) {
    console.log(error.message);
    next();
  }
}
//Get details of a zoom meeting
async function getMeeting(req, res, next) {
  try {
    const token = req.body.token;
    const meetingId = req.body.meetingId;
    const result = await axios.get("https://api.zoom.us/v2/meetings/" + meetingId, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
      }
    });
    res.json(200, 'Success', result.data);
  } catch (error) {
    console.log(error.message);
    next();
  }
}

module.exports = { 
  healthCheck, zoomUserInfo, createZoomMeeting, getMeeting, 
  updateMeeting, deleteMeeting 
}