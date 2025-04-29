import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('concerts.db');


export const initializeDatabase = async () => {
    try {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        concertId TEXT UNIQUE,
        concertName TEXT,
        venueName TEXT
      );
    `);
        console.log('Favorites table created');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};


export const saveToFavorites = async (concert) => {
    try {
        await db.execAsync(
            `INSERT OR IGNORE INTO favorites (concertId, concertName, venueName) VALUES (?, ?, ?);`,
            [concert.id, concert.name, concert._embedded.venues[0].name]
        );
        console.log('Concert saved!');
    } catch (error) {
        console.error('Error saving concert:', error);
    }
};


export const getFavorites = async () => {
    try {
        const result = await db.getAllAsync(`SELECT * FROM favorites;`);
        return result;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};


export const deleteFromFavorites = async (concertId) => {
    try {
        await db.runAsync(`DELETE FROM favorites WHERE concertId = ?;`, [concertId]);
        console.log('Concert removed!');
    } catch (error) {
        console.error('Could not delete concert:', error);
    }
};