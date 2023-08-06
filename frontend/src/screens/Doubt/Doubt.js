import Gun from "gun/gun";
import SEA from "gun/sea";
import "gun/lib/path";
import "gun/lib/promise";
import "gun/lib/radix.js";
import "gun/lib/radisk.js";
// import 'gun/lib/store.js';

import { useEffect, useState, useContext, useRef } from "react";

import { AuthContext } from "../../shared/context/auth-context";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";


import { Stack } from "@mui/material";

const gun = Gun({
  peers: ["https:img-transformer-v2.mogiio.com/gun"], // Put the relay node that you want here
  // peers: ['https:dev-apis.mogiio.com/gc-lms-bc/gun']
});

function Doubt() {
  const [txt, setTxt] = useState();
  const auth = useContext(AuthContext);

  

  useEffect(() => {
    // gun.user().create(auth.userId, auth.userId + "somePassword");
    let user = gun.user()
    user.auth(auth.userId, auth.userId + "somePassword", async (data) => {
        if (data.err) {
            user.create(auth.userId, auth.userId + "somePassword", async (data) => {
                console.log(auth.userId, auth.userId + "somePassword")
                // await authenticateUser(identity, identifier)
            })
        } else {
            let pair = user.pair()
            console.log('Authenticated GUN user: ~' + pair.pub)
        }
    })

  //  gun.user().auth(auth.userId, auth.userId + "somePassword");

  console.log(gun.get("doubts"))

    // gun.get('doubts').once((node) => { // Retrieve the text value on startup
    //   console.log("node hhh",node.length)
    //   if(node == undefined) {
    //     gun.get('text').put({text: "Write the text here"})
    //   } else {
    //     console.log("Found Node")
    //     setTxt(node.text)
    //   }
    // })

    // gun.get('text').on((node) => { // Is called whenever text is updated
    //   console.log("Receiving Update")
    //   console.log(node)
    //   setTxt(node.text)
    // })
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
    };

    // var author = await gun.get("~@"+auth.userId);
    var author = await gun.user().auth(auth.userId, auth.userId + "somePassword");

    console.log(author, await gun
      .user())
    gun
      .user()
      .get("doubts")
      .set(doubt) // At this step, we saved the post in a user schedule, which by default is only writable by the user
      .once(function () {
        this.get("author").put(author.pub); // In this step, we link our post with the author (with our user)
        gun.get("doubts").set(this); // At this step, we save the post with the author installed in the main graph
      });
  };

  return (
    <>
      <div className="Doubt">
        <h1>Collaborative Document With GunJS</h1>
        <textarea value={txt} onChange={updateText} />
      </div>
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
              Next
            </Button>
            {/* <span style={{ width: "100%", color: "gray",textAlign:"center"}}>or</span>
           <Button variant="outlined" size="large" onClick={props.onClick}>
             Signup
           </Button> */}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default Doubt;
