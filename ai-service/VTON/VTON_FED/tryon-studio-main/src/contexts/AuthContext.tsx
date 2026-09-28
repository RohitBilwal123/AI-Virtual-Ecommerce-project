import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LocalUser {
    id: string;
    email: string;
    full_name?: string;
}

interface AuthContextType {
    user: LocalUser | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ data?: any; error: any }>;
    signIn: (email: string, password: string) => Promise<{ data?: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<LocalUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('aurafit_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signUp = async (email: string, password: string, fullName?: string) => {
        if (!email || !password) return { error: { message: 'Email and password required' } };

        const users = JSON.parse(localStorage.getItem('aurafit_users') || '[]');
        if (users.find((u: any) => u.email === email)) {
            return { error: { message: 'User already exists' } };
        }

        const newUser = { id: Math.random().toString(36).substr(2, 9), email, full_name: fullName, password };
        users.push(newUser);
        localStorage.setItem('aurafit_users', JSON.stringify(users));

        const publicUser = { id: newUser.id, email: newUser.email, full_name: newUser.full_name };
        localStorage.setItem('aurafit_user', JSON.stringify(publicUser));
        setUser(publicUser);

        return { data: { user: publicUser }, error: null };
    };

    const signIn = async (email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem('aurafit_users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (!foundUser) {
            return { error: { message: 'Invalid email or password' } };
        }

        const publicUser = { id: foundUser.id, email: foundUser.email, full_name: foundUser.full_name };
        localStorage.setItem('aurafit_user', JSON.stringify(publicUser));
        setUser(publicUser);

        return { data: { user: publicUser }, error: null };
    };

    const signOut = async () => {
        localStorage.removeItem('aurafit_user');
        setUser(null);
        return { error: null };
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
