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

/**
 * Handles database operations.
 */
class DatabaseManager {
    /**
     * Creates a new database.
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
     * @param {string} oldDbName - The current name of the database.
     * @param {string} newDbName - The new name for the database.
     */
    renameDatabase(oldDbName, newDbName) {
        fs.rename(oldDbName, newDbName, (err) => {
            if (err) throw new Error(`Failed to rename database "${oldDbName}" to "${newDbName}"`);
            console.log(`Database "${oldDbName}" renamed to "${newDbName}" successfully.`);
        });
    }

    /**
     * Lists the contents (tables) of a database.
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
     * @param {string} dbName - The name of the database.
     * @param {string} tableName - The name of the table to read.
     */
    readTable(dbName, tableName) {
        fs.readFile(path.join(dbName, `${tableName}.json`), 'utf8', (err, data) => {
            if (err) throw new Error(`Failed to read table "${tableName}" in database "${dbName}"`);
            console.log(`Contents of "${tableName}" in Database "${dbName}":`);
            console.log(JSON.parse(data));
        });
    }

    /**
     * Deletes an existing table.
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
     * 
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
function test() {

    const databaseManager = new DatabaseManager()
    const tableManager = new TableManager()
    const recordManager = new RecordManager()

    databaseManager.createDatabase("myDatabase")
    tableManager.createTable("myDatabase", "myTable")
    recordManager.createRecord("myDatabase", "myTable", { id: 1, name: "John Doe" })
    recordManager.readRecord("myDatabase","myTable",1)
    // recordManager.updateRecord("myDatabase", "myTable", 1, { id: 1, name: "Jane Doe" })
    // recordManager.deleteRecord("myDatabase", "myTable", 1)
    // tableManager.deleteTable("myDatabase", "myTable")
    // databaseManager.renameDatabase("myDatabase", "newDatabase");   
    // databaseManager.deleteDatabase("newDatabase")
}

test();
