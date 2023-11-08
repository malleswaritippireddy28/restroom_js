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
import { ButtonBase, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Star from "@mui/icons-material/StarBorderOutlined";
import Delete from "@mui/icons-material/Delete";
import StarHalf from "@mui/icons-material/StarHalfOutlined";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { getToken } from "../utilities/utility";

export default function RestRoom({ room, isMobile, ...props }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const onDeleteRoom = () => {};

  if (isMobile)
    return (
      <Card sx={{ maxWidth: 345, marginBottom: 6 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={room.imageURL}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {room.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Star />
          <Star />
          <Star />
          <Star />
          <StarHalf />
        </CardActions>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" onClick={() => navigate(`/detail/${room._id}`)}>
            Show Details
          </Button>
        </Box>
        <Divider />
        {getToken()?.isAdmin && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button size="small" onClick={() => {}} endIcon={<Delete />}>
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
        image={room.imageURL}
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
        </CardContent>

        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <CardActions>
            <Star />
            <Star />
            <Star />
            <Star />
            <StarHalf />
            <Button
              size="small"
              onClick={() => navigate(`/detail/${room._id}`)}
            >
              Show Details
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Card>
  );
}
