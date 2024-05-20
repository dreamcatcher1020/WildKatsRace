import { connectToDatabase } from '/lib/mongodb'
export default async (req, res) => {
  const { db } = await connectToDatabase()
  // get user info
  const data = await db
    .collection('wildkat_nfts')
    .aggregate([{ $sample: { size: 3 } }])
    .toArray()
  res.json(data)
}
