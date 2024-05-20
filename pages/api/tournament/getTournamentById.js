import { connectToDatabase } from '/lib/mongodb'
import { ObjectId } from 'bson'

export default async (req, res) => {
  const tournamentID = req.query.data
  const { db } = await connectToDatabase()
  const tournament = await db
    .collection('tournament')
    .find({ _id: ObjectId(tournamentID) })
    .toArray()
  res.json(tournament)
}
