const express = require("express");
const mongoose = require("mongoose");
const http = require("http");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin-divya:test321@cluster0.ktlsf.mongodb.net/patientinfoDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const patientInfoSchema = new mongoose.Schema({
  fullname: String,
  dob: String,
  gender: String,
  illness: String,
  levelOfPain: String,
});
const PatientInfo = mongoose.model("PatientInfo", patientInfoSchema);

let userDetails = {
  username: "",
  dob: "",
  gender: "",
  illness: "",
  levelOfPain: "",
};

const port = process.env.PORT || 5000;

app.get("/api/illnessNames", (req, res) => {
  const illness_url =
    "http://dmmw-api.australiaeast.cloudapp.azure.com:8080/illnesses";

  http
    .get(illness_url, function (response) {
      let data = "";
      // console.log("StatusCode (Illness) = ", response.statusCode);

      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        const illnessList = JSON.parse(data)._embedded.illnesses;
        //console.log("ILLNESS LIST", hospitalList);
        const illnessNames = illnessList.map((element) => element.illness);
        // console.log("ILLNESS NAMES ", illnessNames);
        res.json({ illnessNames });
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });
});

app.get("/api/hospitals", (req, res) => {
  const hospital_url =
    "http://dmmw-api.australiaeast.cloudapp.azure.com:8080/hospitals";

  http.get(hospital_url, function (response) {
    let data = "";
    // console.log("StatusCode (Hospitals) = ", response.statusCode);

    response.on("data", (chunk) => {
      data += chunk;
    });
    response
      .on("end", () => {
        const hospitalData = JSON.parse(data)._embedded.hospitals;

        const hospitalList = hospitalData.map((hospital) => {
          const new_w = hospital.waitingList.filter((w) => {
            if (w.levelOfPain == userDetails.levelOfPain) {
              const averageWaitTime = w.patientCount * w.averageProcessTime;
              //const newList = { ...w, averageWaitTime: averageWaitTime };
              w.averageWaitTime = averageWaitTime;
              return w;
            }
          });

          hospital.waitingList = new_w;
          return hospital;
        });

        const new_hospitalList = hospitalList.sort((hospital1, hospital2) => {
          return hospital1.waitingList[0].averageWaitTime <
            hospital2.waitingList[0].averageWaitTime
            ? -1
            : 1;
        });

        res.json({ new_hospitalList });
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
      });
  });
});

app.post("/api/illnessNames", (req, res) => {
  const data = req.body;
  //console.log("the body is ", req.body.username);
  userDetails.username = data.username;
  userDetails.dob = data.dob;
  userDetails.gender = data.gender;
  userDetails.illness = data.illness;
  userDetails.levelOfPain = data.lop;

  //SAVE to database
  const patientToAdd = new PatientInfo({
    fullname: data.username,
    dob: data.dob,
    gender: data.gender,
    illness: data.illness,
    levelOfPain: data.lop,
  });
  patientToAdd.save();

  res.json(`I received your POST request successfully`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
