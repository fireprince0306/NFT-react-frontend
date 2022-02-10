import s from "./Footer.module.scss"
import React, { useContext, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeContext } from "../../contexts/ThemeContext"

const Footer = () => {
	const { theme, setTheme, isThemeModalOpen, setThemeModalOpen } =
		useContext(ThemeContext)

	const onAnimationComplete = () => {
		setTimeout(() => {
			setThemeModalOpen(false)
		}, 800)
	}

	const Pink = () => {
		return (
			<motion.div
				key={"container"}
				initial={{ y: 0, opacity: 1 }}
				animate={{ x: 0, y: 0, opacity: 1 }}
				exit={{ y: 300, opacity: 0 }}
				transition={{
					type: "tween",
					damping: 10,
					stiffness: 100
				}}
				className={`${s.hape_container}`}
			>
				<motion.span
					key={"first_word"}
					initial="hidden"
					animate="show"
					transition={{ repeat: Infinity, repeatDelay: 1 }}
					variants={{
						hidden: { opacity: 1 },
						show: {
							opacity: 1,
							transition: {
								staggerChildren: 0.03
							}
						}
					}}
					className={s.typography}
					style={{ color: "pink", fontWeight: "bold" }}
				>
					<motion.span
						variants={{
							hidden: { opacity: 1 },
							show: { opacity: 1 },
							exit: { opacity: 0 }
						}}
					>
						PINK
					</motion.span>
				</motion.span>
				<AnimatePresence>
					<motion.span
						key={"second_word"}
						initial="hidden"
						animate="show"
						variants={{
							hidden: { opacity: 1 },
							show: {
								opacity: 1,
								transition: {
									staggerChildren: 0.5
								}
							},
							exit: { opacity: 0 }
						}}
						onAnimationComplete={onAnimationComplete}
						className={s.typography}
						style={{ color: "#99007f" }}
					>
						{"PINK".split("").map((letter, i) => {
							return (
								<motion.span
									key={i}
									variants={{
										hidden: { opacity: 0 },
										show: { opacity: 1 },
										exit: { opacity: 1 }
									}}
								>
									{letter}
								</motion.span>
							)
						})}
					</motion.span>
				</AnimatePresence>
			</motion.div>
		)
	}

	const Pink2 = () => {
		return (
			<motion.div
				key={"container"}
				initial={{ y: 0, opacity: 1 }}
				animate={{ x: 0, y: 0, opacity: 1 }}
				exit={{ y: 300, opacity: 0 }}
				transition={{
					type: "tween",
					damping: 10,
					stiffness: 100
				}}
				className={`${s.hape_container}`}
			>
				<motion.div
					key={"first_word"}
					initial="hidden"
					animate="show"
					variants={{
						hidden: { opacity: 1 },
						show: {
							opacity: 1,
							transition: {
								staggerChildren: 0.5
							}
						}
					}}
					className={s.typography}
					style={{ color: "pink", fontWeight: "bold" }}
					onAnimationComplete={onAnimationComplete}
				>
					<motion.div
						className={s.text}
						variants={{
							hidden: { opacity: 1 },
							show: { opacity: 1 },
							exit: { opacity: 0 }
						}}
						style={{ fontSize: "10vw" }}
					>
						ON WEDNESDAYS
					</motion.div>
					<motion.div
						className={s.text}
						variants={{
							hidden: { opacity: 0 },
							show: { opacity: 1 },
							exit: { opacity: 0 }
						}}
						style={{ fontSize: "10vw" }}
					>
						WE
					</motion.div>{" "}
					<motion.div
						className={s.text}
						variants={{
							hidden: { opacity: 0 },
							show: { opacity: 1 },
							exit: { opacity: 0 }
						}}
						style={{ fontSize: "10vw" }}
					>
						WEAR
					</motion.div>{" "}
					<motion.div
						className={s.text}
						variants={{
							hidden: { opacity: 0 },
							show: { opacity: 1 },
							exit: { opacity: 0 }
						}}
						style={{ fontSize: "10vw", color: "rgb(160 0 195)" }}
					>
						PINK
					</motion.div>
				</motion.div>
			</motion.div>
		)
	}

	return (
		<footer className={s.footer}>
			<AnimatePresence>{isThemeModalOpen && <Pink2 />}</AnimatePresence>
		</footer>
	)
}

export default Footer
