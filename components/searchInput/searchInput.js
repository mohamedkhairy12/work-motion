import React, { useState, useEffect } from "react";
import Styles from "./assets/searchInput.module.scss";

const SearchInput = () => {
  const [show, setShow] = useState(false);
  const [valueclick, setValueclick] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [news, setNews] = useState("");
  const posts = [
    { id: "1", name: "This first post is about React" },
    { id: "2", name: "This next post is about Preact" },
    { id: "3", name: "We have yet another React post!" },
    { id: "4", name: "This is the fourth and final post" },
  ];
  const handleOpen = () => {
    setShow(true);
  };
  const getData = (e) => {
    console.log(e.target.firstChild.data);
    setValueclick(e.target.firstChild.data);
    setValueInput("");
    setShow(false);
  };
  const getValue = (e) => {
    setValueInput(e.target.value);
    console.log(e.target.value);
  };
  useEffect(() => {
    const results = posts.filter((person) =>
      person.name.toLowerCase().includes(valueInput)
    );
    setNews(results);
    console.log(results);
  }, [valueInput]);
  return (
    <>
      <div className="container">
        <div className={`row ${Styles.container}`}>
          <div className={`col-6 ${Styles.card}`}>
            <div className={Styles.searchInput} onInput={handleOpen}>
              <input
                type="text"
                value={valueInput}
                placeholder={valueclick}
                onInput={getValue}
              />
             
            </div>
            {show ? (
              <div className={Styles.cardSearch}>
                <ul onClick={getData}>
                  {news.map((post) => (
                    <li key={post.id}>{post.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchInput;
