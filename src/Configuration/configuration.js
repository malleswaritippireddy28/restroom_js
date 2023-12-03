import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormHelperText,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import {
  configSignal,
  getConfig,
  getToken,
  saveConfig,
} from "../utilities/utility";
import { loader } from "../App";
import { sendBroadcastMessage } from "../firebase";

const Configuration = ({ isMobile }) => {
  useEffect(() => {
    getConfig("DISTANCE");
  }, []);

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  const [broadcastMessage, setBroadcastMsg] = useState("");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Configuration
        </Typography>
        <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 3 }}>
          <Grid container>
            <Card sx={{ maxWidth: 345, padding: 2 }}>
              <CardMedia
                sx={{ height: 230 }}
                image={"./config.jpg"}
                title="Configuration"
              />
              <CardContent>
                <>
                  <Typography gutterBottom variant="h7" component="div">
                    Currently serving rest rooms distance from the user
                  </Typography>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    type="number"
                    value={configSignal.value}
                    onChange={(e) => {
                      if (parseInt(e.target.value) > 0)
                        configSignal.value = e.target.value;
                    }}
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
                    disabled={loader.value}
                    endIcon={loader.value && <CircularProgress />}
                    onClick={async () => await saveConfig()}
                  >
                    Save
                  </Button>
                </>
                <br />
                <br />
                <br />
                {getToken()?.isAdmin && (
                  <>
                    <Typography gutterBottom variant="h7" component="div">
                      Send broadcast message
                    </Typography>
                    <Textarea
                      aria-label="minimum height"
                      // onChange={(e) => setBroadcastMsg(e.target.value)}
                      minRows={3}
                      // value={broadcastMessage}
                      required
                      name="broadcastmessage"
                      fullWidth
                      placeholder="Broadcast Message"
                      sx={{ width: "100%" }}
                    />
                    <Button
                      variant="contained"
                      disabled={loader.value}
                      endIcon={loader.value && <CircularProgress />}
                      onClick={async () => {
                        await sendBroadcastMessage(
                          document.getElementsByName("broadcastmessage")[0]
                            .value
                        );
                        document.getElementsByName(
                          "broadcastmessage"
                        )[0].value = "";
                      }}
                    >
                      Send
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Configuration;
