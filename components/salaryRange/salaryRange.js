import React, { useState } from 'react'
import Styles from './assets/salaryRange.module.scss'
import 'rc-slider/assets/index.css';


const salaryRange = () => {
    const [radio, setRadio] = useState('apple');
    const [active, setActive] = useState(false);
    return (
        <div className="container">
            <div className={Styles.ranges} >
                <p className={Styles.title}>Graphic Designer Salary in Egypt</p>
                <hr style={{ border: "1px solid #EFF0F5" }} />
                <div>


                    <div className="row">
                        <div className={`col-12 col-sm-8 ${Styles.sort1}`}>
                            <div className={Styles.radios}>
                                <input type="radio" value="apple"
                                    checked={radio === "apple"} onChange={(e) => { setRadio(e.target.value) }}
                                    onClick={() => setActive(prev => !prev)} className={active ? 'active' : 'inactive'} />
                                <label style={{ marginRight: "10px" }}>Annual</label>

                                <input type="radio" value="orange" checked={radio === "orange"} onChange={(e) => { setRadio(e.target.value) }} />
                                <label style={{ marginRight: "10px" }}>Monthly</label>
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
                            <p style={{ fontWeight: "bold", color: "#00234B", fontSize: "16px" }}>Monthly</p>
                            <p style={{ fontWeight: "bold", color: "#00234B", fontSize: "32px", margin: " 10px 0px" }}>6.830 EGP</p>
                            <p style={{ fontWeight: "bold", color: "#00234B", fontSize: "14px" }}>Avrage base salary</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default salaryRange;