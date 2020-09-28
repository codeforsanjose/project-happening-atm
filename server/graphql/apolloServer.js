const { ApolloServer, gql } = require('apollo-server-express');
const mutationResolver = require('./resolvers/mutation');
const queryResolver = require('./resolvers/query');

module.exports = (dbClient, twilioClient, logger) => {
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
            getAllMeetings: async () => {
                return await queryResolver.getAllMeetings(dbClient);
            },
            getMeeting: async ({ id }) => {
                return await queryResolver.getMeeting(dbClient, id);
            },
            getMeetingItem: async ({ id }) => {
                return await queryResolver.getMeetingItem(dbClient, id);
            },
            getAllMeetingItems: async () => {
                return await queryResolver.getAllMeetingItems(dbClient);
            },
            getMeetingWithItems: async ({ id }) => {
                return await queryResolver.getMeetingWithItems(dbClient, id);
            },
            getAllMeetingsWithItems: async () => {
                return await queryResolver.getAllMeetingsWithItems(dbClient);
            },
            getSubscription: async ({ id }) => {
                return await queryResolver.getSubscription(dbClient, id);
            },
            getAllSubscriptions: async () => {
                return await queryResolver.getAllSubscriptions(dbClient);
            },
            getSubscription: async ({ id }) => {
                return await queryResolver.getSubscription(dbClient, id)
            },
            getAllSubscriptions: async () => {
                return await queryResolver.getAllSubscriptions(dbClient)
            },
            getSubscription: async ({ id }) => {
                return await queryResolver.getSubscription(dbClient, id)
            },
            getAllSubscriptions: async () => {
                return await queryResolver.getAllSubscriptions(dbClient)
            }
        },
        Mutation: {
            createMeeting: async ({ meeting_type, meeting_start_timestamp, virtual_meeting_url, status }) => {
                return await mutationResolver.createMeeting(dbClient, meeting_type, meeting_start_timestamp, virtual_meeting_url, status);
            },
            updateMeeting: async ({ id, status, meeting_type, virtual_meeting_url, meeting_start_timestamp, meeting_end_timestamp }) => {
                return await mutationResolver.updateMeeting(dbClient, twilioClient, id, status, meeting_type, virtual_meeting_url, meeting_start_timestamp, meeting_end_timestamp);
            },
            createMeetingItem: async ({ meeting_id, order_number, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key }) => {
                return await mutationResolver.createMeetingItem(dbClient, meeting_id, order_number, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key);
            },
            updateMeetingItem: async ( {id, order_number, status, item_start_timestamp, item_end_timestamp, content_categories, description_loc_key, title_loc_key} ) => {
                return await mutationResolver.updateMeetingItem(dbClient, twilioClient, id, order_number, status, item_start_timestamp, item_end_timestamp, content_categories, description_loc_key, title_loc_key);
            },
            createSubscription: async ({ phone_number, email_address, meeting_item_id, meeting_id }) => {
                console.log('Request: ', phone_number, email_address, meeting_item_id, meeting_id);
                return await mutationResolver.createSubscription(dbClient, phone_number, email_address, meeting_item_id, meeting_id);
            }
        }
    };

    return new ApolloServer({
        typeDefs,
        resolvers,
    });
};