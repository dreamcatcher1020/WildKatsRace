import { connectToDatabase } from '/lib/mongodb'
import { ObjectId } from 'bson'
import { MnemonicKey, LCDClient, MsgSend } from '@terra-money/terra.js'

export default async (req, res) => {
  const stringData = req.query.data
  const jsonData = JSON.parse(stringData)
  const { db } = await connectToDatabase()

  // insert tournament db
  await db.collection('tournament').insertOne(
    {
      name: jsonData.name,
      type: jsonData.type,
      access: jsonData.access,
      game: jsonData.game,
      buyIn: jsonData.buyIn,
      payout: jsonData.payout,
      registrationStartDate: jsonData.registrationStartDate,
      tournamentStartDate: jsonData.tournamentStartDate,
      roundNumber: jsonData.roundNumber,
      roundLength: jsonData.roundLength,
      currentRound: 1,
      players: 0,
      creator: jsonData.creator,
      maxPlayers: jsonData.maxPlayers,
      status: 'registering',
      prizePool: jsonData.prizePool,
      hostPool: jsonData.hostPool,
    },
    async function (err, docsInserted) {
      // const tournament_id = docsInserted.insertedId.toString()
      // await db.collection('registered_users_in_tournaments').insertOne({
      //   tournament_id: ObjectId(tournament_id),
      //   username: jsonData.creator,
      //   status: 0, // 0:REGISTERED, 1:PLAYING, 2:END
      //   score: 0,
      //   round_number: 1,
      // })
    },
  )

  res.status(200).json({ success: true })
}
