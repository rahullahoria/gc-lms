import React, { useState, useRef, useContext, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import { AuthContext } from "../../shared/context/auth-context";
import {
  Box,
  ButtonGroup,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Stack,
} from "@mui/material";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Dashboard(props) {
  const [loadedQuiz, setLoadedQuiz] = useState([]);
  const [activeButton, setActiveButton] = useState("quiz");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const responseData = await sendRequest(
        `quiz?email=${auth.email}&mobile=${auth.mobile}`
      );
      setLoadedQuiz(responseData);
    } catch (err) {}
  };

  useEffect(() => {
    console.log("auth", auth);

    fetchQuiz();
  }, [sendRequest, auth]);

  const topicScoreToString = (topics) => {
    let str = "";
    Object.keys(topics).forEach((key) => {
      str += `${key}: ${topics[key].correct}/${topics[key].incorrect}/${topics[key].nonAttempted}, `;
    });
    return str;
  };
  const fetchResults = async () => {
    try {
      setLoadedQuiz([]);
      const responseData = await sendRequest(`result`);
      let resultRows = [];
      for (let i = 0; i < responseData.length; i++) {
        resultRows.push({
          ...responseData[i],
          score: `${responseData[i].score.correct}/${responseData[i].score.incorrect}/${responseData[i].score.nonAttempted}`,
          topicScore: topicScoreToString(responseData[i].topicScore),
        });
      }
      setLoadedQuiz(resultRows);
    } catch (err) {}
  };

  const getQuizCard = (quiz) => {
    return (
      <Card sx={{ maxWidth: 300, width: 300, margin: "auto" }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://mott-img.b-cdn.net/q100-efalse-ptrue-fauto-w500/https://greencodr.com/assets/img/gallery/programming.jpeg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {quiz.name}
          </Typography>

          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="body">
              Duration: {quiz.duration} mins
            </Typography>

            <Typography variant="body">
              Questoin: {quiz.noOfQuestions}
            </Typography>
          </Stack>
          <Divider flexItem />
          <Typography variant="body">Topics</Typography>
          {quiz.topics.map((topic) => (
            <Typography variant="body2" color="text.secondary">
              {topic}
            </Typography>
          ))}
        </CardContent>
        <CardActions textAlign="center">
          <Box textAlign="center">
            <Button variant="contained" size="large" onClick={handleOpen}>
              Start Quiz
            </Button>
          </Box>
        </CardActions>
      </Card>
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const startQuizConfirm = () => {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6">
            Instructions:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Don't Close/Change the Tab of Web Browser
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Don't Right Click on the Page
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            No Cheating Allowed:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Cheating in any form is strictly prohibited during the quiz. This
            includes using external resources, seeking help from others, or
            using unauthorized tools to find answers. If any form of cheating is
            detected, severe consequences will follow. Your account will be
            suspended, meaning you will lose access to the platform or the
            course associated with it. Additionally, you might be blacklisted,
            which could prevent you from using the service in the future.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                navigate(`/quiz/${loadedQuiz._id}`);
              }}
            >
              I Agree
            </Button>
            <Button onClick={handleClose}>No</Button>
          </Typography>
        </Box>
      </Modal>
    );
  };

  const buttonGroupHandler = (type) => {
    setActiveButton(type);
    if (type === "quiz") {
      fetchQuiz();
    } else if (type === "results") {
      fetchResults();
    }
  };

  const showResults = (results) => {
    return (
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <List component="nav" aria-label="secondary mailbox folder">
          {results.map((r, index) => (
            <>
              <ListItemButton
                onClick={(event) => {
                  navigate(`/report/${r._id}`);
                }}
              >
                <ListItemText
                  primary={
                    (r.quizName || "Result " + index) +
                    " | (" +
                    r.score +
                    ") | Correct/Incorrect/non attempted"
                  }
                  secondary={r.topicScore}
                />

                <ListItemIcon>
                  <ArrowForwardIosIcon />
                </ListItemIcon>
              </ListItemButton>
              <Divider flexItem />
            </>
          ))}
        </List>
      </Box>
    );
  };

  const buttons = [
    <Button
      variant={activeButton == "quiz" ? "contained" : "outlined"}
      onClick={() => buttonGroupHandler("quiz")}
      key="quiz"
    >
      Quiz
    </Button>,
    <Button
      variant={activeButton == "results" ? "contained" : "outlined"}
      onClick={() => buttonGroupHandler("results")}
      key="results"
    >
      Results
    </Button>,
  ];

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <ButtonGroup size="large" aria-label="large button group">
          {buttons}
        </ButtonGroup>
      </Box>

      {!isLoading &&
        activeButton == "quiz" &&
        loadedQuiz._id &&
        getQuizCard(loadedQuiz)}
      {!isLoading && activeButton == "results" && showResults(loadedQuiz)}

      {!loadedQuiz._id && activeButton == "quiz" && (
        <Typography gutterBottom variant="h5" component="div">
          No Quiz For You
        </Typography>
      )}
      {/* <Typography gutterBottom variant="h5" component="div">
            Your Courses
          </Typography>
      {!isLoading && loadedQuiz && getQuizCard(loadedQuiz)}

      <Typography gutterBottom variant="h5" component="div">
            New Courses
          </Typography>
      {!isLoading && loadedQuiz && getQuizCard(loadedQuiz)} */}

      {startQuizConfirm()}
    </Stack>
  );
}
