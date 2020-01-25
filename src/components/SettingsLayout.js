import React from "react"
import FloatMenu from "./FloatMenu"
import { ContextProvider } from '../context'

export default ({ children }) => {
  return (
    <ContextProvider>
      {children}
      <FloatMenu />
    </ContextProvider>
  )
}