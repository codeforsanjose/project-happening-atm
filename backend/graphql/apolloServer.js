/* eslint-disable max-len */
const isLambda = process.env.IS_LAMBDA;
const { ApolloServer, gql } = isLambda ? require('apollo-server-lambda') : require('apollo-server');

const getMutationResolver = require('./resolvers/mutation');
const getQueryResolver = require('./resolvers/query');
// const getValidator = require('./resolvers/validators');
// const authController = require('../controllers/authController')();

module.exports = (dbClient, twilioClient, logger) => {
  const mutationResolver = getMutationResolver(logger, dbClient, twilioClient);
  const queryResolver = getQueryResolver(logger, dbClient);
  // const validator = getValidator(logger);

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
    }

    type Mutation {
        createMeeting(meeting_start_timestamp: String!, meeting_type: String, status: String, virtual_meeting_url: String): meeting
        updateMeeting(id: Int!, status: String, meeting_type: String, virtual_meeting_url: String, meeting_start_timestamp: String, meeting_end_timestamp: String): meeting
        
        createMeetingItem(meeting_id: Int!, order_number: Int, item_start_timestamp: String, item_end_timestamp: String, status: String, content_categories: String, description_loc_key: String, title_loc_key: String): meeting_item
        updateMeetingItem(id: Int, order_number: Int, status: String, item_start_timestamp: String, item_end_timestamp: String, content_categories: String, description_loc_key: String, title_loc_key: String): meeting_item

        createSubscription(phone_number: String, email_address:String, meeting_item_id: Int, meeting_id: Int): subscription
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
        order_number: Int
        status: String
        created_timestamp: String
        updated_timestamp: String
        meeting_start_timestamp: String
        meeting_end_timestamp: String
        content_categories: String
        description_loc_key: String
        title_loc_key: String
    }
    `;

  const resolvers = {
    Query: {
      getAllMeetings: async () => queryResolver.getAllMeetings(),
      getMeeting: async (_parent, args) => queryResolver.getMeeting(args.id),
      getMeetingItem: async (_parent, args) => queryResolver.getMeetingItem(args.id),
      getAllMeetingItems: async () => queryResolver.getAllMeetingItems(),
      getMeetingWithItems: async (_parent, args) => queryResolver.getMeetingWithItems(args.id),
      getAllMeetingsWithItems: async () => queryResolver.getAllMeetingsWithItems(),
      getSubscription: async (_parent, args) => queryResolver.getSubscription(args.id),
      getAllSubscriptions: async () => queryResolver.getAllSubscriptions(),
    },
    Mutation: {
      createMeeting: async (_parent, args, context) =>
        // validator.validateAuthorization(context.user.admin, 'createMeeting');
        mutationResolver.createMeeting(args),
      updateMeeting: async (_parent, args, context) =>
        // validator.validateAuthorization(context.user.admin, 'updateMeeting');
        mutationResolver.updateMeeting(args),
      createMeetingItem: async (_parent, args, context) =>
        // validator.validateAuthorization(context.user.admin, 'createMeetingItem');
        mutationResolver.createMeetingItem(args),
      updateMeetingItem: async (_parent, args, context) =>
        // validator.validateAuthorization(context.user.admin, 'updateMeetingItem');
        mutationResolver.updateMeetingItem(args),
      createSubscription: async (_parent, args) => mutationResolver.createSubscription(args),
    },
  };

  return new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
      endpoint: '/dev/graphql',
    },
    // context: ({ req }) => authController.apolloServerContextInit(req),
    context: ({ event, context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
  });
};
