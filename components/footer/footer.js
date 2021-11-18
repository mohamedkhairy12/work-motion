import React from 'react'
import Styles from './assets/footer.module.scss'
import Logo from './assets/wm-logo.png'
import LinkedIn from './assets/LinkedIn.png'
import FaceBook from './assets/FaceBook.png'
import Twitter from './assets/twitter.png'

const footer = () => {
    return (
        <div className={Styles.footer}>
            <div className={`container ${Styles.cont}`}>
                <div className="row">
                    <div className="col-2">
                        <img src={Logo.src} />
                        <div className={Styles.social}>
                            <img src={LinkedIn.src} />
                            <img src={Twitter.src} />
                            <img src={FaceBook.src} />
                        </div>
                        <p className={Styles.address}>Richard-Ermisch-Str. 7, 10247 Berlin, Germany  WorkMotion Software GmbH registered with the commercial register in Germany under HRB 219211 B.</p>
                    </div>
                    <div className="col-2">
                        <p className={Styles.title}>Product</p>
                        <p className={Styles.desc}>Workmotion Platform</p>
                    </div>
                    <div className="col-2">
                        <p className={Styles.title}>Services</p>
                        <p className={Styles.desc}>How it works</p>
                        <p className={Styles.desc}>Features</p>
                    </div>
                    <div className="col-2">
                        <p className={Styles.title}>Resources</p>
                        <p className={Styles.desc}>Blog</p>
                        <p className={Styles.desc}>FAQ</p>
                        <p className={Styles.desc}>Privacy Policy</p>
                        <p className={Styles.desc}>Imprint</p>
                        <p className={Styles.desc}>Help Center</p>

                    </div>
                    <div className="col-2">
                        <p className={Styles.title}>About Us</p>
                        <p className={Styles.desc}>Meet our team</p>
                    </div>
                    <div className="col-2">
                        <p className={Styles.title}>Careers</p>
                        <p className={Styles.desc}>We're hiring</p>
                    </div>
                </div>
                <div className={`row ${Styles.rowTwo}`}>
                    <div className="col-9">
                        <p className={Styles.descTwo}>WorkMotion Software GmbH</p>
                    </div>
                    <div className="col-3">
                        <button className={Styles.btn}>
                            Book a free Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default footer
