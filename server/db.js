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
});

const addRecordEditable = async (recordData, table) => {
  const timeData = {
    created_at: dbUtils.getTimestampGMT(),
    created_at_local: dbUtils.getTimestampLocal(),
    created_timezone_offset: dbUtils.getTimezoneOffset(),
    created_timezone_name: dbUtils.getTimezoneName(),
    lastmodified_at: dbUtils.getTimestampGMT(),
    lastmodified_at_local: dbUtils.getTimestampLocal(),
    lastmodified_timezone_offset: dbUtils.getTimezoneOffset(),
    lastmodified_timezone_name: dbUtils.getTimezoneName(),
  }

  const qd = dbUtils.getQueryInsert(recordData, timeData, table)

  const result = await pool.query(qd.query, qd.values)

  return result.rows[0].id
}

const addRecord = async (recordData, table) => {
  const timeData = {
    timestamp: dbUtils.getTimestampGMT(),
    timestamp_local: dbUtils.getTimestampLocal(),
    timezone_offset: dbUtils.getTimezoneOffset(),
    timezone_name: dbUtils.getTimezoneName(),
  }

  const qd = dbUtils.getQueryInsert(recordData, timeData, table)

  const result = await pool.query(qd.query, qd.values)
  console.log('result', result)
  return result.rows[0].id
}

const modifyRecord = async (recordData, table, id) => {
  const timeData = {
    lastmodified_at: dbUtils.getTimestampGMT(),
    lastmodified_at_local: dbUtils.getTimestampLocal(),
    lastmodified_timezone_offset: dbUtils.getTimezoneOffset(),
    lastmodified_timezone_name: dbUtils.getTimezoneName(),
  }

  const qd = dbUtils.getQueryUpdate(recordData, timeData, table, id)

  console.log('qd', qd)
  const result = await pool.query(qd.query, qd.values)
  console.log('result', result)
  return result.rows[0].id
}

const getRecords = async (table,whereClause) => {
  console.log('no fields here')
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
  addRecordEditable,
  addRecord,
  modifyRecord,
  getRecords,
  getRecordsFields,
  getRecord,
  getRecordFields
};