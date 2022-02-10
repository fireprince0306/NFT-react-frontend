import React, { useState, useEffect } from "react"

import traitFilters from "../zHapeStorage/migrationTraitFilters"
import blockchainHapePrimes from "../zHapeStorage/blockchainHapePrimes"
import traitsListed2 from "../zHapeStorage/migrationTraitFilters2"
import migrationUsers2 from "../zHapeStorage/migrationUsers2"
import finalJson from "../zHapeStorage/finalJson"

const { REACT_APP_URI } = process.env

export default function AdminPostUsers() {
	const [localBlockChainHapes, setLocalBlockChainHapes] = useState(null)
	const [localHapeFinal, setLocalHapeFinal] = useState(null)
	const [localHapeFinal2, setLocalHapeFinal2] = useState(null)

	const registerBatchUsers = async event => {
		event.preventDefault()
		let res = await fetch(`${REACT_APP_URI}/api/multipleusers`, {
			method: "POST",
			body: JSON.stringify(localHapeFinal)
		})
		console.log(res)
	}

	const registerBatchUsers2 = async event => {
		event.preventDefault()
		let res = await fetch(`${REACT_APP_URI}/api/multipleusers`, {
			method: "POST",
			body: JSON.stringify(localHapeFinal2)
		})
		console.log(res)
	}

	useEffect(() => {
		const allHapes = []
		const shift = 6755
		const hapes = finalJson.sort((a, b) => a.token_id - b.token_id)
		hapes.map((hape, i) => {
			const index = i + 1
			let newTokenId = index + shift
			if (newTokenId > 8192) {
				newTokenId = newTokenId - 8192
			}
			allHapes.push({
				token_id: newTokenId,
				attributes: hape.attributes
			})
		})

		const traitsListed = []
		const traitsCategorized = []
		console.log(allHapes)

		const blackListed = [
			"Ti-red",
			"Dizzy Eyes",
			"Hazel",
			"HB Snapback (Black / White) ??",
			"",
			" "
		]

		const blackListedCorrections = [
			{ wrong: "Ti-red", fix: "Ti-Red" },
			{ wrong: "Dizzy Eyes", fix: "Dizzy" },
			{ wrong: "Hazel", fix: "Brown" },
			{
				wrong: "HB Snapback (Black / White) ??",
				fix: "Hb Snapback (Black / White)"
			}
		]

		allHapes.forEach(h => {
			const attributes = h.attributes
			attributes.forEach(a => {
				// If trait doesn't exist already, put it in
				if (
					a.trait_type !== "Heart Number" &&
					a.trait_type !== "Birthday" &&
					!blackListed.includes(a.value)
				) {
					if (
						traitsListed.filter(
							t => t.category === a.trait_type && t.value === a.value
						).length === 0
					) {
						traitsListed.push({
							category: a.trait_type,
							value: a.value,
							count: 1
						})
					} else {
						let index = traitsListed.findIndex(
							t => t.category === a.trait_type && t.value === a.value
						)
						traitsListed[index].count++
					}
				}
			})
		})

		traitsListed.sort((a, b) => {
			if (a.category < b.category) {
				return -1
			}
			if (a.category > b.category) {
				return 1
			}
			if (a.value < b.value) {
				return -1
			}
			if (a.value > b.value) {
				return 1
			}
			return 0
		})

		traitsListed.forEach(t => {
			let index = traitsCategorized.findIndex(c => c.category === t.category)
			if (!blackListed.includes(t.value)) {
				if (index > -1) {
					traitsCategorized[index].traits.push({
						value: t.value,
						count: t.count
					})
				} else {
					traitsCategorized.push({
						category: t.category,
						traits: [
							{
								value: t.value,
								count: t.count
							}
						]
					})
				}
			}
		})
		console.log(traitsCategorized)

		const test = []
		allHapes.forEach(h => {
			let rarity = 0
			h.attributes.forEach(a => {
				const count = traitsCategorized
					.filter(t => t.category === a.trait_type)[0]
					?.traits.filter(t => t.value === a.value)[0]?.count
				if (a.trait_type !== "Birthday" && a.trait_type !== "Heart Number") {
					a["count"] = count
					a["weight"] = count / 8192.0
					a["rarity_score"] = 8192.0 / count
					rarity += 8192.0 / count
				}
				if (blackListed.includes(a.value)) {
					a.value = blackListedCorrections.filter(
						c => c.wrong === a.value
					)[0]?.fix
					//7808 circular barbell silver
				}
			})
			h["hape_rarity"] = rarity
		})

		console.log(allHapes)
		// allHapes
		// token_id and attributes
	}, [])

	useEffect(() => {
		// change local blockchain hapes to json
		if (localBlockChainHapes) {
			const finalHapes = []

			//remove
			let rankSet = []
			for (let i = 0; i < 1000; i++) {
				rankSet.push(i)
			}
			rankSet = shuffle(rankSet)
			localBlockChainHapes.map((h, i) => {
				const finalTraits = []
				// HAPE
				//let hapeRarity = getRndInteger(0, 1000)
				// For each trait's attribute, get the trait from our local list of traits
				// and create a list for our datastructure
				let hapeRarity = 0
				h.attributes.map(t => {
					const filteredTrait = traitsListed2.filter(
						tr => tr.category === t.trait_type && tr.value === t.value
					)
					const count = filteredTrait[0].possession_qty
					const traitRarity = filteredTrait[0].rarity_score
					finalTraits.push({
						category: t.trait_type,
						value: t.value,
						possession_qty: count,
						rarity_score: traitRarity
						//weight?
					})
					hapeRarity = hapeRarity + traitRarity
				})
				const hape = {
					token_id: rankSet[i],
					hape_rarity: hapeRarity,
					rank: rankSet[999 - i],
					image: h.image,
					traits: finalTraits
				}
				finalHapes.push(hape)
			})

			// Ordering HAPES based on Rarity Score
			const ordered = finalHapes
				.slice()
				.sort((a, b) => (a.hape_rarity > b.hape_rarity ? 1 : -1))

			// Creating a new Array, to assign a Ranking using the index
			const orderedRanked = []
			ordered.map((o, i) => {
				orderedRanked.push({ ...o, rank: i + 1 })
			})

			// setLocalHapeFinal(finalHapes.slice(0, 500))
			// setLocalHapeFinal2(finalHapes.slice(500, 1000))
		}
	}, [localBlockChainHapes])

	// CREATE FAKE OPENSEA JSON
	useEffect(() => {
		let listOfHapes = []

		let max = 1000
		for (let i = 0; i < max; i++) {
			let populatedAttributes = []

			traitFilters.map(t => {
				const traitProps = t.traits[getRndInteger(0, t.traits.length - 1)]
				const trait = {
					trait_type: t.category,
					value: traitProps.value
				}
				populatedAttributes.push(trait)
			})

			let hape = {
				name: "HAPE PRIME",
				description: "8192 next-generation, high-fashion HAPES.",
				image: `https://d2134ty93psuer.cloudfront.net/fit-in/${i + 1}.jpg`,
				external_url: "https://hapeprime.com",
				attributes: populatedAttributes
			}
			listOfHapes.push(hape)
		}
		setLocalBlockChainHapes(listOfHapes)
	}, [])

	const getRndInteger = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	const shuffle = array => {
		let currentIndex = array.length,
			randomIndex

		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex--

			// And swap it with the current element.
			;[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex]
			]
		}

		return array
	}

	const shuffleArray = array => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
	}

	return (
		<div>
			<form onSubmit={registerBatchUsers}>
				<div>
					<button type="submit">Register Multiple</button>
				</div>
			</form>
			<form onSubmit={registerBatchUsers2}>
				<div>
					<button type="submit">Register Multiple</button>
				</div>
			</form>
		</div>
	)
}
