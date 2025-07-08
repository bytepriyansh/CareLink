import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false); 
        });

        return () => {
            unsubscribe();
            setLoading(false); 
        };
    }, []);

    const logout = async () => {
        setLoading(true); 
        try {
            await auth.signOut();
        } finally {
            setLoading(false);
        }
    };

    return { user, logout, loading }; 
}