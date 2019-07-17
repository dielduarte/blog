import React from "react"
import { Link } from "gatsby"

import BackButton from "./BackButton"

import styles from "./layout.module.css"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const isRootPath = location.pathname === rootPath

    return (
      <div className={styles.container}>
        <BackButton to={"/"} />
        <header>
          <h1 className={styles.title}>
            <Link className={styles.link} to={`/`}>
              {isRootPath ? "Welcome to my blog!" : title}
            </Link>
          </h1>
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout
