import { connectToDatabase } from '/lib/mongodb'
export default async (req, res) => {
  const username = req.query.username
  const { db } = await connectToDatabase()
  // insert the user db
  await db
    .collection('users')
    .countDocuments({ username: username }, async function (err, count) {
      if (count === 0) {
        await db.collection('users').insertOne({
          username: username,
          total_winnings: 0.0,
          host_pool: 0.0,
          wildkat_pool: 0.0,
        })
      }
    })
  res.status(200).json({ success: true })
}
