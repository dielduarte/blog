import React from "react"

import BackButton from "./BackButton"

import styles from "./layout.module.css"

class Layout extends React.Component {
  render() {
    const { location, title, children, config, siteUrl } = this.props
    const isRootPath = location.pathname === config.rootPath

    return (
      <div className={styles.container}>
        <BackButton
          to={isRootPath ? siteUrl : config.rootPath}
          isExternal={isRootPath}
        />
        <header>
          <h1 className={styles.title}>{isRootPath ? config.title : title}</h1>
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout
