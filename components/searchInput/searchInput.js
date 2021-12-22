import React, { useState, useRef, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";
import Search from "./assets/image/Search.png";
import SalaryRange from "../salaryRange/salaryRange";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import Loader from "../loader/loader";
import HeaderPhoto from "./assets/image/header.png";
import HeaderRes from "./assets/image/headerRes.png";
const SearchInput = () => {
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
  const [loading, setLoading] = useState(false);

  const [showJop, setShowJop] = useState(false);
  const [nameJop, setNameJop] = useState("");
  // const [erorr, setErorr] = useState("");
  // const [jopValue, setJopValue] = useState("");
  const [getValuejop, setGetValuejop] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [newjops, setNewJops] = useState("");
  const [getRanges, setGetRanges] = useState(null);

  ////////////////////countries/////////////////////

  const [nameCountry, setNameCountry] = useState("");
  const [showCountry, setShowCountry] = useState(false);
  const [showRanges, setShowRanges] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [getValueCountry, setGetValueCountry] = useState("");
  const [newCountries, setNewCountries] = useState("");
  const [api, setApi] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [countryID, setCountryID] = useState("");
  const [jobID, setJobID] = useState(null);

  const handleOpenJops = () => {
    setShowJop(true);
  };
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");

          setNewJops([]);
          setShowJop(false);
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
  const getJopsData = (e) => {
    setNewJops([]);
    setGetValuejop(e.target.firstChild.data);
    setShowJop(false);
  };

  const catchJopids = (post) => {
    setGetValuejop(post.positionName);
    setJobID(post.id);
    console.log(post.id, "jops");
  };
  useEffect(() => {
    axios
      .get(`http://34.68.200.24/index.php/category_positions`)
      .then((response) => {
        setAllJobs(response.data.list);
        console.log(response.data.list);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (getValuejop) {
      setNewJops(
        allJobs?.filter((person) =>
          person.positionName.toLowerCase().includes(getValuejop.toLowerCase())
        )
      );
    } else {
      setNewJops([]);
    }
  }, [getValuejop, allJobs]);

  const onChangeValueCountries = (e) => {
    if (
      getValueCountry.length > e.target.value.length ||
      getValueCountry.length < e.target.value.length
    ) {
      setCountryID(null);
    }
    setGetValueCountry(e.target.value);
    if (!e.target.value) setNewCountries([]);
  };

  const onChangeValueJob = (e) => {
    if (
      getValuejop.length > e.target.value.length ||
      getValuejop.length < e.target.value.length
    ) {
      setJobID(null);
    }
    setGetValuejop(e.target.value);
    if (!e.target.value) setNewJops([]);
  };
  /////////////  countries ///////////////////////

  const handleOpencountries = () => {
    setShowCountry(true);
  };
  function useOutsidecountries(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");
          setNewCountries([]);
          setShowCountry("");
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
  const getCountriesData = (e) => {
    setNewCountries([]);
    // console.log("GEHAD IS ::: ", e.target.firstChild.data);
    setGetValueCountry(e.target.firstChild.data);
    setShowCountry(false);
  };
  const catchCountryids = (post) => {
    setGetValueCountry(post.positionName);
    setCountryID(post.id);
    console.log(post.id, "countries");
  };

  useEffect(() => {
    axios
      .get(`http://34.68.200.24/index.php/countries`)
      .then((response) => {
        setAllCountries(response.data.list);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (getValueCountry) {
      setNewCountries(
        allCountries?.filter((person) =>
          person.name.toLowerCase().includes(getValueCountry.toLowerCase())
        )
      );
    } else {
      setNewCountries([]);
    }
  }, [getValueCountry, allCountries]);
  // const onChangeValueCountries = (e) => {
  //   setGetValueCountry(e.target.value);
  //   if (!e.target.value) setNewCountries([]);
  // };
  const sendDaTa = async () => {
    try {
      if (countryID && jobID) {
        setNameCountry(getValueCountry);
        setNameJop(getValuejop);
        setGetRanges(null);
        setShowRanges(true);
        setLoading(true);
        await axios
          .get(
            `http://34.68.200.24/index.php/country/${countryID}/position/${jobID}/advanced`
          )
          .then((response) => {
            setGetRanges(response.data);
            console.log(response.data.currency, "ressssssssss");
          });
        setGetValueCountry("");
        setGetValuejop("");
        return;
      } else {
        setShowRanges(false);
        return;
      }
    } catch (e) {
      // setErorr(e.response.status);
      // document.getElementById("red").style.borderColor = "red";
      setShowRanges(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const wrapperRef = useRef(null);
  const wrappercountries = useRef(null);
  useOutsideAlerter(wrapperRef);
  useOutsidecountries(wrappercountries);

  return (
    <>
      <div className={Styles.header}>
        <div
          className={Styles.imgHeader}
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "26%",
            bottom: "48px",
          }}
        >
          <Image
          
            layout="fill"
            objectFit="contain"
            alt="Picture"
            src={HeaderPhoto.src}
          />
        </div>

        <div
          className={Styles.imgResHeader}
          style={{
            position: "relative",
            width: "100%",

            bottom: "48px",
          }}
        >
          <Image
            alt="Picture"
            width={450}
            height={230}
            src={HeaderRes.src}
          />
        </div>
      </div>
      <div className="container">
      <div className={Styles.cont}>
        <div className={Styles.card}>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            validateOnChange
            validate={(values) => {
              const errors = {};
              if (!values.name || (!jobID && jobID == null)&&!getValuejop) {
                errors.name = "Please Select Position";
              } else {
                errors.name = "";
              }
              if (!values.counries || (!countryID && countryID == null)&&!getValueCountry) {
                errors.counries = "Please Select Country";
              } else {
                errors.counries = "";
              }
              return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
              await onSubmit(values);
              resetForm();
            }}
          >
            <Form>
              <div className="row">
                <div className="col-12 col-md-5" onInput={handleOpenJops}>
                  <div className={Styles.searchInput}>
                    <Field
                      autoComplete="off"
                      name="name"
                      id="red"
                      type="text"
                      value={getValuejop}
                      placeholder="Search by job title"
                      onInput={onChangeValueJob}
                    />
                    <ErrorMessage
                      name="name"
                      render={(msg) => (
                        <div style={{ color: "red", marginTop: "10px" }}>
                          {msg}
                        </div>
                      )}
                    />

                    <div ref={wrapperRef}>
                      {getValuejop && showJop ? (
                        <ul className={Styles.cardSearch} onClick={getJopsData}>
                          {newjops &&
                            newjops?.map((post) => (
                              <li
                                className={Styles.select}
                                onClick={() => catchJopids(post)}
                                key={post.id}
                              >
                                {post.positionName}
                              </li>
                            ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-5" onInput={handleOpencountries}>
                  <div className={Styles.searchInput}>
                    <Field
                      autoComplete="off"
                      name="counries"
                      id="red"
                      type="text"
                      value={getValueCountry}
                      placeholder={"Search country"}
                      onInput={onChangeValueCountries}
                    />
                    <ErrorMessage
                      name="counries"
                      render={(msg) => (
                        <div style={{ color: "red", marginTop: "10px" }}>
                          {msg}
                        </div>
                      )}
                    />
                    <div ref={wrappercountries}>
                      {getValueCountry && showCountry ? (
                        <ul
                          className={Styles.cardSearch}
                          onClick={getCountriesData}
                        >
                          {newCountries &&
                            newCountries?.map((post) => (
                              <li
                                className={Styles.select}
                                onClick={() => catchCountryids(post)}
                                key={post.id}
                              >
                                {post.name}
                              </li>
                            ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  className={`col-12 col-md-2 ${Styles.btn}`}
                  onClick={sendDaTa}
                >
                  <button type="submit" className="button is-primary">
                    <span style={{ marginRight: "12px" }}>
                      {/* <img src={Search.src} /> */}
                      <Image
                        alt="Picture"
                        width={13}
                        height={12}
                        src={Search.src}
                      />
                    </span>
                    Find Salary
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
      </div>

      {/* <Input /> */}
      {loading && nameJop && nameCountry ? (
        <div style={{ width: "25%", height: "50%", margin: "auto" }}>
          {" "}
          <Loader />{" "}
        </div>
      ) : (
        ""
      )}
      <SalaryRange
        getRanges={getRanges}
        getValueCountry={getValueCountry}
        getValuejop={getValuejop}
        nameJop={nameJop}
        nameCountry={nameCountry}
      />
    </>
  );
};
export default SearchInput;
