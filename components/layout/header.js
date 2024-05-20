import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import { useToasts } from 'react-toast-notifications'

function Header() {
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
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = router.pathname
  const firstpath = pathname.split('/')[1]
  const standardCSS = 'text-white block p-2 rounded-md text-base font-medium'
  const selectedCSS = 'text-indigo-400 block p-2 rounded-md text-base font-bold'
  const handleWallet = (route) => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      Router.push(route + '/' + username)
    } else {
      addToast('Connect the Wallet', { appearance: 'error' })
    }
  }
  const handleDisconnect = () => {
    Router.push('/')
    disconnect()
  }
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Black%20Ops%20One"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Faster%20One"
        />
        <script type="text/javascript" src="/js/jquery-2.0.3.min.js"></script>
        <script
          type="text/javascript"
          src="https://code.createjs.com/1.0.0/createjs.min.js"
        ></script>
        <script type="text/javascript" src="/js/howler.min.js"></script>
        <script type="text/javascript" src="/js/main.js"></script>
      </Head>
      <div>
        <nav>
          <div className="flex items-center justify-between mx-auto xl:max-w-7xl lg:max-w-5xl md:max-w-3xl md:px-2 px-4">
            <div className="flex items-center justify-between h-16 w-full">
              <div className="flex items-center justify-between w-full">
                <Link href="/" passHref>
                  <div
                    className={
                      'font-normal md:text-5xl text-3xl text-white cursor-pointer ' +
                      styles.twFaster
                    }
                  >
                    MetaRacers
                  </div>
                </Link>
                {status === WalletStatus.WALLET_NOT_CONNECTED && (
                  <>
                    {availableInstallTypes.map((connectType) => (
                      <button
                        key={'install-' + connectType}
                        onClick={() => install(connectType)}
                        className="hidden md:block text-white bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 px-4 cursor-pointer font-bold"
                      >
                        Install {connectType}
                      </button>
                    ))}
                    {availableConnectTypes.map((connectType) =>
                      connectType === 'EXTENSION' ? (
                        <button
                          key={'connect-' + connectType}
                          onClick={() => connect(connectType)}
                          className="hidden md:block text-white bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 px-4 cursor-pointer font-bold"
                        >
                          Connect Wallet
                        </button>
                      ) : (
                        ''
                      ),
                    )}
                  </>
                )}
                {status === WalletStatus.WALLET_CONNECTED && (
                  <div className="hidden md:flex justify-center items-center">
                    <div className="font-bold text-white text-xl cursor-pointer">
                      {wallets[0].terraAddress.slice(0, 5) +
                        '...' +
                        wallets[0].terraAddress.slice(
                          wallets[0].terraAddress.length - 5,
                          wallets[0].terraAddress.length,
                        )}
                    </div>
                    <button
                      className="hidden md:block text-white bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 px-4 ml-2 cursor-pointer font-bold"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="bg-sky-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div className="md:hidden" id="mobile-menu">
                <div className="mx-4 py-2 sm:px-3 rounded-md">
                  <Link href="/" passHref>
                    <div
                      className={firstpath === '' ? selectedCSS : standardCSS}
                    >
                      DASHBOARD
                    </div>
                  </Link>
                  <Link href="/playnow" passHref>
                    <div
                      className={
                        firstpath === 'playnow' ? selectedCSS : standardCSS
                      }
                    >
                      PLAY NOW
                    </div>
                  </Link>
                  <div onClick={() => handleWallet('/race')}>
                    <div
                      className={
                        firstpath === 'race' ? selectedCSS : standardCSS
                      }
                    >
                      RACE
                    </div>
                  </div>
                  <div onClick={() => handleWallet('/host')}>
                    <div
                      className={
                        firstpath === 'host' ? selectedCSS : standardCSS
                      }
                    >
                      HOST & CREATE
                    </div>
                  </div>
                  <div onClick={() => handleWallet('/wildkats')}>
                    <div
                      className={
                        firstpath === 'wildkats' ? selectedCSS : standardCSS
                      }
                    >
                      WILDKATS
                    </div>
                  </div>
                  {status === WalletStatus.WALLET_NOT_CONNECTED && (
                    <>
                      {availableInstallTypes.map((connectType) => (
                        <button
                          key={'install-' + connectType}
                          onClick={() => install(connectType)}
                          className="flex justify-center items-center bg-indigo-500 text-white block p-2 rounded-md text-base font-bold mt-4"
                        >
                          Install {connectType}
                        </button>
                      ))}
                      {availableConnectTypes.map((connectType) =>
                        connectType === 'EXTENSION' ? (
                          <button
                            key={'connect-' + connectType}
                            onClick={() => connect(connectType)}
                            className="flex justify-center items-center bg-indigo-500 text-white block p-2 rounded-md text-base font-bold mt-4 w-full"
                          >
                            Connect Wallet
                          </button>
                        ) : (
                          ''
                        ),
                      )}
                    </>
                  )}
                  {status === WalletStatus.WALLET_CONNECTED && (
                    <button
                      className="flex justify-center items-center bg-indigo-500 text-white block p-2 rounded-md text-base font-bold mt-4 w-full"
                      onClick={handleDisconnect}
                    >
                      {wallets[0].terraAddress.slice(0, 10) +
                        '...' +
                        wallets[0].terraAddress.slice(
                          wallets[0].terraAddress.length - 10,
                          wallets[0].terraAddress.length,
                        )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Transition>
        </nav>
      </div>
    </>
  )
}

export default Header
