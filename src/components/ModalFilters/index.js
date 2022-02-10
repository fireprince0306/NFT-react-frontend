import React, { useContext, useEffect, useState, useRef } from "react"
import Image from "next/image"
import { FaSuitcase, FaTwitter } from "react-icons/fa"
import { IoLogoDiscord } from "react-icons/io5"
import Select from "react-select"
import { useScrollPosition } from "@n8tb1t/use-scroll-position"
import { ScrollTo } from "react-scroll-to"

import { ModalContext } from "../../contexts/ModalContext"

import s from "./ModalFilters.module.scss"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import traitsListed from "../../../zHapeStorage/migrationTraitListed"
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion"

const ModalFilters = ({ filters }) => {
	const {
		isFilterModalOpen,
		setIsFilterModalOpen,
		appliedFilters,
		setAppliedFilters,
		searchedToken,
		setSearchedToken,
		appliedSortBy,
		setAppliedSortBy
	} = useContext(ModalContext)

	const [searchByToken, setSearchByToken] = useState("")
	const [sortBy, setSortBy] = useState(null)
	const [selectedFilters, setSelectedFilters] = useState([])

	const onCloseModal = () => {
		setIsFilterModalOpen(false)
		setSearchByToken("")
		// Enable scolling
		document.removeEventListener("keydown", onKeyDown)
	}

	const onOpenModal = () => {
		// Prevent scolling
		document.addEventListener("keydown", onKeyDown)
		if (appliedFilters) {
			//setSelectedFilters(appliedFilters)
			localSelectedFilters = appliedFilters
		} else {
			//setSelectedFilters([])
			localSelectedFilters = []
		}
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

	useEffect(() => {
		if (isFilterModalOpen) {
			onOpenModal()
		} else {
			onCloseModal()
		}
	}, [isFilterModalOpen])

	useDidMountEffect(() => {
		if (appliedFilters) {
			setSelectedFilters(appliedFilters)
		}
	}, [appliedFilters])

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

	const isSearchingByTokenId = () => {
		return (
			!isNaN(+searchByToken) && searchByToken !== null && searchByToken !== ""
		)
	}

	const TraitFilter = props => {
		const [isTraitsOpen, setTraitsOpen] = useState(false)

		const checkCategoryOpens = category => {
			const isOpen = selectedFilters.some(f => f.category === category)
			setTraitsOpen(isOpen)
		}

		useEffect(() => {
			checkCategoryOpens(props.category)
		}, [])

		const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 })
		const elementRef = useRef()
		const boundingRef = useRef()

		// Element scroll position
		// useScrollPosition(
		// 	({ currPos }) => {
		// 		console.log(currPos)
		// 		setElementPosition(currPos)
		// 		console.log(elementPosition)
		// 	},
		// 	[],
		// 	elementRef,
		// 	false,
		// 	300,
		// 	boundingRef
		// )

		// useEffect(() => {}, [elementPosition])

		return (
			<>
				<div className={`${s.modal__filter_outer_container}`}>
					<h3 className={`${s.modal__flow_root}`}>
						<button
							onClick={() => setTraitsOpen(!isTraitsOpen)}
							type={`button`}
							className={`${s.modal__filter_inner_container}`}
							disabled={isSearchingByTokenId()}
						>
							<span
								className={`${s.modal__filter_span} ${
									props.category === "Special" ? s.modal__special : ""
								}`}
							>
								{" "}
								{searchByToken}
								{props.category === "Special" ? (
									<Image
										className={`${s.modal__filter_icon} ${s.modal__special}`}
										src={`/static/img/Special_H.svg`}
										alt={"Loading..."}
										width={20}
										height={20}
										quality={100}
									></Image>
								) : (
									<Image
										className={`${s.modal__filter_icon}`}
										src={`/static/img/${props.category}.svg`}
										alt={"Loading..."}
										width={20}
										height={20}
										quality={100}
									></Image>
								)}
								<span className={`${s.modal__filter_text}`}>
									{props.category}
								</span>
							</span>
							<span className={`ml-6 flex items-center`}>
								{!isTraitsOpen ? "+" : "-"}
							</span>
						</button>
					</h3>
				</div>
				<div ref={boundingRef} className={s.modal__trait_outer_container}>
					<AnimatePresence>
						{isTraitsOpen &&
							props.traits.map(trait => {
								return (
									<motion.div
										key={trait.value}
										variants={{
											hidden: { opacity: 0 },
											show: { opacity: 1 },
											exit: { opacity: 0 }
										}}
									>
										<IndividualTraits
											key={trait.value}
											category={props.category}
											trait={trait}
											categoryRef={boundingRef}
											categoryPosition={elementPosition.y}
										/>
									</motion.div>
								)
							})}
					</AnimatePresence>
				</div>
			</>
		)
	}

	let localSelectedFilters = []
	const IndividualTraits = props => {
		const [isTraitSelected, setTraitSelected] = useState(false)
		const checkboxRef = useRef()

		const checkInSelectedFilters = props => {
			const traitCheck = {
				category: props.category,
				value: props.trait.value
			}
			const isSelected = selectedFilters.some(
				f => f.category === traitCheck.category && f.value === traitCheck.value
			)
			setTraitSelected(isSelected)
		}

		useEffect(() => {
			checkInSelectedFilters(props)
		}, [])

		const handleToggle = e => {
			setTraitSelected(!isTraitSelected)

			const category = props.category
			const traitValue = props.trait.value
			const trait = {
				category: category,
				value: traitValue
			}

			// If it's already selected
			if (
				!isTraitSelected === true &&
				!localSelectedFilters.some(
					f => f.category === trait.category && f.value === trait.value
				)
			) {
				localSelectedFilters = [...localSelectedFilters, trait]
				//setSelectedFilters([...selectedFilters, trait])
			} else {
				localSelectedFilters = localSelectedFilters.filter(
					f => f.value !== trait.value
				)
				//setSelectedFilters(selectedFilters.filter(f => f.value !== trait.value))
			}
		}

		// useEffect(() => {
		// 	props.categoryRef.current.scrollTo(0, props.categoryPosition + 100)
		// }, [selectedFilters])

		// useEffect(() => {
		// 	console.log(
		// 		"box: " +
		// 			props.trait.value +
		// 			" " +
		// 			checkboxRef.current.getBoundingClientRect().y
		// 	)
		// }, [
		// 	checkboxRef.current ? checkboxRef.current.getBoundingClientRect().y : null
		// ])

		return (
			<div className={`${s.modal__filter_drop}`}>
				<div className={`${s.modal__filter_drop_row}`}>
					<input
						ref={checkboxRef}
						type={`checkbox`}
						className={`${s.modal__checkbox}`}
						name={props.trait.value}
						onChangeCapture={handleToggle}
						checked={isTraitSelected}
					></input>
					<label
						className={`${s.modal__filter_drop_name}`}
						name={props.trait.value}
						onClick={handleToggle}
					>
						{props.trait.value}{" "}
						<span className={`${s.modal__trait_small}`}>
							{" "}
							{parsePercentage(props.trait.possession_qty)}% /{" "}
							{props.trait.possession_qty}
						</span>
					</label>
				</div>
			</div>
		)
	}

	const handleApplyFilters = e => {
		e.preventDefault()

		if (isSearchingByTokenId()) {
			setSearchedToken(searchByToken)
			setAppliedFilters(null)
		} else {
			//const immutableSelectedFilters = [...selectedFilters]
			const immutableSelectedFilters = [...localSelectedFilters]
			setAppliedFilters(immutableSelectedFilters)
			setAppliedSortBy(sortBy)
			setSearchedToken("")
		}

		setIsFilterModalOpen(false)
	}

	const sortOptions = [
		{ value: "Most Rare", label: "Most Rare" },
		{ value: "Least Rare", label: "Least Rare" },
		{ value: "token_id", label: "HAPE Prime ID #" }
	]

	const sortStyles = {
		control: styles => ({
			...styles,
			backgroundColor: "black",
			color: "white",
			marginBottom: "10px"
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			return {
				...styles,
				backgroundColor: "#1c1c1c",
				color: "#FFF"
			}
		}
	}

	const removeTrait = trait => {
		const removedFilters = selectedFilters.filter(f => f !== trait)
		setSelectedFilters([...removedFilters])
	}

	const resetTraits = e => {
		e.preventDefault()
		setSelectedFilters([])
	}

	return (
		<>
			<AnimatePresence>
				{isFilterModalOpen && (
					<motion.div
						key="modal"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div
							className={`${s.modal__backdrop} ${"d-block"}`}
							style={{ display: "none" }}
						>
							<div className="modal-dialog modal-md">
								<div className={`${s.modal__modal_content} modal-content`}>
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
									<div className={`${s.modal__filter_modal} modal-body`}>
										<form onSubmit={handleApplyFilters}>
											<div className={`${s.modal__filter_container}`}>
												{/* <div className={`${s.modal__listed_filters}`}>
										{selectedFilters.map(filter => {
											return (
												<>
													<button
														key={filter.value}
														onClick={() => removeTrait(filter)}
														className={s.modal__filter_block}
													>
														{filter.category}: {filter.value}
													</button>
												</>
											)
										})}
									</div> */}
												<div>
													<Select
														className={s.modal__sort_by}
														options={sortOptions}
														styles={sortStyles}
														value={sortBy}
														placeholder={"Sort by..."}
														isSearchable={false}
														onChange={e => {
															setSortBy(e)
														}}
													/>
												</div>
												{
													<TraitFilter
														key={"Special"}
														category={"Special"}
														traits={["Gold", "Obsidian", "Oblivion"]}
													/>
												}
												<AnimatePresence>
													<motion.div
														initial="hidden"
														animate="show"
														variants={{
															hidden: { opacity: 1 },
															show: {
																opacity: 1,
																transition: {
																	staggerChildren: 0.09
																}
															},
															exit: { opacity: 0 }
														}}
													>
														{filters &&
															filters.map(filter => {
																return (
																	<motion.div
																		key={filter.category}
																		variants={{
																			hidden: { opacity: 0 },
																			show: { opacity: 1 },
																			exit: { opacity: 1 }
																		}}
																	>
																		<TraitFilter
																			key={filter.category}
																			category={filter.category}
																			traits={filter.traits}
																		/>
																	</motion.div>
																)
															})}
													</motion.div>
												</AnimatePresence>
											</div>
										</form>
									</div>
									<div className={`${s.modal__button_container}`}>
										<button
											className={`${s.modal__submit} ${s.modal__reset}`}
											onClick={resetTraits}
										>
											Reset
										</button>
										<button
											className={`${s.modal__submit}`}
											onClick={handleApplyFilters}
										>
											Apply Filters
										</button>
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
export default ModalFilters
