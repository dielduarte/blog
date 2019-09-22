import React from "react"

import BackButton from "./BackButton"

import styles from "./layout.module.css"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const isRootPath = location.pathname === rootPath

    return (
      <div className={styles.container}>
        <BackButton
          to={isRootPath ? "http://dielduarte.github.io" : "/"}
          isExternal={isRootPath}
        />
        <header>
          <h1 className={styles.title}>
            {isRootPath ? "Welcome to my blog!" : title}
          </h1>
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout
