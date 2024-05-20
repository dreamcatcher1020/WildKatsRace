import { connectToDatabase } from '/lib/mongodb'
import { ObjectId } from 'bson'

export default async (req, res) => {
  const stringData = req.query.data
  const jsonData = JSON.parse(stringData)
  const { db } = await connectToDatabase()
  const user = await db
    .collection('registered_users_in_tournaments')
    .find({
      tournament_id: ObjectId(jsonData.tournament_id),
      username: jsonData.username,
    })
    .toArray()
  res.json(user)
}
