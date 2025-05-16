
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { setAuthToken } from '../apiMAG/api';
import { AdvisorProfile, LoginInput, LoginResponse, UpdatePasswordInput, login, logout, showProfile, resetPassword, addImage, deleteImage } from '../apiMAG/user';


// ----- Context Types -----
interface UserContextState {
    token: string | null;
    usertype: string | null;
    profile: AdvisorProfile | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
    loginUser: (credentials: LoginInput) => Promise<LoginResponse>;
    logoutUser: () => Promise<void>;
    refreshProfile: (userID: number) => Promise<void>;
    updatePassword: (input: UpdatePasswordInput) => Promise<string>;
    uploadImage: (input: string, userID: number) => Promise<string>;
    removeImage: (userID: number) => Promise<string>;
}

const UserContext = createContext<UserContextState | undefined>(undefined);

// ----- Provider Props -----
interface UserProviderProps {
    children: ReactNode;
}

// ----- Provider Component -----
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [usertype, setUsertype] = useState<string | null>(null);
    const [profile, setProfile] = useState<AdvisorProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);  // ← new
    const [userId, setuserId] = useState<string | null>(null);
    
    // Perform login and load profile
   

    const loginUser = async (credentials: LoginInput): Promise<LoginResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data: LoginResponse = await login(credentials);

            // Update React state
            setuserId(String(credentials.userid));
            setToken(data.token);
            setUsertype(data.usertype);

            // Sync token with Axios instance
            setAuthToken(data.token); // Critical: Update api.ts's token

            // Fetch profile immediately after login
           
            await refreshProfile(credentials.userid); // No token needed—uses api.ts's authToken
            

            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout and clear state
    const logoutUser = async () => {
        setLoading(true);
        setError(null);
        try {
            await logout();
            setAuthToken(null);
            setToken(null);
            setProfile(null);
           
            setUsertype(null);
           
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile
    const refreshProfile = async(userID:number) => {
        setLoading(true);
        setError(null);
        try {
            const data: AdvisorProfile = await showProfile(userID); // Uses api.ts's token via Axios
            setProfile(data);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const updatePassword = async (input: UpdatePasswordInput): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await resetPassword(input, Number(userId));
            return res ?? 'Error';
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Add profile image
    const uploadImage = async (input: string, userID: number): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await addImage({ image: input },Number(userId));
            await refreshProfile(userID);
            return res ?? 'Error';
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete profile image
    const removeImage = async (userID: number): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await deleteImage(Number(userId));
            await refreshProfile(userID);
            return res ?? 'Error';
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Effect: Optionally, load token from localStorage on mount and fetch profile
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const userid = localStorage.getItem('userId');
        const storedUsertype = localStorage.getItem('authUsertype');
        if (storedToken) {
            setAuthToken(storedToken);
            setuserId(userid);
            setToken(storedToken);
            setUsertype(storedUsertype);
            refreshProfile(Number(userid) ?? 1).catch(() => { });
        }
        setInitialized(true);  // ← mark that we’re done restoring
    }, []);

    // Persist token to storage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            if (usertype) localStorage.setItem('authUsertype', usertype);
            // api.setAuthHeader(token);
            if (userId)  localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUsertype');
        }
    }, [token, usertype]);

    return (
        <UserContext.Provider
            value={{
                token,
                usertype,
                profile,
                loading,
                error,
                loginUser,
                logoutUser,
                refreshProfile,
                updatePassword,
                uploadImage,
                removeImage,
                initialized,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// ----- Custom Hook -----
export const useUser = (): UserContextState => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
