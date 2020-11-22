import React, { useCallback, useLayoutEffect, useRef, useState } from "react"
import { navigate } from "gatsby"

const enabledLanguages = ['pt-br', 'en'];

const defaultState = {
  isDark: false,
  lang: 'en',
  setDarkTheme: () => {},
  setDynamicState: () => {},
  setLang: () => {},
  isRootPath: true,
  languageLink: ''
}

const Context = React.createContext(defaultState)


const ContextProvider = ({ children })  => {
  const supportsDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches === true

  const getThemeFromLocalStorage = () => {
    return Boolean(JSON.parse(localStorage.getItem("isDark")))
  }

  function getIsDark() {
    const dataFromLocalStorage = getThemeFromLocalStorage()
    return dataFromLocalStorage !== null
      ? dataFromLocalStorage
      : supportsDarkMode()
  }

  const getLang = () => {
    const lang = JSON.parse(localStorage.getItem("lang"))

    if(enabledLanguages.includes(lang)) {
      return lang;
    }

    return 'en'
  }

  const bodyRef = useRef(document.getElementsByTagName('body')[0])
  const [state, setState] = useState({
    lang: getLang(),
    isDark: getIsDark(),
    isRootPath: true,
    languageLink: ''
  })

  const setDarkTheme = useCallback((isDark) => {
    localStorage.setItem("isDark", JSON.stringify(isDark))
    setState(prev => ({ ...prev, isDark }))
  }, [])

  const setLang = useCallback((lang) => {
    localStorage.setItem("lang", JSON.stringify(lang))
    setState(prev => ({ ...prev, lang }))
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

  useLayoutEffect(() => {
    if(state.lang === 'pt-br' && window.location.pathname === '/blog/') {
      navigate('/pt-br')
    }
  //eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  return (
    <Context.Provider
      value={{
        ...state,
        setDarkTheme,
        setDynamicState,
        setLang
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Context
export { ContextProvider }