import React, { useContext } from "react"
import { navigate } from "gatsby"

import styles from "./FloatMenu.module.css"
import globalStyles from '../global.module.css'
import Context from "../context"

function FloatMenu() {
  const context = useContext(Context)

  const getHandleSetQuery = (desiredLang) => () => {
    context.setLang(desiredLang)
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
          alt="Avatar"
          src={'/blog/images/avatar.png'}
          className={styles.avatar}
        />
      </label>
      <div className={globalStyles.container}>
        <h4 className={styles.title}>Hey, nice to see you here!</h4>

        <h6 className={styles.subtitle}>Choose blog language</h6>

        <button onClick={setEn} className={styles.option}>
          <img
            alt="USA flag"
            src={'/blog/images/flags/USA.png'}
            className={styles.flag}
          />
        </button>  
    
        <button onClick={setPtBr} className={styles.option}>
          <img
            alt="brazil flag"
            src={'/blog/images/flags/brazil.png'}
            className={styles.flag}
          />
        </button>

        <h6 className={styles.subtitle}>Choose blog theme</h6>

        <button onClick={() => context.setDarkTheme(true)} className={styles.option}>
          <img
            alt="Dark Theme"
            src={'/blog/images/vader.png'}
            className={styles.vader}
          />
        </button>
        <button onClick={() => context.setDarkTheme(false)} className={styles.option}>
          <img
            alt="Light Theme"
            src={'/blog/images/tropper.png'}
            className={styles.trooper}
          />
        </button>
      </div>
    </section>
  </>;
}

export default FloatMenu