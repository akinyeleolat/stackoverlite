/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { sign, verify } from 'jsonwebtoken';
import { secret } from '../config';

export function createToken(userData: any) {
    return sign(userData, secret, {
        algorithm: 'HS512',
        expiresIn: '1d',
    });
}

export function validateToken(token: string) {
    return verify(token, secret, { algorithms: ['HS512'] });
}
