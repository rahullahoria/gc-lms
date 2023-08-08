import React, { useState, useRef, useContext, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import Papa from "papaparse";
import { Stack } from "@mui/material";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import DeleteIcon from "@mui/icons-material/Delete";

import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import SummarizeIcon from '@mui/icons-material/Summarize';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const columns = [
  { id: "name", label: "Quiz Name", minWidth: 170 },
  { id: "duration", label: "Duration", minWidth: 70 },
  {
    id: "noOfQuestions",
    label: "Questions",
    minWidth: 70,
    align: "right",
  },
  {
    id: "topics",
    label: "Topics",
    minWidth: 200,
    align: "right",
  },

  {
    id: "actions",
    label: "Actions",
    minWidth: 70,
    align: "right",
  },
];

const resultColumns = [
  { id: "username", label: "User Name", minWidth: 100 },
  { id: "mobile", label: "Mobile", minWidth: 100 },
  { id: "quizName", label: "Quiz Name", minWidth: 100 },
  { id: "score", label: "Score", minWidth: 70 },
  { id: "topicScore", label: "Topic Score", minWidth: 70 },
  {
    id: "actions",
    label: "Actions",
    minWidth: 70,
    align: "right",
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

let rows = [];

let resultRows = [];

export default function QuizManager(props) {
  const navigate = useNavigate();

  const [loadedQuiz, setLoadedQuiz] = useState([]);
  const [results, setResults] = useState([]);

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const nameRef = useRef("");

  const durationRef = useRef("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchQuiz = async () => {
    try {
      rows = [];
      const responseData = await sendRequest(`quiz`);
      console.log(responseData);
      for (let i = 0; i < responseData.length; i++) {
        rows.push({
          ...responseData[i],
          topics: responseData[i].topics.join(", "),
        });
      }
      setLoadedQuiz(responseData);
    } catch (err) {}
  };

  const topicScoreToString = (topics) => {
    let str = "";
    Object.keys(topics).forEach((key) => {
      str += `${key}: ${topics[key].correct}/${topics[key].incorrect}/${topics[key].nonAttempted}, `;
    });
    return str;
  };

  const fetchResults = async () => {
    try {
      resultRows = [];
      const responseData = await sendRequest(`result/all`);
      console.log(responseData);
      for (let i = 0; i < responseData.length; i++) {
        resultRows.push({
          ...responseData[i],
          username: responseData[i].user.name,
          mobile: responseData[i].user.mobile,
          score: `${responseData[i].score.correct}/${responseData[i].score.incorrect}/${responseData[i].score.nonAttempted}`,
          topicScore: topicScoreToString(responseData[i].topicScore),
        });
      }

      console.log(resultRows);
      setResults(responseData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchQuiz();
    fetchResults();
  }, [sendRequest, auth]);

  const createQuizHandler = async () => {
    try {
      const responseData = await sendRequest(
        "quiz",
        "POST",
        JSON.stringify({
          name: nameRef.current.value,
          //   emails: emails,
          //   mobiles: mobiles,
          questions: questions,
          duration: durationRef.current.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      handleClose();
      fetchQuiz();
    } catch (err) {}
  };

  const UpdateQuizHandler = async (id) => {
    try {
      const responseData = await sendRequest(
        `quiz/${id}`,
        "PUT",
        JSON.stringify({
          status: "in-active",
        }),
        {
          "Content-Type": "application/json",
        }
      );
      fetchQuiz();
    } catch (err) {}
  };

  //   const emails = [];
  //   const mobiles = [];

  //   const userCSVHandler = (event) => {
  //     // Passing file data (event.target.files[0]) to parse using Papa.parse
  //     Papa.parse(event.target.files[0], {
  //       header: true,
  //       skipEmptyLines: true,
  //       complete: function (results) {
  //         console.log(results.data[0]);
  //         for (let i = 0; i < results.data.length; i++) {
  //           emails.push(results.data[i].Email || results.data[i].email);
  //           mobiles.push(
  //             (
  //               results.data[i].Mobile ||
  //               results.data[i].mobile ||
  //               results.data[i].phone_number
  //             )
  //               .replace(/\D/g, "")
  //               .slice(-10)
  //           );
  //         }
  //         console.log("emails", emails, mobiles);
  //       },
  //     });
  //   };

  let questions = [];
  const questionCSVHandler = (event) => {
    console.log("questionCSVHandler", event.target.files[0]);
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data);
        questions = results.data;
      },
    });
  };

  const addQuizCard = () => {
    return (
      <Card sx={{ maxWidth: 345, margin: "auto" }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://mott-img.b-cdn.net/q100-efalse-ptrue-fauto-w500/https://greencodr.com/assets/img/gallery/programming.jpeg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add New Quiz
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
              inputRef={durationRef}
              id="duration"
              label="duration"
              variant="outlined"
              style={{ width: "100%" }}
            />

            {/* <Button variant="outlined"  size="large" component="label">
          Select Users
          <input
            type="file"
            name="file"
            onChange={userCSVHandler}
            accept=".csv"
            hidden
            style={{ margin: "10px auto" }}
          />
        </Button> */}

            <Button variant="outlined" size="large" component="label">
              Select Questions
              <input
                type="file"
                name="file"
                onChange={questionCSVHandler}
                accept=".csv"
                hidden
                style={{ margin: "10px auto" }}
              />
            </Button>
          </Stack>
        </CardContent>
        <CardContent>
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={createQuizHandler}
            >
              Create Quiz
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Button size="small" onClick={handleOpen}>
          + Quiz
        </Button>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                            {column.id == "actions" && (
                              <DeleteIcon
                                color="danger"
                                onClick={() => {
                                  UpdateQuizHandler(row["_id"]);
                                }}
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Paper sx={{ width: "100%", marginTop: 5, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {resultColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {resultRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {resultColumns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                            {column.id == "actions" && (
                              <>
                                <SummarizeIcon
                                  color="danger"
                                  onClick={(event) => {
                                    navigate(`/report/${row["_id"]}`);
                                  }}
                                />
                                <WhatsAppIcon
                                  color="danger"
                                  onClick={(event) => {
                                    window.open(`https://wa.me/${row["mobile"]}`, '_blank').focus();
                                  }}
                                />
                              </>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={resultRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {addQuizCard()}
      </Modal>
    </>
  );
}
