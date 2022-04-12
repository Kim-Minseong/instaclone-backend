import client from '../../client';

export default {
    Query: {
        seeProfile: async (_, { username }) => {
            return await client.user.findUnique({
                where: {
                    username,
                },
            });
        },
    },
};
