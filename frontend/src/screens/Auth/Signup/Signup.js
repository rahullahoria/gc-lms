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

  const signupSubmitHandler = async () => {
    console.log(emailRef.current.value, passwordRef.current.value);
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
          />
          <TextField
            inputRef={emailRef}
            id="Email"
            label="Email"
            variant="outlined"
            style={{ width: "100%" }}
          />
          <TextField
            inputRef={mobileRef}
            id="Mobile"
            label="Mobile"
            variant="outlined"
            style={{ width: "100%" }}
          />
          <TextField
            inputRef={passwordRef}
            id="passsword"
            label="Password"
            variant="outlined"
            type="password"
            style={{ width: "100%" }}
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
