import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('concerts.db');


export const initializeDatabase = async () => {
    try {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
    concertId TEXT PRIMARY KEY NOT NULL,
    concertName TEXT,
    venueName TEXT
    `);
        console.log('Favorites table created');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};


export const saveToFavorites = async (concert) => {
    try {
        console.log('Saving concert:', concert);

        const concertId = concert.concertId;
        const concertName = concert.concertName;
        const venueName = concert.venueName;

        console.log('Concert ID:', concertId);
        console.log('Concert Name:', concertName);
        console.log('Venue Name:', venueName);

        if (concertId && concertName && venueName) {
            await db.execAsync(
                `INSERT OR IGNORE INTO favorites (concertId, concertName, venueName) VALUES (?, ?, ?);`,
                [concertId, concertName, venueName]
            );
            console.log('Concert saved!');
        } else {
            console.log('Error: Some values are missing. Concert not saved.');
        }
    } catch (error) {
        console.error('Error saving concert:', error);
    }
};

export const getFavorites = async () => {
    try {
        const result = await db.getAllAsync(`SELECT * FROM favorites;`);
        console.log('Fetched favorites:', result);
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