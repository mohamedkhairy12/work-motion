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
  const [showCountry, setShowCountry] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [getValueCountry, setGetValueCountry] = useState("");
  const [newCountries, setNewCountries] = useState("");
  const [api, setApi] = useState([]);
  const [countryID, setCountryID] = useState("");
  const [JobID, setJobID] = useState("");
  const [openMenu, setopenMenu] = useState(false);

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
  };
  const catchJopids = (post) => {
    setGetValuejop(post.positionName);
    setJobID(post);
  };
  useEffect(() => {
    axios
      .get(`http://35.184.155.34/index.php/category_positions`)
      .then((response) => {
        setallJobs(response.data.list);
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
    console.log("===============new e=====================");
    console.log(e);
    console.log("====================================");
    setGetValuejop(e.target.value);
    if (!e.target.value) setNewJops([]);
  };

  // const handleOpencountries = () => {
  //   setShowCountry(true);
  // };
  // const getCountriesData = (e) => {
  //   console.log(e.currentTarget.firstChild.data, "ssssss");

  //   setCountryValue(e.target.firstChild.data);
  //   // setGetValueCountry("");
  //   // getValueCountry
  //   setGetValueCountry(e.target.firstChild.data);
  //   setShowCountry(false);
  // };
  // const catchCountryids = (post) => {
  //   console.log(post, "ssssss");
  //   setCountryID(post);
  // };

  // const getCountry = (e) => {
  //   setGetValueCountry(e.target.value);
  //   console.log(e.target.value);
  // };
  useEffect(() => {
    axios.get(`http://35.184.155.34/index.php/countries`).then((response) => {
      const data = response.data;
      setApi(response.data.list);
      console.log(response.data.list);
      console.log(api);
    });
    const country = api.filter((person) =>
      person.name.toLowerCase().includes(getValueCountry)
    );
    setNewCountries(country);
    console.log(country);
  }, [getValueCountry]);

  const sendDaTa = async () => {
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
  useOutsideAlerter(wrapperRef);

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
                    // onBlur={onBlur}
                  />

                  <div ref={wrapperRef} className={Styles.cardSearch}>
                    <ul onClick={getJopsData}>
                      {newjops &&
                        newjops?.map((post) => (
                          <li
                            style={{ backgroundColor: "red", marginBlock: 5 }}
                            onClick={() => catchJopids(post)}
                            key={post.id}
                          >
                            {post.positionName}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* <div className="col-12 col-md-5" onInput={handleOpencountries}>
                <div className={Styles.searchInput}>
                  <input
                    id="red"
                    type="text"
                    value={getValueCountry}
                    placeholder={"Search by city, or country"}
                    onInput={getCountry}
                  />
                  {showCountry ? (
                    <div className={Styles.cardSearch}>
                      <ul onClick={getCountriesData}>
                        {newCountries.map((post) => (
                          <li
                            onClick={() => catchCountryids(post.id)}
                            key={post.id}
                          >
                            {post.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <SalaryRange getRanges={getRanges} />
    </>
  );
};
export default SearchInput;
