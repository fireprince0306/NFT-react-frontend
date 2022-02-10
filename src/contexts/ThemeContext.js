import React, { createContext } from "react"
import useTheme from "../hooks/useTheme"

const ThemeContext = createContext()

function ThemeProvider({ children }) {
	const { theme, setTheme, isThemeModalOpen, setThemeModalOpen } = useTheme()

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme,
				isThemeModalOpen,
				setThemeModalOpen
			}}
		>
			{children}
		</ThemeContext.Provider>
	)
}

export { ThemeContext, ThemeProvider }
