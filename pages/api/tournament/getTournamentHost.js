import { connectToDatabase } from '/lib/mongodb'
export default async (req, res) => {
  const { db } = await connectToDatabase()

  const stringData = req.query.pagination
  const jsonData = JSON.parse(stringData)
  const creator = req.query.creator

  const data = await db
    .collection('tournament')
    .aggregate([
      {
        $lookup: {
          from: 'registered_users_in_tournaments',
          localField: '_id',
          foreignField: 'tournament_id',
          as: 'users',
        },
      },
      { $match: { creator: creator } },
      { $sort: { registrationStartDate: -1 } },
      { $skip: jsonData.hangCount * jsonData.size },
      { $limit: jsonData.size },
    ])
    .toArray()
  const total = await db
    .collection('tournament')
    .find({ creator: creator })
    .count()

  res.json({ total: total, data: data })
}
