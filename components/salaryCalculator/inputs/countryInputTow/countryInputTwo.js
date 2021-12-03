import React, { useEffect, useRef } from "react";
import Styles from "./assets/countryInputTwo.module.scss";
import { Field, ErrorMessage } from "formik";
const CountryInputTwo = (props) => {


  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");

          props.setNewCountryTwo([]);
          props.setShowMenuCountryTwo(false);
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
   props.setNewCountryTwo([]);
    console.log("GEHAD IS ::: ", e.target.firstChild.data);
    props.setGetValueCountryTwo(e.target.firstChild.data);
    props.setShowMenuCountryTwo(false);
  };

  useEffect(() => {
    if (props.getValueCountryTwo) {
      props.setNewCountryTwo(
        props.allCountryTwo?.filter((person) =>
          person.name
            .toLowerCase()
            .includes(props.getValueCountryTwo.toLowerCase())
        )
      );
    } else {
      props.setNewCountryTwo([]);
    }
  }, [props.getValueCountryTwo, props.allCountryTwo]);
  const onChangeValueCountryTwo = (e) => {
    if (props.getValueCountryTwo.length > e.target.value.length) {
      // setJobID(null);
    }
    props.setGetValueCountryTwo(e.target.value);
    if (!e.target.value) props.setNewCountryTwo([]);
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
        value={props.getValueCountryTwo}
        type="text"
        onInput={onChangeValueCountryTwo}
        placeholder="United Kingdom"
      />
      <ErrorMessage
        name="countryTwo"
        render={(msg) => (
          <div style={{ color: "#808080", marginTop: "10px" }}>{msg}</div>
        )}
      />
      <div ref={wrapperRef}>
        {props.getValueCountryTwo && props.showMenuCountryTwo ? (
          <ul className={Styles.cardSearch} onClick={getCountryTwoData}>
            {props.newCountryTwo &&
              props.newCountryTwo?.map((post) => (
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
