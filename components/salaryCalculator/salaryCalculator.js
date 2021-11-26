import React from "react";
import SalaryTables from "./salaryTables/salaryTables";
import Styles from "./assets/salaryCalculator.module.scss";
import CountryInputOne from "./inputs/countryInputOne/countryInputOne";
const SalaryCalculator = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className={Styles.texts}>
            <h2 className={Styles.header}>How does it work?</h2>
            <p className={Styles.pragraph}>
              You choose two countries where you are looking to hire in and
              we’ll give you a breakdown of the tax deductions in both
              countries. This shall help you compare between both countries and
              make up your decision easily.
            </p>
          </div>
            <CountryInputOne />
          
        </div>

        <div className="col-12 col-md-6">
          <SalaryTables />
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
