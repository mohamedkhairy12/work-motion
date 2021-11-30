import React from "react";
import Styles from "./assets/countryInputOne.module.scss";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import CountryInputTwo from "../countryInputTow/countryInputTwo";
import GrossInput from "../grossInput/grossInput";
import CalculateNetSalary from "../calculateNetSalary/calculateNetSalary";
const CountryInputOne = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required("please select position"),
    counries: Yup.string().required("please select country "),
    wouldRecommend: Yup.boolean().default(false),
  });

  const initialValues = {
    name: "",
    counries: "",
    wouldRecommend: false,
  };

  const onSubmit = (values) => {
    console.log(JSON.stringify(values, null, 2));
  };
  return (
    <div className={Styles.cont}>
      <div className={Styles.card}>
        <h4 className={Styles.header}>Select 2 countries to compare</h4>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await onSubmit(values);
            resetForm();
          }}
        >
          <Form>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className={Styles.searchInput}>
                  <p className={Styles.label}>Country 1</p>
                  <Field
                    autoComplete="off"
                    name="name"
                    id="red"
                    type="text"
                    placeholder="Spain"
                  />
                  <ErrorMessage
                    name="name"
                    render={(msg) => (
                      <div style={{ color: "#808080", marginTop: "10px" }}>
                        {msg}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <CountryInputTwo />
              </div>
              <GrossInput />
              <CalculateNetSalary />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CountryInputOne;
