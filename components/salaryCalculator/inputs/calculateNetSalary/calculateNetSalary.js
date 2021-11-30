import React from "react";
import Styles from "./assets/calculateNetSalary.module.scss";
import Warning from "./assets/complain.png";
import Vector from "./assets/vector.png";
import Image from "next/image";

const calculateNetSalary = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-12">
            <div className={Styles.btn}>
              <button type="submit" className="button is-primary">
                calculate Net Salary
              </button>
            </div>
          </div>
          <div className="col-12 col-sm-12">
            <div className={Styles.card}>
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
                    fontSize: "12px",
                    lineHeight: "22px",
                    color: "#5A6487",
                  }}
                >
                  The calculation is estimated according to a persona and not
                  every employee will fit this persona.
                  <div className={Styles.tooltip}>
                    <span className={Styles.vector}>
                      {/* <img src={Vector.src} className={Styles.vector}/> */}
                      <Image width={20} height={20} src={Vector.src} className={Styles.vector}/>
                    </span>
                    {/* <span className={Styles.tooltiptext}>
                      Persona:
                      <br />
                      Single, no children, 35 years old, Non-religious, public
                      insurance, healthcare/ etc., works in tech, works at home,
                      lives in the capital, resident, no special tax reliefs
                      other than tech related, mid-level (non manegerial/board),
                      indefinite contract.
                    </span> */}
                  </div>
                </p>
              </div>
              <div className={Styles.warningIcon}>
                {/* <img src={Warning.src} /> */}
                <Image width={50} height={48} src={Warning.src} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default calculateNetSalary;
