const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-rajch.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 5) {
    
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(response => {
        console.log(`Added ${response.name}, number: ${response.number} to phonebook`)
        mongoose.connection.close()
    })
} else {

    Person.find({}).then(response => {
        console.log('phonebook:')
        response.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}