/* eslint-disable max-len */
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const getMutationResolver = require('./resolvers/mutation');
const getQueryResolver = require('./resolvers/query');

module.exports = (dbClient, twilioClient, logger) => {
  const mutationResolver = getMutationResolver(logger, dbClient, twilioClient);
  const queryResolver = getQueryResolver(logger, dbClient);

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
      createMeeting: async (_parent, args, context) => {
        if (!context.user.admin) {
          logger.debug('createMeeting: Attempted without Admin credentials');
          throw new AuthenticationError('not admin');
        }
        return mutationResolver.createMeeting(args.meeting_type, args.meeting_start_timestamp, args.virtual_meeting_url, args.status);
      },
      updateMeeting: async (_parent, args, context) => {
        if (!context.user.admin) {
          logger.debug('updateMeeting: Attempted without Admin credentials');
          throw new AuthenticationError('not admin');
        }
        return mutationResolver.updateMeeting(args.id, args.status, args.meeting_type, args.virtual_meeting_url, args.meeting_start_timestamp, args.meeting_end_timestamp);
      },
      createMeetingItem: async (_parent, args, context) => {
        if (!context.user.admin) {
          logger.debug('createMeetingItem: Attempted without Admin credentials');
          throw new AuthenticationError('not admin');
        }
        return mutationResolver.createMeetingItem(args.meeting_id, args.order_number, args.item_start_timestamp, args.item_end_timestamp, args.status, args.content_categories, args.description_loc_key, args.title_loc_key);
      },
      updateMeetingItem: async (_parent, args, context) => {
        if (!context.user.admin) {
          logger.debug('updateMeetingItem: Attempted without Admin credentials');
          throw new AuthenticationError('not admin');
        }
        return mutationResolver.updateMeetingItem(args.id, args.order_number, args.status, args.item_start_timestamp, args.item_end_timestamp, args.content_categories, args.description_loc_key, args.title_loc_key);
      },
      createSubscription: async (_parent, args) => mutationResolver.createSubscription(args.phone_number, args.email_address, args.meeting_item_id, args.meeting_id),
    },
  };

  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // TODO:
      // For some reason the user object isn't available in req.
      // This baffles me because passport middleware should have already deserialized it by this point...
      // I couldn't find much info on this issue so for the time being
      // I'm manually decoding the jwt token here to get around the problem.

      const jwtToken = req.cookies.jwt;

      let decoded = {};
      try {
        decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      } catch (err) {
        switch (err.name) {
          case 'TokenExpiredError':
            logger.error(`JWT token expired error. Token expired on: ${err.expiredAt}`);
            decoded.data = { expired: true };
            break;
          default:
            logger.error(err);
        }
        decoded.data = { admin: false };
      }

      return { user: decoded.data };
    },
  });
};
