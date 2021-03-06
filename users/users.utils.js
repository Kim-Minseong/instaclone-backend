import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
    try {
        if (!token) {
            return null;
        }

        const { id } = await jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await client.user.findUnique({
            where: {
                id,
            },
        });

        if (user) {
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
};

export const protectResolver = (myResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
        return {
            ok: false,
            error: 'Please login.',
        };
    }

    return myResolver(root, args, context, info);
};
