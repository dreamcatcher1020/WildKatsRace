export const getUserStatue = (users, username) => {
  let flag = false
  users.map((item, index) =>
    item['username'] === username ? (flag = true) : '',
  )
  return flag
}

export const getHangCounts = (tournaments, itemCount) => {
  const hangCount =
    tournaments.total % itemCount === 0
      ? parseInt(tournaments.total / itemCount)
      : parseInt(tournaments.total / itemCount) + 1
  const hangCounts = Array.from(Array(hangCount).keys())
  return hangCounts
}

export function numberWithCommas(x, fixCount = 2) {
  return Number(parseFloat(x).toFixed(fixCount)).toLocaleString('en', {
    minimumFractionDigits: fixCount,
  })
}

export function getColorBarData(value, max_value, type) {
  return [
    {
      value: value,
      color: type === 0 ? '#67ed35' : '#ea367b',
    },
    {
      value: max_value - value,
      color: '#54667a',
    },
  ]
}
