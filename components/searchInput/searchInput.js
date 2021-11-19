import React, { useState, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";

const SearchInput = () => {
  const [showCountry, setShowCountry] = useState(false);
  const [showJop, setShowJop] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [jopValue, setJopValue] = useState("");
  const [getValueCountry, setGetValueCountry] = useState("");
  const [getValuejop, setGetValuejop] = useState("");
  const [newCountries, setNewCountries] = useState("");
  const [newjops, setNewJops] = useState("");
  const posts = [
    { id: "1", name: "This first post is about React" },
    { id: "2", name: "This next post is about Preact" },
    { id: "3", name: "We have yet another React post!" },
    { id: "4", name: "This is the fourth and final post" },
  ];
  const posts1 = [
    { id: "1", name: "This first post is about React" },
    { id: "2", name: "This next post is about Preact" },
    { id: "3", name: "We have yet another React post!" },
    { id: "4", name: "This is the fourth and final post" },
  ];
  const handleOpenJops = () => {
    setShowJop(true);
  };
  const handleOpencountries = () => {
    setShowCountry(true);
  };
  const getCountriesData = (e) => {
    console.log(e.target.firstChild.data);
    setCountryValue(e.target.firstChild.data);
    setGetValueCountry("");
    setShowCountry(false);
  };
  const getJopsData = (e) => {
    console.log(e.target.firstChild.data);
    setJopValue(e.target.firstChild.data);
    setGetValuejop("");
    setShowJop(false);
  };
  const getCountry = (e) => {
    setGetValueCountry(e.target.value);
    console.log(e.target.value);
  };
  const getjop = (e) => {
    setGetValuejop(e.target.value);
    console.log(e.target.value);
  };
  // const getAllCounries =  ()=> {
    
  //     axios
  //       .post(`https://paylab.com/paylab_api/v1/countries`, {
          
  //       })
  //       .then((response) => {
  //         const data = response.data;
  //         console.log(response);
  //       });
  
  // }
  // headers: { Authorization: `Bearer ${accessToken}` },
  useEffect(() => {
    // getAllCounries()
    const country = posts.filter((person) =>
      person.name.toLowerCase().includes(getValueCountry)
    );
    setNewCountries(country);
    console.log(country);

    const jop = posts.filter((person) =>
      person.name.toLowerCase().includes(getValuejop)
    );
    setNewJops(jop);
    console.log(jop);
  }, [getValueCountry, getValuejop]);

  const sendDaTa = () => {
    console.log([{ country: countryValue, jop: jopValue }]);
  };
  return (
    <>
      <div className={`container ${Styles.container}`}>
        <div className={`row ${Styles.card}`}>
          <div
            className={`col-12 col-md-5 ${Styles.searchInput}`}
            onInput={handleOpenJops}
          >
            <input
              type="text"
              value={getValuejop}
              placeholder={jopValue ? jopValue : "Search by job title"}
              onInput={getjop}
            />
            {showJop ? (
              <div className={Styles.cardSearch}>
                <ul onClick={getJopsData}>
                  {newjops.map((post) => (
                    <li key={post.id}>{post.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div
            className={`col-12 col-md-5 ${Styles.searchInput}`}
            onInput={handleOpencountries}
          >
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
          <div className={`col-2 col-md-2 ${Styles.btn}`} onClick={sendDaTa}>
            <button>Search</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchInput;
