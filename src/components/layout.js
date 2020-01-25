import React from "react"

import BackButton from "./BackButton"

import styles from "./layout.module.css"
import FloatMenu from "./FloatMenu"

class Layout extends React.Component {
  render() {
    const { location, title, children, config, siteUrl, languageLink } = this.props
    const isRootPath = location.pathname === config.rootPath

    return (
      <div className={styles.container}>
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

        <FloatMenu
          location={location.pathname}
          isRootPath={isRootPath}
          languageLink={languageLink}
        />
      </div>
    )
  }
}

export default Layout
