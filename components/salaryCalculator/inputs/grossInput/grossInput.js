import React, { useEffect, useState } from "react";
import Styles from "./assets/grossInput.module.scss";
import { Field, ErrorMessage } from "formik";
import Switch from "react-switch";
import axios from "axios";
const GrossInput = (props) => {
  const handleChange = (checked) => {
    props.setchecked(checked);
  }

  useEffect(() => {
    axios.get('http://34.68.200.24/index.php/main_currency')
      .then((response) => {
        props.setCurrency(response.data.data)
        console.log(response.data.data, "jdkskjhds")
      })
  }, []);

  const selectValue = (e) => {
    props.setCatchSelectVal(e.target.value)
    // console.log(e.target.value, "eventt")
  }
  const setGrossSal = (e) => {
    props.setGrossSalary(e.target.value)
    console.log(e.target.value, "eventt")
  }

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
            type="number"
            onInput={setGrossSal}
            placeholder="ex:8000"
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
          <select name="currency" id="currency" onInput={selectValue} className={Styles.cur}>
            {props.currency.map((curr) =>
              <option value={curr.name} >{curr.name}</option>
            )}
          </select>
        </div>
        <p>{props.errors.currency}</p>
      </div>
      <div className="col-8 col-md-8">
        <p className={Styles.radioHeader}>
          Does this gross salary include allowances?
        </p>
      </div>
      <div className="col-4 col-md-4" >
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: "end" }}>
          <p style={{ marginRight: '8px' }}>No</p>  <Switch onChange={handleChange}
            className={Styles.switchBtn} checked={props.checked} uncheckedIcon={false} checkedIcon={false} /> <p style={{ marginLeft: '8px' }}>Yes</p>
        </label>
      </div>
    </>
  );
};

export default GrossInput;
