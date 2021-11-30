import React, { useState } from "react";
import Styles from "./assets/salaryRange.module.scss";

const SalaryRange = (props) => {
  const [radio, setRadio] = useState("Annual");
  if (!props.getRanges) return <div/>;
  return (
    <>
      {props.getRanges && props.nameCountry && props.nameJop  ? (
        <div className="container">
          <div className={Styles.ranges}>
            <p className={Styles.title}>
              {props.nameJop} Salary in {props.nameCountry}
            </p>
            <hr />
            <div>
              <div className="row">
                <div className={`col-12 col-sm-8 ${Styles.sort1}`}>
                  <div className={Styles.radios}>
                    <input
                      type="radio"
                      value="Annual"
                      checked={radio === "Annual" ? true : false}
                      onChange={(e) => {
                        setRadio(e.target.value);
                      }}
                    />
                    <label
                      style={{ marginRight: "10px" }}
                      className={
                        radio === "Annual" ? Styles.unactive : Styles.active
                      }
                    >
                      Annual
                    </label>

                    <input
                      type="radio"
                      value="Monthly"
                      checked={radio === "Monthly" ? true : false}
                      onChange={(e) => {
                        setRadio(e.target.value);
                      }}
                    />
                    <label
                      style={{ marginRight: "10px" }}
                      className={
                        radio === "Monthly" ? Styles.unactive : Styles.active
                      }
                    >
                      Monthly
                    </label>
                  </div>
                  <div className={Styles.rangeInfo}>
                    <span
                      className="col-3"
                      style={{
                        background: "#F8936D",
                        width: "93px",
                        height: "52px",
                      }}
                    ></span>
                    <span
                      className="col-3"
                      style={{
                        background:
                          "linear-gradient(90deg, #F8936D 16.67%, #9B87FF 100%)",
                      }}
                    ></span>
                    <span
                      className="col-3"
                      style={{
                        background: "#9B87FF",
                        width: "93px",
                        height: "52px",
                      }}
                    ></span>
                  </div>
                  <div className={Styles.values}>
                    <div className={Styles.min}>
                      <p>10 % </p>
                      <p>
                        {props?.getRanges?.currency}
                        {radio === "Annual"
                          ? props?.getRanges?.quantiles?.q10
                          : Math.ceil(props?.getRanges?.quantiles?.q10 / 12)}
                        K
                      </p>
                    </div>
                    <div>
                      <p>MEDIAN</p>
                      <p>
                        {props?.getRanges?.currency}
                        {radio === "Annual"
                          ? props?.getRanges?.quantiles?.average
                          : Math.ceil(
                              props?.getRanges?.quantiles?.average / 12
                            )}
                        K
                      </p>
                    </div>
                    <div className={Styles.max}>
                      <p>90 %</p>
                      <p>
                        {props.getRanges.currency}
                        {radio === "Annual"
                          ? props?.getRanges?.quantiles?.q90
                          : Math.ceil(props?.getRanges?.quantiles.q90 / 12)}
                        K
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`col-12 col-sm-4 ${Styles.baseSalary}`}>
                  <p className={Styles.month}>{radio}</p>
                  <p className={Styles.net}>
                    {radio === "Annual"
                      ? props.getRanges?.quantiles?.average
                      : Math.ceil(
                          props.getRanges?.quantiles?.average / 12
                        )}
                    {props.getRanges?.currency}
                  </p>
                  <p className={Styles.avg}>Average base salary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SalaryRange;
