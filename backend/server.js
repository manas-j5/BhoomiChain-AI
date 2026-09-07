require('dotenv').config()
const app = require('./src/app')
const config = require('./src/config')

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════╗`)
  console.log(`║   BhoomiChain AI — Backend Running    ║`)
  console.log(`║   http://localhost:${PORT}               ║`)
  console.log(`║   ENV: ${config.NODE_ENV.padEnd(28)}║`)
  console.log(`╚═══════════════════════════════════════╝\n`)
})
