const express = require("express");

const https = require("https");
const http = require("http");

const app = express();
const port = process.env.PORT || 5000;

const hospital_url =
  "http://dmmw-api.australiaeast.cloudapp.azure.com:8080/hospitals";

app.get("/api/illnessNames", (req, res) => {
  const illness_url =
    "http://dmmw-api.australiaeast.cloudapp.azure.com:8080/illnesses";

  http.get(illness_url, function (response) {
    console.log("StatusCode = ", response.statusCode);

    response.on("data", function (data) {
      const illnessData = JSON.parse(data);

      const illnessList = illnessData._embedded.illnesses; //console.log(illnessData._embedded.illnesses);

      const illnessNames = illnessList.map((element) => element.illness);

      //console.log("NAMES", illnessNames);
      res.send({ illnessNames });
    });
  });
});

/*
app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});*/

app.listen(port, () => console.log(`Listening on port ${port}`));
