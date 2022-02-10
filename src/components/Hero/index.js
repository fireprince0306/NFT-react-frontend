import Image from "next/image"
import { FaInternetExplorer, FaTwitter, FaInstagram } from "react-icons/fa"
import s from "./Hero.module.scss"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeContext } from "../../contexts/ThemeContext"
import { useContext } from "react"

const Hero = () => {
	const { theme, setTheme, isThemeModalOpen, setThemeModalOpen } =
		useContext(ThemeContext)

	const handleOpensea = () => {
		window.open("https://opensea.io/collection/hapeprime")
	}

	return (
		<section className="px-4 text-center">
			<div className={`${s.logo_container}`}>
				<Image
					className={`${s.hapebeast}`}
					src={`/static/img/hapebeastsvg.svg`}
					priority={true}
					width={648 / 4.5}
					height={56 / 4.5}
					quality={100}
					alt={"HAPEBEAST LOGO"}
				></Image>
				<AnimatePresence>
					<div className={`${s.title}`}>
						{theme !== "#79238c" && (
							<motion.div
								key={"#79238c"}
								className={`${s.logo}`}
								initial={{ y: 25, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: -300, opacity: 0 }}
								transition={{
									type: "spring",
									damping: 25,
									stiffness: 100
								}}
							>
								HAPE RARITY
							</motion.div>
						)}
						{theme === "#79238c" && (
							<motion.div
								key={"gold"}
								className={`${s.logo}`}
								initial={{ y: 25, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: -300, opacity: 0 }}
								transition={{
									type: "spring",
									damping: 25,
									stiffness: 100
								}}
							>
								PINK PRIMES
							</motion.div>
						)}
					</div>
				</AnimatePresence>
			</div>
			<div className="col-lg-6 mx-auto">
				<button onClick={handleOpensea} className={`${s.opensea}`}>
					View On Opensea
				</button>
			</div>
		</section>
	)
}

export default Hero
