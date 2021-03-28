import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "./navbar";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Hospitals() {
  const [hospitalDetails, setHospitalDetails] = useState([
    {
      id: "",
      name: "",
      waitingList: [
        {
          patientCount: 0,
          levelOfPain: 0,
          averageProcessTime: 0,
          averageWaitTime: 0,
        },
      ],
      location: {
        lat: 0.0,
        lng: 0.0,
      },
    },
  ]);

  const apiEndpoint = "/api/hospitals";
  //let hospitalDetails = useRef([]);
  // const [hospitalDetails, setHospitalDetails] = useState([]);
  useEffect(() => {
    async function fetchHospitals() {
      // console.log("hospital before", hospitalDetails);
      const response = await fetch(apiEndpoint);
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);

      const new_hospitalDetails = body.new_hospitalList;
      setHospitalDetails(new_hospitalDetails);

      //console.log("UPDATED hospital details", hospitalDetails);
      // console.log("UPDATED hospital details [0]", hospitalDetails[0].name);
    }
    fetchHospitals();
  }, [hospitalDetails]);

  //console.log("UPDATED hospital details", hospitalDetails);
  //console.log("UPDATED hospital details [0]", hospitalDetails[0].name);

  return (
    <div className="center">
      <div>
        <Navbar title="SUGGESTED HOSPITALS" />
      </div>
      <Link to="/" className="my-3 btn btn-light">
        Back
      </Link>
      <div>
        <div className="my-3">
          {hospitalDetails.map((h) => (
            <div
              key={h.id}
              className="card bg-light mb-3"
              style={{ maxWidth: 900 }}
            >
              <div className="card-header">
                <strong>{h.name}</strong>
              </div>
              <div className="card-body">
                {h.waitingList.map((w) => (
                  <Row key={w.levelOfPain}>
                    <Col>
                      <p className="card-text">
                        Patients waiting: {w.patientCount}
                      </p>
                    </Col>
                    <Col>
                      <p className="card-text">
                        Average processing time: {w.averageProcessTime} mins
                      </p>
                    </Col>
                    <Col>
                      <p className="card-text">
                        Average wait time:{" "}
                        <strong>{w.averageWaitTime} mins</strong>{" "}
                      </p>
                    </Col>
                  </Row>
                ))}
                <p></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Hospitals);
