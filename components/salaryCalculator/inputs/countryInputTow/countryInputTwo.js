import React, { useEffect, useRef, useState } from "react";
import Styles from "./assets/countryInputTwo.module.scss";
import { Field, ErrorMessage } from "formik";
const CountryInputTwo = ({getValueCountryTwo,getValueCountryOne,allCountryTwo,newCountryTwo,setNewCountryTwo,errors,showMenuCountryTwo,setShowMenuCountryTwo,setGetValueCountryTwo}) => {
const [matchCountries, setMatchCountries] = useState(false)

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");

          setNewCountryTwo([]);
          setShowMenuCountryTwo(false);
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

  const getCountryTwoData = (e) => {
   setNewCountryTwo([]);
    console.log("GEHAD IS ::: ", e.target.firstChild.data);
    setGetValueCountryTwo(e.target.firstChild.data);
    setShowMenuCountryTwo(false);
  };

  useEffect(() => {
    let match = allCountryTwo.map((i)=>i.name)
    setMatchCountries(match.includes(getValueCountryTwo))
    if (getValueCountryTwo) {
      setNewCountryTwo(
      allCountryTwo?.filter((person) =>
          person.name
            .toLowerCase()
            .includes(getValueCountryTwo.toLowerCase())
        )
      );
    } else {
      setNewCountryTwo([]);
    }
  }, [getValueCountryTwo,allCountryTwo,setNewCountryTwo]);
  const onChangeValueCountryTwo = (e) => {
    if (getValueCountryTwo.length > e.target.value.length) {
      // setJobID(null);
    }
    setGetValueCountryTwo(e.target.value);
    if (!e.target.value) setNewCountryTwo([]);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <div className={Styles.searchInput}>
      <p className={Styles.label}>Country 2</p>
      <Field
        autoComplete="off"
        name="countryTwo"
        id="red"
        value={getValueCountryTwo}
        type="text"
        onInput={onChangeValueCountryTwo}
        placeholder="Select Country 2"
      />
      
      <p>{ getValueCountryTwo==getValueCountryOne  || !getValueCountryTwo  || !matchCountries ? errors.second_country:''}</p>
     
     
      {/* <ErrorMessage
        name="countryTwo"
        render={(msg) => (
          <div style={{ color: "#808080", marginTop: "10px" }}>{msg}</div>
        )}
      /> */}
      <div ref={wrapperRef}>
        {getValueCountryTwo && showMenuCountryTwo ? (
          <ul className={Styles.cardSearch} onClick={getCountryTwoData}>
            {newCountryTwo &&
             newCountryTwo?.map((post) => (
                <li
                  className={Styles.select}
                  key={post.name}
                >
                  {post.name}
                </li>
              ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default CountryInputTwo;
