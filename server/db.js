const dbUtils = require('./dbUtils');
// import utils from '../src/utils/utils';
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

const addRecord = async (recordData, table) => {
  const qd = dbUtils.getQueryInsert(recordData, table)

  const result = await pool.query(qd.query, qd.values)

  return result.rows[0].id
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

module.exports = {
  addRecord,
  modifyRecord,
  getRecords,
  getRecordsFields,
  getRecord,
  getRecordFields,
  pool
};