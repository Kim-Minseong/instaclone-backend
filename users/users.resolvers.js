import client from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        login: async (_, { username, password }) => {
            // find user with args.username
            const user = await client.user.findFirst({
                where: {
                    username,
                },
            });

            if (!user) {
                return {
                    ok: false,
                    error: 'User not found.',
                };
            }

            // check password with args.password
            const passwordOk = await bcrypt.compare(password, user.password);

            if (!passwordOk) {
                return {
                    ok: false,
                    error: 'Please try again after check your password.',
                };
            }

            // issue a token and send it to the user
            const token = await jwt.sign(
                { id: user.id },
                process.env.TOKEN_SECRET
            );
            return {
                ok: true,
                token,
            };
        },
    },
};
