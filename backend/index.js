const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 8080;

//for random id generator
const crypto = require("crypto");

//fetches the data from JSON file in the directory
const fs = require("fs");
const { request } = require("http");
const db = fs.readFileSync(__dirname + "/" + "patient-api.json");
const patients = JSON.parse(db);

//get request to fetch list of patients
app.get("/", (req, res) => {
  res.send(
    "This is the HomePage. Add '/patients' in the URl to get a list of patients"
  );
});

//to get a list of all patients
app.get("/patients", async (req, res) => {
  console.log(typeof patients);
  res.json({ data: patients });
});

//to add a patient to the list of patients
app.put("/patients", async (req, res) => {
  console.log("receiving");
  console.log(req.body);
  var id = crypto.randomBytes(16).toString("hex")
  const newPatient = { ...req.body, id };
  patients.push(newPatient)
  const newPatientsList = JSON.stringify(patients)

  fs.writeFile(__dirname + "/" + "patient-api.json", newPatientsList, err=>{
    if(err) throw err;
    console.log("New data added");
  })

  // const id = crypto.randomBytes(16).toString("hex");
  // console.log(typeof id);

  res.json({ body: patients });
});

//to fetch details of a single patient by id
app.get("/patient/:id", (req, res) => {
  const patient = patients.find((obj) => obj.id === req.params.id);
  console.log(patient);
  res.json({ data: patient });
});

//to add new fields or update fields in a patient by id
app.post("/patient/:id", (req, res) => {
  console.log(typeof req.body)
  const newPatients = patients.map(patient => {
    return (patient.id===req.params.id) ? {...patient, ...req.body} : patient
  })

  fs.writeFile(__dirname + "/" + "patient-api.json", JSON.stringify(newPatients), err=>{
    if(err) throw err;
    console.log("object has been updated");
  })

  res.json({data: newPatients, message:`patient with id ${req.params.id} has been updated`})
})


//to delete a patient by its id
app.delete("/patient/:id", (req, res) => {
  const newPatients = patients.filter(
    (patient) => patient.id !== req.params.id
  );
  console.log(newPatients);

  fs.writeFile(__dirname + "/" + "patient-api.json", JSON.stringify(newPatients), err=>{
    if(err) throw err;
    console.log("object has been deleted");
  })

  res.json({
    newPatients,
    message: `The patient with ID - ${req.params.id} has been deleted`,
  });
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
