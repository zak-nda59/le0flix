export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    displayName: string;
    role: 'user' | 'admin';
    isEmailVerified: number;
    createdAt: Date;
    updatedAt: Date;
}
