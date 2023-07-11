/* eslint-disable max-len */

const { ApolloServer } = require("apollo-server");

const getMutationResolver = require("./resolvers/mutation");
const getQueryResolver = require("./resolvers/query");
const getDBClient = require("../db/dbClient");
const getAuthentication = require("./resolvers/authentication");
const typeDefs = require("./typeDefs");
const loginUser = require("./services/authentication");

module.exports = (logger) => {
  const mutationResolver = getMutationResolver(logger);
  const queryResolver = getQueryResolver(logger);
  const authentication = getAuthentication(logger);

  // We are handling the lifecycle of the DB client here rather than inside individual resolver functions because
  // some resolver functions are nested within eachother. (Ex: getAllMeetingsWithItems, getMeetingWithItems and getMeeting)
  // If the resolver functions themselves handled the connections, the logic required to effeciently manage them such that only
  // one DB connection is used per GrapQL request would be unnecessarily complex.
  // So, we'll handle the connection's lifecycle here at the initial function call and throw it downstream.
  const resolverHandler = async (resolverFunc, args, context) => {
    let dbClient;
    try {
      dbClient = await getDBClient(logger);
      logger.info("Initiating DB Client - backend/graphql_api/graphql/apolloServer.js");
      await dbClient.init();
      return await resolverFunc(dbClient, args, context);
    } catch (err) {
      logger.error(`Resolver error: ${err}`);
      throw err;
    } finally {
      try {
        logger.info("Ending DB connection - backend/graphql_api/graphql/apolloServer.js");
        await dbClient.end();
      } catch (err) {
        logger.error(`Error ending DB connection: ${err.stack}`);
      }
    }
  };

  const resolvers = {
    Query: {
      getAllMeetings: async () => {
        logger.info("Initiating GetAllMeetings Query resolver");
        return resolverHandler(queryResolver.getAllMeetings);
      },
      getMeeting: async (_parent, args) => {
        logger.info("Initiating GetMeeting Query resolver");
        return resolverHandler(queryResolver.getMeeting, args.id);
      },
      getMeetingItem: async (_parent, args) => {
        logger.info("Initiating GetMeetingItem Query resolver");
        return resolverHandler(queryResolver.getMeetingItem, args.id);
      },
      getAllMeetingItems: async () => {
        logger.info("Initiating GetAllMeetingItems Query resolver");
        return resolverHandler(queryResolver.getAllMeetingItems);
      },
      getMeetingWithItems: async (_parent, args) => {
        logger.info("Initiating GetMeetingWithItems Query resolver");
        return resolverHandler(queryResolver.getMeetingWithItems, args.id);
      },
      getAllMeetingsWithItems: async () => {
        logger.info("Initiating GetAllMeetingsWithItems Query resolver");
        return resolverHandler(queryResolver.getAllMeetingsWithItems);
      },
      getSubscription: async (_parent, args, context) => {
        logger.info("Initiating GetSubscription Query resolver");
        return resolverHandler(queryResolver.getSubscription, args.id, context);
      },
      getSubscriptionsByEmailAndMeetingID: async (_parent, args, context) => {
        logger.info(
          "Initiating getSubscriptionsByEmailAndMeetingID Query resolver"
        );
        return resolverHandler(
          queryResolver.getSubscriptionsByEmailAndMeetingID,
          args,
          context
        );
      },
      getAllSubscriptions: async (_parent, args, context) => {
        logger.info("Initiating GetAllSubscriptions Query resolver");
        return resolverHandler(
          queryResolver.getAllSubscriptions,
          args,
          context
        );
      },
      getAllAccounts: async () => {
        logger.info("Initiating getAllAccounts Query resolver");
        return resolverHandler(queryResolver.getAllAccounts);
      },
      getAccountById: async (_parent, args) => {
        logger.info("Initiating GetAccountById Query resolver: args: ", args);
        return resolverHandler(queryResolver.getAccountById, args.id);
      },
      getAccountByEmail: async (_parent, args) => {
        logger.info(
          "Initiating GetAccountByEmail Query resolver: args: ",
          args.email_address
        );
        return resolverHandler(
          queryResolver.getAccountByEmail,
          args.email_address
        );
      },
      loginLocal: async (_parent, args) => {
        const loginLocalUserResult = await loginUser(
          args.email_address,
          args.password
        );
        // create signed JWT to relay logged in user info in hashed token
        let token = authentication.createJWT({rows:[loginLocalUserResult]}) 
        logger.info("Initiating LoginLocal Query resolver");
        //return await resolverHandler(queryResolver.loginLocal, args.email_address, args.password); // original loginLocal logic (prior to refactor) 
        return {token: token, email: loginLocalUserResult.email_address}; // mirrors return args from orig. loginLocal function in backend/graphql_api/graphql/resolvers/query.js
      },
      loginGoogle: async (_parent, args, context) => {
        logger.info("Initiating LoginGoogle Query resolver");
        return resolverHandler(queryResolver.loginGoogle, context);
      },
      loginMicrosoft: async (_parent, args, context) => {
        logger.info("Initiating LoginMicrosoft Query resolver");
        return resolverHandler(queryResolver.loginMicrosoft, context);
      },
      getResetPasswordToken: async (_parent, args) => {
        logger.info(
          "Initiating GetResetPasswordToken Query resolver: args: ",
          args.id
        );
        return resolverHandler(queryResolver.getResetPasswordToken, args.id);
      },
    },
    Mutation: {
      createMeeting: async (_parent, args, context) => {
        logger.info("Initiating CreateMeeting Mutation resolver");
        return resolverHandler(mutationResolver.createMeeting, args, context);
      },
      updateMeeting: async (_parent, args, context) => {
        logger.info("Initiating UpdateMeeting Mutation resolver");
        return resolverHandler(mutationResolver.updateMeeting, args, context);
      },
      deleteMeeting: async (_parent, args, context) => {
        logger.info("Initiating DeleteMeeting Mutation resolver");
        return resolverHandler(mutationResolver.deleteMeeting, args, context);
      },
      createMeetingItem: async (_parent, args, context) => {
        logger.info("Initiating CreateMeetingItem Mutation resolver");
        return resolverHandler(
          mutationResolver.createMeetingItem,
          args,
          context
        );
      },
      updateMeetingItem: async (_parent, args, context) => {
        logger.info("Initiating UpdateMeetingItem Mutation resolver");
        return resolverHandler(
          mutationResolver.updateMeetingItem,
          args,
          context
        );
      },
      createSubscriptions: async (_parent, args, context) => {
        logger.info("Initiating CreateSubscriptions Mutation resolver");
        return resolverHandler(
          mutationResolver.createSubscriptions,
          args,
          context
        );
      },
      deleteSubscription: async (_parent, args, context) => {
        logger.info("Initiating deleteSubscription Mutation resolver");
        return resolverHandler(
          mutationResolver.deleteSubscription,
          args,
          context
        );
      },
      confirmEmail: async (_parent, args) => {
        logger.info("Initiating ConfirmEmail Mutation resolver");
        return resolverHandler(mutationResolver.confirmEmail, args);
      },
      unconfirmEmail: async (_parent, args) => {
        logger.info("Initiating UnconfirmEmail Mutation resolver");
        return resolverHandler(mutationResolver.unconfirmEmail, args);
      },
      updateEmail: async (_parent, args) => {
        logger.info("Initiating UpdateEmail Mutation resolver");
        return resolverHandler(mutationResolver.updateEmail, args);
      },
      updatePhoneNumber: async (_parent, args) => {
        logger.info("Initiating UpdatePhoneNumber Mutation resolver");
        return resolverHandler(mutationResolver.updatePhoneNumber, args);
      },
      createAccount: async (_parent, args, context) => {
        logger.info("Initiating CreateAccount Mutation resolver");
        return resolverHandler(mutationResolver.createAccount, args, context);
      },
      forgotPassword: async (_parent, args, context) => {
        logger.info("Initiating ForgotPassword Mutation resolver");
        return resolverHandler(mutationResolver.forgotPassword, args, context);
      },
      resetPassword: async (_parent, args, context) => {
        logger.info("Initiating ResetPassword Mutation resolver");
        return resolverHandler(mutationResolver.resetPassword, args, context);
      },
      updatePassword: async (_parent, args, context) => {
        logger.info("Initiating UpdatePassword Mutation resolver");
        return resolverHandler(mutationResolver.updatePassword, args, context);
      },
    },
  };

  // ApolloServer documentation: https://www.apollographql.com/docs/apollo-server/
  return new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
      endpoint: "/dev/agendapi",
    },
    // Empty implementation for local and deployed dev use:
    // TODO: Auth needs to be refactored for AWS
    context: ({ req }) => {
      if (req.headers.authorization) {
        const context = authentication.getToken(req.headers.authorization);
        return context;
      } else {
        // if no token in headers setting token to null
        return {
          token: null,
        };
      }
    },
  });
};
