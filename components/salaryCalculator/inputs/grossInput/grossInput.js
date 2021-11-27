import React from "react";
import Styles from "./assets/grossInput.module.scss";
import { Field, ErrorMessage } from "formik";

const grossInput = () => {
  return (
    <>
      <div className="col-12 col-md-12">
        <p className={Styles.label}>
          How much gross (pre-tax) salary are you looking to pay annually?
        </p>
      </div>
      <div className="col-12 col-md-8">
        <div className={Styles.searchInput}>
          <Field
            autoComplete="off"
            name="counries"
            id="red"
            type="text"
            placeholder="80,000"
          />
          <ErrorMessage
            name="counries"
            render={(msg) => (
              <div style={{ color: "#808080", marginTop: "10px" }}>{msg}</div>
            )}
          />
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className={Styles.searchInput}>
          <Field
            autoComplete="off"
            name="counries"
            id="red"
            type="text"
            placeholder="80,000"
          />
          <ErrorMessage
            name="counries"
            render={(msg) => (
              <div style={{ color: "#808080", marginTop: "10px" }}>{msg}</div>
            )}
          />
        </div>
      </div>
      <div className="col-12 col-md-8">
        <p className={Styles.radioHeader}>
          Does this gross salary include allowances?{" "}
        </p>
      </div>
      <div className="col-12 col-md-4"></div>
    </>
  );
};

export default grossInput;
