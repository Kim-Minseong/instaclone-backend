import client from '../../client';
import bcrypt from 'bcrypt';

export default {
    Mutation: {
        editProfile: async (
            _,
            { firstName, lastName, username, email, password: newPassword }
        ) => {
            let hashPassword = null;

            if (newPassword) {
                hashPassword = await bcrypt.hash(newPassword, 10);
            }

            if (username) {
                const existUsername = await client.user.findUnique({
                    where: {
                        username,
                    },
                });
                if (existUsername) {
                    return {
                        ok: false,
                        error: 'The username is already taken.',
                    };
                }
            }

            if (email) {
                const existEmail = await client.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (existEmail) {
                    return {
                        ok: false,
                        error: 'The email is already taken.',
                    };
                }
            }

            const updatedUser = await client.user.update({
                where: {
                    id: 2,
                },
                data: {
                    firstName,
                    lastName,
                    username,
                    email,
                    ...(hashPassword && { password: hashPassword }),
                },
            });
            if (updatedUser.id) {
                return {
                    ok: true,
                };
            } else {
                return {
                    ok: false,
                    error: "Can't update profile now, please try later.",
                };
            }
        },
    },
};