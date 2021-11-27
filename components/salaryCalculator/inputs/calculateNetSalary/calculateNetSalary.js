import React from "react";
import Styles from "./assets/calculateNetSalary.module.scss";
import warnning from "./image/complain.png";
import icon from "./image/Vector ico.png";

const calculateNetSalary = () => {
  return (
    <>
      <div className="col-12 col-md-12">
        <div className={Styles.btn}>
          <button type="submit" className="button is-primary">
            calculate Net Salary
          </button>
        </div>
      </div>
      <div className="col-12 col-md-12">
        <div className={Styles.card}>
          <div className="col-12 col-md-12">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>
                <p
                  style={{
                    fontFamily: "Archivo",
                    fontSize: "12px",
                    lineHeight: "13px",
                    color: "#00234B",
                  }}
                >
                  This Calculation is only an estimate and should not be taken
                  into legal account
                </p>
                <p
                  style={{
                    fontFamily: "Work Sans",
                    fontSize: "12px",
                    lineHeight: "22px",
                    color: "#5A6487",
                  }}
                >
                  The calculation is estimated according to a persona and not
                  every employee will fit this persona.
                  <span style={{ margin: "0 0 0 5px"}}>
                    <img src={icon.src} />
                  </span>
                </p>
              </div>
              <div className={Styles.warnning} style={{ marginTop: "16px" }}>
                <img src={warnning.src} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default calculateNetSalary;
