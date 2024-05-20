import Header from '/components/layout/header'
import Menu from '/components/layout/menu'
import styles from '/styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { API_PATH, days, months } from '/lib/constant'
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider'
import Loader from '/components/loading'
import { MnemonicKey, LCDClient, MsgSend } from '@terra-money/terra.js'
import ColorBar from '/components/colorbar'
import Image from 'next/image'
import { getColorBarData, numberWithCommas } from '/lib/moment.js'

export default function Lobby({ REST_APIs }) {
  const { wallets } = useWallet()
  const { query } = useRouter()
  const lobby_id = query['lobby-id']
  const [tournament, setTournament] = useState('')
  const [tournamentUser, setTournamentUser] = useState('')
  const [success, setSuccess] = useState(false)
  const [start, setStart] = useState(false)
  const [loading, setLoading] = useState(true)
  const connectedWallet = useConnectedWallet()
  const [masterWallet, setMasterWallet] = useState('')
  const [nfts, setNFTs] = useState([])
  const [characterOpen, setCharacterOpen] = useState(false)
  const colorbarData = [
    {
      value: 300,
      color: '#67ed35',
    },
    {
      value: 200,
      color: '#54667a',
    },
  ]
  // init the game canvas
  const initCanvas = (data, username) => {
    if (document.getElementsByTagName('canvas').length == 0) return

    var oMain = new CMain({
      /////////////PLAYER SETTINGS
      player_max_speed: 1200000, //SET MAX SPEED OF THE PLAYER
      player_maxspeed_indicator: 200, //VALUE ON THE TACHOMETER, WHEN PLAYER REACH THE MAX SPEED. YOU CAN CHANGE THE UNITS IN CLANG.
      player_centrifugal_force: 0.3, //CENTRIFUGAL FORCE VALUE WHEN IN CURVE.

      /////////////GENERAL SETTINGS
      audio_enable_on_startup: false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS
      fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
      check_orientation: true, //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES,
      modeType: 'tournament', // set the type of mode
      date: {
        startDate: Date.parse(data.tournamentStartDate),
      },
      round: data.currentRound,
      player: username,
    })

    // $(oMain).on("start_session", function (evt) {
    //   console.log('start')
    //   // if (getParamValue('ctl-arcade') === "true") {
    //   //   parent.__ctlArcadeStartSession();
    //   // }
    //   //..
    // });

    // $(oMain).on("end_session", function (evt) {
    //   console.log('end')
    //   // if (getParamValue('ctl-arcade') === "true") {
    //   //   parent.__ctlArcadeEndSession();
    //   // }
    //   //..
    // });

    // $(oMain).on("restart_level", function (evt, iLevel) {
    //   console.log('restart')
    //   if (getParamValue('ctl-arcade') === "true") {
    //     parent.__ctlArcadeRestartLevel({
    //       level: iLevel
    //     });
    //   }
    //   //..
    // });

    // $(oMain).on("save_score", function (evt, iScore, szMode) {
    //   console.log('receiving level data:', evt, iScore, szMode);
    //   if (getParamValue('ctl-arcade') === "true") {
    //     parent.__ctlArcadeSaveScore({
    //       score: iScore,
    //       mode: szMode
    //     });
    //   }
    // });

    // $(oMain).on("start_level", function (evt, iLevel) {
    //   console.log('start level', iLevel);
    //   if (getParamValue('ctl-arcade') === "true") {
    //     parent.__ctlArcadeStartLevel({
    //       level: iLevel
    //     });
    //   }
    //   //..
    // });

    $(oMain).on('end_level', function (evt, data) {
      console.log('end level', data)
      fetch(
        `${REST_APIs.updateUserForTournament}?data=${JSON.stringify({
          tournament_id: lobby_id,
          username: data.player,
          score: data.score,
          curRound: data.round,
        })}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            oMain.date.startDate = Date.parse(
              data.tournament.tournamentStartDate,
            )

            setTournament(data.tournament)
          } else {
          }
        })
      // if (getParamValue('ctl-arcade') === "true") {
      //   parent.__ctlArcadeEndLevel({
      //     level: iLevel
      //   });
      // }
      //..
    })

    // $(oMain).on("show_interlevel_ad", function (evt) {
    //   if (getParamValue('ctl-arcade') === "true") {
    //     parent.__ctlArcadeShowInterlevelAD();
    //   }
    //   //..
    // });

    // $(oMain).on("share_event", function (evt, iScore) {
    //   console.log(iScore)
    //   if (getParamValue('ctl-arcade') === "true") {
    //     parent.__ctlArcadeShareEvent({
    //       img: TEXT_SHARE_IMAGE,
    //       title: TEXT_SHARE_TITLE,
    //       msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
    //       msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1
    //     });
    //   }
    //   //..
    // });

    if (isIOS()) {
      setTimeout(function () {
        sizeHandler()
      }, 200)
    } else {
      sizeHandler()
    }
  }

  useEffect(() => {
    const username = wallets.length === 0 ? '' : wallets
    if (username) {
      // get Master Wallet Address
      fetch(`${REST_APIs.getAllWalletAddress}`)
        .then((res) => res.json())
        .then((res) => {
          setMasterWallet(res.masterWalletAddr)
        })

      // get Tournament Info
      fetch(`${REST_APIs.getTournamentById}?data=${lobby_id}`)
        .then((res) => res.json())
        .then((res) => {
          setTournament(res[0])

          // confirm the user is registered
          fetch(
            `${REST_APIs.getTournamentUser}?data=${JSON.stringify({
              tournament_id: lobby_id,
              username: username[0].terraAddress,
            })}`,
          )
            .then((data) => data.json())
            .then((data) => {
              setTournamentUser(data[0])

              setLoading(false)

              if (data.length === 0) {
                setSuccess(false)
              } else {
                setSuccess(true)
                initCanvas(res[0], username[0].terraAddress)
              }
            })
        })
    }
  }, [wallets])

  const handleSelectDriver = () => {
    setLoading(true)
    const lcd = new LCDClient({
      URL: 'https://lcd.terra.dev',
      chainID: 'bombay-12',
    })

    setCharacterOpen(true)
    fetch(`${REST_APIs.getRandomWildkats}`)
      .then((res) => res.json())
      .then((res) => {
        setNFTs([])
        for (let i = 0; i < res.length; i++) {
          lcd.wasm
            .contractQuery('terra13s3camdcy7k7exyp4ggc60xr6wtt4fa5g76pzg', {
              metadata_u_r_i: {
                token_id: res[i].token_id.toString(),
              },
            })
            .then((res_meta) => {
              fetch(`${res_meta}`)
                .then((result) => result.json())
                .then((result) => {
                  const temp = {
                    _id: res[i]._id,
                    time_boost: res[i].time_boost,
                    max_time_boost: res[i].max_time_boost,
                    points_boost: res[i].points_boost,
                    max_points_boost: res[i].max_points_boost,
                    speed_boost: res[i].speed_boost,
                    max_speed_boost: res[i].max_speed_boost,
                    extra_drag: res[i].extra_drag,
                    max_extra_drag: res[i].max_extra_drag,
                    extra_cars: res[i].extra_cars,
                    max_extra_cars: res[i].max_extra_cars,
                    token_id: res[i].token_id,
                    media: result.media,
                  }
                  setNFTs((old) => [...old, temp])
                })
            })
            .catch((err) => {
              console.log(err)
            })
        }
        setCharacterOpen(true)
        setLoading(false)
      })
  }
  const handleRegisterUser = (tid) => {
    connectedWallet
      .post({
        msgs: [
          new MsgSend(connectedWallet.walletAddress, masterWallet, {
            uusd: tournament.buyIn * 1e6,
          }),
        ],
      })
      .then(async (txResult) => {
        if (txResult.success) {
          setLoading(true)
          const username = wallets[0].terraAddress
          fetch(
            `${REST_APIs.registerUserForTournament}?data=${JSON.stringify({
              tournament_id: lobby_id,
              username: username,
              buyIn: tournament.buyIn,
              prizePool: tournament.prizePool,
              hostPool: tournament.hostPool,
              token_id: tid,
            })}`,
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.length === 0) {
                setSuccess(false)
              } else {
                fetch(`${REST_APIs.registerUser}?username=${username}`)
                  .then((data) => data.json())
                  .then((data) => {
                    setTournamentUser(res[0])
                    setSuccess(true)
                    setLoading(false)
                    setCharacterOpen(false)
                    initCanvas(tournament, username)
                  })
              }
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleRebuy = () => {
    const username = wallets[0].terraAddress

    connectedWallet
      .post({
        msgs: [
          new MsgSend(connectedWallet.walletAddress, masterWallet, {
            uusd: tournament.buyIn * 1e6,
          }),
        ],
      })
      .then(async (txResult) => {
        if (txResult.success) {
          setLoading(true)
          fetch(
            `${REST_APIs.rebuyTournament}?data=${JSON.stringify({
              tournament_id: lobby_id,
              username: username,
              buyIn: tournament.buyIn,
            })}`,
          )
            .then((res) => res.json())
            .then(async (data) => {
              if (data.length === 0) {
                setSuccess(false)
              } else {
                setTournamentUser(data.user)
                setSuccess(true)
                setLoading(false)
                initCanvas(tournament, username)
              }
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleBoard = () => {
    setCharacterOpen(false)
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
              <div className="md:pl-2 text-gray-400 font-bold">
                Tournament Lobby #{query['lobby-id']}
              </div>

              {characterOpen ? (
                <div>
                  <div className="flex justify-between items-center">
                    <div className="md:pl-2 font-bold">
                      Select Your WildKat Driver
                    </div>
                    <div
                      onClick={() => handleBoard()}
                      className="border-2 border-gray-400 rounded-full w-8 h-8 flex justify-center items-start cursor-pointer text-gray-400"
                    >
                      &times;
                    </div>
                  </div>
                  <div className="md:pl-2 pt-2 text-center w-full">
                    <div className="block md:flex  justify-between items-center text-black md:gap-8 w-full">
                      {nfts &&
                        nfts.map((item, index) => (
                          <div
                            key={index}
                            className="rounded-md w-full md:w-1/3 md:mb-0 mb-6 bg-gradient-to-b from-gray-400 h-auto border border-gray-700 text-white text-left shadow-lg shadow-cyan-500/40 hover:shadow-red-500/100 cursor-pointer"
                          >
                            <div className="w-full h-96 md:h-48 relative">
                              <Image alt="NFT" src={item.media} layout="fill" />
                            </div>

                            <div className="p-4">
                              <div
                                className={'pb-2 ' + styles.twFontBlackOpsOne}
                              >
                                WildKat #{item.token_id}
                              </div>
                              <div className="pb-2">
                                <div className="uppercase font-bold text-sm">
                                  time boost: +{parseInt(item.time_boost)}%
                                </div>
                                <ColorBar
                                  data={getColorBarData(
                                    item.time_boost,
                                    100,
                                    0,
                                  )}
                                />
                              </div>
                              <div className="pb-2">
                                <div className="uppercase font-bold text-sm">
                                  points boost: +{parseInt(item.points_boost)}%
                                </div>
                                <ColorBar
                                  data={getColorBarData(
                                    item.points_boost,
                                    100,
                                    0,
                                  )}
                                />
                              </div>
                              <div className="pb-2">
                                <div className="uppercase font-bold text-sm">
                                  speed boost: +{parseInt(item.speed_boost)}%
                                </div>
                                <ColorBar
                                  data={getColorBarData(
                                    item.speed_boost,
                                    100,
                                    0,
                                  )}
                                />
                              </div>
                              <div className="pb-2">
                                <div className="uppercase font-bold text-sm">
                                  extra drag: +{parseInt(item.extra_drag)}%
                                </div>
                                <ColorBar
                                  data={getColorBarData(
                                    item.extra_drag,
                                    100,
                                    1,
                                  )}
                                />
                              </div>
                              <div className="pb-4">
                                <div className="uppercase font-bold text-sm">
                                  extra cars: +{parseInt(item.extra_cars)}%
                                </div>
                                <ColorBar
                                  data={getColorBarData(
                                    item.extra_cars,
                                    100,
                                    1,
                                  )}
                                />
                              </div>
                              <button
                                onClick={() =>
                                  handleRegisterUser(item.token_id)
                                }
                                className="characterSelectButton hover:bg-red-500 py-1 rounded-md text-md text-white font-semibold uppercase w-full mb-4"
                              >
                                Select WildKat
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
              {!characterOpen ? (
                <div>
                  <div className="md:pl-2 font-bold">
                    WildKats Arcade Racing $25K Grand Prix
                  </div>
                  <div className="md:pl-2 text-xs text-green-500 flex justify-start items-center font-bold">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 mr-1"></span>
                    <div>Registering</div>
                  </div>
                  <div className="sm:flex sm:justify-between block">
                    <div
                      className={
                        'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md  md:w-1/3 ' +
                        styles.bgBoard
                      }
                    >
                      <div className="font-bold">Tournament Price Pool</div>
                      <div className="pb-4 text-2xl font-bold">4,830 UST</div>
                      {!success ? (
                        tournament.status != 'registering' ? (
                          <p>Tournament is opened yet. You cannot register</p>
                        ) : (
                          <div
                            className="p-2 bg-emerald-400 w-48 rounded-md cursor-pointer hover:bg-emerald-600 font-bold text-center"
                            onClick={handleSelectDriver}
                          >
                            Register for ${tournament.buyIn}
                          </div>
                        )
                      ) : (
                        tournament.currentRound == 2 && tournament.status == "playing" && tournamentUser.round_number == 1 && tournamentUser.status == 2 ? ( // you lose on round 1
                          <div className="p-2 bg-emerald-400 w-48 rounded-md cursor-pointer hover:bg-emerald-600 font-bold text-center" onClick={handleRebuy}>Rebuy for ${tournament.buyIn}</div>
                        ) : (
                          'You are registered'
                        )
                      )}
                    </div>
                    <div
                      className={
                        'p-4 lg:m-2 mt-1 w-full min-h-40 rounded-md  md:w-2/3 ' +
                        styles.bgBoard
                      }
                    >
                      <div className="font-bold mb-3">Tournament Details</div>
                      <div className="md:flex justify-start text-gray-400 text-sm w-full">
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Buy In: </div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.buyIn} UST
                          </div>
                        </div>
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Game:</div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.game}
                          </div>
                        </div>
                      </div>
                      <div className="md:flex justify-start text-gray-400 text-sm w-full">
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Start TIme: </div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament &&
                              days[
                                tournament.tournamentStartDate
                                  .split('T')[0]
                                  .split('-')[2] - 1
                              ] +
                                ' ' +
                                months[
                                  tournament.tournamentStartDate
                                    .split('T')[0]
                                    .split('-')[1] - 1
                                ] +
                                ' ' +
                                tournament.tournamentStartDate
                                  .split('T')[1]
                                  .split(':')[0] +
                                ':' +
                                tournament.tournamentStartDate
                                  .split('T')[1]
                                  .split(':')[1]}
                          </div>
                        </div>
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Tournament Type:</div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.type}
                          </div>
                        </div>
                      </div>
                      <div className="md:flex justify-start text-gray-400 text-sm w-full">
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">
                            Number of Rounds:{' '}
                          </div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.roundNumber}
                          </div>
                        </div>
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">
                            Registerd Players:
                          </div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.players}
                          </div>
                        </div>
                      </div>
                      <div className="md:flex justify-start text-gray-400 text-sm w-full">
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Round Length: </div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.roundLength} mins
                          </div>
                        </div>
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Max Players:</div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.maxPlayers}
                          </div>
                        </div>
                      </div>
                      <div className="md:flex justify-start text-gray-400 text-sm w-full">
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Current Round:</div>
                          <div className="w-1/2 md:w-1/2">
                            {tournament.currentRound}
                          </div>
                        </div>
                        <div className="flex justify-start text-gray-400 text-sm w-full">
                          <div className="w-1/2 md:w-1/2">Driver:</div>
                          <div className="w-1/2 md:w-1/2">
                            {tournamentUser
                              ? 'WildKats #' + tournamentUser.token_id
                              : 'unknown'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {success ? (
                    tournament.status != 'ended' ? (
                      tournament.currentRound == tournamentUser.round_number ? (
                        <div className="md:p-2 mt-6">
                          <div
                            className="border-4 border-gray-500 h-64 w-full p-2"
                            style={{ height: '600px' }}
                          >
                            <canvas
                              id="canvas"
                              className="ani_hack"
                              width="1600"
                              height="960"
                            ></canvas>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-center">
                            You losed in round {tournamentUser.round_number}{' '}
                            (score: {tournamentUser.score})
                          </p>
                        </div>
                      )
                    ) : (
                      <div>
                        <p className="text-center">Tournament is ended</p>
                      </div>
                    )
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
              <div className="md:pl-2 text-gray-400 pt-8 font-bold">
                Registerd Players / Leaderboard
              </div>
              <div className="md:m-2 md:flex justify-between items-start gap-2 mb-4">
                <div
                  className={
                    'p-4 mt-1 w-full min-h-40 rounded-md md:w-2/3 mb-4 md:mb-0 ' +
                    styles.bgBoard
                  }
                >
                  <div className="mt-4">
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' + styles.bgMain
                      }
                    >
                      <div className="w-1/12">#</div>
                      <div className="w-1/4">User</div>
                      <div className="w-1/4">WildKat</div>
                      <div className="w-1/6">Score</div>
                      <div className="w-1/4">Status</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/12">1</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Registered</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/12">2</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Round 1</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/12">3</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Eliminated</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/12">4</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Round 2</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/12">5</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Registered</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/12">6</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Round 1</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/12">7</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Eliminated</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/12">8</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Round 2</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/12">9</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Eliminated</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/12">10</div>
                      <div className="w-1/4">terral-xxx-sgtf2</div>
                      <div className="w-1/4">WildKats #8287</div>
                      <div className="w-1/6">14,871</div>
                      <div className="w-1/4">Round 2</div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    'p-4 mt-1 w-full min-h-40 rounded-md md:w-1/3 ' +
                    styles.bgBoard
                  }
                >
                  <div className="mt-4">
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' + styles.bgMain
                      }
                    >
                      <div className="w-1/4">Rank</div>
                      <div className="w-5/12">Prize Pool %</div>
                      <div className="w-1/3">Prize $UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/4">1st</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/4">2nd</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/4">3rd</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/4">4th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/4">5th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/4">6th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/4">7th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/4">8th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableEvenColor
                      }
                    >
                      <div className="w-1/4">9th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                    <div
                      className={
                        'flex justify-start items-center pl-2 ' +
                        styles.wildkatTableOddColor
                      }
                    >
                      <div className="w-1/4">10th</div>
                      <div className="w-5/12">24.4%</div>
                      <div className="w-1/3">4,871 UST</div>
                    </div>
                  </div>
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
    const REST_APIs = {
      getTournamentById: API_PATH.getTournamentById,
      getTournamentUser: API_PATH.getTournamentUser,
      registerUserForTournament: API_PATH.registerUserForTournament,
      registerUser: API_PATH.registerUser,
      updateUserForTournament: API_PATH.updateUserForTournament,
      rebuyTournament: API_PATH.rebuyTournament,
      getAllWalletAddress: API_PATH.getAllWalletAddress,
      getRandomWildkats: API_PATH.getRandomWildkats,
    }
    return {
      props: {
        REST_APIs: REST_APIs,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { createTournament: 'false' },
    }
  }
}
