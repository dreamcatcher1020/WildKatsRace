import { connectToDatabase } from '/lib/mongodb'
import { ObjectId } from 'bson'
import { MnemonicKey, LCDClient, MsgSend } from '@terra-money/terra.js'

export default async (req, res) => {
  const stringData = req.query.data
  const jsonData = JSON.parse(stringData)
  const { db } = await connectToDatabase()

  // insert registered_users_in_tournaments db
  await db.collection('registered_users_in_tournaments').insertOne(
    {
      tournament_id: ObjectId(jsonData.tournament_id),
      username: jsonData.username,
      status: 0, // 0:REGISTERED, 1:PLAYING, 2:END
      score: 0,
      round_number: 1,
      token_id: jsonData.token_id,
    },
    async function (err, docsInserted) {
      await db
        .collection('tournament')
        .updateOne(
          { _id: ObjectId(jsonData.tournament_id) },
          { $inc: { players: 1 } },
        )
    },
  )
  const users = await db
    .collection('registered_users_in_tournaments')
    .find({
      tournament_id: ObjectId(jsonData.tournament_id),
      username: jsonData.username,
    })
    .toArray()

  res.status(200).json(users)
}
