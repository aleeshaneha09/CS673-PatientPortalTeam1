const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 3000;

//for random id generator
const crypto = require("crypto");

//fetches the data from JSON file in the directory
const fs = require("fs");
const { request } = require("http");
// const db = fs.readFileSync(__dirname + "/" + "patient-api.json");
// const patients = JSON.parse(db);

//fetches the doctor api data
const doctorDB = fs.readFileSync(__dirname + "/" + "doctor-api.json");
const doctors = JSON.parse(doctorDB);

//get request to fetch list of doctors
app.get("/", (req, res) => {
  res.send(
    "This is the HomePage. Add '/doctors' in the URl to get a list of patients"
  );
});

//get request to fetch patient details
app.get("/patient", (req, res) => {
  console.log(res);
});

//to get a list of all patients
app.get("/doctors", async (req, res) => {
  console.log(typeof doctors);
  res.json({ data: doctors });
});

//to add a patient to the list of doctors
app.put("/doctors", async (req, res) => {
  console.log("receiving");
  console.log(req.body);
  var id = crypto.randomBytes(16).toString("hex");
  const newDoctor = { ...req.body, id };
  doctors.push(newDoctor);
  const newDoctosList = JSON.stringify(doctors);

  fs.writeFile(__dirname + "/" + "doctor-api.json", newDoctosList, (err) => {
    if (err) throw err;
    console.log("New data added");
  });

  // const id = crypto.randomBytes(16).toString("hex");
  // console.log(typeof id);

  res.json({ body: doctors });
});

//to fetch details of a single doctor by id
app.get("/doctor/:id", (req, res) => {
  const doctor = doctors.find((obj) => obj.id === req.params.id);
  console.log(doctor);
  res.json({ data: doctor });
});

//to add new fields or update fields in a doctor by id
app.post("/doctor/:id", (req, res) => {
  console.log(typeof req.body);
  const newDoctors = doctors.map((doctor) => {
    return doctor.id === req.params.id ? { ...doctor, ...req.body } : doctor;
  });

  fs.writeFile(
    __dirname + "/" + "doctor-api.json",
    JSON.stringify(newDoctors),
    (err) => {
      if (err) throw err;
      console.log("Doctor object has been updated");
    }
  );

  res.json({
    data: newDoctors,
    message: `Doctor with id ${req.params.id} has been updated`,
  });
});

//to get a doctor's availability by its id
app.get("/doctor/:id/availability", (req, res) => {
  const doctor = doctors.find((obj) => obj.id === req.params.id);
  const availability = doctor.availability;
  console.log(doctor);
  console.log(availability);
  if (availability === "undefined") {
    res.status(404).json({
      message:
        "The schedule for the requested doctor is not available right now",
    });
  }
  res.json({ availability });
});

//to delete a doctor by its id
app.delete("/doctor/:id", (req, res) => {
  const newDoctors = doctors.filter((doctor) => doctor.id !== req.params.id);
  console.log(newDoctors);

  fs.writeFile(
    __dirname + "/" + "doctor-api.json",
    JSON.stringify(newDoctors),
    (err) => {
      if (err) throw err;
      console.log("Doctor object has been deleted");
    }
  );

  res.json({
    newDoctors,
    message: `The doctor with ID - ${req.params.id} has been deleted`,
  });
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
