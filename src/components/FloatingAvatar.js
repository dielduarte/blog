import React from "react"

import styles from "./FloatingAvatar.module.css"

function FloatingAvatar() {
  return (
    <div className={styles.container}>
      <img
        src="/images/avatar.png"
        width="60px"
        height="60px"
        className={styles.image}
        alt="That's my avatar"
      />
    </div>
  )
}

export default FloatingAvatar
