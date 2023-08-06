import React, { useState, useRef, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PieChart } from "@mui/x-charts/PieChart";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [createData(65, 60, 25, 35, 5)];

export default function Report() {
  const [loadedResult, setLoadedResult] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const reportId = useParams().id;

  const goToHomeHandler = () => {
    navigate("/");
  }

  const goToHelpHandler = () => { 
    const URL = `https://wa.me/918882307448?text=${encodeURI("Hi, How can you help me?\n\nHere is my quiz report\n"+window.location.href)}`;
    window.open(URL, '_blank').focus();
  }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(`result/${reportId}`);
        setLoadedResult(responseData);

        console.log("setLoadedResult", responseData);
      } catch (err) {}
    };
    fetchQuiz();
  }, [sendRequest, reportId]);

  const getTopicCard = (key, topic) => {
    return (
      <Card sx={{ maxWidth: 800, margin: "auto", marginTop: "30px" }}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={8} xs={12}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: topic.correct,
                        color: "#228b22",
                        label: "Correct",
                      },
                      {
                        id: 1,
                        value: topic.incorrect,
                        color: "#ff5733",
                        label: "Incorrect",
                      },
                      {
                        id: 2,
                        value: topic.nonAttempted,
                        color: "#EFFD5F",
                        label: "Not-Attempt",
                      },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </Grid>
            <Grid item md={4} xs={12} >
              <Typography  variant="h5" component="div">
                {getUserLevel(topic)} in {key}
              </Typography>
            <Divider flexItem />

              <Typography variant="body2" component="div">
                Correct: {topic.correct}
              </Typography>
              <Typography variant="body2" component="div">
                Incorrect: {topic.incorrect}
              </Typography>
              <Typography variant="body2" component="div">
                Not-Attempt: {topic.nonAttempted}
              </Typography>
           

              <Button style={{marginTop:"30px"}} onClick={goToHelpHandler} variant="contained" endIcon={<WhatsAppIcon />}>
                Need Help to Improve
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const getUserLevel = (topic) => {
    let level = null;
    if (
      topic.correct / (topic.correct + topic.incorrect + topic.nonAttempted) >
      0.7
    ) {
      level = <span style={{ color: "green" }}>Awesome</span>;
    } else if (
      topic.correct / (topic.correct + topic.incorrect + topic.nonAttempted) >
      0.5
    ) {
      level = <span style={{ color: "yellow" }}>Average</span>;
    } else {
      level = <span style={{ color: "red" }}>Poor</span>;
    }
    return level;
  };

  return (
    <>
    <IconButton variant='contained' onClick={goToHomeHandler} 
   sx={{ position: "fixed", top: 200, left: 0, zIndex: 2000 }}> <HomeOutlinedIcon /> Home</IconButton>
   <IconButton variant='contained' onClick={goToHelpHandler} 
   sx={{ position: "fixed", top: 230, left: 0, zIndex: 2000 }}> <WhatsAppIcon /> Help</IconButton>
      {!isLoading && loadedResult && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Total Question</StyledTableCell>
                <StyledTableCell align="right">Attempt</StyledTableCell>
                <StyledTableCell align="right">Correct</StyledTableCell>
                <StyledTableCell align="right">Incorrect</StyledTableCell>
                <StyledTableCell align="right">Un-attempt</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell align="right">
                  {loadedResult.score.correct +
                    loadedResult.score.incorrect +
                    loadedResult.score.nonAttempted}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {loadedResult.score.correct + loadedResult.score.incorrect}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {loadedResult.score.correct}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {loadedResult.score.incorrect}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {loadedResult.score.nonAttempted}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isLoading &&
        loadedResult &&
        Object.keys(loadedResult.topicScore).map((key) =>
          getTopicCard(key, loadedResult.topicScore[key])
        )}
    </>
  );
}
