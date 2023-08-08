import Gun from "gun/gun";
import SEA from "gun/sea";
import "gun/lib/path";
import "gun/lib/promise";
import "gun/lib/radix.js";
import "gun/lib/radisk.js";
// import 'gun/lib/store.js';

import React, { useState, useRef, useContext, useEffect } from "react";


import { AuthContext } from "../../shared/context/auth-context";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import Moment from 'moment';


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

const gun = Gun({
  peers: ["https:img-transformer-v2.mogiio.com/gun"], // Put the relay node that you want here
  // peers: ['https:dev-apis.mogiio.com/gc-lms-bc/gun']
});

function Doubt() {
  const [txt, setTxt] = useState();
  const [doubts, setDoubts] = useState([]);
  const auth = useContext(AuthContext);

  const dt = {};

  const buildArFromObj = (o) => {
    let arr = [];
    Object.keys(o).forEach(function (key) {
      var val = o[key];
      arr.push({ ...val, key });
      // logic();
    });

    return arr;
  };
  const refreshDoubts = (status = "open", userId) => {
    setDoubts([]);

    const getDoubts = () => {
      const doubtsGun = gun.get("doubts");

      if (doubtsGun)
        doubtsGun
          .map()
          .once(function (data, key) {
            // console.log("Item:", dt);
            if (
              data &&
              data.title &&
              data.status == status &&
              (!userId || data.userId == userId)
            )
              dt[key] = data;
            // dt.push({...data,key: key});
          })
          .once(() => {
            setDoubts(buildArFromObj(dt));
            console.log("doubts", doubts);
          });
    };

    getDoubts();
  };
  useEffect(() => {
    console.log("useEffect called");
    // gun.user().create(auth.userId, auth.userId + "somePassword");
    let user = gun.user();
    user.auth(auth.userId, auth.userId + "somePassword", async (data) => {
      if (data.err) {
        user.create(auth.userId, auth.userId + "somePassword", async (data) => {
          // console.log(auth.userId, auth.userId + "somePassword")
          // await authenticateUser(identity, identifier)
        });
      } else {
        let pair = user.pair();
        // console.log('Authenticated GUN user: ~' + pair.pub)
      }
    });

    refreshDoubts("open", auth.userId);
  }, []);

  const updateText = (event) => {
    console.log("Updating Text");
    console.log(event.target.value);
    gun.get("text").put({ text: event.target.value }); // Edit the value in our db
    setTxt(event.target.value);
  };

  const doubtTFRef = useRef("");

  const addDoubtHandler = async (event) => {
    var doubt = {
      title: doubtTFRef.current.value,
      status: "open",
      userId: auth.userId,
      username: auth.email.split("@")[0],
      createdAt: new Date().toString(),
    };

    // var author = await gun.get("~@"+auth.userId);
    var author = await gun
      .user()
      .auth(auth.userId, auth.userId + "somePassword");

    console.log(author, await gun.user());
    gun
      .user()
      .get("doubts")
      .set(doubt) // At this step, we saved the post in a user schedule, which by default is only writable by the user
      .once(function () {
        this.get("author").put(author.pub); // In this step, we link our post with the author (with our user)
        gun.get("doubts").set(this); // At this step, we save the post with the author installed in the main graph
      });
    doubtTFRef.current.value = "";

    refreshDoubts();
  };

  const [activeButton, setActiveButton] = useState("my");

  const buttonGroupHandler = (type) => {
    setActiveButton(type);
    if (type === "my") {
      refreshDoubts("open", auth.userId);
    } else if (type === "open") {
      refreshDoubts("open", null);
    } else if (type === "close") {
      refreshDoubts("close", null);
    }
  };

  const buttons = [
    <Button
      variant={activeButton == "my" ? "contained" : "outlined"}
      onClick={() => buttonGroupHandler("my")}
      key="my"
    >
      My Doubts
    </Button>,
    <Button
      variant={activeButton == "open" ? "contained" : "outlined"}
      onClick={() => buttonGroupHandler("open")}
      key="open"
    >
      Open
    </Button>,
    <Button
      variant={activeButton == "closed" ? "contained" : "outlined"}
      onClick={() => buttonGroupHandler("closed")}
      key="closed"
    >
      Closed
    </Button>,
  ];

  const deleteDoubt = (key) => {
    // users.path(key).put(null);
    const doubtsGun = gun.get("doubts");
    console.log("deleteing", key, doubtsGun.get(key).get("userId"));

    doubtsGun.get(key).once((node) => {
      console.log("node", node.userId);
      if (node.userId == auth.userId) {
        doubtsGun.get(key).put(null);
      }
      // console.log("d",d,key);
    });
    // doubtsGun.get(key).put(null);

    refreshDoubts("open", auth.userId);
  };

  const closeDoubt = (key) => {
    // users.path(key).put(null);
    const doubtsGun = gun.get("doubts");
    // console.log("deleteing", key, doubtsGun.get(key).get("userId"));

    doubtsGun.get(key).once((node) => {
      console.log("node", node.userId);
      if (node.userId == auth.userId) {
        doubtsGun.get(key).get("status").put("close");
      }
      // console.log("d",d,key);
    });
    // doubtsGun.get(key).put(null);

    // refreshDoubts("open", auth.userId);
  };

  const [openAnswer, setAnswerOpen] = React.useState(false);
  const handleAnswerOpen = () => setAnswerOpen(true);
  const handleAnswerClose = () => setAnswerOpen(false);

  const answerModal = ()=>(<Modal open={openAnswer} onClose={handleAnswerClose}>
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6">
        Instructions:
      </Typography>
      
    </Box>
  </Modal>);

const [openDelete, setDeleteOpen] = React.useState(false);
const handleDeleteOpen = () => setDeleteOpen(true);
const handleDeleteClose = () => setDeleteOpen(false);

  const deleteConformModal = ()=>(<Modal open={openDelete} onClose={handleDeleteClose}>
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6">
        Instructions:
      </Typography>
      
    </Box>
  </Modal>);

  const showDoubt = (doubt) => (
    <Card
      // onClick={() => deleteDoubt(doubt.key)}
      key={doubt.key}
      sx={{ maxWidth: 400, width: 400, margin: "auto", marginTop: 5 }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {doubt.title}
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          By {doubt.username}
        </Typography>
        <Typography gutterBottom variant="body" component="div">
          {Moment(doubt.createdAt).format('d MMM')}
        </Typography>
      </CardContent>
      <CardContent>
        <Stack spacing={2} direction="row" lexWrap="wrap">
          <Button
            variant="outlined"
            size="small"
            onClick={handleAnswerOpen}
          >
            Answer
          </Button>
          

          <Button
            variant="outlined"
            size="small"
            onClick={() => closeDoubt(doubt.key)}
           
          >
            Close
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteOpen}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <>
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
      {/* <div className="Doubt">
        <h1>Collaborative Document With GunJS</h1>
        <textarea value={txt} onChange={updateText} />
      </div> */}
      <Card sx={{ maxWidth: 400, width: 400, margin: "auto" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Ask Doubt
          </Typography>

          <Stack spacing={2}>
            <TextField
              id="doubtTF"
              label="Doubt"
              inputRef={doubtTFRef}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </Stack>
        </CardContent>
        <CardContent>
          <Stack spacing={2}>
            <Button variant="contained" size="large" onClick={addDoubtHandler}>
              Ask
            </Button>
            {/* <span style={{ width: "100%", color: "gray",textAlign:"center"}}>or</span>
           <Button variant="outlined" size="large" onClick={props.onClick}>
             Signup
           </Button> */}
          </Stack>
        </CardContent>
      </Card>

      {doubts && doubts.length > 0 && doubts.map((doubt) => showDoubt(doubt))}
    </>
  );
}

export default Doubt;
