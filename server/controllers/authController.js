const jwt = require('jsonwebtoken');

module.exports = (logger, dbClient) => {
  const module = {};
  module.logginFailed = (req, res) => {
    res.send('You Failed to log in!');
  };

  module.logginSuccess = (req, res) => {
    const userEmail = req.user.email;
    const userName = req.user.name;
    const { admin } = req.user;
    logger.info(`User logged in: ${userEmail} - ${userName}`);
    logger.info(`Admin: ${admin}`);

    res.send(`Welcome ${userName}! Administrator: ${admin}`);
  };

  module.googleCallback = async (req, res) => {
    const user = {
      displayName: req.user.displayName,
      name: req.user.name.givenName,
      // eslint-disable-next-line no-underscore-dangle
      email: req.user._json.email,
      provider: req.user.provider,
    };

    // Verify admin rights
    const dbResponse = await dbClient.getAdminByEmail(user.email);
    user.admin = dbResponse.rows.length > 0;

    const token = jwt.sign({
      data: user,
    }, process.env.JWT_SECRET, { expiresIn: '10h' });

    res.cookie('jwt', token);
    res.redirect('/good');
  };

  module.logout = (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
  };

  return module;
};
