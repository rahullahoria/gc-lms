import React, { useState, useRef, useContext } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import { Stack } from "@mui/material";

export default function Signup(props) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const mobileRef = useRef("");
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);

  const changeValue = (e, fieldName) => {
    if (fieldName === "password") {
      if (e.target.value.length >= 5) {
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    } else if (fieldName === "email") {
      if (validateEmail(e.target.value)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    } else if (fieldName === "name") {
      if (e.target.value.length >= 3) {
        setNameError(false);
      } else {
        setNameError(true);
      }
    } else if (fieldName === "mobile") {
      if (e.target.value.length >= 10 && isNumeric(e.target.value)) {
        setMobileError(false);
      } else {
        setMobileError(true);
      }
    }
  };

  const isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const signupSubmitHandler = async () => {
    console.log(emailRef.current.value, passwordRef.current.value);
    if(nameError || emailError || passwordError || mobileError) return;
    if(!nameRef.current.value || !emailRef.current.value || !mobileRef.current.value || !passwordRef.current.value) return;
    try {
      const responseData = await sendRequest(
        "users/signup",
        "POST",
        JSON.stringify({
          name: nameRef.current.value,
          email: emailRef.current.value,
          mobile: mobileRef.current.value,
          password: passwordRef.current.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(responseData);
    } catch (err) {}

    // auth.login("userId", "token");
  };

  return (
    <Card sx={{ maxWidth: 400, width: 400, margin: "auto" }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://mott-img.b-cdn.net/q100-efalse-ptrue-fauto-w500/https://greencodr.com/assets/img/gallery/programming.jpeg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Signup
        </Typography>

        <Stack spacing={2}>
          <TextField
            inputRef={nameRef}
            id="Name"
            label="Name"
            variant="outlined"
            style={{ width: "100%" }}
            helperText={nameError ? "Provide Valid Name" : ""}
            error={nameError}
            onChange={(e) => changeValue(e, "name")}
          />
          
          <TextField
            inputRef={mobileRef}
            id="Mobile"
            label="Mobile"
            type="tel"
            variant="outlined"
            style={{ width: "100%" }}
            helperText={mobileError ? "Provide Valid Mobile" : ""}
            error={mobileError}
            onChange={(e) => changeValue(e, "mobile")}
          />
          <TextField
            inputRef={emailRef}
            id="Email"
            label="Email"
            type="email"
            variant="outlined"
            style={{ width: "100%" }}
            helperText={emailError ? "Provide Valid Email" : ""}
            error={emailError}
            onChange={(e) => changeValue(e, "email")}
          />
          <TextField
            inputRef={passwordRef}
            id="passsword"
            label="Password"
            variant="outlined"
            type="password"
            style={{ width: "100%" }}
            helperText={passwordError ? "Password should be of 6 Char" : ""}
            error={passwordError}
            onChange={(e) => changeValue(e, "password")}
          />
        </Stack>
      </CardContent>
      <CardContent>
        <Stack spacing={2} lexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={signupSubmitHandler}
          >
            Signup
          </Button>
          <span style={{ width: "100%", color: "gray", textAlign: "center" }}>
            or
          </span>

          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              console.log("onClick");
              props.onClick();
            }}
          >
            Login
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
