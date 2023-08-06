import React, { useState, useRef, useContext } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { Stack } from "@mui/material";

export default function Login(props) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const mobEmailRef = useRef("");
  const passwordRef = useRef("");

  //password_error_text

  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const changeValue = (e, fieldName) => {
      if(fieldName === "password"){
        if(e.target.value.length >= 5){
          setPasswordError(false);
        }
        else {
          setPasswordError(true);
        }
      }
      else if (fieldName === "email"){
        if(validateEmail(e.target.value)){
          setEmailError(false);
        }
        else {
          setEmailError(true);
        }
      }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const loginSubmitHandler = async () => {
    console.log(mobEmailRef.current.value, passwordRef.current.value);
    if(emailError || passwordError ) return;
    if(!mobEmailRef.current.value || !passwordRef.current.value) return;
    try {
      const responseData = await sendRequest(
        "users/login",
        "POST",
        JSON.stringify({
          email: mobEmailRef.current.value,
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
    <>
      <Card sx={{ maxWidth: 400, width: 400, margin: "auto" }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://mott-img.b-cdn.net/q100-efalse-ptrue-fauto-w500/https://greencodr.com/assets/img/gallery/programming.jpeg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Login
          </Typography>
         
            <Stack spacing={2}>
              <TextField
                id="mob-email"
                label="Email"
                inputRef={mobEmailRef}
                variant="outlined"
                style={{ width: "100%" }}

                helperText={emailError?"Provide Valid Email Id":""}
                error={emailError}
                onChange={e => changeValue(e, 'email')}
              />
              <TextField
                id="passsword"
                label="Password"
                variant="outlined"
                type="password"

                helperText={passwordError?"Passsword Should be of 6 characters":""}
                error={passwordError}
                onChange={e => changeValue(e, 'password')}

                style={{ width: "100%" }}
                inputRef={passwordRef}
              />
            </Stack>
     
        </CardContent>
        <CardContent>
          <Stack spacing={2} >
            <Button
              variant="contained"
              size="large"
              onClick={loginSubmitHandler}
            >
              Login
            </Button>
            <span style={{ width: "100%", color: "gray",textAlign:"center"}}>or</span>
            <Button variant="outlined" size="large" onClick={props.onClick}>
              Signup
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
