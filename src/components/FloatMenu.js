import React from 'react'

import styles from "./FloatMenu.module.css"

function FloatMenu() {
  return <>
    <input type="checkbox" id="openSettings" className={styles.openSettings}/>
    <section className={styles.menu}>
      <label htmlFor="openSettings">
        <img
          alt="brazil flag"
          src={'/images/avatar.png'}
          className={styles.avatar}
        />
      </label>
      <div className={styles.container}>
        <h4 className={styles.title}>Hey, nice to see you here!</h4>

        <h6 className={styles.subtitle}>Choose blog language</h6>
        <img
          alt="USA flag"
          src={'/images/flags/USA.png'}
          className={styles.flag}
        />
        <img
          alt="brazil flag"
          src={'/images/flags/brazil.png'}
          className={styles.flag}
        />

        <h6 className={styles.subtitle}>Choose blog theme</h6>

        <img
          alt="Dark Theme"
          src={'/images/vader.png'}
          className={styles.vader}
        />
        <img
          alt="Light Theme"
          src={'/images/tropper.png'}
          className={styles.trooper}
        />
      </div>
    </section>
  </>;
}

export default FloatMenu