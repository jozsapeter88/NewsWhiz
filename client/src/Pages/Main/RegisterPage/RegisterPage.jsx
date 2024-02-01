import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../../../Components/Signup";

const Register = async (formData) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    return { status: response.status };
  } catch (error) {
    console.error("Error:", error);
    return { status: 500 };
  }
};

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

const RegistrationForm = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [successfulReg, setReg] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const regObj = {
      userName: e.target.formBasicUsername.value,
      email: e.target.formBasicEmail.value,
      password: e.target.formBasicPassword.value,
    };
    const auth = await Register(regObj);
    if (auth.status === 401) {
      setShowMsg(false);
      console.error("Username is already taken!");
    } else if (auth.status === 500) {
      console.error("Can't communicate with server!");
    } else if (auth.status === 200) {
      setShowMsg(true);
      setReg(true);
      console.log("Registration successful!");
      await timeout(1000);
      navigate("/");
    }
  };

  return (
    <Signup
      onSubmit={onSubmit}
      showMsg={showMsg}
      successfulReg={successfulReg}
    ></Signup>
  );
};

export default RegistrationForm;
