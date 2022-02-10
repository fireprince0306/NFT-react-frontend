import React, { useEffect, useState, useContext, useRef } from "react"
import Card from "../Card"
import InfiniteScroll from "react-infinite-scroll-component"
import { useDebounce } from "use-debounce"

import { ModalContext } from "../../contexts/ModalContext"
import { ThemeContext } from "../../contexts/ThemeContext"

import s from "./CardList.module.scss"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import Sticky from "react-sticky-el"
import { motion, AnimatePresence } from "framer-motion"

import ModalFilters from "../ModalFilters"
import ModalTheme from "../ModalTheme"
import ModalCard from "../ModalCard"
import { SideFilter } from "../SideFilter"

export default function CardList({ users, filters }) {
	const {
		setEntity,
		setModalIsOpen,
		setIsFilterModalOpen,
		appliedFilters,
		setAppliedFilters,
		searchedToken,
		appliedSortBy,
		setAppliedSortBy
	} = useContext(ModalContext)

	const { theme, setTheme, isThemeModalOpen, setThemeModalOpen } =
		useContext(ThemeContext)

	const [hapes, setHapes] = useState(users)
	const [hasMore, setHasMore] = useState(true)
	const [searchByToken, setSearchByToken] = useState("")
	const [searchValue] = useDebounce(searchByToken, 500)
	const maxHapes = 1000
	const [totalFilteredHapes, setTotalFilteredHapes] = useState(maxHapes)
	const [isReset, setIsReset] = useState(false)
	const [loading, setLoading] = useState(false)
	const { REACT_APP_URI } = process.env

	useEffect(() => {
		if (hapes.length === maxHapes) {
			setHasMore(false)
		}

		if (hapes.length === totalFilteredHapes) {
			setHasMore(false)
		}
	}, [hapes])

	useDidMountEffect(async () => {
		if (searchValue >= 1 && searchValue <= 8888) {
			let res = await fetch(
				`${REACT_APP_URI}/api/gethapebytokenid?tokenid=${searchValue}`,
				{
					method: "GET"
				}
			)
			let hapeData = await res.json()
			const filteredCount = hapeData.filteredCount
			hapeData = hapeData.data
			setIsReset(false)
			setHapes(hapeData)
			setTotalFilteredHapes(filteredCount)
			setHasMore(false)
			window.scrollTo(0, 0)
		} else if (
			(searchValue === "" && !isReset) ||
			searchValue < 1 ||
			searchValue > 8888
		) {
			resetFilter()
		}
	}, [searchValue])

	useDidMountEffect(async () => {
		setLoading(true)
		const sort = appliedSortBy ? appliedSortBy.value : null

		const params = JSON.stringify({
			appliedFilters: appliedFilters,
			appliedSortBy: sort
		})

		let res = await fetch(`${REACT_APP_URI}/api/users?filters=${params}`, {
			method: "GET"
		})

		let newHapes = await res.json()
		const filteredCount = newHapes.filteredCount
		newHapes = newHapes.data
		setIsReset(false)
		setHapes(newHapes)
		setTotalFilteredHapes(filteredCount)
		setHasMore(true)
		setLoading(false)
		window.scrollTo(0, 0)
	}, [appliedFilters, appliedSortBy])

	const resetFilter = async e => {
		if (!isReset) {
			setLoading(true)
			setAppliedFilters(null)
			setAppliedSortBy(null)
			const params = JSON.stringify({})
			let res = await fetch(`${REACT_APP_URI}/api/users?filters=${params}`, {
				method: "GET"
			})
			let newHapes = await res.json()
			const filteredCount = newHapes.filteredCount
			newHapes = newHapes.data
			setHapes(newHapes)
			setIsReset(true)
			setSearchByToken("")
			setTotalFilteredHapes(filteredCount)
			setHasMore(true)
			setLoading(false)
			window.scrollTo(0, 0)
		}
	}

	const getMoreHapes = async () => {
		console.log("get more")
		let lastHape = 0
		let startType = ""
		if (appliedSortBy) {
			if (appliedSortBy.value.includes("Rare")) {
				lastHape = hapes.length > 0 ? hapes[hapes.length - 1].rank : 0
				startType = "rank"
			} else if (appliedSortBy.value === "token_id") {
				lastHape = hapes.length > 0 ? hapes[hapes.length - 1].token_id : 0
				startType = "token_id"
			}
		} else {
			// default case. make sure to change in backend too
			lastHape = hapes.length > 0 ? hapes[hapes.length - 1].rank : 0
			startType = "rank"
		}

		const sort = appliedSortBy ? appliedSortBy.value : null
		const params = JSON.stringify({
			startType: startType,
			start: lastHape,
			appliedFilters: appliedFilters,
			appliedSortBy: sort
		})

		let res = await fetch(`${REACT_APP_URI}/api/users?filters=${params}`, {
			method: "GET"
		})
		let newHapes = await res.json()
		newHapes = newHapes.data
		setHapes(hape => [...hape, ...newHapes])
	}

	const onReadMore = card => {
		setEntity(card)
		setModalIsOpen(true)
	}

	const openFilterModal = () => {
		setIsFilterModalOpen(true)
	}

	const onChangeSearchByTokenId = e => {
		setSearchByToken(e.target.value)
	}

	const handleSubmitTokenSearch = e => {
		e.preventDefault()
	}

	const removeTrait = trait => {
		const removedFilters = appliedFilters.filter(f => f !== trait)
		setAppliedFilters([...removedFilters])
	}

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05
			}
		}
	}

	return (
		<div className={`mb-5 rounded ${s.lightgrey}`} id="cards">
			<>
				<Sticky className={s.sticky_filters}>
					<div className={`${s.filter_bar}`}>
						<form
							onSubmit={handleSubmitTokenSearch}
							style={{ display: "inline-block" }}
						>
							<input
								style={{ background: "none" }}
								className={`${s.filter_button} ${s.search_by_token}`}
								type={"tel"}
								value={searchByToken}
								max={8888}
								placeholder={"HAPE Prime ID #"}
								onChange={onChangeSearchByTokenId}
							></input>
						</form>
						<motion.button
							whileHover={{ scale: 1.07 }}
							whileTap={{ scale: 0.95 }}
							className={`${s.filter_button} ${s.reset_button}`}
							onClick={resetFilter}
						>
							Reset
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.07 }}
							whileTap={{ scale: 0.95 }}
							className={s.filter_button}
							onClick={openFilterModal}
						>
							Filter
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.07 }}
							whileTap={{ scale: 0.95 }}
							className={`${s.filter_button} ${s.reset_button}`}
							onClick={() => {
								setTheme("#79238c")
								setThemeModalOpen(true)
							}}
						>
							Test background
						</motion.button>
					</div>
				</Sticky>
				<div className={`${s.total}`}>
					<div>
						<div>
							<span className={`${s.collection_filter}`}>Collection:</span> HAPE
							PRIME <span className={`${s.total_x}`}> | </span>{" "}
							<span className={`${s.collection_filter}`}>Filtered: </span>
							{totalFilteredHapes}{" "}
							<span className={`${s.collection_filter}`}>of</span> 8,192
						</div>
					</div>
				</div>
				<div className={`${s.filter_block_container}`}>
					{searchedToken && <span>Hape Prime #{searchedToken}</span>}
					<div
						className={`${s.filter_block} ${s.filter_block_invisible}`}
					></div>
					{loading && (
						<div className={`${s.filter_block} ${s.filter_loading}`}>
							Loading HAPE Primes
						</div>
					)}
					{!loading && appliedSortBy && (
						<div key={appliedSortBy.value} className={s.filter_block}>
							Sorted by {appliedSortBy.label}
						</div>
					)}
					{!loading &&
						appliedFilters &&
						appliedFilters.map(filter => {
							return (
								<>
									<button
										key={filter.value}
										onClick={() => removeTrait(filter)}
										className={s.filter_block}
									>
										{filter.category}: {filter.value}
									</button>
								</>
							)
						})}
				</div>
				<hr className={`mt-3`} />

				<InfiniteScroll
					id="infinite_scroll"
					className={`${s.infinite_scroll}`}
					dataLength={hapes.length}
					next={getMoreHapes}
					hasMore={hasMore}
					scrollThreshold={0.6}
					loader={<h4 className={`${s.infinite_scroll_loading}`}>Loading</h4>}
					endMessage={
						<h4 className={`${s.infinite_scroll_loading}`}>End of Results</h4>
					}
				>
					<AnimatePresence>
						<motion.div
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
							initial="hidden"
							animate="show"
							className={`${s.gutter_1} row justify-content-center`}
							transition={{ repeat: Infinity, repeatDelay: 1 }}
						>
							{hapes.map(hape => (
								<Card key={hape.token_id} card={hape} onReadMore={onReadMore} />
							))}
						</motion.div>
					</AnimatePresence>
				</InfiniteScroll>
				<ModalFilters filters={filters} />
				<ModalCard />
				<ModalTheme />
				{hasMore && <div className={`${s.scroll_padding}`}></div>}
			</>
		</div>
	)
}
