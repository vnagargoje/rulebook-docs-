const TOKEN_KEY = 'yugo_token';

export type TokenType = {
    access: string;
    refresh: string;
};

export const getToken = (): TokenType | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? JSON.parse(token) : null;
};

export const setToken = (value: TokenType) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(value));
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
