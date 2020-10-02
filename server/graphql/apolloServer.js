const { ApolloServer, gql } = require('apollo-server-express');

module.exports = (dbClient, twilioClient, logger) => {
    const mutationResolver = require('./resolvers/mutation')(logger, dbClient, twilioClient);
    const queryResolver = require('./resolvers/query')(logger, dbClient);

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
            getAllMeetings: async (parent, args, context, info) => {
                return await queryResolver.getAllMeetings();
            },
            getMeeting: async (parent, args, context, info) => {
                return await queryResolver.getMeeting(args.id);
            },
            getMeetingItem: async (parent, args, context, info) => {
                return await queryResolver.getMeetingItem(args.id);
            },
            getAllMeetingItems: async (parent, args, context, info) => {
                return await queryResolver.getAllMeetingItems();
            },
            getMeetingWithItems: async (parent, args, context, info) => {
                return await queryResolver.getMeetingWithItems(args.id);
            },
            getAllMeetingsWithItems: async (parent, args, context, info) => {
                return await queryResolver.getAllMeetingsWithItems();
            },
            getSubscription: async (parent, args, context, info) => {
                return await queryResolver.getSubscription(args.id);
            },
            getAllSubscriptions: async (parent, args, context, info) => {
                return await queryResolver.getAllSubscriptions();
            },
            getSubscription: async (parent, args, context, info) => {
                return await queryResolver.getSubscription(args.id)
            },
            getAllSubscriptions: async (parent, args, context, info) => {
                return await queryResolver.getAllSubscriptions()
            },
            getSubscription: async (parent, args, context, info) => {
                return await queryResolver.getSubscription(args.id)
            },
            getAllSubscriptions: async (parent, args, context, info) => {
                return await queryResolver.getAllSubscriptions()
            }
        },
        Mutation: {
            createMeeting: async ( parent, args, context, info ) => {
                return await mutationResolver.createMeeting(args.meeting_type, args.meeting_start_timestamp, args.virtual_meeting_url, args.status);
            },
            updateMeeting: async (parent, args, context, info) => {
                return await mutationResolver.updateMeeting(args.id, args.status, args.meeting_type, args.virtual_meeting_url, args.meeting_start_timestamp, args.meeting_end_timestamp);
            },
            createMeetingItem: async (parent, args, context, info) => {
                return await mutationResolver.createMeetingItem(args.meeting_id, args.order_number, args.item_start_timestamp, args.item_end_timestamp, args.status, args.content_categories, args.description_loc_key, args.title_loc_key);
            },
            updateMeetingItem: async (parent, args, context, info) => {
                return await mutationResolver.updateMeetingItem(args.id, args.order_number, args.status, args.item_start_timestamp, args.item_end_timestamp, args.content_categories, args.description_loc_key, args.title_loc_key);
            },
            createSubscription: async (parent, args, context, info) => {
                return await mutationResolver.createSubscription(args.phone_number, args.email_address, args.meeting_item_id, args.meeting_id);
            }
        }
    };

    return new ApolloServer({
        typeDefs,
        resolvers,
        // TODO: This might be useful for auth later
        // context: ({ req, res }) => {
        //     const token = req.headers.authorization || '';
        //     const user = getUser(token);
        //     return { user };
        // }
    });
};