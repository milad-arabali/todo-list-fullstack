import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken";


export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}


export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}


interface TokenPayload extends JwtPayload {
    email: string;
}


export function verifyToken(
    token: string,
    secret: string
): { email: string } | false {
    try {
        const verified = jwt.verify(token, secret) as TokenPayload;
        return {email: verified.email};
    } catch (err) {
        return false;
    }
}
