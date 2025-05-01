import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SQLite from 'expo-sqlite';

console.log('SQLite:', SQLite);


export const SQLiteContext = createContext();


export const SQLiteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [db, setDb] = useState(null);


    useEffect(() => {
        const initDb = async () => {
            const database = await SQLite.openDatabaseAsync('concerts.db');
            await database.execAsync(`DROP TABLE IF EXISTS favorites;`);
            await database.execAsync(`
            CREATE TABLE IF NOT EXISTS favorites (
              concertId TEXT PRIMARY KEY,
              concertName TEXT,
              venueName TEXT,
              date TEXT
            );
          `);
            console.log('Favorites table ensured');
            setDb(database);
        };

        initDb();
    }, []);


    const saveToFavorites = async (concert) => {
        if (!db) return;

        const { concertId, concertName, venueName } = concert;

        if (concertId && concertName && venueName) {
            try {
                await db.runAsync(
                    `INSERT OR IGNORE INTO favorites (concertId, concertName, venueName, date) VALUES (?, ?, ?, ?);`,
                    [concertId, concertName, venueName, concert.date]
                );
                console.log(' Concert saved!');
            } catch (error) {
                console.error(' Error saving concert:', error);
            }
        } else {
            console.log(' Missing values. Concert not saved.');
        }
    };



    const getFavorites = async () => {
        if (!db) return [];

        try {
            const results = await db.getAllAsync(`SELECT * FROM favorites;`);
            console.log('Fetched favorites:', results);
            setFavorites(results);
            return results;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    };

    const deleteFromFavorites = async (concertId) => {
        if (!db) return;

        try {
            await db.runAsync(`DELETE FROM favorites WHERE concertId = ?;`, [concertId]);
            console.log('Concert deleted!');
        } catch (error) {
            console.error('Error deleting concert:', error);
        }
    };

    return (
        <SQLiteContext.Provider value={{
            favorites,
            saveToFavorites,
            getFavorites,
            deleteFromFavorites
        }}>
            {children}
        </SQLiteContext.Provider>
    );
};

export const useSQLite = () => useContext(SQLiteContext);


