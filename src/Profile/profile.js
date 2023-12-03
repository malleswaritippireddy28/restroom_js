import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/SupervisedUserCircle";
import { getToken, userSignal } from "../utilities/utility";

const Profile = ({ isMobile }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!user) setUser(getToken());
  }, [user]);

  useEffect(() => {}, []);

  return (
    <>
      {/* <h1>{userSignal.value.user}</h1> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!isMobile && (
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
        )}
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 3 }}>
          <Grid container>
            <Card sx={{ maxWidth: 345, padding: 2 }}>
              <CardMedia
                sx={{ height: 230 }}
                image={
                  user?.imageURL ||
                  "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.webp"
                }
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {user?.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">{user?.isAdmin ? "Admin" : "User"}</Button>
              </CardActions>
              <>
                <Typography gutterBottom variant="h8" component="div">
                  {getToken()?.description}
                  {/* typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. */}
                </Typography>
                {/* <Typography gutterBottom variant="" component="div">
                  Currently serving distance from the user
                </Typography>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  type="number"
                  endAdornment={
                    <InputAdornment position="end">Miles</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
                <FormHelperText id="outlined-weight-helper-text">
                  Distance
                </FormHelperText>
                <Button
                  variant="contained"
                  // disabled
                  // endIcon={<CircularProgress />}
                >
                  Save
                </Button> */}
              </>
            </Card>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
