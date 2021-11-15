const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const jwksClient = require('jwks-rsa');
const crypto = require('crypto');


module.exports = (logger) => {
    const module = {};

    const identifyTokenIssuer = token => {
        const { iss } = jwt.decode(token);
        return iss;
    };

    const verifyAdmin = async (dbClient, email) => {
        const dbResponse = await dbClient.getAdminByEmail(email);
        return dbResponse.rows.length > 0;
    };

    const hashPassword = async password => {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    };

    const comparePassword = async (password, hash) => {
        const passwordMatch = await bcrypt.compare(password, hash);
        return passwordMatch;
    };

    // Used for subscriber email verification and password reset random token strings.
    const randomToken = () => {
        const token = crypto.randomBytes(20).toString('hex');
        return token;
    };

    const createJWT = user => {
        const payload = {
            iss: process.env.JWT_ISSUER,
            aud: process.env.JWT_AUDIENCE,
            sub: user.rows[0].id,
            email: user.rows[0].email_address,
            first_name: user.rows[0].first_name,
            last_name: user.rows[0].last_name,
            roles: user.rows[0].roles
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    };

    const verifyGoogleToken = async (dbClient, token) => {
        let user;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const { email, email_verified, given_name, family_name, exp } = payload;
            if (!email_verified) {
                logger.error('Google account email is not verified');
                throw new Error('Google account email is not verified');
            };
            if (exp < new Date().getTime() / 1000) {
                logger.error('Google Id Token is Expired');
                throw new Error('Google Id Token is Expired');
            };
            //Check if user in database
            const dbUser = await dbClient.getAccountByEmail(email);
            if (dbUser.rowCount !== 0) {
                user = dbUser;
            } else {
                //Verify if admin email in admin whitelist
                const isAdmin = await verifyAdmin(dbClient, email);
                const roles = isAdmin ? '{ADMIN}' : '{USER}';
                const token = await randomToken();
                user = {
                    first_name: given_name,
                    last_name: family_name,
                    email_address: email,
                    roles: roles,
                    password: null,
                    auth_type: "Google",
                    token: token
                };
            };
        } catch (e) {
            logger.error(`Cannot authenticate Google Id Token: ${e}`);
            throw new Error(e);
        }
        return user;
    };

    const verifyMicrosoftToken = async (dbClient, token) => {
        let user;

        const validateOptions = {
            audience: process.env.MICROSOFT_CLIENT_ID,
            issuer: process.env.MICROSOFT_AUTHORITY + "/v2.0"
        };

        const getSigningKeys = (header, callback) => {
            const client = jwksClient({
                jwksUri: 'https://login.microsoftonline.com/common/discovery/keys'
            });

            client.getSigningKey(header.kid, function (e, key) {
                if (e) {
                    throw new Error(e)
                }
                const signingKey = key.publicKey || key.rsaPublicKey;
                callback(null, signingKey);
            });
        };

        try {
            const payload = new Promise((resolve,reject)=>{
                (jwt.verify(token, getSigningKeys, validateOptions, (e, result) => {
                    if (e) {
                        logger.error(`Cannot validate Microsoft Id Token: ${e}`);
                        throw new Error(e);
                    }
                    resolve(result);
            }))});
            let { email, name, exp } = await payload;
            //TODO: Need to work on how to split full name this approach may not work for all names
            name = name.split(" ")
            const first_name = name[0];
            const last_name = name[0];
            //TODO: Need to find way to verify email
            if (exp < new Date().getTime() / 1000) {
                logger.error('Microsoft Id Token is Expired');
                throw new Error('Microsoft Id Token is Expired');
            };
            //Check if user in database
            const dbUser = await dbClient.getAccountByEmail(email);
            if (dbUser.rowCount !== 0) {
                user = dbUser;
            } else {
                //Verify if admin email in admin whitelist
                const isAdmin = await verifyAdmin(dbClient, email);
                const roles = isAdmin ? '{ADMIN}' : '{USER}';
                const token = await randomToken();
                user = {
                    first_name: first_name,
                    last_name: last_name,
                    email_address: email,
                    roles: roles,
                    password: null,
                    auth_type: "Microsoft",
                    token: token
                };
            };

        } catch (e) {
            logger.error(`Cannot authenticate Microsoft Id Token: ${e}`);
            throw new Error(e);
        }
        return user;
    };

    const verifyEmailPassword = async (dbClient, email_address, password) => {
        let user;
        email_address = email_address.toLowerCase().trim();
        try {

            const dbUser = await dbClient.getAccountByEmail(email_address);
            if (dbUser.rows.length === 0) {
                logger.error('Email does not match our records please sign up');
                throw new Error('Email does not match our records please sign up');
            }
            const dbPassword = dbUser.rows[0].password;
            const isAuthenticated = await comparePassword(password, dbPassword);
            if (!isAuthenticated) {
                logger.error('Email and Password do not match');
                throw new Error('Email and Password do not match');
            }
            user = dbUser
        } catch (e) {
            logger.error(`Cannot authenticate email and password: ${e}`);
            throw new Error(e);
        }
        return user;
    };

    const getToken = authHeaders => {
        // Splitting bearer off authentication header
        const token = authHeaders.split(" ")[1];
        const context = {};
        try {
            const issuer = identifyTokenIssuer(token);
            if (issuer === process.env.JWT_ISSUER) {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                context.user = user;
                context.token = token;
            } else {
                context.token = token;
            };
        } catch (e) {
            logger.error(`Cannot verify token issuer: ${e}`);
            throw new Error(e);
        }
        return context;
    }

    // TODO: Need to add way to add token to revoke list

    // TODO: Setup password reset logic

    module.identifyTokenIssuer = identifyTokenIssuer;
    module.verifyAdmin = verifyAdmin;
    module.hashPassword = hashPassword;
    module.comparePassword = comparePassword;
    module.randomToken = randomToken;
    module.createJWT = createJWT;
    module.verifyGoogleToken = verifyGoogleToken;
    module.verifyMicrosoftToken = verifyMicrosoftToken;
    module.verifyEmailPassword = verifyEmailPassword;
    module.getToken = getToken;

    return module;
};