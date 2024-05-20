import { connectToDatabase } from '/lib/mongodb'
export default async (req, res) => {
  const { db } = await connectToDatabase()
  // insert the user db
  const total = await db.collection('tournament').countDocuments({})
  res.status(200).json({ success: total })
}
