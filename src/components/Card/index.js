import React, { useContext, useState, useEffect, useRef } from "react"
import { FaSuitcase } from "react-icons/fa"
import Image from "next/image"
import s from "./Card.module.scss"
import useOnScreen from "../../hooks/useOnScreen"
import colorMap from "../Helpers/ColorMap"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ModalContext } from "../../contexts/ModalContext"

const Card = ({ card, onReadMore, isJob }) => {
	const { isModalOpen } = useContext(ModalContext)
	const { token_id, rank, traits } = card
	const [loading, setLoading] = useState(true)

	const cardRef = useRef(null)
	const isOnScreen = useOnScreen(cardRef)

	const [imageSrc, setImageSrc] = useState(
		`https://d2txl75rmr4hou.cloudfront.net/fit-in/300x300/${token_id}.png`
	)

	const getBackgroundColor = () => {
		const background = traits.filter(f => f.category === "Background")[0].value
		return colorMap[background]
	}

	const item = {
		hidden: { opacity: 0 },
		show: { opacity: 1 }
	}

	function handleClick(evt){
		var element = document.getElementById(evt.target.id);
		fade(element);
	
	}

	var intervalId;
	var opacity = 0;
	const onCardClick = () => {
		if (!isModalOpen)
			setTimeout(()=> {
				intervalId = setInterval(show, 10);
			}, 60)
	}

	function show() {
		var modal = document.getElementById("modal-container");
		if(modal) {
			opacity = Number(window.getComputedStyle(modal).getPropertyValue("opacity"));
			if (opacity < 1) {
				opacity += 0.2;
				modal.style.opacity = opacity;
			} else {
				clearInterval(intervalId);
			}
		}
	}

	return (
		<div className={`${s["bad-col-3"]} ${s.zoom} d-flex`} data-item="card" onClick={onCardClick}>
			<motion.div variants={item}>
				<div
					className={`${s.scene}`}
					onClick={() => {
						onReadMore(card)
					}}
				>
					<div ref={cardRef} className={s.card}>
						{isOnScreen && (
							<div
								className={`${s["card__face"]} ${s["card__face--front"]}`}
								style={{ backgroundColor: () => getBackgroundColor() }}
							>
								<div>
									<span
										className={`${s.token_id} absolute top-0 end-0 z-5 p-2`}
									>
										#{token_id}
										{traits.background}
									</span>
									<span className={`${s.rank} absolute top-0 start-0 z-5 p-2`}>
										{rank}
									</span>
									<Image
										className={`${s.avatar_image}`}
										placeholder={`blur`}
										src={imageSrc}
										blurDataURL={imageSrc}
										onError={() => {
											console.log(token_id)
										}}
										priority={true}
										width={300}
										height={300}
										quality={100}
										alt={token_id}
										onLoadingComplete={() => setLoading(false)}
									></Image>
								</div>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default Card
