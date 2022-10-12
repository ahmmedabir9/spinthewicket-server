const { setDoc, addDoc, getDoc, updateDoc } = require('./api')

const CreateQuickMatch = (data) => addDoc('quick_matches', data)
const GetQuickMatch = (id) => getDoc(`quick_matches/${id}`)
const UpdateQuickMatch = (id, data) => updateDoc(`quick_matches/${id}`, data)

module.exports = {
  CreateQuickMatch,
  GetQuickMatch,
  UpdateQuickMatch,
}
