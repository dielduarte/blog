import React, { useCallback, useLayoutEffect, useRef, useState } from "react"


const supportsDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches === true

function getIsDark() {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem("isDark"))
  return dataFromLocalStorage !== null
    ? dataFromLocalStorage
    : supportsDarkMode()
}

const defaultState = {
  isDark: getIsDark(),
  setDarkTheme: () => {},
  setDynamicState: () => {},
  isRootPath: true,
  languageLink: ''
}

const Context = React.createContext(defaultState)


const ContextProvider = ({ children })  => {
  const bodyRef = useRef(document.getElementsByTagName('body')[0])
  const [state, setState] = useState({
    isDark: getIsDark(),
    isRootPath: true,
    languageLink: ''
  })

  const setDarkTheme = useCallback((isDark) => {
    localStorage.setItem("isDark", JSON.stringify(isDark))
    setState(prev => ({ ...prev, isDark }))
  }, [])

  const setDynamicState = useCallback(({ isRootPath, languageLink }) => {
    setState(prev => ({ ...prev, isRootPath, languageLink }))
  }, [])

  useLayoutEffect(() => {
    if(state.isDark) {
      bodyRef.current.classList.remove('light-theme')
    } else if(!bodyRef.current.classList.contains('light-theme')) {
      bodyRef.current.classList.add('light-theme')
    }
  }, [state.isDark, bodyRef])

  return (
    <Context.Provider
      value={{
        ...state,
        setDarkTheme,
        setDynamicState
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Context
export { ContextProvider }