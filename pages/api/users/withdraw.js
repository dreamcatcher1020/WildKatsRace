import { connectToDatabase } from '/lib/mongodb'

import { MnemonicKey, LCDClient, MsgSend } from '@terra-money/terra.js'

export default async (req, res) => {
  const jsonData = JSON.parse(req.query.data)
  const { db } = await connectToDatabase()

  try {
    const users = await db
      .collection('users')
      .find({
        username: jsonData.username,
        total_winnings: { $gt: 0 },
      })
      .toArray()
    
      if (users.length == 0) {
        res.status(200).json({ 
          success: false,
          msg: 'Cannot withdraw'
        })
        return
      }
      
    const curUser = users[0]
    console.log(curUser.total_winnings)
    console.log(jsonData)

    const lcd = new LCDClient({
      URL: 'https://bombay-lcd.terra.dev/',
      chainID: 'bombay-12',
    })

    const prizePool = lcd.wallet(
      new MnemonicKey({ mnemonic: process.env.PRIZE_POOL }),
    )

    let tx = await prizePool.createAndSignTx({
      msgs: [
        new MsgSend(
          prizePool.key.accAddress, 
          curUser.username, 
          {
            uusd: curUser.total_winnings * 1e6,
          }
        ),
      ],
    })
    const ddd = await lcd.tx.broadcast(tx)
    console.log(ddd)
    await db.collection('users').updateOne(
      {
        username: jsonData.username,
      },
      { $set: { total_winnings: 0 } },
    )

    res.status(200).json({ 
      success: true
    })
  } catch (error) {
    res.status(200).json({ 
      success: false,
      msg: 'Withdraw error'
    })
  }
}
