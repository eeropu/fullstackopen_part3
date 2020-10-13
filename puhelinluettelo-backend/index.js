require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))


const Person = require('./models/person')


app.get('/api/info', (req, res, next) => {
    Person.count().then(count => {
        const infoString = `Phonebook has info for ${count} people\n\n${new Date}`
        res.setHeader('content-type', 'text/plain')
        res.send(infoString)
    }).catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(response => {
        res.json(response.map(person => person.toJSON()))
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(person.toJSON())
            } else {
                next(person)
            }
        }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(result => {
        console.log(result)
        res.json(result)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    if (body.number.length < 8) {
        throw { name: 'ValidationError' }
    }

    const update = {
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, update, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            res.json(updatedPerson.toJSON())
        }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        }).catch(error => next(error))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'))
})

const notFoundHandler = (error, req, res, next) => {
    if ( error.name === 'CastError' && error.kind === 'ObjectId' ) {
        return res.status(404).end()
    }
    next(error)
}

app.use(notFoundHandler)

const validationErrorHandler = (error, req, res, next) => {
    if ( error.name === 'ValidationError' ) {
        return res.status(400).send(error.message)
    }
    next(error)
}

app.use(validationErrorHandler)

const errorHandler = (error, req, res) => {
    console.log(error.message)
    return res.status(500).send({ error: 'Something went wrong'})
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})