import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import { useTheme } from '@material-ui/core/styles';

function InfoBox ( {
  title,
  cases,
  total,
  isGreen,
  isOrange,
  isRed,
  active,
  onClick
} ) {
  const theme = useTheme();
  return (
    <Card
      className={ `infoBox ${ active && "infoBox--selected" } ${ isRed && "infoBox--red"
        } ${ isGreen && "infoBox--green" } ${ isOrange && "infoBox--orange" } ${ theme.palette.type === 'dark' && 'dark--stats' }` }
      onClick={ onClick }
    >
      <CardContent>
        <Typography color="textSecondary" className={ theme.palette.type === 'dark' ? "infoBox__title dark--title" : 'infoBox__title' }>
          { title }
        </Typography>

        <h2
          className={ `infoBox__cases ${ isRed && "infoBox__cases--red" } ${ isGreen && "infoBox__cases--green"
            } ${ isOrange && "infoBox__cases--orange" }` }
        >
          { cases }
        </h2>

        <Typography color="textSecondary" className={ theme.palette.type === 'dark' ? "infoBox__total dark--total" : 'infoBox__total' }>
          { total } Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
