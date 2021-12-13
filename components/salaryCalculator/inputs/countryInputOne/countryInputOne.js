import React, { useEffect, useRef, useState } from "react";
import Styles from "./assets/countryInputOne.module.scss";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import CountryInputTwo from "../countryInputTow/countryInputTwo";
import GrossInput from "../grossInput/grossInput";
import CalculateNetSalary from "../calculateNetSalary/calculateNetSalary";
import axios from "axios";
const CountryInputOne = (props) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("please select position"),
    counries: Yup.string().required("please select country "),
    grossSalary: Yup.string().required("please select gross"),
    countryTwo: Yup.string().required("please select country Two "),
    wouldRecommend: Yup.boolean().default(false),
  });

  const initialValues = {
    name: "",
    counries: "",
    grossSalary:"",
    countryTwo: "",
    wouldRecommend: false,
  };


  const onSubmit = (values) => {
    console.log(JSON.stringify(values, null, 2));
  };
  ////////////////////////////////////////////// countryOne /////////////////////////////////////////////
  const [showMenuCountryOne, setShowMenuCountryOne] = useState(false);
  const [getValueCountryOne, setGetValueCountryOne] = useState("");
  const [allCountryOne, setAllCountryOne] = useState([]);
  const [allCountryTwo, setAllCountryTwo] = useState([]);
  const [newCountryOne, setNewCountryOne] = useState("");

  const handleOpencountryOne = () => {
    setShowMenuCountryOne(true);
  };


  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");

          setNewCountryOne([]);
          setShowMenuCountryOne(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const getCountryOneData = (e) => {
    setNewCountryOne([]);
    console.log("GEHAD IS ::: ", e.target.firstChild.data);
    setGetValueCountryOne(e.target.firstChild.data);
    setShowMenuCountryOne(false);
  };

  const catchCountryOneId = (item) => {
    setGetValueCountryOne(item.name);
    // setJobID(post.name);
    // console.log(post.name, "jops");
  };
  useEffect(() => {
    axios
      .get(`http://34.68.200.24/index.php/getCountry`)
      .then((response) => {
        setAllCountryOne(response.data.data);
        setAllCountryTwo(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    if (getValueCountryOne) {
      setNewCountryOne(
        allCountryOne?.filter((person) =>
          person.name
            .toLowerCase()
            .includes(getValueCountryOne.toLowerCase())
        )
      );
    } else {
      setNewCountryOne([]);
    }
  }, [getValueCountryOne, allCountryOne]);

  const onChangeValueCountryOne = (e) => {
    if (getValueCountryOne.length > e.target.value.length) {
      // setJobID(null);
    }
    setGetValueCountryOne(e.target.value);
    if (!e.target.value) setNewCountryOne([]);
  };
  const onChangeGrossValue = (e) => {
    if (grossSalary.length > e.target.value.length) {
      // setJobID(null);
    }
    setGrossSalary(e.target.value);
    if (!e.target.value) setGrossSalary('');
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);


  //////////////////////////////////////////send as a props to  countryTwo component  ////////////////////////////////////

  const [showMenuCountryTwo, setShowMenuCountryTwo] = useState(false);
  const [getValueCountryTwo, setGetValueCountryTwo] = useState("");
  const [newCountryTwo, setNewCountryTwo] = useState("");

  const handleOpencountryTwo = () => {
    setShowMenuCountryTwo(true);
  };


  ////////////////START CURRENCY TYPE////////////////////
  const [currency, setCurrency] = useState([])
  const [catchSelectVal, setCatchSelectVal] = useState('')
  const [grossSalary, setGrossSalary] = useState('')
  const [checked, setchecked] = useState(false);
  // const[tableOne, setTableOne] = useState("")
  const [errors, setErrors] = useState('')
  //////////////// End CURRENCY TYPE////////////////////

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
              <div className="col-12 col-md-6" onInput={handleOpencountryOne}>
                <div className={Styles.searchInput}>
                  <p className={Styles.label}>Country 1</p>
                  <Field
                    autoComplete="off"
                    name="name"
                    id="red"
                    type="text"
                    value={getValueCountryOne}
                    placeholder="Select Country 1"
                    onInput={onChangeValueCountryOne}
                  />
                  <p>{errors.first_country}</p>
                  <div ref={wrapperRef}>
                    {getValueCountryOne && showMenuCountryOne ? (
                      <ul
                        className={Styles.cardSearch}
                        onClick={getCountryOneData}
                      >
                        {newCountryOne &&
                          newCountryOne?.map((item) => (
                            <li
                              className={Styles.select}
                              onClick={() => catchCountryOneId(item)}
                              key={item.name}
                            >
                              {item.name}
                            </li>
                          ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6" onInput={handleOpencountryTwo}>
                <CountryInputTwo
                  setAllCountryTwo={setAllCountryTwo}
                  allCountryTwo={allCountryTwo}
                  setGetValueCountryTwo={setGetValueCountryTwo}
                  setNewCountryTwo={setNewCountryTwo}
                  newCountryTwo={newCountryTwo}
                  getValueCountryTwo={getValueCountryTwo}
                  showMenuCountryTwo={showMenuCountryTwo}
                  setShowMenuCountryTwo={setShowMenuCountryTwo}
                  errors={errors}
                  setErrors={setErrors}
                />
              </div>

              <GrossInput
                setCurrency={setCurrency}
                currency={currency}
                setCatchSelectVal={setCatchSelectVal}
                catchSelectVal={catchSelectVal}
                setGrossSalary={setGrossSalary}
                setchecked={setchecked}
                checked={checked}
                errors={errors}
                setErrors={setErrors}
              />
              <CalculateNetSalary
                getValueCountryOne={getValueCountryOne}
                getValueCountryTwo={getValueCountryTwo}
                setCatchSelectVal={setCatchSelectVal}
                catchSelectVal={catchSelectVal}
                setGrossSalary={setGrossSalary}
                grossSalary={grossSalary}
                setchecked={setchecked}
                checked={checked}
                setTableOne={props.setTableOne}
                tableOne={props.tableOne}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CountryInputOne;
