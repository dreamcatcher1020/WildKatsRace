import Header from '/components/layout/header'
import Menu from '/components/layout/menu'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '/styles/Home.module.css'
import {
  API_PATH,
  months,
  days,
  tournamentStatus,
  categories,
  itemCounts,
} from '/lib/constant.js'
import { useWallet } from '@terra-money/wallet-provider'
import { getUserStatue, getHangCounts, numberWithCommas } from '/lib/moment.js'
import Dropdown from '/components/dropdown'
import { useEffect, useState } from 'react'
import Loader from '/components/loading'

import { useToasts } from 'react-toast-notifications'

export default function Race({ getTournamentRace, getMyInfo, withDrawTotalWinningPool }) {
  const { query } = useRouter()
  const username = query['username']
  const { status, wallets } = useWallet()
  const [tournamentState, setTournamentState] = useState(tournamentStatus[0])
  const [itemCount, setItemCount] = useState(itemCounts[0])
  const [selectedItem, setSelectedItem] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hangCounts, setHangCounts] = useState(0)
  const [tournaments, setTournaments] = useState()
  const [myInfo, setMyInfo] = useState()
  const [category, setCategories] = useState(categories[0])
  const [keyword, setKeyword] = useState('')

  const { addToast } = useToasts()
  // const [registeredTournamentCount, setRegisteredTournamentCount] = useState(0)
  // tournaments.data && tournaments.data.map((item, index) => ( getUserStatue(item['users'], username) ? ())
  const defaultPaginationCSS =
    'w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in rounded-full '
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
      `${getTournamentRace}?pagination=${JSON.stringify(
        pagination,
      )}&username=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setTournaments(res)
        setHangCounts(getHangCounts(res, itemCount))
        setLoading(false)
      })
    fetch(`${getMyInfo}?username=${username}`)
      .then((res) => res.json())
      .then((res) => {
        setMyInfo(res)
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
      `${getTournamentRace}?pagination=${JSON.stringify(
        pagination,
      )}&username=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
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
      `${getTournamentRace}?pagination=${JSON.stringify(
        pagination,
      )}&username=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
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
      `${getTournamentRace}?pagination=${JSON.stringify(
        pagination,
      )}&username=${username}&keywordJSON=${JSON.stringify(keywordJSON)}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setTournaments(res)
        setHangCounts(getHangCounts(res, itemCount))
        setLoading(false)
      })
    console.log('handleSearch', keywordJSON)
  }

  function withDraw () {
    fetch(`${withDrawTotalWinningPool}?data=${JSON.stringify({
      username: wallets[0].terraAddress,
    })}`).then((res) => res.json()).then((res) => {
      console.log(res)
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
                  <div className="font-bold">Registered Tournaments</div>
                  <div className="pb-4 text-2xl font-bold">
                    {numberWithCommas(tournaments.total, 0)}
                  </div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-1/2">Total Tournaments:</div>
                    <div className="w-1/2">34</div>
                  </div>
                </div>
                <div
                  className={
                    'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md  md:w-1/3 ' +
                    styles.bgBoard
                  }
                >
                  <div className="font-bold">Total Winnings</div>
                  <div className="pb-4 text-2xl font-bold">
                    {!myInfo ? 0 : myInfo.total_winnings} UST
                  </div>
                  <div className="flex justify-start text-gray-400 text-sm pb-2">
                    <div className="w-1/2">Available: </div>
                    <div className="w-1/2">
                      {numberWithCommas(123123123)} UST
                    </div>
                  </div>
                  <div className="flex justify-start text-gray-400 text-sm">
                    <div className="w-1/2"></div>
                    <div className="w-1/2">
                      <div
                        className={
                          'rounded-xl p-2 flex justify-center items-center text-white font-bold cursor-pointer hover:bg-indigo-600 font-bold ' +
                          styles.withdrawBtn
                        }
                        onClick={withDraw}
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 lg:m-2 mt-1 mt-2  md:mt-0">
                  <Link href="/race" passHref>
                    <div className="rounded-md bg-emerald-400 md:w-48 text-sm p-2 cursor-pointer mb-2 flex items-center justify-center w-full md:float-right font-bold hover:bg-emerald-600">
                      Practice
                    </div>
                  </Link>
                </div>
              </div>
              <div className="md:p-2 p-0 mt-6">
                <div className="text-gray-400 font-bold">
                  Registered Tournaments
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
                            <Link href={'/lobby/' + item._id} passHref>
                              <div className="p-2 flex justify-center items-center rounded-md cursor-pointer hover:bg-red-600 bg-red-400 font-bold">
                                Race
                              </div>
                            </Link>
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
        getTournamentRace: API_PATH.getTournamentRace,
        getMyInfo: API_PATH.getMyInfo,
        withDrawTotalWinningPool: API_PATH.withDrawTotalWinningPool,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { data: 'false' },
    }
  }
}
