/* eslint-disable max-len */

// This environment variable is only set in AWS. Local development shouldn't have it.
const isLambda = process.env.IS_LAMBDA;
const { ApolloServer, gql } = isLambda ? require('apollo-server-lambda') : require('apollo-server');

const getMutationResolver = require('./resolvers/mutation');
const getQueryResolver = require('./resolvers/query');
const getDBClient = require('../db/dbClient');
const getAuthentication = require('./resolvers/authentication');

module.exports = (logger) => {
  const mutationResolver = getMutationResolver(logger);
  const queryResolver = getQueryResolver(logger);
  const authentication = getAuthentication(logger);

  const typeDefs = gql`
    type Query {
        getMeeting(id: Int!): meeting
        getAllMeetings: [meeting]

        getMeetingItem(id: Int!): meeting_item
        getAllMeetingItems: [meeting_item]

        getMeetingWithItems(id: Int!): meeting_with_items
        getAllMeetingsWithItems: [meeting_with_items]

        getSubscription(id: Int!): subscription
        getAllSubscriptions: [subscription]

        loginLocal(email_address: String!, password: String!): auth_data
        loginGoogle: auth_data
        loginMicrosoft: auth_data
        
        # TODO: Need to add verify token query
        
        # TODO: Need to add reset password query
    }

    type Mutation {
        createMeeting(meeting_start_timestamp: String!, meeting_type: String, status: String, virtual_meeting_url: String): meeting
        updateMeeting(id: Int!, status: String, meeting_type: String, virtual_meeting_url: String, meeting_start_timestamp: String, meeting_end_timestamp: String): meeting

        createMeetingItem(meeting_id: Int!, order_number: Int!, item_start_timestamp: String, item_end_timestamp: String, status: String, content_categories: String!, description_loc_key: String, title_loc_key: String): meeting_item
        updateMeetingItem(id: Int, order_number: Int!, status: String, item_start_timestamp: String, item_end_timestamp: String, content_categories: String!, description_loc_key: String, title_loc_key: String): meeting_item

        createSubscriptions(phone_number: String, email_address:String, meetings: [meetingInput]): [subscription]

        confirmEmail(token: String): Boolean
        unconfirmEmail(token: String): Boolean

        createAccount(first_name: String, last_name: String, email_address: String, password: String): auth_data

        # TODO: Need to add update user info mutation
    }

    type subscription {
        id: Int
        phone_number: String
        email_address: String
        meeting_item_id: Int
        meeting_id: Int
        created_timestamp: String
        updated_timestamp: String
    }

    input meetingInput {
        meeting_item_id: Int
        meeting_id: Int
    }

    type meeting_with_items {
        meeting: meeting
        items: [meeting_item]
    }

    type meeting {
        id: Int
        status: String
        meeting_type: String
        created_timestamp: String
        updated_timestamp: String
        meeting_start_timestamp: String
        meeting_end_timestamp: String
        virtual_meeting_url: String
    }

    type meeting_item {
        id: Int
        meeting_id: Int
        parent_meeting_item_id: Int
        order_number: Int
        status: String
        created_timestamp: String
        updated_timestamp: String
        item_start_timestamp: String
        item_end_timestamp: String
        content_categories: String
        description_loc_key: String
        title_loc_key: String
    }

    type account {
      id: Int
      first_name: String
      last_name: String
      unsubscribe_token: String
      email_address: String
      phone_number: String
      phone_number_subscribed: Boolean 
      email_address_subscribed: Boolean
      password: String
      password_reset_token: String
      password_reset_expire: String
      roles: [roles]!
      created_timestamp: String
      updated_timestamp: String
    }

    enum roles{
      ADMIN
      USER
    }
  

    type auth_data {
      token: String!
    }
    `;

  // We are handling the lifecycle of the DB client here rather than inside individual resolver functions because
  // some resolver functions are nested within eachother. (Ex: getAllMeetingsWithItems, getMeetingWithItems and getMeeting)
  // If the resolver functions themselves handled the connections, the logic required to effeciently manage them such that only
  // one DB connection is used per GrapQL request would be unnecessarily complex.
  // So, we'll handle the connection's lifecycle here at the initial function call and throw it downstream.
  const resolverHandler = async (resolverFunc, args, context) => {
    let dbClient;
    try {
      dbClient = await getDBClient(logger);
      await dbClient.init();
      return await resolverFunc(dbClient, args, context);
    } catch (err) {
      logger.error(`Resolver error: ${err}`);
      throw err;
    } finally {
      try {
        logger.info('Ending DB connection');
        await dbClient.end();
      } catch (err) {
        logger.error(`Error ending DB connection: ${err.stack}`);
      }
    }
  };

  const resolvers = {
    Query: {
      getAllMeetings: async () => {
        logger.info('Initiating GetAllMeetings Query resolver');
        return resolverHandler(queryResolver.getAllMeetings);
      },
      getMeeting: async (_parent, args) => {
        logger.info('Initiating GetMeeting Query resolver');
        return resolverHandler(queryResolver.getMeeting, args.id);
      },
      getMeetingItem: async (_parent, args) => {
        logger.info('Initiating GetMeetingItem Query resolver');
        return resolverHandler(queryResolver.getMeetingItem, args.id);
      },
      getAllMeetingItems: async () => {
        logger.info('Initiating GetAllMeetingItems Query resolver');
        return resolverHandler(queryResolver.getAllMeetingItems);
      },
      getMeetingWithItems: async (_parent, args) => {
        logger.info('Initiating GetMeetingWithItems Query resolver');
        return resolverHandler(queryResolver.getMeetingWithItems, args.id);
      },
      getAllMeetingsWithItems: async () => {
        logger.info('Initiating GetAllMeetingsWithItems Query resolver');
        return resolverHandler(queryResolver.getAllMeetingsWithItems);
      },
      getSubscription: async (_parent, args, context) => {
        logger.info('Initiating GetSubscription Query resolver');
        return resolverHandler(queryResolver.getSubscription, args.id, context);
      },
      getAllSubscriptions: async (_parent, args, context) => {
        logger.info('Initiating GetAllSubscriptions Query resolver');
        return resolverHandler(queryResolver.getAllSubscriptions, args, context);
      },
      loginLocal: async (_parent, args) => {
        logger.info('Initiating LoginLocal Query resolver');
        return resolverHandler(queryResolver.loginLocal, args.email_address, args.password);
      },
      loginGoogle: async (_parent, args, context) => {
        logger.info('Initiating LoginGoogle Query resolver');
        return resolverHandler(queryResolver.loginGoogle, context);
      },
      loginMicrosoft: async (_parent, args, context) => {
        logger.info('Initiating LoginMicrosoft Query resolver');
        return resolverHandler(queryResolver.loginMicrosoft, context);
      }
    },
    Mutation: {
      createMeeting: async (_parent, args, context) => {
        logger.info('Initiating CreateMeeting Mutation resolver');
        return resolverHandler(mutationResolver.createMeeting, args, context);
      },
      updateMeeting: async (_parent, args, context) => {
        logger.info('Initiating UpdateMeeting Mutation resolver');
        return resolverHandler(mutationResolver.updateMeeting, args, context);
      },
      createMeetingItem: async (_parent, args, context) => {
        logger.info('Initiating CreateMeetingItem Mutation resolver');
        return resolverHandler(mutationResolver.createMeetingItem, args, context);
      },
      updateMeetingItem: async (_parent, args, context) => {
        logger.info('Initiating UpdateMeetingItem Mutation resolver');
        return resolverHandler(mutationResolver.updateMeetingItem, args, context);
      },
      createSubscriptions: async (_parent, args, context) => {
        logger.info('Initiating CreateSubscriptions Mutation resolver');
        return resolverHandler(mutationResolver.createSubscriptions, args, context);
      },
      confirmEmail: async (_parent, args) => {
        logger.info('Initiating ConfirmEmail Mutation resolver');
        return resolverHandler(mutationResolver.confirmEmail, args);
      },
      unconfirmEmail: async (_parent, args) => {
        logger.info('Initiating UnconfirmEmail Mutation resolver');
        return resolverHandler(mutationResolver.unconfirmEmail, args);
      },
      createAccount: async (_parent, args, context) => {
        logger.info('Initiating CreateAccount Mutation resolver');
        return resolverHandler(mutationResolver.createAccount, args, context);
      },
    },
  };

  // ApolloServer documentation: https://www.apollographql.com/docs/apollo-server/
  return new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
      endpoint: '/dev/agendapi',
    },
    // Empty implementation for local and deployed dev use:
    // TODO: Auth needs to be refactored for AWS
    context: ({ req }) => {
      if (req.headers.authorization) {
        const context = authentication.getToken(req.headers.authorization);
        return context
      } else {
        // if no token in headers setting token to null
        return {
          token: null
        }
      }
    },
  });
};
