import Header from '/components/layout/header'
import Menu from '/components/layout/menu'
import styles from '/styles/Home.module.css'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function PlayNow() {
  useEffect(() => {
    var oMain = new CMain({
      /////////////PLAYER SETTINGS
      player_max_speed: 12000, //SET MAX SPEED OF THE PLAYER
      player_maxspeed_indicator: 200, //VALUE ON THE TACHOMETER, WHEN PLAYER REACH THE MAX SPEED. YOU CAN CHANGE THE UNITS IN CLANG.
      player_centrifugal_force: 0.3, //CENTRIFUGAL FORCE VALUE WHEN IN CURVE.

      /////////////GENERAL SETTINGS
      audio_enable_on_startup: false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS
      fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
      check_orientation: true, //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES,
      modeType: 'free_play', // set the type of mode
    })

    if (isIOS()) {
      setTimeout(function () {
        sizeHandler()
      }, 200)
    } else {
      sizeHandler()
    }
  }, [])

  return (
    <>
      <Header />
      <div className="flex items-start justify-start mx-auto xl:max-w-7xl lg:max-w-5xl md:max-w-3xl md:px-2 px-4 text-white w-full pt-2 md:pt-12">
        <div className="w-1/5 sm:block hidden">
          <Menu />
        </div>
        <div className="w-full md:w-4/5">
          <div
            className={
              'text-center text-white uppercase text-lg ' +
              styles.twFontBlackOpsOne
            }
          >
            Wildkats arcade racing
          </div>
          <div className="text-center text-gray-400 text-xs w-full flex justify-center items-center mt-4">
            <div className="w-3/5">
              Race through three worlds of increasing difficulty. Complete each
              track as fast as possible before the time runs out! Practice below
              or complete for $UST in tournaments
            </div>
          </div>
          <div className="border-4 border-gray-500 w-full mt-12 p-2" style={{ height: '600px' }}>
            <canvas id="canvas" className="ani_hack" width="1600" height="960" ></canvas>
          </div>
          <div className="md:flex justify-start items-start font-bold mt-8">
            <div
              className={
                'p-4 mt-1 w-full min-h-40 rounded-md md:w-1/2 ' + styles.bgBoard
              }
            >
              <div className="flex justify-start items-center">
                <div className="text-white">Top Racers Bonus</div>
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
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableEvenColor
                  }
                >
                  <div className="w-1/6">9</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
                <div
                  className={
                    'flex justify-start items-center pl-2 ' +
                    styles.wildkatTableOddColor
                  }
                >
                  <div className="w-1/6">10</div>
                  <div className="w-2/3">WildKats #8287</div>
                  <div className="w-1/6">4,871</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 w-full p-4 text-gray-300 md:ml-8">
              <div className="mb-6">
                The Top Racers Bonus is paid out every 30-days to the 10 highest
                scoring racer.
              </div>
              <div className="mb-6">
                Score points by entering competitive tournaments
              </div>
              <div>
                <Link href="/" passHref>
                  <div className="rounded-md bg-emerald-400 md:w-48 text-sm p-2 cursor-pointer mb-2 flex items-center justify-center w-full md:float-left text-white hover:bg-emerald-600">
                    View Tournaments
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
