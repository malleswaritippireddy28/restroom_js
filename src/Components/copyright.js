import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const CopyRight = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      className="copyRight"
      {...props}
    >
      {"Copyright © "}
      <Link to={"/"}>Rest Roomz</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default CopyRight;
