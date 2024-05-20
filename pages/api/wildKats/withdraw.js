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
        wildkat_pool: { $gt: 0 },
      })
      .toArray()
    
    console.log(users)
    if (users.length == 0) {
      res.status(200).json({ 
        success: false,
        msg: 'Cannot withdraw'
      })
      return
    }

    const curUser = users[0]

    const lcd = new LCDClient({
      URL: 'https://bombay-lcd.terra.dev/',
      chainID: 'bombay-12',
    })

    const wildkatsOwnerPool = lcd.wallet(
      new MnemonicKey({ mnemonic: process.env.WILDKATSNFTOWNERS_POOL }),
    )
    let tx = await wildkatsOwnerPool.createAndSignTx({
      msgs: [
        new MsgSend(
          wildkatsOwnerPool.key.accAddress, 
          curUser.username, 
          {
            uusd: curUser.wildkat_pool * 1e6,
          }
        ),
      ],
    })
    await lcd.tx.broadcast(tx)

    await db.collection('users').updateOne(
      {
        username: jsonData.username,
      },
      { $set: { wildkat_pool: 0 } },
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
