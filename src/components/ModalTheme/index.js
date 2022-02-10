import React, { useContext, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ModalContext } from "../../contexts/ModalContext"
import s from "./ModalTheme.module.scss"
import { CircularProgressbar } from "@hollyhoesisme/react-circular-progressbar"
import colorMap from "../Helpers/ColorMap"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeContext } from "../../contexts/ThemeContext"

const ModalTheme = () => {
	const { entity: card, isModalOpen, setModalIsOpen } = useContext(ModalContext)
	// const { theme, setTheme, isThemeModalOpen, setThemeModalOpen } =
	// 	useContext(ThemeContext)

	const onCloseModal = () => {
		setThemeModalOpen(false)
		// Enable scolling
		document.removeEventListener("keydown", onKeyDown)
	}

	const onOpenModal = () => {
		// Prevent scolling
		document.addEventListener("keydown", onKeyDown)
	}

	/**
	 * Close the modal when the Escape key is pressed
	 * @param {object} event
	 */
	const onKeyDown = event => {
		if (event.keyCode === 27) {
			onCloseModal()
		}
	}

	// useEffect(() => {
	// 	console.log(isThemeModalOpen)
	// 	if (isThemeModalOpen) {
	// 		onOpenModal()
	// 	} else {
	// 		onCloseModal()
	// 	}
	// }, [isThemeModalOpen])

	const textToList = text => {
		return text.split("")
	}

	return (
		<>
			<AnimatePresence>
				{false && (
					<motion.div
						key="modal"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div
							className={`${s.backdrop} ${
								isThemeModalOpen ? "d-block" : "d-none"
							}`}
							style={{ display: "none" }}
						>
							<div className={`${s.modal_lg_container} modal-dialog modal-lg`}>
								<div className={`${s.modal_content}`}>
									<div className="absolute top-0 end-0 z-5 p-2">
										<button
											type="button"
											className={`${s.close_button}`}
											data-bs-dismiss="modal"
											aria-label="Close"
											onClick={onCloseModal}
										>
											X
										</button>
									</div>
									<div className={`${s.modal_body}`}>
										<motion.div
											initial={{ y: 0, opacity: 1 }}
											animate={{ x: 0, y: 0, opacity: 1 }}
											exit={{ x: -300, opacity: 0 }}
											transition={{
												type: "spring",
												damping: 10,
												stiffness: 100
											}}
											className={`${s.hape_container}`}
										>
											<motion.span
												initial="hidden"
												animate="show"
												transition={{ repeat: Infinity, repeatDelay: 1 }}
												variants={{
													hidden: { opacity: 0 },
													show: {
														opacity: 1,
														transition: {
															staggerChildren: 0.03
														}
													}
												}}
												className={s.typography}
												style={{ color: "pink" }}
											>
												<motion.span
													variants={{
														hidden: { opacity: 1 },
														show: { opacity: 1 }
													}}
												>
													PINK
												</motion.span>
											</motion.span>
											<motion.span
												initial="hidden"
												animate="show"
												transition={{ repeat: Infinity, repeatDelay: 1 }}
												variants={{
													hidden: { opacity: 0 },
													show: {
														opacity: 1,
														transition: {
															staggerChildren: 0.2
														}
													}
												}}
												className={s.typography}
												style={{ color: "#99007f" }}
											>
												{textToList("GANG").map((letter, i) => {
													return (
														<motion.span
															key={i}
															variants={{
																hidden: { opacity: 0 },
																show: { opacity: 1 }
															}}
														>
															{letter}
														</motion.span>
													)
												})}
											</motion.span>
										</motion.div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
export default ModalTheme
