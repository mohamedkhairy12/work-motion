import React from "react";
import Styles from "./assets/countryInputTwo.module.scss";
import {Field, ErrorMessage } from "formik";
const CountryInputTwo = () => {
 
  return (
    <div className={Styles.searchInput}>
      <p className={Styles.label}>Country 2</p>
      <Field
        autoComplete="off"
        name="counries"
        id="red"
        type="text"
        placeholder="United Kingdom"
      />
      <ErrorMessage
        name="counries"
        render={(msg) => (
          <div style={{ color: "#808080", marginTop: "10px" }}>{msg}</div>
        )}
      />
    </div>
  );
};

export default CountryInputTwo;
