import React, { useEffect, useState }  from 'react';
import Button from '@mui/material/Button';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import { useAuth } from '../../shared/hooks/auth-hook';
import Box from "@mui/material/Box";




export default function Auth() {
  const { token, login, logout, userId } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleShowLoginForm = ()=>{
    setShowLoginForm(!showLoginForm)
  }

  return (
    <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  minHeight="100vh"
  
>
        { showLoginForm && <Login onClick={toggleShowLoginForm}/> }
        { !showLoginForm && <Signup onClick={toggleShowLoginForm}/> }
     
        </Box>
  );
}
