import Head from "next/head"
import s from "../styles/Home.module.scss"
import React, { useState, useEffect, useContext, useRef } from "react"
import Header from "../src/components/Header/Header"

import Hero from "../src/components/Hero"
import CardList from "../src/components/CardList"

import { ModalProvider } from "../src/contexts/ModalContext"

import { motion, AnimatePresence, useAnimation, useCycle } from "framer-motion"
import { ThemeContext } from "../src/contexts/ThemeContext"
import { useDimensions } from "../src/hooks/useDimensions"
import useDidMountEffect from "../src/hooks/useDidMountEffect"
import Footer from "../src/components/Footer"
import { SideFilter } from "../src/components/SideFilter"

export default function Home({ users }) {
	const [admin, setAdmin] = useState(false)
	const [adminCheck, setAdminCheck] = useState("")
	const [filters, setFilters] = useState(null)

	const { theme, setTheme } = useContext(ThemeContext)
	useEffect(async () => {
		console.log(REACT_APP_API_URI)
		// GET filters
		let filtersResult = await fetch(`${REACT_APP_API_URI}/api/getfilters`, {
			method: "GET"
		})

		let finalFilters = await filtersResult.json()
		finalFilters = finalFilters.data
		setFilters(finalFilters)
	}, [])

	const handleAdminCheck = e => {
		if (e.target.value === "privatehapeyboi") {
			setAdmin(false)
		}
	}

	const getBackgroundColor = () => {
		return "#1c1c1c"
	}

	const controls = useAnimation()

	const handleColorChange = theme => {
		controls.start({
			backgroundColor: theme,
			transition: { duration: 0.3 }
		})
		setTheme(theme)
		document.body.style.backgroundColor = theme
	}
	useDidMountEffect(() => {
		handleColorChange(theme)
	}, [theme])

	// const wipe = {
	// 	open: (height = 1000) => ({
	// 		clipPath: `circle(${5000}px at 100px 500px)`,
	// 		transition: {
	// 			type: "spring",
	// 			stiffness: 20,
	// 			restDelta: 2
	// 		}
	// 	}),
	// 	closed: {
	// 		transition: {
	// 			delay: 0.5,
	// 			type: "spring",
	// 			stiffness: 400,
	// 			damping: 40
	// 		}
	// 	}
	// }

	const [isOpen, toggleOpen] = useCycle(false, true)
	const containerRef = useRef(null)
	const { height } = useDimensions(containerRef)
console.log("entered")
	return (
		<div>
			<Header />
			<style jsx global>{`
				body {
					background-color: ${getBackgroundColor()};
				}

				html,
				body,
				body > div,
				#CustomBody {
					height: 100%;
					z-index: -1;
				}
			`}</style>
			{/* <SideFilter /> */}

			<AnimatePresence>
				<motion.div
					//initial={false}
					//animate={isOpen ? "open" : "closed"}
					animate={controls}
					ref={containerRef}
					id="CustomBody"
					// className={s.background_wipe}
					// variants={wipe}
					style={{ backgroundColor: getBackgroundColor() }}
				>
					{/* <button onClick={() => toggleOpen()}>asldfkn</button> */}
					<button onClick={() => handleColorChange("#1c1c1c")}>black</button>

					{/* <motion.div
						id="BackgroundWipe"
						className={s.background_wipe}
						variants={wipe}
						style={{ height: height }}
					/> */}
					{admin ? (
						<div>
							<input onChange={handleAdminCheck}></input>
						</div>
					) : (
						<>
							<Head>
								<title>HAPE RARITY</title>
								<link rel="icon" href="/favicon.ico" />
							</Head>
							<div className={s.background}>
								<main
									className={`${s["main-container"]} container-md relative z-5`}
								>
									<Hero />
									<ModalProvider>
										<div style={{ display: "block" }}>
											<CardList users={users} filters={filters} />
										</div>
									</ModalProvider>
								</main>
								<Footer></Footer>
							</div>
						</>
					)}
				</motion.div>
			</AnimatePresence>
			<Footer />
		</div>
	)
}

const { REACT_APP_API_URI } = process.env

export async function getServerSideProps({ res }) {
	// GET hapes
	const params = JSON.stringify({})
	let hapesResult = await fetch(`${REACT_APP_API_URI}/api/users?filters=${params}`, {
		method: "GET"
	})
	
	let hapes = await hapesResult.json()
	hapes = hapes.data
	//hehe
	const users = hapes

	res.setHeader(
		"Cache-Control",
		"max-age=86400, s-maxage=86400, stale-while-revalidate"
	)

	return {
		props: { users }
	}
}
