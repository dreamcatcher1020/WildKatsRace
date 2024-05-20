import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import { useToasts } from 'react-toast-notifications'

const Menu = () => {
  const { addToast } = useToasts()
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    wallets,
    connect,
    install,
    disconnect,
  } = useWallet()
  const router = useRouter()
  const pathname = router.pathname
  const firstpath = pathname.split('/')[1]
  const username = wallets.length === 0 ? '' : wallets[0].terraAddress
  const standardCSS =
    'flex justify-start bg-gradient-to-r hover:from-indigo-500 rounded-md py-1 px-2 cursor-pointer w-48 flex items-center mb-4 hover:text-white text-gray-400'
  const selectedCSS =
    'flex justify-start bg-gradient-to-r from-indigo-500 rounded-md py-1 px-2 cursor-pointer w-48 flex items-center mb-4 hover:text-white text-white'

  const handleWallet = (route) => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      Router.push(route + '/' + username)
    } else {
      addToast('Connect the Wallet', { appearance: 'error' })
    }
  }

  return (
    <div className={styles.twFontBlackOpsOne}>
      <Link href="/" passHref>
        <div className={firstpath === '' ? selectedCSS : standardCSS}>
          DASHBOARD
        </div>
      </Link>
      <Link href="/playnow" passHref>
        <div className={firstpath === 'playnow' ? selectedCSS : standardCSS}>
          PLAY NOW
        </div>
      </Link>
      <div onClick={() => handleWallet('/race')}>
        <div className={firstpath === 'race' ? selectedCSS : standardCSS}>
          RACE
        </div>
      </div>
      <div onClick={() => handleWallet('/host')}>
        <div className={firstpath === 'host' ? selectedCSS : standardCSS}>
          HOST & CREATE
        </div>
      </div>
      <div onClick={() => handleWallet('/wildkats')}>
        <div className={firstpath === 'wildkats' ? selectedCSS : standardCSS}>
          WILDKATS
        </div>
      </div>
    </div>
  )
}

export default Menu
