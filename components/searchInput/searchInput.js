import React, { useState, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";
import Search from "./assets/image/Search.png";
import axios from "axios";
// import axios from "../../axios";

const SearchInput = () => {
  const [showCountry, setShowCountry] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [getValueCountry, setGetValueCountry] = useState("");
  const [newCountries, setNewCountries] = useState("");
  const [api, setApi] = useState([]);

  const handleOpencountries = () => {
    setShowCountry(true);
  };
  const getCountriesData = (e) => {
    console.log(e.target.firstChild.data);
    setCountryValue(e.target.firstChild.data);
    setGetValueCountry("");
    setShowCountry(false);
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

  const sendDaTa = () => {
    console.log([{ country: countryValue }]);
  };

  return (
    <>
      <div className="container">
        <div className={Styles.cont}>
          <div className={Styles.card}>
            <div className="row">
              <div className="col-12 col-md-5" onInput={handleOpencountries}>
                <div className={Styles.searchInput}>
                  <input
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
                          <li key={post.id}>{post.name}</li>
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
    </>
  );
};
export default SearchInput;
