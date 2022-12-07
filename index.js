const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

const bodyParser = require("body-parser");
app.use(bodyParser.json())

require('dotenv').config();

// const uuid = require("uuid")

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

//default route
app.get("/", (request, response) => {
    response.send("/doctors for list of Doctors")
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
    //console.log(id)
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
    //const id = uuid.v4()
    const id = Math.floor(Math.random() * 999999)
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const modifiedAt = createdAt
    const doctorDb = { id, createdAt, modifiedAt, ...request.body }
    

    const { firstName, lastName, email, contactNumber, qualification, profession, profilePicture, cases } = { ...request.body }
    // console.log(request.body)
    // console.log(doctorDb)

    connection.query('insert into Doctor values(?,?,?,?,?,?,?,?,?,?,?)', [id, createdAt, modifiedAt,email, firstName, lastName, contactNumber, profession, qualification,cases, profilePicture],
        (error, result) => {
            if (error) {
                throw error
                response.json({ message: "error in creating new Doctor" })
            }
            //console.log(result)
            response.json({ data: doctorDb, message: "New doctor has been created" })

        })
   //response.json({message: "received"})
})


//update info of existing doctor by id
app.put("/doctors/:id", async (request,response)=>{
    const id = request.params.id

    const modifiedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    connection.query('select * from Doctor where Id = ?', [id], (error, result) => {
        if (error) {
            throw error
            response.json({message: "There was an error in fetching data from database"})
        }
        let doctorData = {...result[0], ...request.body}
        console.log(doctorData)
        const { firstName, lastName, email, contactNumber, qualification, profession, profilePicture, cases, createdAt } = { ...doctorData }

        connection.query(`update Doctor set firstName = ?, lastName = ?, email = ?, contactNumber = ?, qualification = ?, profession = ?, profilePicture = ?, cases=?, createdAt=?, modifiedAt=? where Id=?`,
        [firstName, lastName, email, contactNumber, qualification, profession, profilePicture, cases, createdAt, modifiedAt, id], (error2, result2) => {
            if (error2){
                throw error2
                response.json({message: "there was an error in updating the data"})
            }
            response.json({data: doctorData, message: "Details have been updated"})
        })      
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

app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("listening on port 3000")
    }
})