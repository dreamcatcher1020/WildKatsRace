import Header from '/components/layout/header'
import Menu from '/components/layout/menu'
import Image from 'next/image'
import NFT from '/assets/image/NFT.png'
import styles from '/styles/Home.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  API_PATH,
} from '/lib/constant.js'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'

import { MnemonicKey, LCDClient, MsgSend } from '@terra-money/terra.js'
import { useToasts } from 'react-toast-notifications'

export default function WildKats({ getMyInfo, withDrawWildKatPool }) {
  const { query } = useRouter()
  const username = query['username']
  const { status, wallets } = useWallet()
  const [myInfo, setMyInfo] = useState()

  const [nfts, setNFTs] = useState([])

  const { addToast } = useToasts()

  useEffect(() => {
    const lcd = new LCDClient({
      URL: 'https://lcd.terra.dev',
      chainID: 'bombay-12',
    })

    if (wallets[0]) {
      lcd.wasm
        .contractQuery('terra13s3camdcy7k7exyp4ggc60xr6wtt4fa5g76pzg', {
          tokens: {
            // "owner": "terra14wuh6n9vhypdydx6jq0qtwjvmckvdl6j4te09g",
            owner: wallets[0].terraAddress,
          },
        })
        .then((res) => {
          console.log('res', res)
          if (res.tokens) {
            setNFTs([])
            for (let i = 0; i < res.tokens.length; i++) {
              const elem = res.tokens[i]
              // console.log('elem', elem)
              fetch(`${elem.metadata_uri}`)
                .then((result) => result.json())
                .then((result) => {
                  console.log(result)
                  setNFTs((old) => [...old, result])
                })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    fetch(`${getMyInfo}?username=${username}`)
      .then((res) => res.json())
      .then((res) => {
        setMyInfo(res)
      })
  }, [wallets])

  function withDraw () {
    fetch(`${withDrawWildKatPool}?data=${JSON.stringify({
      username: wallets[0].terraAddress,
    })}`).then((res) => res.json()).then((res) => {
      if (res.success) {
        addToast('Success', { appearance: 'success' })
      } else {
        addToast(res.msg, { appearance: 'error' })
      }
    })
  }

  return (
    <>
      <Header />
      <div className="flex items-start justify-start mx-auto xl:max-w-7xl lg:max-w-5xl md:max-w-3xl md:px-2 px-4 text-white w-full pt-2 md:pt-12">
        <div className="w-1/5 sm:block hidden">
          <Menu />
        </div>
        <div className="w-full md:w-4/5">
          <div className="sm:flex sm:justify-between block">
            <div
              className={
                'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md w-full md:w-1/3 ' +
                styles.bgBoard
              }
            >
              <div className="font-bold">WildKats Rewards</div>
              <div className="pb-4 text-2xl font-bold">{!myInfo ? 0 : myInfo.wildkat_pool} UST</div>
              <div className="flex justify-start text-gray-400 text-sm pb-2">
                <div className="w-2/3">Total WildKats Rewards: </div>
                <div className="w-1/3">27,000 UST</div>
              </div>
              <div className="flex justify-start text-gray-400 text-sm">
                <div className="w-1/2"></div>
                <div className="w-1/2">
                  <div
                    className={
                      'rounded-xl p-2 flex justify-center items-center text-white font-bold cursor-pointer hover:bg-indigo-600 ' +
                      styles.withdrawBtn
                    }
                    onClick={withDraw}
                  >
                    Withdraw
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 lg:m-2 mt-8 md:mt-0 md:pr-2 md:pl-10">
              <div className="font-bold text-white text-sm pb-1">
                My WildKats
              </div>
              <div className="text-gray-400 text-xs flex items-center justify-start space-x-2 overflow-y-auto max-w-3xl whitespace-nowrap">
                {nfts
                  ? nfts.map((elem, index) => {
                      return (
                        <div key={index}>
                          <Image
                            alt="NFT"
                            src={elem.media}
                            width={120}
                            height={120}
                          />
                          <div>{elem.title}</div>
                          <div>11,243 points</div>
                        </div>
                      )
                    })
                  : ''}
              </div>
            </div>
          </div>
          <div className="md:p-2 p-0 mt-6">
            <div className="flex justify-start items-center">
              <div className="font-bold text-white">Top WildKats</div>
              <div className="font-bold text-gray-500 text-xs pl-3">
                Last 7 Days
              </div>
            </div>
            <div className="text-gray-400 text-xs flex items-center space-x-2 overflow-y-auto max-w-3xl whitespace-nowrap">
              <div>
                <Image alt="NFT" src={NFT} width={120} height={120} />
                <div>#8287</div>
                <div>11,243 points</div>
              </div>
              <div>
                <Image alt="NFT" src={NFT} width={120} height={120} />
                <div>#8287</div>
                <div>11,243 points</div>
              </div>
              <div>
                <Image alt="NFT" src={NFT} width={120} height={120} />
                <div>#8287</div>
                <div>11,243 points</div>
              </div>
              <div>
                <Image alt="NFT" src={NFT} width={120} height={120} />
                <div>#8287</div>
                <div>11,243 points</div>
              </div>
              <div>
                <Image alt="NFT" src={NFT} width={120} height={120} />
                <div>#8287</div>
                <div>11,243 points</div>
              </div>
              <div>
                <Image alt="NFT" src={NFT} width={120} height={120} />
                <div>#8287</div>
                <div>11,243 points</div>
              </div>
            </div>
          </div>
          <div className="md:flex justify-start items-start font-bold mt-8">
            <div
              className={
                'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md md:w-1/2 ' +
                styles.bgBoard
              }
            >
              <div className="flex justify-start items-center">
                <div className="text-white">Top WildKats Bonus</div>
                <div className="text-gray-500 text-xs pl-3">Day 9/30</div>
              </div>
              <div>12,039 UST</div>
              <div className="mt-4">
                <div
                  className={
                    'flex justify-start items-center pl-2 ' + styles.bgMain
                  }
                >
                  <div className="w-1/6">#</div>
                  <div className="w-2/3">User</div>
                  <div className="w-1/6">Score</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableEvenColor
                  }
                >
                  <div className="w-1/6">1</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableOddColor
                  }
                >
                  <div className="w-1/6">2</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableEvenColor
                  }
                >
                  <div className="w-1/6">3</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableOddColor
                  }
                >
                  <div className="w-1/6">4</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableEvenColor
                  }
                >
                  <div className="w-1/6">5</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableOddColor
                  }
                >
                  <div className="w-1/6">6</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableEvenColor
                  }
                >
                  <div className="w-1/6">7</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableOddColor
                  }
                >
                  <div className="w-1/6">8</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 w-full p-4 text-gray-300">
              <div className="mb-6">
                The Top WildKats Bonus is paid out every 30-days to the 10
                highest scoring WildKats.
              </div>
              <div className="mb-6">
                WildKats score points during competitive tournaments
              </div>
              <div>
                <Link href="/wildkats" passHref>
                  <div className="rounded-md bg-emerald-400 md:w-48 text-sm p-2 cursor-pointer mb-2 flex items-center justify-center w-full md:float-left text-white hover:bg-emerald-600">
                    Buy a WildKat NFT
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    return {
      props: {
        getMyInfo: API_PATH.getMyInfo,
        withDrawWildKatPool: API_PATH.withDrawWildKatPool,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { data: 'false' },
    }
  }
}
