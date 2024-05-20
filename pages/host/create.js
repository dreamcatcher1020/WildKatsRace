import React, { useState, forwardRef, useEffect } from 'react'
import Header from '/components/layout/header'
import Menu from '/components/layout/menu'
import Dropdown from '/components/dropdown'
import Router from 'next/router'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  API_PATH,
  tournamentType,
  tournamentAccess,
  gameData,
  payoutStructure,
  rounds,
  lengths,
  roadTypes,
} from '/lib/constant'
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider'
import { useToasts } from 'react-toast-notifications'
import Loader from '/components/loading'
import { MsgSend } from '@terra-money/terra.js'

export default function Create({
  createTournament,
  getAllWalletAddress,
  registerUser,
}) {
  const { addToast } = useToasts()
  const { wallets } = useWallet()
  const [loading, setLoading] = useState(true)

  const connectedWallet = useConnectedWallet()

  const [tournamentStartDate, setTournamentStartDate] = useState(new Date())
  const [errName, setErrName] = useState(true)
  const [errBuyIn, setErrBuyIn] = useState(true)
  const [errDateMsg, setErrDateMsg] = useState('')
  const [errMaxPlayersMsg, setErrMaxPlayersMsg] = useState('')
  const [errPrize, setErrPrize] = useState('')
  const [errHost, setErrHost] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState(tournamentType[0])
  const [access, setAccess] = useState(tournamentAccess[0])
  const [game, setGame] = useState(gameData[0])
  const [buyIn, setBuyIn] = useState('')
  const [payout, setPayout] = useState(payoutStructure[0])
  const [roundNumber, setRoundNumber] = useState(rounds[0])
  const [roundLength, setRoundLength] = useState(lengths[0])
  const [maxPlayers, setMaxPlayers] = useState('1000')
  const [prizePool, setPrizePool] = useState('')
  const [hostPool, setHostPool] = useState('')
  const [masterWallet, setMasterWallet] = useState('')
  const total = 90

  useEffect(() => {
    const pagination = {
      hangCount: 0,
      size: 10,
    }
    fetch(`${getAllWalletAddress}`)
      .then((res) => res.json())
      .then((res) => {
        setMasterWallet(res.masterWalletAddr)
        setLoading(false)
      })
  }, [])

  async function handleCreate() {
    if (!name) {
      setErrName(false)
    } else {
      setErrName(true)
    }

    if (!buyIn) {
      setErrBuyIn(false)
    } else {
      setErrBuyIn(true)
    }

    if (!maxPlayers) {
      setErrMaxPlayersMsg('Input the Max Players!')
    } else {
      setErrMaxPlayersMsg('')
    }

    if (!hostPool) {
      setErrHost('Input the HostPool')
    } else {
      setErrHost('')
    }

    if (!prizePool) {
      setErrPrize('Input the PrizePool')
    } else {
      setErrPrize('')
    }

    if (!name || !buyIn || !maxPlayers || !hostPool || !prizePool) {
      return
    }

    if (!maxPlayers.match(numbers)) {
      setErrMaxPlayersMsg('Input the number only!')
      console.log('errMaxPlayersMsg', errMaxPlayersMsg)
      return
    }

    if (parseInt(maxPlayers) < 10) {
      setErrMaxPlayersMsg('Min Players have to be over 10')
      console.log('errMaxPlayersMsg', errMaxPlayersMsg)
      return
    }

    if (parseInt(maxPlayers) > 10000) {
      setErrMaxPlayersMsg('Max Players have to be over 10000')
      console.log('errMaxPlayersMsg', errMaxPlayersMsg)
      return
    }

    const numbers = /^[0-9]+$/
    if (!buyIn.match(numbers)) {
      setErrBuyIn(false)
      return
    }

    if (buyIn < 10) {
      setErrBuyIn(false)
      return
    }

    if (parseInt(prizePool) < 50 || parseInt(prizePool) > 90) {
      setErrPrize('Prize have to be over 50 & under 90')
      return
    }

    if (parseInt(hostPool) > 40 || parseInt(hostPool) < 0) {
      setErrHost('Host have to be under 40')
      return
    }
    const registrationStartDate = new Date()
    const deltaDate = tournamentStartDate - registrationStartDate
    if (deltaDate < 0) {
      setErrDateMsg(
        'Tournament Start Date must be over than Registration Start Date',
      )
      return
    } else if (deltaDate < 86399000) {
      // 1 Day
      setErrDateMsg(
        'Between Date of Tournament Start and Registration Start must be at least one day',
      )
      return
    } else {
      setErrDateMsg('')
    }

    connectedWallet
      .post({
        msgs: [
          new MsgSend(connectedWallet.walletAddress, masterWallet, {
            // uusd: buyIn * 1e6,
            uusd: 5 * 1e6,
          }),
        ],
      })
      .then(async (txResult) => {
        if (txResult.success) {
          setLoading(true)
          console.log('registrationStartDate', registrationStartDate)
          console.log('now', new Date())
          const registrationStartDateStr = JSON.stringify(registrationStartDate)
          const tournamentStartDateStr = JSON.stringify(tournamentStartDate)
          const data = {
            name,
            type,
            access,
            game,
            buyIn,
            registrationStartDate: registrationStartDateStr.slice(
              1,
              registrationStartDateStr.length - 1,
            ),
            tournamentStartDate: tournamentStartDateStr.slice(
              1,
              tournamentStartDateStr.length - 1,
            ),
            roundNumber,
            roundLength,
            payout,
            creator: wallets[0].terraAddress,
            maxPlayers,
            prizePool:
              typeof prizePool === 'string' ? parseInt(prizePool) : prizePool,
            hostPool:
              typeof hostPool === 'string' ? parseInt(hostPool) : hostPool,
          }
          setErrMaxPlayersMsg('')
          setName('')

          fetch(`${createTournament}?data=${JSON.stringify(data)}`)
            .then((res) => res.json())
            .then((res) => {
              fetch(`${registerUser}?username=${wallets[0].terraAddress}`)
                .then((res_user) => res_user.json())
                .then((res_user) => {
                  Router.push('/host')
                })
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSetName = (e) => {
    setName(e.target.value)
  }

  const handleGetType = (item) => {
    setType(item)
  }

  const handleGetAccess = (item) => {
    setAccess(item)
  }

  const handleGetGame = (item) => {
    setGame(item)
  }

  const handleGetPayout = (item) => {
    setPayout(item)
  }

  const handleGetRoundNumber = (item) => {
    setRoundNumber(item)
  }

  const handleGetRoundLength = (item) => {
    setRoundLength(item)
  }

  const handleSetBuyIn = (e) => {
    setBuyIn(e.target.value)
  }

  const handleSetMaxPlayers = (e) => {
    setMaxPlayers(e.target.value)
  }

  const handleSetPrizePool = (e) => {
    const value = e.target.value
    const numbers = /^[0-9]+$/
    setPrizePool(value)
    if (!value.match(numbers)) {
      setErrPrize('Input only number')
      return
    } else if (parseInt(value) < 50 || parseInt(value) > 90) {
      setErrPrize('Prize have to be over 50 & under 90')
      return
    }
    setErrPrize('')
    setErrHost('')
    setHostPool(total - value)
  }

  const handleSetHostPool = (e) => {
    const value = e.target.value
    const numbers = /^[0-9]+$/
    setHostPool(value)
    if (!value.match(numbers)) {
      setErrHost('Input only number')
      return
    } else if (parseInt(value) > 40 || parseInt(value) < 0) {
      setErrHost('Host have to be under 40')
      return
    }
    setErrPrize('')
    setErrHost('')
    setPrizePool(total - value)
  }

  const RegistrationStartInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="block w-full py-2 px-4 mt-2 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ))

  return (
    <>
      <Header />
      <div className="flex items-start justify-start mx-auto xl:max-w-7xl lg:max-w-5xl md:max-w-3xl md:px-2 px-4 text-white pt-2 md:pt-12 mb-4">
        <div className="w-1/5 sm:block hidden">
          <Menu />
        </div>
        <div className="w-full md:w-4/5">
          {loading ? (
            <Loader />
          ) : (
            <div>
              <div className="flex justify-between">
                <div className="text-gray-400 font-bold mb-4">
                  Create New Tournament
                </div>
                <Link href="/host" passHref>
                  <div className="border-2 border-gray-400 rounded-full w-8 h-8 flex justify-center items-start cursor-pointer text-gray-400">
                    &times;
                  </div>
                </Link>
              </div>
              <div className="block md:flex md:justify-between">
                <div className="w-full md:w-1/2 pr-0 md:pr-2">
                  <div
                    className={
                      !errName
                        ? 'text-red-500 font-bold text-xs'
                        : 'text-gray-300 font-bold text-xs'
                    }
                  >
                    Tournament Name
                  </div>
                  <div>
                    <input
                      value={name}
                      onChange={(e) => handleSetName(e)}
                      className="block w-full p-4 mt-2 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-2 md:pt-0 pt-4">
                  <div className="font-bold text-gray-300 text-xs">
                    Tournament Type
                  </div>
                  <div>
                    <Dropdown
                      onHandleGetItem={handleGetType}
                      backgourndColor="#272c51"
                      data={tournamentType}
                      color="text-gray-400"
                      position="left"
                    />
                  </div>
                </div>
              </div>
              <div className="block md:flex md:justify-between pt-6">
                <div className="w-full md:w-1/2 pr-0 md:pr-2">
                  <div className="font-bold text-gray-300 text-xs">
                    Tournament Access
                  </div>
                  <div>
                    <Dropdown
                      onHandleGetItem={handleGetAccess}
                      backgourndColor="#272c51"
                      data={tournamentAccess}
                      color="text-gray-400"
                      position="left"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-2 md:pt-0 pt-4">
                  <div className="font-bold text-gray-300 text-xs">Game</div>
                  <div>
                    <Dropdown
                      onHandleGetItem={handleGetGame}
                      backgourndColor="#272c51"
                      data={gameData}
                      color="text-gray-400"
                      position="left"
                    />
                  </div>
                </div>
              </div>
              <div className="block md:flex md:justify-between pt-6">
                <div className="w-full md:w-1/2 pr-0 md:pr-2">
                  <div
                    className={
                      errMaxPlayersMsg
                        ? 'text-red-500 font-bold text-xs'
                        : 'text-gray-300 font-bold text-xs'
                    }
                  >
                    Max Players (Min 10 & Max 10, 000){' '}
                    {errMaxPlayersMsg ? '**' : ''} {errMaxPlayersMsg}
                  </div>
                  <div>
                    <input
                      value={maxPlayers}
                      onChange={(e) => handleSetMaxPlayers(e)}
                      className="block w-full p-4 mt-2 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-2 md:pt-0 pt-4"></div>
              </div>
              <div className="block md:flex md:justify-between pt-6">
                <div className="w-full md:w-1/2 pr-2 md:pl-0 md:pt-0 pt-4">
                  <div className="font-bold text-gray-300 text-xs">
                    Entry Details
                  </div>
                  <div>
                    <div className="block w-full p-4 pr-4 mt-2 text-white border-gray-500 border-2 rounded-md text-gray-500 font-bold">
                      <div
                        className={
                          !errBuyIn
                            ? 'text-red-500 font-bold text-xs'
                            : 'text-gray-300 font-bold text-xs'
                        }
                      >
                        Total Buy In{' '}
                        {!errBuyIn ? '( Only Number and Min 10UST )' : ''}
                      </div>
                      <div className="flex justify-start items-center">
                        <div className="w-5/6 pr-1">
                          <input
                            onChange={(e) => handleSetBuyIn(e)}
                            className="block w-full py-2 px-4 mt-2 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center text-right"
                          />
                        </div>
                        <div className="w-1/6 text-right text-xs">UST</div>
                      </div>
                      <div className="flex justify-start items-center pt-2">
                        <div className="w-5/6 pr-1 font-bold text-gray-500 text-xs flex justify-start items-center">
                          <div className="w-2/3">
                            <div>Prize Pool %:</div>
                            <div className="text-red-500 font-bold text-xs">
                              {errPrize}
                            </div>
                          </div>
                          <div className="w-1/3 text-center">
                            <input
                              value={prizePool}
                              onChange={(e) => handleSetPrizePool(e)}
                              className="block w-full p-4 mt-2 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center text-right"
                            />
                          </div>
                        </div>
                        <div className="w-1/6 text-right text-xs">UST</div>
                      </div>
                      <div className="flex justify-start items-center pt-2">
                        <div className="w-5/6 pr-1 font-bold text-gray-500 text-xs flex justify-start items-center">
                          <div className="w-2/3">
                            <div>Host %:</div>
                            <div className="text-red-500 font-bold text-xs">
                              {errHost}
                            </div>
                          </div>
                          <div className="w-1/3 text-center">
                            <input
                              value={hostPool}
                              onChange={(e) => handleSetHostPool(e)}
                              className="block w-full p-4 mt-2 text-white bg-gray-600 appearance-none focus:outline-none bg-gray-600 focus:bg-gray-700 focus:shadow-inner rounded-md opacity-50 h-12 flex justify-start items-center text-right"
                            />
                          </div>
                        </div>
                        <div className="w-1/6 text-right text-xs">UST</div>
                      </div>
                      <div className="flex justify-start items-center pt-2">
                        <div className="w-2/3 pr-1 font-bold text-gray-500 text-xs flex justify-start items-center">
                          <div className="w-2/3">MetaRacers %:</div>
                          <div className="w-1/3 text-center">5</div>
                        </div>
                        <div className="w-1/6 text-right pr-1 text-xs">10</div>
                        <div className="w-1/6 text-right text-xs">UST</div>
                      </div>
                      <div className="flex justify-start items-center pt-2">
                        <div className="w-2/3 pr-1 font-bold text-gray-500 text-xs flex justify-start items-center">
                          <div className="w-2/3">WildKats %:</div>
                          <div className="w-1/3 text-center">5</div>
                        </div>
                        <div className="w-1/6 text-right pr-1 text-xs">10</div>
                        <div className="w-1/6 text-right text-xs">UST</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-2 md:pt-0 pt-4">
                  <div className="font-bold text-gray-300 text-xs">Timings</div>
                  <div>
                    <div className="block w-full p-4 pr-4 mt-2 text-white border-gray-500 border-2 rounded-md text-gray-500 font-bold">
                      <div
                        className={
                          errDateMsg
                            ? 'text-red-500 font-bold text-xs pb-4'
                            : 'text-gray-300 font-bold text-xs'
                        }
                      >
                        {errDateMsg}
                      </div>
                      <div className="block md:flex justify-start items-center">
                        <div className="w-full md:mt-0 mt-3">
                          <div className="font-bold text-gray-500 text-xs">
                            Tournament Start
                          </div>
                          <div>
                            <DatePicker
                              selected={tournamentStartDate}
                              onChange={(date) => setTournamentStartDate(date)}
                              customInput={<RegistrationStartInput />}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              showTimeSelect
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start items-center pt-4 font-bold text-gray-500 text-xs">
                        <div className="w-1/3">Number of Rounds</div>
                        <div className="w-1/4">
                          <Dropdown
                            onHandleGetItem={handleGetRoundNumber}
                            backgourndColor="#272c51"
                            data={rounds}
                            color="text-gray-400"
                            position="right"
                          />
                        </div>
                        <div className="w-1/12 pl-2">Round(s)</div>
                        <div className="w-1/3 text-right">( Max 4 Rounds )</div>
                      </div>
                      <div className="flex justify-start items-center pt-4 font-bold text-gray-500 text-xs">
                        <div className="w-1/3">Length of Rounds</div>
                        <div className="w-1/4">
                          <Dropdown
                            onHandleGetItem={handleGetRoundLength}
                            backgourndColor="#272c51"
                            data={lengths}
                            color="text-gray-400"
                            position="right"
                          />
                        </div>
                        <div className="w-1/12 pl-2">Mins</div>
                        <div className="w-1/3 text-right">
                          ( Min 30 Minutes )
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block md:flex md:justify-between pt-6">
                <div className="w-full md:w-1/2 pr-2 md:pl-0 md:pt-0 pt-4">
                  <div className="font-bold text-gray-300 text-xs">
                    Payout Structure
                  </div>
                  <div>
                    <Dropdown
                      onHandleGetItem={handleGetPayout}
                      backgourndColor="#272c51"
                      data={payoutStructure}
                      color="text-gray-400"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-2 md:pt-0 pt-4">
                  <button
                    className="rounded-md bg-emerald-400 w-full md:w-48 text-white flex justify-center items-center h-12 p-3 cursor-pointer mt-6 float-right font-bold hover:bg-emerald-600"
                    onClick={handleCreate}
                  >
                    Create Tournaments
                  </button>
                </div>
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
        createTournament: API_PATH.createTournament,
        registerUser: API_PATH.registerUser,
        getAllWalletAddress: API_PATH.getAllWalletAddress,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { createTournament: 'false' },
    }
  }
}
