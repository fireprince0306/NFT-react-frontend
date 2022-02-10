import "../styles/global/index.scss"
import "../styles/progress.css"
import React, { useContext } from "react"
import { ThemeProvider } from "../src/contexts/ThemeContext"

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider>
			{" "}
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
