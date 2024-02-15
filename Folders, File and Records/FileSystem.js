/**
 * Author: Ayan
 * 
 * Simple Database Management System
 * 
 * Database: Represented by Folders
 * Table: Represented by Text Files (Converted to JSON)
 * Record: Represented by Text Lines (JSON)
 */

const fs = require('fs');
const path = require('path');
// console.log(path);
const readline = require('readline');
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Handles database operations.
 */
class DatabaseManager {
    /**
     * Creates a new database.
     * @private
     * @param {string} dbName - The name of the new database.
     */
    createDatabase(dbName) {
        if (fs.existsSync(dbName)) {
            console.log(`Database "${dbName}" already exists.`);
            return;
        }
        
        fs.mkdir(dbName, (err) => {
            if (err) throw new Error(`Failed to create database "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        });
    }

    /**
     * Deletes an existing database.
     * @param {string} dbName - The name of the database to be deleted.
     */
    deleteDatabase(dbName) {
        fs.rmdir(dbName, { recursive: true }, (err) => {
            if (err) throw new Error(`Failed to delete database "${dbName}"`);
            console.log(`Database "${dbName}" deleted successfully.`);
        });
    }

    /**
     * Renames an existing database.
     * @private
     * @param {string} oldDbName - The current name of the database.
     * @param {string} newDbName - The new name for the database.
     */
    renameDatabase(oldDbName, newDbName) {

        if (!(fs.existsSync(oldDbName))) {
            console.log(`Database "${oldDbName}" doesn't exists.`);
            return;
        }
        fs.rename(oldDbName, newDbName, (err) => {
            if (err) throw new Error(`Failed to rename database "${oldDbName}" to "${newDbName}"`);
            console.log(`Database "${oldDbName}" renamed to "${newDbName}" successfully.`);
        });
    }

    /**
     * Lists the contents (tables) of a database.
     * @private
     * @param {string} dbName - The name of the database.
     */
    listDatabaseContents(dbName) {
        fs.readdir(dbName, (err, files) => {
            if (err) throw new Error(`Failed to read database "${dbName}"`);
            console.log(`Contents of Database "${dbName}":`);
            files.forEach(file => {
                console.log(file);
            });
        });
    }
}

/**
 * Handles table operations.
 */
class TableManager {
    /**
     * Creates a new table in the specified database.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the new table.
     */
    createTable(dbName, tableName) {
        const filePath = path.join(dbName, `${tableName}.json`);
    
        // Check if the file already exists
        if (fs.existsSync(filePath)) {
            console.log(`Table "${tableName}" already exists in database "${dbName}".`);
            return;
        }
    
        const data = [];
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) throw new Error(`Failed to create table "${tableName}" in database "${dbName}"`);
            console.log(`Table "${tableName}" created successfully in database "${dbName}".`);
        });
    }
    
    /**
     * Reads and displays the contents of a table.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the table to read.
     */
    readTable(dbName, tableName) {

        const filePath = path.join(dbName, `${tableName}.json`);

        if (!(fs.existsSync(filePath))) {
            console.log(`Table "${tableName}" doesn't exists in database "${dbName}".`);
            return;
        }
        fs.readFile(path.join(dbName, `${tableName}.json`), 'utf8', (err, data) => {
            if (err) throw new Error(`Failed to read table "${tableName}" in database "${dbName}"`);
            console.log(`Contents of "${tableName}" in Database "${dbName}":`);
            console.log(JSON.parse(data));
        });
    }

    /**
     * Deletes an existing table.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the table to delete.
     */
    deleteTable(dbName, tableName) {
        const filePath = path.join(dbName, `${tableName}.json`);
        fs.unlink(filePath, (err) => {
            if (err) throw new Error(`Failed to delete table "${tableName}" from database "${dbName}"`);
            console.log(`Table "${tableName}" deleted successfully from database "${dbName}".`);
        });
    }

    /**
     * Renames an existing table.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} oldTableName - The current name of the table.
     * @param {string} newTableName - The new name for the table.
     */
    renameTable(dbName, oldTableName, newTableName) {
        const oldFilePath = path.join(dbName, `${oldTableName}.json`);
        const newFilePath = path.join(dbName, `${newTableName}.json`);
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) throw new Error(`Failed to rename table "${oldTableName}" to "${newTableName}" in database "${dbName}"`);
            console.log(`Table "${oldTableName}" renamed to "${newTableName}" in database "${dbName}" successfully.`);
        });
    }
}

/**
 * Handles record operations.
 */
class RecordManager {
    /**
     * Creates a new record in the specified table.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the table.
     * @param {object} recordData - The data of the new record.
     */
    createRecord(dbName, tableName, recordData) {
        const filePath = path.join(dbName, `${tableName}.json`);
    
        // Read the existing records from the table file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw new Error(`Failed to read table "${tableName}" in database "${dbName}"`);
    
            // Parse the existing records
            const dataArray = JSON.parse(data);
    
            // Check if the record already exists based on its ID
            const recordExists = dataArray.some(record => record.id === recordData.id);
            if (recordExists) {
                console.log(`Record with ID "${recordData.id}" already exists in table "${tableName}" in database "${dbName}".`);
                return;
            }
    
            // Add the new record to the array of records
            dataArray.push(recordData);
    
            // Write the updated records back to the table file
            fs.writeFile(filePath, JSON.stringify(dataArray), (err) => {
                if (err) throw new Error(`Failed to create record in table "${tableName}" in database "${dbName}"`);
                console.log(`Record created successfully in table "${tableName}" in database "${dbName}".`);
            });
        });
    }
    /**
     * @private
     * @param {String} dbName -The name of database
     * @param {String} tableName - The name of table
     * @param {number} recordId - Id of the record that need to be read.
     */
    readRecord(dbName, tableName, recordId) {
        const filePath = path.join(dbName, `${tableName}.json`);
    
        // Read the existing records from the table file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw new Error(`Failed to read table "${tableName}" in database "${dbName}"`);
    
            // Parse the existing records
            const dataArray = JSON.parse(data);
    
            // Find the record with the given ID
            const record = dataArray.find(record => record.id === recordId);
            if (!record) {
                console.log(`Record with ID "${recordId}" not found in table "${tableName}" in database "${dbName}".`);
                return;
            }
    
            // Log the found record
            console.log(`Record with ID "${recordId}" in table "${tableName}" in database "${dbName}":`);
            console.log(record);
        });
    }
    

    /**
     * Updates an existing record in the specified table.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the table.
     * @param {number} recordId - The ID of the record to update.
     * @param {object} newData - The new data for the record.
     */
    updateRecord(dbName, tableName, recordId, newData) {
        const filePath = path.join(dbName, `${tableName}.json`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw new Error(`Failed to read table "${tableName}" in database "${dbName}"`);
            const dataArray = JSON.parse(data);
            const indexToUpdate = dataArray.findIndex(item => item.id === recordId);
            if (indexToUpdate === -1) {
                throw new Error(`Record with ID "${recordId}" not found in table "${tableName}" in database "${dbName}"`);
            }
            dataArray[indexToUpdate] = newData;
            fs.writeFile(filePath, JSON.stringify(dataArray), (err) => {
                if (err) throw new Error(`Failed to update record with ID "${recordId}" in table "${tableName}" in database "${dbName}"`);
                console.log(`Record with ID "${recordId}" updated successfully in table "${tableName}" in database "${dbName}".`);
            });
        });
    }

    /**
     * Deletes an existing record from the specified table.
     * @private
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the table.
     * @param {number} recordId - The ID of the record to delete.
     */
    deleteRecord(dbName, tableName, recordId) {
        const filePath = path.join(dbName, `${tableName}.json`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw new Error(`Failed to read table "${tableName}" in database "${dbName}"`);
            const dataArray = JSON.parse(data);
            const indexToDelete = dataArray.findIndex(item => item.id === recordId);
            if (indexToDelete === -1) {
                throw new Error(`Record with ID "${recordId}" not found in table "${tableName}" in database "${dbName}"`);
            }
            dataArray.splice(indexToDelete, 1);
            fs.writeFile(filePath, JSON.stringify(dataArray), (err) => {
                if (err) throw new Error(`Failed to delete record with ID "${recordId}" from table "${tableName}" in database "${dbName}"`);
                console.log(`Record with ID "${recordId}" deleted successfully from table "${tableName}" in database "${dbName}".`);
            });
        });
    }
}

/**
 * Test function for database operations.
 */
function main() {


    read.question('Enter operation (0: exit ,1: Create Database, 2: Delet Database, 3: Rename Database,4: Read Database , 5 : Create Table, 6: Delete Table, 7: Rename Table,8: Read Table, 9 : Create Record, 10: Update Record, 11: Delete Record,12: Read Record \n', (operation) => {
        switch (operation) {
            case '0':
                read.close();
            case '1':
                read.question('Enter the name of the database: ', (dbName) => {
                    const databaseManager = new DatabaseManager();
                    databaseManager.createDatabase(dbName);
                    read.close();
                });
                break;
            case '2':
                read.question('Enter the name of the database to delete: ', (dbName) => {
                    const databaseManager = new DatabaseManager();
                    databaseManager.deleteDatabase(dbName);
                    read.close();
                });
                break;
            case '3':
                read.question('Enter the current name of the database: ', (oldDbName) => {
                    read.question('Enter the new name of the database: ', (newDbName) => {
                        const databaseManager = new DatabaseManager();
                        databaseManager.renameDatabase(oldDbName, newDbName);
                        read.close();
                    });
                });
                break;
            case '4':
                read.question('Enter the name of the database to list contents: ', (dbName) => {
                    const databaseManager = new DatabaseManager();
                    databaseManager.listDatabaseContents(dbName);
                    read.close();
                });
                break;
            case '5':
                read.question('Enter the name of the database to create table: ', (dbName) => {
                    read.question('Enter the name of the table: ', (tableName) => {
                        const tableManager = new TableManager();
                        tableManager.createTable(dbName, tableName);
                        read.close();
                    });
                });
                break;
            case '6':
                read.question('Enter the name of the database to delete table from: ', (dbName) => {
                    read.question('Enter the name of the table to delete: ', (tableName) => {
                        const tableManager = new TableManager();
                        tableManager.deleteTable(dbName, tableName);
                        read.close();
                    });
                });
                break;
            case '7':
                read.question('Enter the name of the database to rename table: ', (dbName) => {
                    read.question('Enter the current name of the table: ', (oldTableName) => {
                        read.question('Enter the new name of the table: ', (newTableName) => {
                            const tableManager = new TableManager();
                            tableManager.renameTable(dbName, oldTableName, newTableName);
                            read.close();
                        });
                    });
                });
                break;
            case '8':
                read.question('Enter the name of the database to read table from: ', (dbName) => {
                    read.question('Enter the name of the table to read: ', (tableName) => {
                        const tableManager = new TableManager();
                        tableManager.readTable(dbName, tableName);
                        read.close();
                    });
                });
                break;
            case '9':
                read.question('Enter the name of the database to create record in table: ', (dbName) => {
                    read.question('Enter the name of the table: ', (tableName) => {
                        read.question('Enter the ID of the record: ', (recordId) => {
                            read.question('Enter the name of the record: ', (recordName) => {
                                const recordManager = new RecordManager();
                                console.log(typeof(recordId));
                                recordManager.createRecord(dbName, tableName, { id: recordId, name: recordName });
                                read.close();
                            });
                        });
                    });
                });
                break;
            case '10':
                read.question('Enter the name of the database to update record in table: ', (dbName) => {
                    read.question('Enter the name of the table: ', (tableName) => {
                        read.question('Enter the ID of the record: ', (recordId) => {
                            read.question('Enter the new name of the record: ', (newRecordName) => {
                                const recordManager = new RecordManager();
                                console.log(typeof(recordId));
                                recordManager.updateRecord(dbName, tableName, recordId, { id: recordId, name: newRecordName });
                                read.close();
                            });
                        });
                    });
                });
                break;
            case '11':
                read.question('Enter the name of the database to delete record from table: ', (dbName) => {
                    read.question('Enter the name of the table: ', (tableName) => {
                        read.question('Enter the ID of the record: ', (recordId) => {
                            const recordManager = new RecordManager();
                            console.log(typeof(recordId));
                            recordManager.deleteRecord(dbName, tableName, recordId);
                            read.close();
                        });
                    });
                });
                break;
            case '12':
                read.question('Enter the name of the database to read record from table: ', (dbName) => {
                    read.question('Enter the name of the table: ', (tableName) => {
                        read.question('Enter the ID of the record: ', (recordId) => {
                            const recordManager = new RecordManager();
                            console.log(typeof(recordId));
                            recordManager.readRecord(dbName, tableName, recordId);
                            read.close();
                        });
                    });
                });
                break;
            default:
                console.log('Invalid operation.');
                read.close();
        }
        
        
    });

}

main()