import React, { useState, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";
import Search from "./assets/image/Search.png";
import SalaryRange from "../salaryRange/salaryRange";
import axios from "axios";
// import axios from "../../axios";

const SearchInput = () => {
  const [showJop, setShowJop] = useState(false);
  const [jopValue, setJopValue] = useState("");
  const [getValuejop, setGetValuejop] = useState("");
  const [newjops, setNewJops] = useState("");
  const [apiJops, setApiJops] = useState([]);
  const [getRanges, setGetRanges] = useState("");
  ////////////////////countries/////////////////////
  const [showCountry, setShowCountry] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [getValueCountry, setGetValueCountry] = useState("");
  const [newCountries, setNewCountries] = useState("");
  const [api, setApi] = useState([]);
  const [countryID, setCountryID] = useState('')
  const [JobID, setJobID] = useState('')
  const handleOpenJops = () => {
    setShowJop(true);
  };

  const getJopsData = (e) => {
    console.log(e.target.firstChild.data);
    setJopValue(e.target.firstChild.data);
    setGetValuejop("");
    setShowJop(false);
  };
  const getjop = (e) => {
    setGetValuejop(e.target.value);
    console.log(e.target.value);
  };
  const catchJopids = (post) => {
    console.log(post, "ssssss");
    setJobID(post)
  };
  useEffect(() => {
    axios
      .get(`http://35.184.155.34/index.php/category_positions`)
      .then((response) => {
        const data = response.data.list;
        setApiJops(response.data.list);
        console.log(response.data.list);
      });
    const jop = apiJops.filter((person) =>
      person.positionName.toLowerCase().includes(getValuejop)
    );
    setNewJops(jop);
    console.log(jop, "SSSSSSSSSSSSSS");
  }, [getValuejop]);

  const handleOpencountries = () => {
    setShowCountry(true);
  };
  const getCountriesData = (e) => {

    console.log(e.currentTarget.firstChild.data, "ssssss");

    setCountryValue(e.target.firstChild.data);
    setGetValueCountry("");
    setShowCountry(false);
  };
  const catchCountryids = (post) => {
    console.log(post, "ssssss");
    setCountryID(post)
  };



  const getCountry = (e) => {
    setGetValueCountry(e.target.value);
    console.log(e.target.value);
  };
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
        .get(`http://35.184.155.34/index.php/country/${countryID}/position/${JobID}/advanced`)
        .then((response) => {
          setGetRanges(response.data)
          console.log(response.data.currency, "ressssssssss")
        });
    } catch (e) {
      document.getElementById("red").style.borderColor = "red"
      console.log(e)
    }

  };

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
                    onInput={getjop}
                  />
                  {showJop ? (
                    <div className={Styles.cardSearch}>
                      <ul onClick={getJopsData}>
                        {newjops.map((post) => (
                          <li onClick={() => catchJopids(post.id)} key={post.id}>{post.positionName}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-12 col-md-5" onInput={handleOpencountries}>
                <div className={Styles.searchInput}>
                  <input
                    id="red"
                    type="text"
                    value={getValueCountry}
                    placeholder={
                      countryValue ? countryValue : "Search by city, or country"
                    }
                    onInput={getCountry}
                  />
                  {showCountry ? (
                    <div className={Styles.cardSearch}>
                      <ul onClick={getCountriesData}>
                        {newCountries.map((post) => (
                          <li onClick={() => catchCountryids(post.id)} key={post.id}>{post.name}</li>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <SalaryRange getRanges={getRanges} />
    </>
  );
};
export default SearchInput;
