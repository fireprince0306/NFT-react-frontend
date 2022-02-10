// Hey, these are the objects I'm creating for our data. We're using MongoDB, so we
// represent all of our data in arrays of javascript objects. You are more than welcome
// to create a list of these yourselves, then provide it to me, as it's super easy to just push
// into our database.
// Or, just give me all of the data in w/e form you desire, then I'll
// write any of the scripts necessary to construct these lists, then perform a
// database migration to put the data into our database.
// There's some redudancies here and unfortunately I'm not using a relational database
// even though I should have.

// Additionally, we're going to need a way to serve the images. IPFS is fine,
// But if we're willing to pay for a CDN, that is much more preferred.
// I set it up so the data fetching is fast, but loading the image isn't as fast at the moment
// since we're not using a CDN.

// 1) HAPE RARITIES
// List of HAPEs with their corresponding attributes
const hapes = [
	{
		token_id: 7000,
		hape_rarity: 759.58,
		rank: 1,
		owner: "0x9808989",
		image:
			"https://gateway.ipfs.io/ipfs/Qmdd5vDd75VhgYmLY9R26iUXGot4XWjosbPnzFchFWkbVo",
		traits: [
			{
				category: "Trait Count",
				value: "5",
				// count of how many HAPEs possess this trait
				possession_qty: 26,
				rarity_score: 129.5,
				weight: 20
			},
			{
				category: "Eyes",
				value: "Sunglasses",
				possession_qty: 352,
				rarity_score: 28.41,
				weight: 20
			},
			{
				category: "Mouth",
				value: "Bored Unshaven Pizza",
				possession_qty: 26,
				rarity_score: 129.5,
				weight: 20
			},
			{
				category: "Clothes",
				value: "Cowboy Shirt",
				possession_qty: 84.03,
				rarity_score: 119,
				weight: 20
			},
			{
				category: "Fur",
				value: "Robot",
				possession_qty: 265,
				rarity_score: 37.74,
				weight: 20
			},
			{
				category: "Background",
				value: "Gray",
				possession_qty: 26,
				rarity_score: 129.5,
				weight: 20
			},
			{
				category: "Hat",
				value: "None",
				possession_qty: 2256,
				rarity_score: 4.43,
				weight: 20
			},
			{
				category: "Earring",
				value: "None",
				possession_qty: 7023,
				rarity_score: 1.42,
				weight: 20
			}
		]
	}
	//... and so on for each HAPE
]

// 2) TRAITS
// List of the individual traits
const traits = [
	{
		category: "Hair",
		value: "Spiky",
		weight: 20,
		possession_qty: 200,
		rarity_score: 240
	},
	{
		category: "Hair",
		value: "Flat",
		weight: 28,
		possession_qty: 350,
		rarity_score: 120
	}
	//... and so on for every single attribute
]

// 3) TRAITS BUT FOR FILTERS
// This is like Traits, but instead with category as a parent, and the traits are in an array
const filters = [
	{
		category: "Hair",
		traits: [
			{ value: "Spiky", weight: 20, possession_qty: 200, rarity_score: 240 },
			{ value: "Flat", weight: 28, possession_qty: 350, rarity_score: 120 },
			{ value: "Bald", weight: 0.08, possession_qty: 10, rarity_score: 350 }
		]
	},
	{
		category: "Clothing",
		traits: [
			{ value: "Donda", weight: 1, possession_qty: 20, rarity_score: 100 },
			{
				value: "Blouse",
				weight: 70,
				possession_qty: 3500,
				rarity_score: 80
			},
			{
				value: "T-shirt",
				weight: 80,
				possession_qty: 3600,
				rarity_score: 90
			}
		]
	}
	//... and so on for every single category
]
