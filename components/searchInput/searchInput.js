import React, { useState, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";
import Search from "./assets/image/Search.png";
import axios from "axios";
// import axios from "../../axios";

const SearchInput = () => {
  const [showJop, setShowJop] = useState(false);
  const [jopValue, setJopValue] = useState("");
  const [getValuejop, setGetValuejop] = useState("");
  const [newjops, setNewJops] = useState("");
  const [apiJops, setApiJops] = useState([]);
  
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
  
  useEffect(() => {
    axios.get(`http://35.184.155.34/index.php/category_positions`)
    .then((response) => {
      const data = response.data.list;
      setApiJops(response.data.list);
      console.log(response.data.list);
    });
    const jop = apiJops.filter((person) =>
      person.positionName.toLowerCase().includes(getValuejop)
    );
    setNewJops(jop);
    console.log(jop,"SSSSSSSSSSSSSS");
  }, [ getValuejop]);

  const sendDaTa = () => {
    console.log([{jop: jopValue }]);
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
                    type="text"
                    value={getValuejop}
                    placeholder={jopValue ? jopValue : "Search by job title"}
                    onInput={getjop}
                  />
                  {showJop ? (
                    <div className={Styles.cardSearch}>
                      <ul onClick={getJopsData}>
                        {newjops.map((post) => (
                          <li key={post.id}>{post.positionName}</li>
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
           
                  <span style={{marginRight:"12px"}}>
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
