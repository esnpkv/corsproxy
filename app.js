import express from 'express'
import request from 'request'

const app = express()
const port = 3900

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Cache-Control', 'no-store')
  next()
})

app.get('/proxy', (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.status(400).send('Требуется указать URL')
  }

  request({
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Referer': 'https://example.com'
    }
  })
  .on('response', (response) => {
    res.setHeader('Content-Type', response.headers['content-type'])
  })
  .on('error', (error) => {
    res.status(500).send(error.message)
  })
  .pipe(res)
})

app.listen(port, () => {
  console.log(`Прокси сервер слушает порт ${port}`)
})
