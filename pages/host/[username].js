import Header from '/components/layout/header'
import Menu from '/components/layout/menu'
import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import Check from '/assets/icon/check.svg'
import Link from 'next/link'
import styles from '/styles/Home.module.css'
import {
  API_PATH,
  months,
  days,
  categories,
  tournamentStatus,
  itemCounts,
} from '/lib/constant.js'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import { getUserStatue, getHangCounts } from '/lib/moment.js'
import Dropdown from '/components/dropdown'
import { useEffect, useState } from 'react'
import Loader from '/components/loading'

export default function Host({ getTournamentHost }) {
  const { status, wallets } = useWallet()
  const { query } = useRouter()
  const username = query['username']
  const [tournamentState, setTournamentState] = useState(tournamentStatus[0])
  const [itemCount, setItemCount] = useState(itemCounts[0])
  const [selectedItem, setSelectedItem] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hangCounts, setHangCounts] = useState(0)
  const [tournaments, setTournaments] = useState()
  const [category, setCategories] = useState(categories[0])
  const [keyword, setKeyword] = useState('')
  const defaultPaginationCSS =
    'w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in rounded-full '

  const handleLobby = (lobby_id) => {
    status === WalletStatus.WALLET_CONNECTED
      ? Router.push('/lobby/' + lobby_id)
      : addToast('Connect the Wallet', { appearance: 'error' })
  }

  useEffect(() => {
    const keywordJSON = {
      type: category,
      value: keyword,
    }
    const pagination = {
      hangCount: 0,
      size: 10,
    }

    fetch(
      `${getTournamentHost}?pagination=${JSON.stringify(
        pagination,
      )}&creator=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setTournaments(res)
        setHangCounts(getHangCounts(res, itemCount))
        setLoading(false)
      })
  }, [])
  const handleGetTournamentStatus = (item) => {
    setTournamentState(item)
  }
  const handleGetItemCounts = (item) => {
    setItemCount(item)
    setLoading(true)
    const keywordJSON = {
      type: category,
      value: keyword,
    }
    const pagination = {
      hangCount: selectedItem,
      size: item,
    }

    fetch(
      `${getTournamentHost}?pagination=${JSON.stringify(
        pagination,
      )}&creator=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setTournaments(res)
        setHangCounts(getHangCounts(res, item))
        setLoading(false)
      })
  }

  const handleSelectItem = (item) => {
    setSelectedItem(item)
    setLoading(true)
    const keywordJSON = {
      type: category,
      value: keyword,
    }
    const pagination = {
      hangCount: item,
      size: itemCount,
    }

    fetch(
      `${getTournamentHost}?pagination=${JSON.stringify(
        pagination,
      )}&creator=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setTournaments(res)
        setHangCounts(getHangCounts(res, itemCount))
        setLoading(false)
      })
  }
  const handleGetCategories = (item) => {
    setCategories(item)
  }
  const handleSetKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const handleSearch = () => {
    const keywordJSON = {
      type: category,
      value: keyword,
    }
    const pagination = {
      hangCount: selectedItem,
      size: itemCount,
    }

    fetch(
      `${getTournamentHost}?pagination=${JSON.stringify(
        pagination,
      )}&creator=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setTournaments(res)
        setHangCounts(getHangCounts(res, itemCount))
        setLoading(false)
      })
    console.log('handleSearch', keywordJSON)
  }

  return (
    <>
      <Header />
      <div className="flex items-start justify-start mx-auto xl:max-w-7xl lg:max-w-5xl md:max-w-3xl md:px-2 px-4 text-white w-full pt-2 md:pt-12">
        <div className="w-1/5 sm:block hidden">
          <Menu />
        </div>
        <div className="w-full md:w-4/5">
          {loading ? (
            <Loader />
          ) : (
            <div>
              <div className="sm:flex sm:justify-between block">
                <div
                  className={
                    'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md  md:w-1/3 ' +
                    styles.bgBoard
                  }
                >
                  <div className="font-bold">Live Tournaments</div>
                  <div className="pb-8 text-2xl font-bold">24</div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-1/2">Total Prize Pool:</div>
                    <div className="w-1/2">321,000 UST</div>
                  </div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-1/2">Total Players:</div>
                    <div className="w-1/2">420</div>
                  </div>
                </div>
                <div
                  className={
                    'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md  md:w-1/3 ' +
                    styles.bgBoard
                  }
                >
                  <div className="font-bold">
                    Top Racers Bonus{' '}
                    <span className="text-xs text-gray-400">Day: 24/30</span>
                  </div>
                  <div className="pb-4 text-2xl font-bold">14,354 UST</div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-3/4">1. Terra1-sef5t </div>
                    <div className="w-1/4">34,954</div>
                  </div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-3/4">2. Terra1-sef5t </div>
                    <div className="w-1/4">12,954</div>
                  </div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-3/4">3. Terra1-sef5t </div>
                    <div className="w-1/4">45,954</div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 lg:m-2 mt-1 mt-2  md:mt-0">
                  <Link href="/host/create" passHref>
                    <div className="rounded-md bg-emerald-400 md:w-48 text-sm p-2 cursor-pointer mb-2 flex items-center justify-center w-full md:float-right font-bold hover:bg-emerald-600">
                      Create New Tournament
                    </div>
                  </Link>
                  <div className="rounded-md bg-gray-400 md:w-48 w-full text-sm p-2 cursor-pointer flex items-center justify-center md:float-right font-bold">
                    Withdraw Rewards
                  </div>
                </div>
              </div>
              <div className="md:p-2 p-0 mt-6 mb-4">
                <div className="text-gray-400 font-bold">
                  My Hosted Tournaments
                </div>
                {tournaments.data.length !== 0 ? (
                  <div>
                    <div className="flex justify-between items-center gap-3">
                      <div className="w-2/3 flex justify-between items-center gap-2">
                        <div className="w-1/6">
                          <Dropdown
                            onHandleGetItem={handleGetCategories}
                            backgourndColor="#272c51"
                            data={categories}
                            color="text-gray-400"
                            position="left"
                          />
                        </div>
                        <div className="w-4/6">
                          <input
                            value={keyword}
                            onChange={(e) => handleSetKeyword(e)}
                            className="block w-full p-4 mt-1 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center"
                          />
                        </div>
                        <div className="w-1/6">
                          <div
                            className="flex items-center justify-center bg-emerald-400 w-full h-12  rounded-md cursor-pointer hover:bg-emerald-600 font-bold text-center"
                            onClick={() => handleSearch()}
                          >
                            Search
                          </div>
                        </div>
                      </div>
                      <div className="w-1/6 flex justify-between items-center gap-2">
                        <div className="w-1/4">Size:</div>
                        <div className="w-3/4">
                          <Dropdown
                            onHandleGetItem={handleGetItemCounts}
                            backgourndColor="#272c51"
                            data={itemCounts}
                            color="text-gray-400"
                            position="left"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-12 rounded-md flex items-center justify-start px-2 font-bold">
                      <div className="w-1/3 md:w-1/6 text-xs md:text-base">
                        Start (UTC)
                      </div>
                      <div className="w-1/4 md:block hidden">
                        Tournament Name
                      </div>
                      <div className="w-1/4 md:w-1/12 text-xs md:text-base">
                        Buy In
                      </div>
                      <div className="w-1/6 md:w-1/12 text-xs md:text-base">
                        Players
                      </div>
                      <div className="w-1/12 md:block hidden">Round</div>
                      <div className="w-1/12 md:block hidden">Creator</div>
                      <div className="w-1/12 md:block hidden">Status</div>
                    </div>
                    {tournaments.data &&
                      tournaments.data.map((item, index) => (
                        <div
                          key={index}
                          className="w-full bg-gray-400 h-12 rounded-md flex items-center justify-start px-2 mb-1 hover:bg-gray-600 cursor-pointer"
                        >
                          <div className="w-1/3 md:w-1/6 text-xs md:text-base">
                            {days[
                              item.tournamentStartDate
                                .split('T')[0]
                                .split('-')[2] - 1
                            ] +
                              ' ' +
                              months[
                                item.tournamentStartDate
                                  .split('T')[0]
                                  .split('-')[1] - 1
                              ] +
                              ' ' +
                              item.tournamentStartDate
                                .split('T')[1]
                                .split(':')[0] +
                              ':' +
                              item.tournamentStartDate
                                .split('T')[1]
                                .split(':')[1]}
                          </div>
                          <div className="w-1/4 md:block hidden">
                            {item.name}
                          </div>
                          <div className="w-1/4 md:w-1/12 text-xs md:text-base">
                            {item.buyIn} $UST
                          </div>
                          <div className="w-1/6 md:w-1/12 text-xs md:text-base">
                            {item.players}
                          </div>
                          <div className="w-1/12 md:w-1/12 text-xs md:text-base">
                            {item.roundNumber}
                          </div>
                          <div className="w-1/12 md:block hidden tooltip">
                            {item.creator.slice(0, 3) +
                              '...' +
                              item.creator.slice(
                                item.creator.length - 3,
                                item.creator.length,
                              )}
                            <span className="tooltiptext md:block hidden">
                              {item.creator}
                            </span>
                          </div>
                          <div className="w-1/12 md:block hidden">
                            Registering
                          </div>
                          <div className="w-1/4 md:w-1/6 px-2">
                            <div
                              onClick={() => handleLobby(item._id)}
                              className={
                                'p-1 flex justify-center items-center rounded-md cursor-pointer font-bold bg-emerald-400 hover:bg-emerald-600'
                              }
                            >
                              {getUserStatue(item['users'], username) ? (
                                <div className="w-6 pr-2">
                                  <Image alt="Check" src={Check} />
                                </div>
                              ) : (
                                ''
                              )}

                              <div>Lobby</div>

                              {getUserStatue(item['users'], username) ? (
                                <div className="w-6 pl-2">
                                  <Image alt="Check" src={Check} />
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                    <div className="flex flex-col items-center my-4">
                      <div className="flex text-white">
                        <div className="h-12 w-12 mr-1 flex justify-center items-center rounded-full bg-gray-400 hover:bg-gray-600 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-left w-4 h-4"
                          >
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </div>
                        <div className="flex h-12 font-medium rounded-full bg-gray-400">
                          {hangCounts.map((item, index) => (
                            <div
                              key={index}
                              className={
                                selectedItem === index
                                  ? defaultPaginationCSS +
                                    'bg-pink-800 hover:bg-red-800'
                                  : defaultPaginationCSS +
                                    'bg-gray-400 hover:bg-gray-600'
                              }
                              onClick={() => handleSelectItem(index)}
                            >
                              {item + 1}
                            </div>
                          ))}
                        </div>
                        <div className="h-12 w-12 ml-1 flex bg-gray-400 hover:bg-gray-600 justify-center items-center rounded-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-right w-4 h-4"
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="font-bold text-red-500">
                    Data does not exist
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    return {
      props: {
        getTournamentHost: API_PATH.getTournamentHost,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { data: 'false' },
    }
  }
}
