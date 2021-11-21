import React, { useState } from 'react'
import Styles from './assets/salaryRange.module.scss'


const salaryRange = () => {
    const [radio, setRadio] = useState('annual');
    const [active, setActive] = useState(false);
    const changeStyle = () => {
    console.log("you just clicked");
  
    setStyle("cont2");
  };
    return (
        <div className="container">
            <div className={Styles.ranges} >
                <p className={Styles.title}>Graphic Designer Salary in Egypt</p>
                <hr/>
                <div>


                    <div className="row">
                        <div className={`col-12 col-sm-8 ${Styles.sort1}`}>
                            <div className={Styles.radios}>
                                <input type="radio" value="annual"
                                    checked={radio === "annual" ? true : false} onChange={(e) => { setRadio(e.target.value) }}
                                     />
                                <label style={{ marginRight: "10px" }} className={radio === "annual" ? Styles.unactive :Styles.active   }>Annual</label>

                                <input type="radio" value="monthly" checked={radio === "monthly" ? true : false} onChange={(e) => { setRadio(e.target.value) }} />
                                <label style={{ marginRight: "10px" }} className={radio === "monthly" ? Styles.unactive :Styles.active   }>Monthly</label>
                            </div>
                            <div className={Styles.rangeInfo}>
                                <span className="col-3" style={{ background: "#F8936D", width: "93px", height: "52px" }}></span>
                                <span className="col-3" style={{ background: "linear-gradient(90deg, #F8936D 16.67%, #9B87FF 100%)", }}></span>
                                <span className="col-3" style={{ background: "#9B87FF", width: "93px", height: "52px" }}></span>
                            </div>
                            <div className={Styles.values}>
                                <div className={Styles.min}>
                                    <p>10 %</p>
                                    <p>EGP 2.5K</p>
                                </div>
                                <div>
                                    <p>MEDIAN</p>
                                    <p>EGP 6.8K</p>
                                </div>
                                <div className={Styles.max}>
                                    <p>90 %</p>
                                    <p>EGP 12.5K</p>
                                </div>
                            </div>
                        </div>
                        <div className={`col-12 col-sm-4 ${Styles.baseSalary}`}>
                            <p className={Styles.month}>Monthly</p>
                            <p className={Styles.net}>6.830 EGP</p>
                            <p className={Styles.avg}>Avrage base salary</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default salaryRange;