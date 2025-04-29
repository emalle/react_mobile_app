import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('concerts.db');

export const initializeDatabase = () => {
    try {
        db.execSync('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, concertId TEXT, concertName TEXT, venueName TEXT);');
        console.log('Favorites table created');
    } catch (error) {
        console.log('Error creating table:', error);
    }
};

export const saveToFavorites = (concert) => {
    try {
        db.execSync('INSERT INTO favorites (concertId, concertName, venueName) VALUES (?, ?, ?);', [concert.id, concert.name, concert._embedded.venues[0].name]);
        console.log('Concert saved!');
    } catch (error) {
        console.log('Error saving concert to favorites:', error);
    }
};

export const getFavorites = () => {
    try {
        // Using executeSql for SELECT queries (to fetch data)
        const results = [];
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM favorites;',
                [],
                (_, { rows }) => {
                    // Push all rows into the results array
                    rows._array.forEach((row) => results.push(row));
                },
                (_, error) => {
                    console.log('Error fetching favorites:', error);
                    return [];
                }
            );
        });
        return results;
    } catch (error) {
        console.log('Error fetching favorites:', error);
        return [];
    }
};

export const deleteFromFavorites = (concertId) => {
    try {

        db.execSync('DELETE FROM favorites WHERE concertId = ?;', [concertId]);
        console.log('Concert removed!');
    } catch (error) {
        console.log('Error removing concert from favorites:', error);
    }
};
