require('babel-core/register')

const app = require('./server').default

const port = process.env.PORT || 3001

app.listen(port, (error) => {
  if (error) throw error
  console.log(`Listening at localhost:${port}`)
})
