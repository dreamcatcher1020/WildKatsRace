import { MnemonicKey } from '@terra-money/terra.js'

export default async (req, res) => {
  const mk = new MnemonicKey({
    mnemonic: process.env.MASTER_WALLET,
  })

  res.status(200).json({ masterWalletAddr: mk.accAddress })
}
