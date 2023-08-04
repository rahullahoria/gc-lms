import React, { useState, useRef, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../shared/context/auth-context';
import { Divider, Grid, IconButton, Stack } from "@mui/material";


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

export default function Quiz() {
  const [loadedQuiz, setLoadedQuiz] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [updatingResponse, setUpdatingResponse] = useState(false);

  const [questionResponses, setQuestionResponses] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const navigate = useNavigate();


  

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const quizId = useParams().id;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(`api/quiz/${quizId}`);
        
        setQuestionResponses(new Array(responseData.questions.length).fill(0));
        setLoadedQuiz(responseData);
        setMinutes(responseData.duration-1);

        console.log("LoadedQuiz",responseData);
      } catch (err) {}
    };
    fetchQuiz();
  }, [sendRequest, quizId]);

  useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                   submitQuestionResponse()
                    clearInterval(myInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)

        return ()=> {
            clearInterval(myInterval);
          };
    });

  const handleChange = (event) => {
    setUpdatingResponse(true);
    // setSelectedValue(event.target.value);
    console.log(event.target.value,questionResponses,questionIndex,loadedQuiz.questions[questionIndex]);
    let qIndex = loadedQuiz.questions[questionIndex].qIndex;
    console.log(qIndex)
    questionResponses[qIndex] = event.target.value;
    // event.target.value = null;
    setQuestionResponses(questionResponses);
    // setQuestionIndex(questionIndex+1);
    setTimeout(()=>{setUpdatingResponse(false);},1)
    

  };

  const submitQuestionResponse = async () =>{
    try {
      const responseData = await sendRequest(
        'api/result',
        'POST',
        JSON.stringify({
          quizId,
          questionResponses
        })
        
      );
      console.log("LoadedQuiz",responseData);
      navigate(`/report/${responseData._id}`)
    } catch (err) {}
  }

  const getOptionsArray =  () => {
    return ['a','b','c','d'].sort( () => Math.random() - 0.5);
  }

  
    const [ minutes, setMinutes ] = useState(60);
    const [seconds, setSeconds ] =  useState(0);
   

  return (
    <>
      {!isLoading && loadedQuiz && (
        <>
        <Stack spacing={50} justifyContent="space-between" direction="row" >
          <Typography variant="h6" component="h2">
            {loadedQuiz.name} ({questionIndex+1}/{loadedQuiz.questions.length})
          </Typography>

          <Typography variant="h6" component="h2">
             { minutes === 0 && seconds === 0
            ? null
            : <> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</> 
        }
          </Typography>

          </Stack>
          <Grid container spacing={2}>
          <Grid item xs={8}>
          <Card sx={{ maxWidth: 800, margin: "auto", marginTop: "25px" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {questionIndex+1}. {loadedQuiz.questions[questionIndex].Question}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                { !updatingResponse && (<FormControl>
                  <RadioGroup
                    // aria-labelledby={"lable-question-option-"+questionIndex}
                    // name={"question-option-"+questionIndex}
                    // id={"question-option-"+questionIndex}
                    // defaultValue={questionResponses[questionIndex]||false}
                    value={questionResponses[loadedQuiz.questions[questionIndex].qIndex]|| false}
                    onChange={handleChange}
                  >
                    {/* {getOptionsArray().map(value => (<FormControlLabel
                      value={value}
                      control={<Radio />}
                      label={loadedQuiz.questions[questionIndex][value]}
                    />))} */}

{loadedQuiz.questions[questionIndex].optionsOrder.map(value => (<FormControlLabel
                      value={value}
                      control={<Radio />}
                      label={loadedQuiz.questions[questionIndex][value]}
                    />))}
                    
                    
                  </RadioGroup>
                </FormControl>) }
              </Typography>
            </CardContent>
            <CardContent>
            <Stack spacing={50} justifyContent="space-between" direction="row" >
              { questionIndex > 0 && <Button size="small" onClick={()=>{setQuestionIndex(questionIndex-1)}} >Previous</Button>}
              { questionIndex < (loadedQuiz.questions.length -1 ) && <Button size="small" onClick={()=>{setQuestionIndex(questionIndex+1)}}>Next</Button>}
              { questionIndex == (loadedQuiz.questions.length - 1) && <Button size="small" onClick={handleOpen}>
                Submit
              </Button> }
              </Stack>
            </CardContent>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Are you sure you want to Submit the quiz?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  You can not Change your answers after this.
                </Typography>
                <Button onClick={submitQuestionResponse}>Yes</Button>
                <Button onClick={handleClose} >No</Button>
              </Box>
            </Modal>
          </Card>
          </Grid>

          <Grid item xs={4}>
          <Card sx={{ maxWidth: 800, margin: "auto", marginTop: "25px" }}>
            <CardContent>
            <Stack useFlexGap flexWrap="wrap" justifyContent="space-around" alignItems="center" spacing={3} direction="row" >
            {questionResponses.map((res, index) => (<IconButton style={{width: "30px"}} size="small" disabled={index==questionIndex} onClick={()=>{setQuestionIndex(index)}} color={res?"primary":"error"} >{index+1}</IconButton>))}
          
            </Stack>
            <Stack spacing={2} lexWrap="wrap">
            <Divider flexItem />
            
            <Button variant="outlined" size="large" onClick={handleOpen}>
                Submit
              </Button>
              </Stack>
            </CardContent>
          </Card>
          </Grid>
          </Grid>

        </>
      )}
    </>
  );
}
