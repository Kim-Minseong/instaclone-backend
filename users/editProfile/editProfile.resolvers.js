import fs from 'fs';
import client from '../../client';
import bcrypt from 'bcrypt';
import { protectResolver } from '../users.utils';

const resoverFn = async (
    _,
    {
        firstName,
        lastName,
        username,
        email,
        password: newPassword,
        bio,
        avatar,
    },
    { loggedInUser }
) => {
    let hashPassword = null;
    const { filename, createReadStream } = await avatar;
    const lowerFilename = filename.toLowerCase();
    console.log(lowerFilename);
    const readStream = createReadStream();
    const writeStream = fs.createWriteStream(
        process.cwd() + '/uploads/' + lowerFilename
    );
    readStream.pipe(writeStream);

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
            id: loggedInUser.id,
        },
        data: {
            firstName,
            lastName,
            username,
            email,
            bio,
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
};

export default {
    Mutation: {
        editProfile: protectResolver(resoverFn),
    },
};
