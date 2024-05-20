import { connectToDatabase } from '/lib/mongodb'
export default async (req, res) => {
  const { db } = await connectToDatabase()

  const stringData = req.query.pagination
  const jsonData = JSON.parse(stringData)
  const keyword = req.query.keyword
  console.log('keyword', keyword)
  let data = []
  if (keyword) {
    data = await db
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
        {
          $match: {
            $or: [{ name: { $eq: keyword } }, { creator: { $eq: keyword } }],
          },
        },
        { $sort: { registrationStartDate: -1 } },
        { $skip: jsonData.hangCount * jsonData.size },
        { $limit: jsonData.size },
      ])
      .toArray()
  } else {
    data = await db
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
        { $sort: { registrationStartDate: -1 } },
        { $skip: jsonData.hangCount * jsonData.size },
        { $limit: jsonData.size },
      ])
      .toArray()
  }
  // const
  // console.log(data)
  const total = await db.collection('tournament').countDocuments({})
  res.json({ total: total, data: data })
}
