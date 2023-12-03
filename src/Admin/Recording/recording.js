import React, { useEffect } from "react";
import { getRecordings, recordingData } from "../../utilities/utility";

const Recording = () => {
  useEffect(() => {
    getRecordings();
  }, []);

  return (
    <div className="player-container">
      <input
        type={"button"}
        onClick={() => {
          window["play"](recordingData.value);
        }}
        value={"Play"}
        className="btn btn-primary"
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default Recording;
