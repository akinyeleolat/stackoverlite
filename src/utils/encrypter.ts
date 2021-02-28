import bcrypt from 'bcryptjs';

export function encryptPassword(
    password: string,
    salt: number,
): Promise<string> {
    return bcrypt
        .genSalt(salt)
        .then(salted => bcrypt.hash(password, salted))
        .catch(error => {
            throw error;
        });
}

export function isEqualsPassword(
    encrypted: string,
    text: string,
): Promise<boolean> {
    return bcrypt.compare(text, encrypted);
}
