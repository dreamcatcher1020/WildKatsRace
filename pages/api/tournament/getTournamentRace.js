import { connectToDatabase } from '/lib/mongodb'
import { getUserStatue } from '/lib/moment'
export default async (req, res) => {
  const { db } = await connectToDatabase()

  const stringData = req.query.pagination
  const username = req.query.username
  const pagination = JSON.parse(stringData)
  const res_data = await db
    .collection('tournament')
    .aggregate([
      {
        $lookup: {
          from: 'registered_users_in_tournaments',
          localField: '_id',
          foreignField: 'tournament_id',
          as: 'Users',
        },
      },
      { $match: { status: 'registering' } },
      { $sort: { registrationStartDate: -1 } },
    ])
    .toArray()

  let allData = []
  let data = []
  let total = 0
  res_data.map((item, index) =>
    getUserStatue(item['Users'], username) ? allData.push(item) : '',
  )

  res_data.map((item, index) =>
    getUserStatue(item['Users'], username) ? total++ : '',
  )

  const start = pagination.hangCount * pagination.size
  const end = (pagination.hangCount + 1) * pagination.size

  allData.map((item, index) =>
    index >= start && index < end ? data.push(item) : '',
  )

  console.log(allData)

  res.json({ total: total, data: data })
}
