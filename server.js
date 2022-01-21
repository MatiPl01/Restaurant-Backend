const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

process.on('uncaughtException', err => {
  console.error('Uncaught rejection:', err.name, err.message)
  process.exit(1)
})

const app = require("./app")

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}...`)
})

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
