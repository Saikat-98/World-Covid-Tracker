import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({
  title,
  cases,
  total,
  isGreen,
  isOrange,
  isRed,
  active,
  onClick,
}) {
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isGreen && "infoBox--green"} ${isOrange && "infoBox--orange"}`}
      onClick={onClick}
    >
      <CardContent>
        <Typography color="textSecondary" className="infoBox__title">
          {title}
        </Typography>

        <h2
          className={`infoBox__cases ${isRed && "infoBox__cases--red"} ${
            isGreen && "infoBox__cases--green"
          } ${isOrange && "infoBox__cases--orange"}`}
        >
          {cases}
        </h2>

        <Typography color="textSecondary" className="infoBox__total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
