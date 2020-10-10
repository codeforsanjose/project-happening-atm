const jwt = require('jsonwebtoken')

module.exports = (logger, dbClient) => {
    let module = {};
    module.logginFailed = (req, res) => {
        res.send('You Failed to log in!');
    };

    module.logginSuccess = (req, res) => {
        let userEmail = req.user.email;
        let userName = req.user.name;
        let admin = req.user.admin;
        logger.info('User logged in: ' + userEmail + ' - ' + userName);
        logger.info('Admin: ' + admin);

        res.send(`Welcome ${userName}! Administrator: ${admin}`);
    };

    module.googleCallback = async (req, res) => {
        let user = {
            displayName: req.user.displayName,
            name: req.user.name.givenName,
            email: req.user._json.email,
            provider: req.user.provider 
        };

        // Verify admin rights
        let dbResponse = await dbClient.getAdminByEmail(user.email);
        user.admin = dbResponse.rows.length > 0;

        let token = jwt.sign({
            data: user
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token)
        res.redirect('/good');
    };
    
    module.logout = (req, res) => {
        req.session = null;
        req.logout();
        res.redirect('/');
    };
    
    return module;
}