const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    result = persons.find(person => person.id === Number(req.params.id))
    result ? res.json(result) : res.status(404).end()
})

app.post('/api/persons', (req, res) => {
    const id = Math.floor(Math.random() * 10000000000) 
    const body = req.body
    if (!body.name) {
        res.status(400).json({ error: 'Name is required' })
    } else if (persons.find(person => person.name === body.name)) {
        res.status(400).json({ error: 'Name must be unique' })
    } else if (!body.number) {
        res.status(400).json({ error: 'Number is required' })
    } else {
        persons.push({...body, id })
        res.status(201).json(body)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).end()
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})