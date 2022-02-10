import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
	console.log("intruder detected")
	const client = await clientPromise
	const dbName = "haperarity"
	const tableName = "hapeprimeraritiesprivate"
	const db = client.db(dbName)
	switch (req.method) {
		case "POST":
			let bodyObject = JSON.parse(req.body)
			let newUsers = await db.collection(tableName).insertMany(bodyObject)
			res.json(newUsers)
			break
		case "GET":
			const users = await db.collection(tableName).find({}).toArray()
			res.json({ status: 200, data: users })
			break
		case "DELETE":
			const deleteAll = await db.collection(tableName).deleteMany({})
			break
	}
}
