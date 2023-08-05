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

  //password_error_text

  const [passwordError, setPasswordError] = useState("");


  const mobEmailRef = useRef("");
  const passwordRef = useRef("");

  const changeValue = (e, fieldName) => {
      if(fieldName === "password"){
        if(e.target.value.length >= 5){
          setPasswordErrorText("");
        }
        else {
          setPasswordErrorText("Password should be at least 6 characters");
        }
      }
  }

  const loginSubmitHandler = async () => {
    console.log(mobEmailRef.current.value, passwordRef.current.value);
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
              />
              <TextField
                id="passsword"
                label="Password"
                variant="outlined"
                type="password"
                
                error={passwordErrorText}
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
