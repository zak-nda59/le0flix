export type AccessTokenPayload = {
    sub: string;
    email: string;
    role: 'user' | 'admin';
};
