export type Category = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
};

export type Movie = {
    id: string;
    title: string;
    synopsis: string | null;
    releaseYear: number | null;
    durationMinutes: number | null;
    maturityRating: string | null;
    thumbnailUrl: string | null;
    backdropUrl: string | null;
    hlsBasePath: string;
    isPublished: number;
    categories: Category[];
    createdAt: string;
    updatedAt: string;
};

export type AuthResponse = {
    accessToken: string;
    user: {
        id: string;
        email: string;
        displayName: string | null;
        role: string;
    };
};

export type StreamSessionResponse = {
    playbackUrl: string;
    expiresAt: string;
};
