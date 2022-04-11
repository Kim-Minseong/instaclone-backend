import client from '../client';
import bcrypt from 'bcrypt';

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

    Mutation: {
        createAccount: async (
            _,
            { firstName, lastName, username, email, password }
        ) => {
            //check if username or eamil are already
            const existingUser = await client.user.findFirst({
                where: {
                    OR: [{ username }, { email }],
                },
            });

            if (existingUser) {
                return {
                    ok: false,
                    error: 'Username or email is already taken.',
                };
            } else {
                // hash password
                const hashPassword = await bcrypt.hash(password, 10);

                // save and return user
                await client.user.create({
                    data: {
                        firstName,
                        lastName,
                        username,
                        email,
                        password: hashPassword,
                    },
                });

                return {
                    ok: true,
                };
            }
        },
    },
};
