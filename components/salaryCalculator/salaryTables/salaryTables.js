import React from "react";
import Styles from "./assets/salaryTables.module.scss";
const SalaryTables = (props) => {
  console.log(props, "proopp")
  return (
    <>
    
        <div className={Styles.tables}>
          <p>Gross salary amount in talents’ local currency</p>
          <div className={Styles.table1}>
            <table>
              <tr>
                <th>Amount in local currency</th>
                <th>{props.tableOne?.first_country}</th>
                <th>{props.tableOne?.second_country}</th>
              </tr>
              <tr>
                <td>{props.tableOne?.gross?.main_value} {props.tableOne?.gross?.main_currency}</td>
                <td>{props.tableOne?.gross?.gross_one} {props.tableOne?.gross?.currency_one}</td>
                <td>{props.tableOne?.gross?.gross_two} {props.tableOne?.gross?.currency_two}</td>
              </tr>
            </table>
          </div>
          <p className={Styles.p2}>Estimated net salary break down</p>
          <div className={Styles.table2}>
            <table>
              <tr>
                <th>Amount in local currency</th>
                <th>{props.tableOne?.first_country} {props.tableOne?.currency}</th>
                <th>{props.tableOne?.second_country} {props.tableOne?.currency}</th>
              </tr>
              <tr>
                <td>Taxable income</td>
                <td>{props.tableOne?.country_one?.taxable_one} {props.tableOne?.currency}</td>
                <td>{props.tableOne?.country_two?.taxable_two} {props.tableOne?.currency}</td>
              </tr>
              <tr>
                <td>Income tax:</td>
                <td>{props.tableOne?.country_one?.tax_one} {props.tableOne?.currency}</td>
                <td>{props.tableOne?.country_two?.tax_two} {props.tableOne?.currency}</td>
              </tr>
              <tr>
                <td>Social security:</td>
                <td>{props.tableOne?.country_one?.security_one} {props.tableOne?.currency}</td>
                <td>{props.tableOne?.country_two?.security_two} {props.tableOne?.currency}</td>
              </tr>
              <tr>
                <td>Net salary</td>
                <td>{props.tableOne?.country_one?.final_one} {props.tableOne?.currency}</td>
                <td>{props.tableOne?.country_two?.final_two} {props.tableOne?.currency}</td>
              </tr>
            </table>
          </div>
        </div>
       
    </>
  );

};
export default SalaryTables;
