const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())


var bodyParser = require("body-parser");
app.use(bodyParser.json())

require('dotenv').config();

const uuid = require("uuid")

//connecting to database on planetscale
require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

//console.log(process.env.DATABASE_URL)

//checking if database is connected
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected!!!")
    }
})

//get details of all doctors
app.get("/doctors", (request, response) => {
    connection.query("select * from Doctor", function (err, result, fields) {
        if (err) {
            response.json({ message: "Cannot get List of doctors" })
        }
        else {
            response.json({ data: result })
            console.log(JSON.stringify(result))
        }
    })
})


//get details doctor by id
app.get("/doctors/:id", (request, response) => {
    const id = request.params.id
    console.log(id)
    connection.query(`select * from Doctor where Id = ?`, [id], (error, result) => {
        if (error) {
            throw error
            response.json({ message: "error in creating new Doctor" })
        }
        console.log(result)
        response.json({ data: result })
    })
});


//add new doctor with all details
app.post("/doctors", (request, response) => {
    const Id = uuid.v4()
    const doctorDb = { Id, ...request.body }

    const { First_name, Last_name, Email, Contact_Number, Qualification, Specialization, Profile_Picture } = { ...request.body }
    console.log(request.body)

    connection.query('insert into Doctor values(?,?,?,?,?,?,?,?)', [Id, First_name, Last_name, Email, Contact_Number, Qualification, Specialization, Profile_Picture],
        (err, res) => {
            if (err) {
                throw err
                response.json({ message: "error in creating new Doctor" })
            }
            console.log(res)
            response.json({ data: doctorDb, message: "New doctor has been created" })

        })
})



//delete doctor by id
app.delete("/doctors/:id", (request, response) => {
    const Id = request.params.id

    connection.query('delete from Doctor where Id = ?', [Id], (error, result) => {
        if (error) throw error
        console.log(result)
        response.json({ data: `Doctor with Id ${Id} has been deleted` })
    })

})

app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("listening on port 3000")
    }
})