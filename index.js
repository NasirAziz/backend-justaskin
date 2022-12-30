const { Pool, Client } = require("pg")
require("dotenv").config()
console.log(process.env.RDS_DB_NAME)
const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
  //   dialect: "postgres",
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
})

// promise - checkout a client
pool
  .connect()
  .then(async (client) => {
    console.log("Connected", client)
    try {
      const res = await client.query("SELECT * FROM users WHERE user_id = $1", [1])
      client.release()
      console.log(res.rows[0])
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }

    // remove when necessary
    pool.end()
  })
  .catch((err) => {
    console.log("Error Connecting with server:", JSON.stringify(err))
  })
