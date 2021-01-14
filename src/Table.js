import React from "react";
import "./Table.css";
import numeral from "numeral";
import { useTheme } from '@material-ui/core/styles'

function Table ( { countries } ) {
  const theme = useTheme()

  return (
    <div className={ theme.palette.type === 'light' ? "table" : "table dark--table" }>
      <table>
        <tbody>
          { countries.map( ( { country, cases }, index ) => {
            return (
              <tr key={ `table-country-${ index }` }>
                <td>{ country }</td>
                <td>
                  <strong>{ numeral( cases ).format( "0,0" ) }</strong>
                </td>
              </tr>
            );
          } ) }
        </tbody>
      </table>
    </div>
  );
}

export default Table;
