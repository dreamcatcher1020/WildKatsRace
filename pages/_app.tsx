import '../styles/globals.css'

import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider'
import { AppProps } from 'next/app'
import Link from 'next/link'
import React from 'react'
import { ToastProvider } from 'react-toast-notifications'

export default function MyApp({
  pageProps,
  Component,
  defaultNetwork,
  walletConnectChainIds,
}: AppProps & WalletControllerChainOptions) {
  const main = (
    <main>
      <ToastProvider
        autoDismiss={true}
        autoDismissTimeout={3000}
        placement="top-right"
      >
        <Component {...pageProps} />
      </ToastProvider>
    </main>
  )

  return typeof window !== 'undefined' ? (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
    >
      {main}
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={defaultNetwork}>
      {main}
    </StaticWalletProvider>
  )
}

// MyApp.getInitialProps = async () => {
//   const chainOptions = await getChainOptions()
//   return {
//     ...chainOptions,
//   }
// }
