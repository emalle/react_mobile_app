import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseAsync('concerts.db');

// Function to initialize the "favorites" table since it does not exist
export const initializeDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, concertId TEXT, concertName TEXT, venueName TEXT);',
            [],
            () => {
                console.log('Favorites table created');
            },
            (_, error) => {
                console.log('Error creating table:', error);
            }
        );
    });
};

// Function to save a concert to the favorites table
export const saveToFavorites = (concert) => {
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO favorites (concertId, concertName, venueName) VALUES (?, ?, ?);',
            [concert.id, concert.name, concert._embedded.venues[0].name],
            () => {
                console.log('Concert saved!');
            },
            (_, error) => {
                console.log('Error saving concert to favorites:', error);
            }
        );
    });
};
// Now to get the favorite concerts
export const getFavorites = (callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM favorites;',
            [],
            (_, { rows }) => {
                callback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching favorites:', error);
            }
        );
    });
};
// And also to cancel a concert from the favorites
export const deleteFromFavorites = (concertId) => {
    db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM favorites WHERE concertId = ?;',
            [concertId],
            (_, result) => {
                console.log('Concert removed!');
            },
            (_, error) => {
                console.log('Error removing concert from favorites:', error);
            }
        );
    });
};