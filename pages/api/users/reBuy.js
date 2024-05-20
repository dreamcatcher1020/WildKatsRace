import { connectToDatabase } from '/lib/mongodb'
import { ObjectId } from 'bson'
import { MnemonicKey, LCDClient, MsgSend } from '@terra-money/terra.js'

export default async (req, res) => {
  const stringData = req.query.data
  const jsonData = JSON.parse(stringData)
  const { db } = await connectToDatabase()

  // update tournament user db
  await db.collection('registered_users_in_tournaments').updateOne(
    {
      tournament_id: ObjectId(jsonData.tournament_id),
      username: jsonData.username,
    },
    { 
      $set: { 
        score: 0,
        status: 1,
        round_number: 2,
      } 
    },
  )

  const users = await db.collection('registered_users_in_tournaments')
    .find({
      tournament_id: ObjectId(jsonData.tournament_id),
      username: jsonData.username,
    })
    .toArray()

  res.status(200).json({ 
    success: true,
    user: users[0]
  })
}
