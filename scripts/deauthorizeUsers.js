require('dotenv').config()

const { pool } = require('../server/db')
const { deauthorizeStrava } = require('../src/strava/deauthorize')
const { refreshToken } = require('../src/strava/refresh')

async function run() {
    const users = await pool.query(`
        SELECT user_id, pgp_sym_decrypt(auth_token, $1) AS access_token, pgp_sym_decrypt(refresh_token, $1) AS refresh_token, users.Name, users.lastmodified_at
        FROM users_auth
        INNER JOIN users ON users.id = users_auth.user_id
        WHERE users.lastmodified_at > NOW() - INTERVAL '30 days'
    `, [process.env.TOKEN_ENCRYPTION_KEY])

    for (const u of users.rows) {
        if(u.refresh_token.length > 40) {
            const res = (`
                SELECT user_id, pgp_sym_decrypt(pgp_sym_decrypt(auth_token, $1)::bytea, $1) AS access_token, pgp_sym_decrypt(pgp_sym_decrypt(refresh_token, $1)::bytea, $1) AS refresh_token, users.Name, users.lastmodified_at
                FROM users_auth
                INNER JOIN users ON users.id = users_auth.user_id
                WHERE users.lastmodified_at > NOW() - INTERVAL '30 days' and users_auth.user_id = $2
            `, [process.env.TOKEN_ENCRYPTION_KEY, u.user_id])
            u = res.rows[0]
        }
        try {
            let response = await deauthorizeStrava(u.access_token)
            console.log(`Deauthorized user ${u.user_id}:`, response)
            if(response.errors) {
                let responseRefresh = await refreshToken(u.refresh_token)
                console.log(`responserefresh user ${u.user_id}:`, responseRefresh)
                if(!responseRefresh.errors) {
                    let newAccessToken = responseRefresh.access_token
                    let responseDeauth = await deauthorizeStrava(newAccessToken)
                    console.log(`Deauthorized user after refresh ${u.user_id}:`, responseDeauth)
                    await pool.query(`
                        DELETE FROM users_auth
                        WHERE user_id = $1
                    `, [u.user_id])
                } else {
                    console.error(`Could not refresh token for user ${u.user_id}, skipping deauthorization.`)
                }
            } else {
                await pool.query(`
                    DELETE FROM users_auth
                    WHERE user_id = $1
                `, [u.user_id])
            }
        } catch (e) {
            console.error(`Error deauthorizing user ${u.user_id}:`, e)
        }
    }

    await pool.end()
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
})