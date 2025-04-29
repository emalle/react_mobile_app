
import React, { createContext, useEffect, useState } from 'react';
import {
    initializeDatabase,
    saveToFavorites,
    getFavorites,
    deleteFromFavorites,
} from './db';

export const SQLiteContext = createContext();

export const SQLiteProvider = ({ children }) => {
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        const setup = async () => {
            await initializeDatabase();
            setDbReady(true);
        };
        setup();
    }, []);

    return (
        <SQLiteContext.Provider
            value={{
                dbReady,
                saveToFavorites,
                getFavorites,
                deleteFromFavorites,
            }}
        >
            {children}
        </SQLiteContext.Provider>
    );
};
