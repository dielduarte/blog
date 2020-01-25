import React, { useContext } from "react"
import { navigate } from "gatsby"

import styles from "./FloatMenu.module.css"
import globalStyles from '../global.module.css'
import Context from "../context"

function FloatMenu() {
  const context = useContext(Context)

  const getHandleSetQuery = (desiredLang) => () => {
    if(context.isRootPath) {
      return navigate(desiredLang === 'pt-br' ? '/pt-br' : '/')
    }

    return navigate(context.languageLink)
  }

  const setPtBr = getHandleSetQuery('pt-br')
  const setEn = getHandleSetQuery('en')

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
      <div className={globalStyles.container}>
        <h4 className={styles.title}>Hey, nice to see you here!</h4>

        <h6 className={styles.subtitle}>Choose blog language</h6>
        <img
          alt="USA flag"
          src={'/images/flags/USA.png'}
          className={styles.flag}
          onClick={setEn}
        />
        <img
          alt="brazil flag"
          src={'/images/flags/brazil.png'}
          className={styles.flag}
          onClick={setPtBr}
        />

        <h6 className={styles.subtitle}>Choose blog theme</h6>

        <img
          alt="Dark Theme"
          src={'/images/vader.png'}
          className={styles.vader}
          onClick={() => context.setDarkTheme(true)}
        />
        <img
          alt="Light Theme"
          src={'/images/tropper.png'}
          className={styles.trooper}
          onClick={() => context.setDarkTheme(false)}
        />
      </div>
    </section>
  </>;
}

export default FloatMenu