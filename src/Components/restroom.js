import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { ButtonBase, Divider, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Star from "@mui/icons-material/StarBorderOutlined";
import Delete from "@mui/icons-material/Delete";
import StarHalf from "@mui/icons-material/StarHalfOutlined";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import {
  API_URL,
  getTimer,
  getToken,
  roomtransactions,
  updateRoom,
} from "../utilities/utility";
import Countdown from "react-countdown";

export default function RestRoom({
  room,
  isMobile,
  onDeleteRoom,
  transaction,
  ...props
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timer, setTimer] = React.useState();

  React.useEffect(() => {
    // setTimer(transaction);
    // console.log(transaction?._id, "----");
    // if (transaction) {
    //   setTimeout(() => {
    //     setTimer(-1);
    //   }, Math.round((((transaction.end - Date.now()) % 86400000) % 3600000) / 60000) * 1000);
    // }
  }, [transaction]);

  const maintenance = () => {
    return (
      <p style={{ color: "red" }}>
        <Countdown
          date={transaction ? transaction.end : Date.now()}
          intervalDelay={0}
          precision={3}
          renderer={(props) => {
            if (props.completed)
              return <h1 style={{ color: "green" }}>Available now</h1>;
            return (
              <>
                Under Maintenance till &nbsp;
                <u>
                  <b>{`${props.days} day${props.days > 1 ? "s" : ""} ${
                    props.hours > 9 ? props.hours : "0" + props.hours
                  }:${
                    props.minutes > 9 ? props.minutes : "0" + props.minutes
                  }:${
                    props.seconds > 9 ? props.seconds : "0" + props.seconds
                  }`}</b>
                </u>
              </>
            );
          }}
        />
      </p>
    );
  };

  if (isMobile)
    return (
      <Card sx={{ mb: 3 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={`${room.imageURL}`}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {room.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {room.distance.toFixed(2)} Miles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {maintenance()}
          </Typography>
        </CardContent>
        <CardActions>
          <Rating
            name="half-rating"
            defaultValue={room.rating}
            precision={0.5}
            disabled
          />
        </CardActions>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" onClick={() => navigate(`/detail/${room._id}`)}>
            Show Details
          </Button>
        </Box>
        <Divider />
        {getToken()?.isAdmin && (
          <Box
            sx={{ display: "flex", justifyContent: "center" }}
            onClick={onDeleteRoom}
          >
            <Button size="small" endIcon={<Delete />}>
              Delete
            </Button>
          </Box>
        )}
      </Card>
    );

  return (
    <Card
      sx={{ display: "flex", width: "auto", height: "300px", marginBottom: 6 }}
    >
      <CardMedia
        component="img"
        sx={{ width: "30%" }}
        image={`${room.imageURL}`}
        alt="Live from space album cover"
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {room.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {room.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {room.distance.toFixed(2)} Miles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {maintenance()}
          </Typography>
        </CardContent>

        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <CardActions>
            <Rating
              name="half-rating"
              defaultValue={room.rating}
              precision={0.5}
              disabled
            />
            <Button
              size="small"
              onClick={() => navigate(`/detail/${room._id}`)}
            >
              Show Details
            </Button>
          </CardActions>
        </Box>
      </Box>
      {getToken()?.isAdmin && (
        <Button size="small" onClick={onDeleteRoom}>
          <Delete />
        </Button>
      )}
    </Card>
  );
}
