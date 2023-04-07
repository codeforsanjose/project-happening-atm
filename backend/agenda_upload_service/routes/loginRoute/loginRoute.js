const { Router } = require("express");

// const loginLocal = async (dbClient, email_address, password) => {
//   let token;
//   let user;
//   try {
//     if (password === undefined || password === null || password == "") {
//       logger.error("Unable to authenticate no password provided");
//       throw new Error("Unable to authenticate no password provided");
//     } else {
//       user = await authentication.verifyEmailPassword(
//         dbClient,
//         email_address,
//         password
//       );
//       validator.validateAuthType(user.rows[0].auth_type, "Local");
//       token = authentication.createJWT(user);
//     }
//   } catch (e) {
//     logger.error(`loginLocal resolver error: ${e}`);
//     throw e;
//   }
//   return { token, email: email_address };
// };

module.exports = (logger) => {
  const router = Router();

  router.get("/login", function (req, res) {
    console.log("------------>the login paarmas", req);
    res.status(200).json({ msg: "login post here in server" });
  });

  return router;
};
