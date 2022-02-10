import clientPromise from "../../lib/mongodb"
import { withSentry } from "@sentry/nextjs"

const allowCors = fn => async (req, res) => {
	res.setHeader("Access-Control-Allow-Credentials", true)
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
				const users = await db
					.collection(tableName)
					.find({ token_id: parseInt(req.query.tokenid) })
					.sort({ token_id: 1 })
					.limit(1)
					.toArray()

				res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate")
				res.json({ status: 200, data: users, filteredCount: users.length })
			} catch (e) {
				console.log(e)
			}
			break
	}
}

export default withSentry(allowCors(handler))
