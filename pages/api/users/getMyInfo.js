import { connectToDatabase } from '/lib/mongodb'
export default async (req, res) => {
  const username = req.query.username
  const { db } = await connectToDatabase()
  // get user info
  const data = await db
    .collection('users')
    .find({ username: username })
    .toArray()
  res.json(data[0])
}
