export const API_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.DEVELOPMENT_URL
    : process.env.DEPLOYMENT_URL
export const API_PATH = {
  getAllTournaments: `${API_URL}/api/tournament/get`,
  getTournamentHost: `${API_URL}/api/tournament/getTournamentHost`,
  getTournamentRace: `${API_URL}/api/tournament/getTournamentRace`,
  getAllRaceTournaments: `${API_URL}/api/tournament/getRaces`,
  createTournament: `${API_URL}/api/tournament/create`,
  registerUserForTournament: `${API_URL}/api/registered_users_in_tournament/registerUser`,
  registerUser: `${API_URL}/api/users/registerUser`,
  rebuyTournament: `${API_URL}/api/users/reBuy`,
  getTournamentById: `${API_URL}/api/tournament/getTournamentById`,
  getTournamentUser: `${API_URL}/api/registered_users_in_tournament/getTournamentUser`,
  updateUserForTournament: `${API_URL}/api/registered_users_in_tournament/updateUser`,
  getAllWalletAddress: `${API_URL}/api/walletAddress`,
  getMyInfo: `${API_URL}/api/users/getMyInfo`,
  getRandomWildkats: `${API_URL}/api/wildKats/get`,
  withDrawWildKatPool: `${API_URL}/api/wildKats/withdraw`,
  withDrawTotalWinningPool: `${API_URL}/api/users/withdraw`,
}
export const tournamentType = ['Leaderboard', 'Knockout']
export const tournamentAccess = ['Public', 'Invite Only']
export const gameData = ['WildKats Arcade Racing']
export const payoutStructure = ['Automatic dafault']
export const rounds = ['1', '2', '3', '4']
export const lengths = ['30', '45', '60', '90', '120']
export const itemCounts = [10, 20, 50, 100]
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export const days = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  '15th',
  '16th',
  '17th',
  '18th',
  '19th',
  '20th',
  '21th',
  '22th',
  '23th',
  '24th',
  '25th',
  '26th',
  '27th',
  '28th',
  '29th',
  '30th',
  '31th',
]

export const roadTypes = [
  'City 1',
  'City 2',
  'City 3',
  'City 4',
  'City 5',
  'City 6',
  'City 7',
  'City 8',
  'City 9',
]

export const tournamentStatus = ['All', 'Registering', 'Live', 'Completed']
export const categories = ['All', 'Name', 'Creator']
export default {
  API_URL,
  API_PATH,
  months,
  days,
  tournamentType,
  tournamentAccess,
  gameData,
  payoutStructure,
  rounds,
  lengths,
  roadTypes,
  itemCounts,
}
