import clientPromise from "../../lib/mongodb"
import { withSentry } from "@sentry/nextjs"

const allowCors = fn => async (req, res) => {
	res.setHeader("Access-Control-Allow-Credentials", true)

	// let allowedOrigins = [
	// 	"http://haperarity.io",
	// 	"http://haperarity.vercel.app",
	// 	"http://localhost:3000"
	// ]
	// let origin = req.headers.origin
	// if (allowedOrigins.includes(origin)) {
	// 	res.setHeader("Access-Control-Allow-Origin", origin)
	// }

	res.setHeader("Access-Control-Allow-Origin", "*")

	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,OPTIONS,PATCH,DELETE,POST,PUT"
	)
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	)

	if (req.method === "OPTIONS") {
		console.log("options")
		res.status(200).end()
		return
	}
	return await fn(req, res)
}

async function handler(req, res) {
	const client = await clientPromise
	const dbName = "haperarity"
	const tableName = "hapeprimeraritiesprivate"
	const db = client.db(dbName)
	switch (req.method) {
		case "GET":
			try {
				const userBody = JSON.parse(req.query.filters)
				const startingId = userBody.start
				const appliedSortBy = userBody.appliedSortBy

				const defaultStart = "rank"

				// Get more by rank or token_id depending on sort
				// If sorting by least rare, for Get More Hapes, set to less than start
				let start = 0
				let innerQuery = { $gt: start }
				if (startingId) {
					start = parseInt(startingId)
					innerQuery = { $gt: start }
					if (appliedSortBy === "Least Rare") {
						innerQuery = { $lt: start }
					}
				}

				// Sort by Token ID or Rarity
				let sortQuery = {}
				if (appliedSortBy === "token_id") {
					sortQuery["token_id"] = 1
				} else if (appliedSortBy === "Most Rare") {
					sortQuery["rank"] = 1
				} else if (appliedSortBy === "Least Rare") {
					sortQuery["rank"] = -1
				} else {
					sortQuery[defaultStart] = 1
				}

				let startingType = userBody.startType
				if (!startingType) startingType = defaultStart
				const startQuery = {}
				startQuery[startingType] = innerQuery

				// Filter By Trait
				let filterQuery = []
				const appliedFilters = userBody.appliedFilters
				if (appliedFilters && appliedFilters.length > 0) {
					appliedFilters.map(filter => {
						let escapedFilter = filter.value
						// Give issues because Baby Blue contains Blue, so it's not exact
						// We did this initially to capture parent groups. No need right now.
						// Also should only be capturing parent groups for the ones that have parentheses
						// if (escapedFilter.includes("(") && escapedFilter.includes(")")) {
						// 	escapedFilter = escapedFilter.replace("(", "\\(")
						// 	escapedFilter = escapedFilter.replace(")", "\\)")
						// }
						// const reg = new RegExp(escapedFilter, "")
						filterQuery.push({
							traits: {
								$elemMatch: {
									category: { $eq: filter.category },
									//value: { $regex: reg },
									value: { $eq: escapedFilter }
								}
							}
						})
					})
				} else {
					filterQuery = [{ token_id: { $exists: true } }]
				}

				// Special Query
				let specialQuery = { $exists: true }
				// If special query selected
				if (false) {
					specialQuery = { $in: [8, 783] }
				}

				// Has to have a start point AND match any of the traits selected
				const users = await db
					.collection(tableName)
					.find({
						$and: [
							startQuery,
							{
								$or: filterQuery
							}
						],
						token_id: specialQuery
					})
					.sort(sortQuery)
					.limit(30)
					.toArray()

				const filteredCount = await db
					.collection(tableName)
					.find({
						$and: [
							startQuery,
							{
								$or: filterQuery
							}
						]
					})
					.count()

				// res.setHeader("Cache-Control", "max-age=0, s-maxage=86400")
				res.setHeader(
					"Cache-Control",
					"max-age=86400, s-maxage=86400, stale-while-revalidate"
				)

				res.json({ status: 200, data: users, filteredCount: filteredCount })
			} catch (e) {
				console.log(e)
			}
			break
	}
}

export default withSentry(allowCors(handler))
