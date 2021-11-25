import React, { useState, useRef, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";
import Search from "./assets/image/Search.png";
import SalaryRange from "../salaryRange/salaryRange";
import axios from "axios";
// import axios from "../../axios";

const SearchInput = () => {
  const [showJop, setShowJop] = useState(false);
  // const [jopValue, setJopValue] = useState("");
  const [getValuejop, setGetValuejop] = useState("");
  const [allJobs, setallJobs] = useState([]);
  const [newjops, setNewJops] = useState("");
  const [getRanges, setGetRanges] = useState("");

  ////////////////////countries/////////////////////

  // const [hhhhhhh, setHhhhhhh] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [getValueCountry, setGetValueCountry] = useState("");
  const [newCountries, setNewCountries] = useState("");
  const [api, setApi] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [countryID, setCountryID] = useState("");
  const [JobID, setJobID] = useState("");

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
    console.log("GEHAD IS ::: ", e.target.firstChild.data);
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
      .get(`http://35.184.155.34/index.php/category_positions`)
      .then((response) => {
        setallJobs(response.data.list);
        console.log(response.data.list);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (getValuejop) {
      setNewJops(
        allJobs?.filter((person) => person.positionName.includes(getValuejop))
      );
    } else {
      setNewJops([]);
    }
  }, [getValuejop]);

  const onChangeValueJob = (e) => {

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
    console.log("GEHAD IS ::: ", e.target.firstChild.data);
    setGetValueCountry(e.target.firstChild.data);
    setShowCountry(false)
  };
  const catchCountryids = (post) => {
    setGetValueCountry(post.positionName);
    setCountryID(post.id);
    console.log(post.id, "countries");
  };

  useEffect(() => {
    axios
      .get(`http://35.184.155.34/index.php/countries`)
      .then((response) => {
        setAllCountries(response.data.list);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (getValueCountry) {
      setNewCountries(
        allCountries?.filter((person) => person.name.includes(getValueCountry))
      );
    } else {
      setNewCountries([]);
    }
  }, [getValueCountry]);
  const onChangeValueCountries = (e) => {
    setGetValueCountry(e.target.value);
    if (!e.target.value) setNewCountries([]);
  };
  const sendDaTa = async () => {
    // setHhhhhhh(getValueCountry)

    try {
      await axios
        .get(
          `http://35.184.155.34/index.php/country/${countryID}/position/${JobID}/advanced`
        )
        .then((response) => {
          setGetRanges(response.data);
          console.log(response.data.currency, "ressssssssss");
        });
    } catch (e) {
      document.getElementById("red").style.borderColor = "red";
      console.log(e);
    }
  };

  const wrapperRef = useRef(null);
  const wrappercountries = useRef(null);
  useOutsideAlerter(wrapperRef);
  useOutsidecountries(wrappercountries);

  return (
    <>
      <div className="container">
        <div className={Styles.cont}>
          <div className={Styles.card}>
            <div className="row">
              <div className="col-12 col-md-5" onInput={handleOpenJops}>
                <div className={Styles.searchInput}>
                  <input
                    id="red"
                    type="text"
                    value={getValuejop}
                    placeholder="Search by job title"
                    onInput={onChangeValueJob}
                  />

                  <div ref={wrapperRef} >
                    {getValuejop && showJop? (
                      <ul className={Styles.cardSearch} onClick={getJopsData}>
                        {newjops &&
                          newjops?.map((post) => (
                            <p
                              className={Styles.select}
                              onClick={() => catchJopids(post)}
                              key={post.id}
                            >
                              {post.positionName}
                            </p>
                          ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-5" onInput={handleOpencountries}>
               <div className={Styles.searchInput}>
                  <input
                    id="red"
                    type="text"
                    value={getValueCountry}
                    placeholder={"Search by city, or country"}
                    onInput={onChangeValueCountries}
                  />

                  <div ref={wrappercountries} >
                  {getValueCountry && showCountry? ( <ul className={Styles.cardSearch} onClick={getCountriesData}>
                      {newCountries &&
                        newCountries?.map((post) => (
                          <p
                          className={Styles.select}
                            onClick={() => catchCountryids(post)}
                            key={post.id}
                          >
                            {post.name}
                          </p>
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
                <button>
                  <span style={{ marginRight: "12px" }}>
                    <img src={Search.src} />
                  </span>
                  Find Salary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SalaryRange
        getRanges={getRanges}
        getValueCountry={getValueCountry}
        getValuejop={getValuejop}
        // hhhhhhh={hhhhhhh}
      />
    </>
  );
};
export default SearchInput;
