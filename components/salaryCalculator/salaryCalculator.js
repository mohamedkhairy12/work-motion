import React, { useEffect, useState } from "react";
import SalaryTables from "./salaryTables/salaryTables";
import Styles from "./assets/salaryCalculator.module.scss";
import CountryInputOne from "./inputs/countryInputOne/countryInputOne";
import netSalary from "./assets/netSalary.png";
import netSalaryRes from "./assets/netSalaryRes.png";
import Image from "next/image";

const SalaryCalculator = () => {
  const [tableOne, setTableOne] = useState();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className={Styles.header}>
        <div
          className={Styles.imgHeader}
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "25%",
            bottom: "48px",
          }}
        >
          <Image
            layout="fill"
            objectFit="contain"
            alt="Picture"
            src={netSalary.src}
          />
        </div>

        <div className={Styles.imgResHeader} style={{
            position: "relative",
            width: "100%",
            
            bottom: "48px",
          }}>
          <Image
            alt="Picture"
            width={450}
            height={230}
            src={netSalaryRes.src}
          />
        </div>
      </div>
      <div className={Styles.main}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className={Styles.texts}>
                <h2 className={Styles.header}>How does it work?</h2>
                <p className={Styles.pragraph}>
                  You choose two countries where you are looking to hire in and
                  we’ll give you a breakdown of the tax deductions in both
                  countries. This shall help you compare between both countries
                  and make up your decision easily.
                </p>
              </div>
              <CountryInputOne
                setTableOne={setTableOne}
                tableOne={tableOne}
                loading={loading}
                setLoading={setLoading}
              />
            </div>

            <div className="col-12 col-sm-6">
              {/* {tableOne && */}
              <SalaryTables
                loading={loading}
                setLoading={setLoading}
                setTableOne={setTableOne}
                tableOne={tableOne}
              />
              {/* } */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalaryCalculator;
