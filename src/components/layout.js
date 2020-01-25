import React, { useContext, useLayoutEffect, useMemo } from "react"

import BackButton from "./BackButton"
import styles from "./layout.module.css"
import globalStyles from '../global.module.css'

import Context from "../context"


const Layout = (props) => {
  const { location, title, children, config, siteUrl, languageLink } = props
  const { setDynamicState } = useContext(Context)
  const isRootPath = useMemo(
    () => location.pathname === config.rootPath,
    [location, config]
  )

  useLayoutEffect(() => {
    setDynamicState({ isRootPath, languageLink })
  }, [isRootPath, languageLink, setDynamicState])

  return (
    <div className={globalStyles.container}>
      <BackButton
        to={isRootPath ? siteUrl : config.rootPath}
        isExternal={isRootPath}
      />
      <header>
        <h1 className={styles.title}>
          {isRootPath ? config.title : title}
        </h1>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
