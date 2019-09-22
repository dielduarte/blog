import React from "react"
import { Link } from "gatsby"

import styles from "./BackButton.module.css"

function BackButton({ to, isExternal }) {
  if (isExternal) {
    return (
      <a className={styles.button} href={to}>
        {"<="}
      </a>
    )
  }

  return (
    <Link className={styles.button} to={to}>
      {"<="}
    </Link>
  )
}

export default BackButton
