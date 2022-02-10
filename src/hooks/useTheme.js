import { useState } from "react"

function useTheme() {
	const [theme, setTheme] = useState(null)
	const [isThemeModalOpen, setThemeModalOpen] = useState(null)

	return {
		theme,
		setTheme,
		isThemeModalOpen,
		setThemeModalOpen
	}
}

export default useTheme
