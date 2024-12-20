const db = require('./db');

// Define the SQL for creating tables
const tableDefinitions = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        strava_id BIGINT UNIQUE,
        name VARCHAR(255),
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        city VARCHAR(255),
        country VARCHAR(255),
        state VARCHAR(255),
        sex VARCHAR(1),
        username VARCHAR(255),
        token VARCHAR(255),
        has_strava BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP,
        created_at_local TIMESTAMP,
        created_timezone_offset VARCHAR(20),
        created_timezone_name VARCHAR(100),
        lastmodified_at TIMESTAMP,
        lastmodified_at_local TIMESTAMP,
        lastmodified_timezone_offset VARCHAR(20),
        lastmodified_timezone_name VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        strava_id BIGINT UNIQUE,
        average_heartrate FLOAT,
        average_speed FLOAT,
        average_temp FLOAT,
        average_watts FLOAT,
        device_watts BOOLEAN DEFAULT FALSE,
        display_hide_heartrate_option BOOLEAN DEFAULT TRUE,
        distance FLOAT,
        elapsed_time INTEGER,
        elev_high FLOAT,
        elev_low FLOAT,
        end_lat FLOAT,
        end_lng FLOAT,
        external_id VARCHAR(255),
        has_heartrate BOOLEAN DEFAULT FALSE,
        heartrate_opt_out BOOLEAN DEFAULT FALSE,
        kilojoules FLOAT,
        location_city VARCHAR(255),
        location_country VARCHAR(255),
        location_state VARCHAR(255),
        max_heartrate INTEGER,
        max_speed FLOAT,
        moving_time INTEGER,
        name VARCHAR(255),
        sport_type VARCHAR(50),
        start_date TIMESTAMP,
        start_date_local TIMESTAMP,
        start_lat FLOAT,
        start_lng FLOAT,
        summary_map VARCHAR(4000),
        total_elevation_gain INTEGER,
        created_at TIMESTAMP,
        created_at_local TIMESTAMP,
        created_timezone_offset VARCHAR(20),
        created_timezone_name VARCHAR(100),
        lastmodified_at TIMESTAMP,
        lastmodified_at_local TIMESTAMP,
        lastmodified_timezone_offset VARCHAR(20),
        lastmodified_timezone_name VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS exports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_id INTEGER REFERENCES activities(id),
        color VARCHAR(255),
        filter INTEGER,
        resolution INTEGER,
        image VARCHAR(255),
        mode VARCHAR(255),
        size VARCHAR(255),
        unit VARCHAR(255),
        type VARCHAR(255),
        show_average BOOLEAN DEFAULT FALSE,
        show_coordinates BOOLEAN DEFAULT FALSE,
        show_date BOOLEAN DEFAULT FALSE,
        show_distance BOOLEAN DEFAULT FALSE,
        show_duration BOOLEAN DEFAULT FALSE,
        show_elevation BOOLEAN DEFAULT FALSE,
        show_power BOOLEAN DEFAULT FALSE,
        show_name BOOLEAN DEFAULT FALSE,
        timestamp TIMESTAMP,
        timestamp_local TIMESTAMP,
        timezone_offset VARCHAR(20),
        timezone_name VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_id INTEGER REFERENCES activities(id),
        export_id INTEGER REFERENCES exports(id),
        has_strava_login BOOLEAN DEFAULT FALSE,
        has_loaded_gpx BOOLEAN DEFAULT FALSE,
        has_selected_activity BOOLEAN DEFAULT FALSE,
        has_exported BOOLEAN DEFAULT FALSE,
        type_export VARCHAR(255),
        is_mobile BOOLEAN DEFAULT FALSE,
        timestamp TIMESTAMP,
        timestamp_local TIMESTAMP,
        timezone_offset VARCHAR(20),
        timezone_name VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        visit_id INTEGER REFERENCES visits(id),
        info VARCHAR(32768),
        component VARCHAR(255),
        function VARCHAR(255),
        message VARCHAR(255),
        type VARCHAR(255),
        is_error BOOLEAN DEFAULT FALSE,
        timestamp TIMESTAMP,
        timestamp_local TIMESTAMP,
        timezone_offset VARCHAR(20),
        timezone_name VARCHAR(100)
    );
`;

// Function to create tables if they don't exist
const createTables = async () => {
  try {
    await db.pool.query(tableDefinitions);
    console.log('Tables are ensured to exist!');
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = {createTables}