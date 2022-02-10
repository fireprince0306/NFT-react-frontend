import React, { useContext, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ModalContext } from "../../contexts/ModalContext"
import s from "./Modal.module.scss"
import { CircularProgressbar } from "@hollyhoesisme/react-circular-progressbar"
import colorMap from "../Helpers/ColorMap"
import { motion, AnimatePresence } from "framer-motion"

const ModalCard = () => {
	const { entity: card, isModalOpen, setModalIsOpen } = useContext(ModalContext)

	const formatImageUrl = card => {
		return `https://d2txl75rmr4hou.cloudfront.net//fit-in/512x512/${card.token_id}.png`
	}

	const [imageSrc, setImageSrc] = useState(
		card ? formatImageUrl(card) : `/static/img/placeholderhape.png`
	)
	
	var intervalId;
	var opacity = 1;

	const onCloseModal = () => {
		if (isModalOpen)
			intervalId = setInterval(hide, 10);
	}

	function hide() {
		var modal = document.getElementById("modal-container");

		if(modal) {
			opacity = Number(window.getComputedStyle(modal).getPropertyValue("opacity"));
			if (opacity > 0) {
				opacity -= 0.2;
				modal.style.opacity = opacity;
			} else {
				clearInterval(intervalId);
				setModalIsOpen(false)
				setImageSrc(`/static/img/placeholderhape.png`)
				// Enable scolling
				document.removeEventListener("keydown", onKeyDown)
			}
		}
	}

	const onOpenModal = () => {
		// Prevent scolling
		document.addEventListener("keydown", onKeyDown)
		setImageSrc(formatImageUrl(card))
	}

	/**
	 * Close the modal when the Escape key is pressed
	 * @param {object} event
	 */
	const onKeyDown = event => {
		if (event.keyCode === 27) {
			setTimeout(()=> {
				onCloseModal();
			}, 60)
		}
	}

	useEffect(() => {
		if (isModalOpen) {
			onOpenModal()
		} else {
			onCloseModal()
		}
	}, [isModalOpen])

	const handleOpensea = () => {
		window.open(
			"https://opensea.io/assets/0x4db1f25d3d98600140dfc18deb7515be5bd293af/" +
				card.token_id
		)
	}

	const parsePercentage = number => {
		number = number / 8192
		// Convert to percentage
		number = number * 100

		if (number < 1) {
			let final = Math.ceil(number * 100) / 100
			if (final >= 1) {
				return Math.round(number)
			}
			final = final.toString().substring(1, 4)
			return final
		}
		return Math.round(number)
	}

	const [placeholderBackgroundColor, setPlaceHolderBackgroundColor] =
		useState("transparent")

	const setBackgroundColor = () => {
		if (card) {
			const background = card.traits.filter(f => f.category === "Background")[0]
				.value
			console.log(colorMap[background])
			setPlaceHolderBackgroundColor(colorMap[background])
		}
	}

	useEffect(() => {
		setBackgroundColor()
	}, [card])


	return (
		<>
			<AnimatePresence>
				{isModalOpen && card && (
					<div
						key="modal"
						id="modal-container"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div
							className={`${s.modal__backdrop} ${
								isModalOpen ? "d-block" : "d-none"
							}`}
							style={{ display: "none" }}
						>
							<div
								className={`${s.modal__modal_lg_container} modal-dialog modal-lg`}
							>
								<div className={`${s.modal__modal_content}`}>
									<div className="absolute top-0 end-0 z-5 p-2">
										<button
											type="button"
											className={`${s.modal__close_button}`}
											data-bs-dismiss="modal"
											aria-label="Close"
											onClick={onCloseModal}
										>
											X
										</button>
									</div>
									<div className={`${s.modal__modal_body}`}>
										<div className={`${s.modal__hape_container}`}>
											<div className={`${s.modal__left_side}`}>
												<div
													className={`${s.modal__left_side_inner_container}`}
												>
													<div
														className={`${s.modal__left_side_rarity_rank}`}
													></div>
													<div className={`${s.modal__hape_pfp_outside}`}>
														<div
															className={`${s.modal__hape_pfp_background}`}
															style={{
																backgroundColor: placeholderBackgroundColor
															}}
														>
															<Image
																className={`${s.modal__hape_pfp}`}
																src={imageSrc}
																alt={"Loading..."}
																placeholder={`blur`}
																blurDataURL={imageSrc}
																onError={() =>
																	setImageSrc(`/static/img/placeholderhape.png`)
																}
																priority={true}
																width={512}
																height={512}
																quality={100}
																onLoadingComplete={() =>
																	setPlaceHolderBackgroundColor("transparent")
																}
															></Image>
														</div>
													</div>
													
													<div className={`${s.modal__right_side_inner}`}>
														<div className={`${s.modal__rarity_score_title}`}>
															Rarity: {card.hape_rarity}
														</div>
													</div>
													<div className={`${s.modal__hape_id_container}`}>
														<div className={`${s.modal__hape_id}`}>
															<span>RANK {card.rank}</span>
														</div>
														<div className={`${s.modal__hape_slash}`}>/</div>
														<div className={`${s.modal__hape_id}`}>
															<span>HAPE PRIME #{card.token_id}</span>
														</div>
													</div>
													<div className={`${s.modal__opensea}`}>
														<button
															onClick={handleOpensea}
															className={`${s.modal__opensea_button}`}
														>
															<span>View on Opensea</span>
														</button>
													</div>
												</div>
											</div>

											<div className={`${s.modal__right_side}`}>
												<div className={`${s.modal__right_side_trait_section}`}>
													{card.traits.map(trait => {
														let progressPercentage = parsePercentage(trait.possession_qty);
														return (
															<div
																key={trait.category + " " + trait.value}
																className={`${s.modal__trait_container}`}
															>
																<div className={`${s.modal__trait_title}`}>
																	<div className={`${s.modal__trait_quantity}`}>
																		<div className="circle-progress-bar">
																			<div className="progress-container">
																				<div id="middle-circle">{progressPercentage}%</div>
																				<div id="progress-spinner" style={{background: `conic-gradient(#c7ad1c ${progressPercentage}%, transparent ${progressPercentage}%)`}}></div>
																			</div>
																		</div>
																		{/* <CircularProgressbar
																			value={parsePercentage(
																				trait.possession_qty
																			)}
																			text={`${parsePercentage(
																				trait.possession_qty
																			)}%`}
																		/> */}
																		{/* <div className={`CircularProgressbarPath`}>
																asd
															</div>
															<div className={`CircularProgressbarText`}>
																asd
															</div>
															<div className={`CircularProgressbarTrail`}>
																asd
															</div> */}
																	</div>
																	<div className={`${s.modal__trait_category}`}>
																		<div>{trait.value}</div>
																		<div
																			className={`${s.modal__trait_category_text}`}
																		>
																			{trait.category}
																		</div>
																	</div>
																	{/* <div className={`${s.modal__trait_eth}`}>
															123 hehe
														</div> */}
																	<div className={`${s.modal__trait_score}`}>
																		+{trait.rarity_score}
																	</div>
																</div>
															</div>
														)
													})}
												</div>
												<div className={s.modal__right_side_dna}>
													<div>
														<Image
															className={`${s.hapebeast}`}
															src={`/static/img/birthday_icon.svg`}
															priority={true}
															width={26}
															height={25}
															quality={100}
														></Image>
														<span className={s.modal__dna_text}>
															08/20/2021
														</span>
													</div>
													<div>
														<Image
															className={`${s.hapebeast}`}
															src={`/static/img/heart_number_icon.svg`}
															priority={true}
															width={23}
															height={22}
															quality={100}
														></Image>
														<span className={s.modal__dna_text}>
															132.424.200
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</>
	)
}
export default ModalCard
