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

//below route is to get a list of all patients
app.get("/patients", async (req, res) => {
  console.log(typeof patients);
  res.json({ data: patients });
});

//below request adds a patient to the list of patients
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

//below route fetches details of a single patient by id
app.get("/patient/:id", (req, res) => {
  const patient = patients.find((obj) => obj.id === req.params.id);
  console.log(patient);
  res.json({ data: patient });
});

app.delete("/patient/:id", (req, res) => {
  const newPatients = patients.filter(
    (patient) => patient.id !== req.params.id
  );
  console.log(newPatients);
  res.json({
    oldData: patients,
    newData: newPatients,
    message: `The patient with ID - ${req.params.id} has been deleted`,
  });
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
