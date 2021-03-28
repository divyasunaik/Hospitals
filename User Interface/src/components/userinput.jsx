import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Joi from "joi-browser";

function UserInput({ history }) {
  const apiEndpoint = "/api/illnessNames";
  const [userDetails, setUserDetails] = useState({
    username: "",
    dob: "",
    gender: "",
    illness: "",
    lop: 0,
  });
  const [illnessesData, setillnessesData] = useState({
    illnesses: [],
    levelOfPain: [],
    gender: [""],
  });

  const [errors, setErrors] = useState({});

  const schema = {
    username: Joi.string().required().label("Full Name"),
    dob: Joi.required().label("Date of birth"),
    gender: Joi.string().required(),
    illness: Joi.required(),
    lop: Joi.required(),
  };

  useEffect(() => {
    async function fetchillnessNames() {
      const response = await fetch(apiEndpoint);
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);

      let illnesses_new = body.illnessNames;
      setillnessesData((prevValue) => {
        return {
          ...prevValue,
          // eslint-disable-next-line
          ["illnesses"]: illnesses_new,
          // eslint-disable-next-line
          ["levelOfPain"]: [0, 1, 2, 3, 4],
          // eslint-disable-next-line
          ["gender"]: ["Female", "Male", "Not like to disclose"],
        };
      });
    }
    fetchillnessNames();
  }, []);

  const validate = () => {
    const result = Joi.validate(userDetails, schema, { abortEarly: false });

    if (!result.error) return null;

    const errors = {};

    for (let item of result.error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tempErrors = validate();
    //console.log(errors);
    setErrors((prevValue) => {
      if (tempErrors)
        return {
          ...prevValue,
          // eslint-disable-next-line
          ["username"]: tempErrors.username,
          // eslint-disable-next-line
          ["dob"]: tempErrors.dob,
          // eslint-disable-next-line
          ["gender"]: tempErrors.dob,
          // eslint-disable-next-line
          ["illness"]: tempErrors.dob,
          // eslint-disable-next-line
          ["lop"]: tempErrors.dob,
        };
      else return {};
    });

    if (tempErrors) return;

    history.push("/hospitals");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(userDetails),
    };

    fetch(apiEndpoint, requestOptions)
      .then((response) => response.text())
      .then((text) => console.log(text));
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, subSchema);
    return error ? error.details[0].message : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const errorMsg = validateProperty(e.target);
    if (errorMsg)
      setErrors((prevValue) => {
        return {
          ...prevValue,
          [name]: errorMsg,
        };
      });

    setUserDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-4">
          <label htmlFor="username">Full Name</label>
          <input
            name="username"
            value={userDetails.username}
            onChange={handleChange}
            id="fullname"
            type="text"
            className="form-control"
            placeholder="Enter first , last name"
          />
          {errors.username && (
            <div className="alert alert-danger">{errors.username}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            name="dob"
            value={userDetails.dob}
            onChange={handleChange}
            id="dob"
            type="text"
            className="form-control"
            placeholder="DD-MM-YYYY"
          />
          {errors.dob && <div className="alert alert-danger">{errors.dob}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            className="form-control"
            onChange={handleChange}
          >
            <option value="">Select One</option>
            {illnessesData.gender.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="illness">Select an Illness</label>
          <select
            name="illness"
            className="form-control"
            onChange={handleChange}
          >
            <option value="">Select one</option>
            {illnessesData.illnesses.map((i) => (
              <option key={i.id} value={i.name}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lop">Select level of Pain</label>
          <select name="lop" className="form-control" onChange={handleChange}>
            <option value="">Select one</option>
            {illnessesData.levelOfPain.map((lop) => (
              <option key={lop} value={lop}>
                {lop}
              </option>
            ))}
          </select>
        </div>

        <button disabled={validate()} type="Submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default withRouter(UserInput);
