const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())

//app.use(morgan('tiny'))

app.use(morgan(function (tokens, req, res) {

  if (tokens.method(req, res) === 'POST' ) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      `{name: ${req.body.name}, number: ${req.body.number}}`
    ].join(' ')
} else if (tokens.method(req, res) === 'GET') {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}

}))



let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456' 
    },
    {
        id: 2,
        name: 'Ada Lovelace', 
        number: '39-44-5323523' 
    },
    { 
        id: 3,
        name: 'Dan Abramov', 
        number: '12-43-234345' 
    },
    {
        id: 4,
        name: 'Mary Poppendieck', 
        number: '39-23-6423122' 
    }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {

    const number = persons.length

    res.send(`<p>phonebook has info for ${number} people</><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id) 

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.random() * 10000
}

app.post('/api/persons', (req, res) => {

const body = req.body
console.log(body)

if (!body.name && !body.number) {
  return res.status(400).json({ 
    error: 'name and number are missing' 
  })
}

if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }

if (!body.number) {
  return res.status(400).json({
    error: 'number is missing'
  })
}

if (persons.find(p => p.name === body.name)) {
  return res.status(400).json({
    error: 'name must be unique'
  })
}

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})