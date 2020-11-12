const jwt = require('jsonwebtoken')

module.exports = (logger, dbClient) => {
  const module = {}

  module.logginFailed = (req, res) => {
    res.send('You Failed to log in!')
  }

  module.logginSuccess = (req, res) => {
    const userEmail = req.user.email
    const userName = req.user.name
    const { admin } = req.user
    logger.info(`User logged in: ${userEmail} - ${userName}`)
    logger.info(`Admin: ${admin}`)

    res.send(`Welcome ${userName}! Administrator: ${admin}`)
  }

  module.googleCallback = async (req, res) => {
    const user = {
      displayName: req.user.displayName,
      name: req.user.name.givenName,
      // eslint-disable-next-line no-underscore-dangle
      email: req.user._json.email,
      provider: req.user.provider,
    }

    // Verify admin rights
    const dbResponse = await dbClient.getAdminByEmail(user.email)
    user.admin = dbResponse.rows.length > 0

    const token = jwt.sign(
      {
        data: user,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    res.cookie('jwt', token)
    res.redirect('/good')
  }

  module.logout = (req, res) => {
    req.session = null
    req.logout()
    res.redirect('/')
  }

  module.apolloServerContextInit = async req => {
    // TODO:
    // For some reason the user object isn't available in req.
    // This baffles me because passport middleware should have already
    // deserialized it by this point...
    // I couldn't find much info on this issue so for the time being
    // I'm manually decoding the jwt token here to get around the problem.

    const jwtToken = req.cookies.jwt

    let decoded = {}

    // This environment variable is used elsewhere under the hood. For example: https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/
    if (process.env.NODE_ENV === 'development') {
      decoded.data = { admin: true }
    } else {
      try {
        decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
      } catch (err) {
        switch (err.name) {
          case 'TokenExpiredError':
            logger.debug(
              `JWT token expired error. Token expired on: ${err.expiredAt}`,
            )
            decoded.data = { expired: true }
            break
          case 'JsonWebTokenError':
            if (err.message === 'jwt must be provided') {
              logger.debug('No JWT token provided')
              break
            }
          // eslint-disable-next-line no-fallthrough
          // This fallthrough is necessary to catch more generic JWT errors
          default:
            logger.error(JSON.stringify(err))
        }
        decoded.data = { admin: false }
      }
    }

    return { user: decoded.data }
  }

  return module
}
