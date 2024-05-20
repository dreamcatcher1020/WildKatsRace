import { connectToDatabase } from '/lib/mongodb'
import { ObjectId } from 'bson'

export default async (req, res) => {
  const stringData = req.query.data
  const jsonData = JSON.parse(stringData)
  const { db } = await connectToDatabase()

  const tournament = await db
    .collection('tournament')
    .find({ _id: ObjectId(jsonData.tournament_id) })
    .toArray()

  // if (tournament[0].currentRound != jsonData.curRound) {
  //   return
  // }

  // insert registered_users_in_tournaments db
  await db.collection('registered_users_in_tournaments').updateOne(
    {
      tournament_id: ObjectId(jsonData.tournament_id),
      username: jsonData.username,
      score: { $not: { $gte: jsonData.score } },
    },
    { $set: { score: jsonData.score } },
  )
  
  res.status(200).json({ 
    success: true,
    tournament: tournament[0],
  })
}
