import {compare, hash} from "bcryptjs";
import jwt from "jsonwebtoken";

async function hashPassword(password) {
    return await hash(password, 10);

}


async function comparePassword(password, hashedPassword) {
    return await compare(password, hashedPassword);
}

function verifyToken(token, secret) {
    try {
        const verify = jwt.verify(token, secret);
        return {email: verify.email};
    } catch (err) {
        return false;
    }

}

export {hashPassword, comparePassword, verifyToken};
