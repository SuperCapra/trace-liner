const dbUtils = require('./dbUtils');
// import utils from '../src/utils/utils';
const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.DB_HOST === 'localhost';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

const addRecord = async (recordData, table) => {
  const qd = dbUtils.getQueryInsert(recordData, table)

  const result = await pool.query(qd.query, qd.values)

  return result.rows[0].id
}
const addUsersAuth = async (recordData, t) => {
  const qd = dbUtils.getQueryAuth(recordData, t)
  const result = await pool.query(qd.query, qd.values)
  return result.rows[0].user_id
}
const modifyRecord = async (recordData, table, id) => {
  const qd = dbUtils.getQueryUpdate(recordData, table, id)

  const result = await pool.query(qd.query, qd.values)
  // console.log('qd', qd)
  // console.log('result', result)
  return result.rows[0].id
}

const getRecords = async (table,whereClause) => {
  return (await pool.query(dbUtils.getQuerySelectAll(table,whereClause))).rows
}
const getRecordsFields = async (table,fields,whereClause) => {
  return (await pool.query(dbUtils.getQuerySelectFieldsAll(table,fields,whereClause))).rows
}
const getRecord = async (table,field,value) => {
  return (await pool.query(dbUtils.getQuerySelectRecord(table,field,value))).rows
}
const getRecordFields = async (table,fields,field,value) => {
  return (await pool.query(dbUtils.getQuerySelectFieldsRecord(table,fields,field,value))).rows
}
const getQueryResult = async (query) => {
  const trimmedQuery = query.trim().toUpperCase();
  // if (!trimmedQuery.startsWith('SELECT')) {
  //   throw new Error('Only SELECT queries are allowed.');
  // }
  return (await pool.query(query)).rows
}
const register = async (data, table) => {
  const qd = dbUtils.getQueryInsert(data, table)

  // if (!qd.query.startsWith('INSERT')) {
  //   throw new Error('Only INSERT queries are allowed.');
  // }
  const result = await pool.query(qd.query, qd.values)
  return result.rows[0].id
}
const getTimestampGMT = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

module.exports = {
  addRecord,
  modifyRecord,
  getRecords,
  getRecordsFields,
  getRecord,
  getRecordFields,
  pool,
  getQueryResult,
  register,
  getTimestampGMT,
  addUsersAuth
};