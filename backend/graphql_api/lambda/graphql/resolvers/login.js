const jwt = require('jsonwebtoken');
const { getAdminByEmail } = require('../../db/dbClient')
const { OAuth2Client } = require('google-auth-library')

module.exports = (logger) => {
    const module = {};

    const authGoogle = async (dbclient, context) => {
        let token;
        let user;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken: context.token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            // Get sub, email, name from google response
            console.log(payload);
            const { sub, email, name, email_verified, exp } = payload;
            if (!email_verified) {
                logger.error('Google email is not verified')
                throw new Error('Google email is not verified')
            }
            if (exp < new Date().getTime() / 1000) {
                logger.error('Google Id Token is expired')
                throw new Error('Google Id Token is expired')
            }
            // Verify admin rights
            // Note: might want to change this to a role once we implement user signup
            const dbResponse = await dbclient.getAdminByEmail(email);
            admin = dbResponse.rows.length > 0;
            // Throwing error if user is not admin
            if (!admin) {
                logger.error('This user is not an administrator')
                throw new Error('This user is not an administrator')
            }
            // Creating User
            user = {
                name: name,
                email: email,
                authorizer: "google",
                authorizerId: sub,
                admin: admin,
            }
            // Creating Token
            token = jwt.sign({
                data: user,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

        } catch (e) {
            logger.error(`Cannot authenticate Google Id Token: ${e}`);
            throw e;
        }
        return {
            token: token,
            name: user.name,
            email: user.email,
            authorizer: user.authorizer,
            authorizerId: user.authorizerId,
            admin: user.admin
        }
    };
    // Framework for Microsoft login strategy
    // const authMicrosoft = async (token) => {
    //     let res;
    //     try {
    //         res = "Microsoft Working"
    //     } catch (e) {
    //         logger.error(e);
    //         throw e;
    //     }
    //     return {
    //         token: res,
    //         tokenExpiration: 1
    //     }
    // };

    // Framework for Local login strategy
    // const authLocal = async ({ email, password }) => {
    //     let res;
    //     try {
    //         res = "Microsoft Working"
    //     } catch (e) {
    //         logger.error(e);
    //         throw e;
    //     }
    //     return {
    //         token: res,
    //         tokenExpiration: 1
    //     }
    // };

    module.authGoogle = authGoogle;
    // Add module for Microsoft login strategy
    // module.authMicrosoft = authMicrosoft;
    // Add module for Local login strategy
    // module.authLocal = authLocal
    return module;
};