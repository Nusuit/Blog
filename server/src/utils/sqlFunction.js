const mysql = require('mysql2');
const config = require('../config/config');
const pool = mysql.createPool(config);

function createTable(schema) {
    return new Promise((resolve, reject) => {
        pool.query(schema, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

function checkRecordExist(tableName, column, value) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

        pool.query(query, [value], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length ? results[0] : null);
            }
        });
    });
}

function insertRecord(tableName, record) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${tableName} SET ?`;

        pool.query(query, [record], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function updateRecord(tableName, updates, column, value) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${tableName} SET ? WHERE ${column} = ?`;
        pool.query(query, [updates, value], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteRecord(tableName, column, value) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject(err);
                }

                const query = `DELETE FROM ${tableName} WHERE ${column} = ?`;

                connection.query(query, [value], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            reject(err);
                        });
                    }

                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                reject(err);
                            });
                        }

                        connection.release();
                        resolve(results);
                    });
                });
            });
        });
    });
}

function getRecords(tableName, column, value) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

        pool.query(query, [value], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getRecordsByUserIds(tableName, column, userIds) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tableName} WHERE ${column} IN (?)`;

        pool.query(query, [userIds], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = { createTable,
    checkRecordExist,
    insertRecord,
    updateRecord,
    deleteRecord,
    getRecords,
    getRecordsByUserIds,
    executeQuery
};