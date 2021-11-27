import React from "react";
import Styles from "./assets/salaryTables.module.scss";
const SalaryTables = () => {
  return (
    <div className={Styles.table1}>
      <div className={Styles.header}>
        <span>Amount in local currency</span>
        <span>Spain </span>
        <span>United Kingdom</span>
      </div>
      <div className={Styles.description}>
        <span>80,000 USD</span>
        <span>69,741 EUR</span>
        <span>59,660 GBP</span>
      </div>
    </div>
  );
};
export default SalaryTables;
