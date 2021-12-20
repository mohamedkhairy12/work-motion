import React, { useEffect, useState } from "react";
import Styles from "./assets/calculateNetSalary.module.scss";
import Warning from "./assets/complain.png";
import Vector from "./assets/Vector.png";
import Image from "next/image";
import axios from "axios";

const CalculateNetSalary = (props) => {
  
  const calculateDaTa = async () => {
    try {
     await axios.post('http://34.68.200.24/index.php/calculate_it', {
          "first_country": props.getValueCountryOne,
          "second_country": props.getValueCountryTwo,
          "currency": props.catchSelectVal,
          "value": props.grossSalary,
          "allow": props.checked
        
      })
        .then((response) => {
          props.setTableOne(response.data)  
          console.log(response.data, "poosstt")
        })
    } catch (error) {
      props.setErrors(error.response.data)
    }
    if(props.getValueCountryOne && props.getValueCountryTwo&& props.checked  ){
    props.setGetValueCountryOne("")
    props.setGetValueCountryTwo("")
    
    props.setchecked(false)
  }
   
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-12">
            <div className={Styles.btn}>
              <button type="submit" className="button is-primary" onClick={calculateDaTa}>
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
                      {/* <Image alt="Picture" width={20} height={20} src={Vector.src} className={Styles.vector} /> */}
                      <Image alt="Picture" width={'10%'} height={'10%'} src={Vector.src} className={Styles.vector} />
                    </span>
                    {/* <span className={Styles.tooltiptext}>
                      Persona:
                      <br />
                      Single, no children, 35 years old, Non-religious, public
                      insurance, healthcare/ etc., works in tech, works at home,
                      lives in the capital, resident, no special tax reliefs
                      other than tech related, mid-level (non manegerial/board),
                      indefinite contract.ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                    </span> */}
                  </div>
                </p>
              </div>
              <div className={Styles.warningIcon}>
                {/* <img src={Warning.src} /> */}
                {/* <Image alt="Picture" width={50} height={48} src={Warning.src} /> */}
                <Image alt="Picture" width={'70%'} height={'70%'} src={Warning.src} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculateNetSalary;
