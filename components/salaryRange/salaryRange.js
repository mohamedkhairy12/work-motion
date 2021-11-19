import React, { useState } from 'react'
// import ReactRanger from 'react-ranger'
// import { useRanger } from 'react-ranger'
import ReactDOM from "react-dom";
// import styled, { createGlobalStyle } from "styled-components";
import { useRanger } from "react-ranger";
import Styles from './assets/salaryRange.module.scss'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const salaryRange = () => {
    const [radio, setRadio] = useState('apple')
    return (
        <div className="container">    
        <div className={Styles.ranges} >
            <p className={Styles.title}>Graphic Designer Salary in Egypt</p>
            <hr style={{ border: "1px solid #EFF0F5" }} />
            
                <div >
                    <input type="radio" value="apple" checked={radio === "apple"} onChange={(e) => { setRadio(e.target.value) }} />
                    <label style={{marginRight:"10px"}}>{radio}</label>

                    <input type="radio" value="orange" checked={radio === "orange"} onChange={(e) => { setRadio(e.target.value) }} />
                    <div className="row">
                        {/* <Range max={60} min={10} step={8}/> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default salaryRange;