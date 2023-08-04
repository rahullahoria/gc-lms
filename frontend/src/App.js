import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/layout";

import Auth from "./screens/Auth/Auth";
import Quiz from "./screens/Quiz/Quiz";
import Report from "./screens/Report/Report";
import Dashboard from "./screens/Dashboard/Dashboard";
import QuizManager from "./screens/Quiz/QuizManager";


import Container from "@mui/material/Container";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from './shared/hooks/auth-hook';
import Doubt from "./screens/Doubt/Doubt";


function App() {
  const { token, login, logout, userId, email, mobile } = useAuth();

  const getRoutes = () => {
    if (token) {
      return (
        <Route path="/" element={<Layout />}>
          
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/doubt" element={<Doubt />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/quiz-manager" element={<QuizManager />} />
        </Route>
      );
    } else {
      return (<><Route path="*" element={<Auth />} /></>);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        email: email,
        mobile: mobile
      }}
    >
      <div style={{backgroundColor: "#f4f4f4"}}>
    <Container style={{backgroundColor: "#f4f4f4"}} maxWidth="xl">
      <BrowserRouter>
        <Routes>
          {getRoutes()}
        </Routes>
      </BrowserRouter>
    </Container>
    </div>
    </AuthContext.Provider>
  );
}

export default App;
