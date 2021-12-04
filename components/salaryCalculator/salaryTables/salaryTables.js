import React from "react";
import Styles from "./assets/salaryTables.module.scss";
const SalaryTables = (props) => {
  console.log(props,"proopp")
  return (
    <div className={Styles.tables}>
      <p>Gross salary amount in talents’ local currency</p>
      <div className={Styles.table1}>
        <table>
          <tr>
            <th>Amount in local currency</th>
            <th>Spain</th>
            <th>United Kingdom</th>
          </tr>
          <tr>
            <td>{props.tableOne}</td>
            <td>69,741 EUR</td>
            <td>59,660 GBP</td>
          </tr>
        </table>
      </div>
      <p className={Styles.p2}>Estimated net salary break down</p>
      <div className={Styles.table2}>
        <table>
          <tr>
            <th>Amount in local currency</th>
            <th>Spain</th>
            <th>United Kingdom</th>
          </tr>
          <tr>
            <td>Taxable income</td>
            <td>80,000 USD</td>
            <td>80,000 USD</td>
          </tr>
          <tr>
            <td>Income tax: 20%</td>
            <td>3,321 USD</td>
            <td>2,421 USD</td>
          </tr>
          <tr>
            <td>Social security: 15%</td>
            <td>5,123 USD</td>
            <td>2,111 USD</td>
          </tr>
          <tr>
            <td>Net salary</td>
            <td>57,280 USD</td>
            <td>54,345 USD</td>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default SalaryTables;
