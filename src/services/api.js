const firebase = require('firebase-admin')
const firestore = firebase.firestore()
const collectIdsAndDocs = require('../utils/collectIdsAndDocs')

//set doc
const setDoc = async (docRef, dataToSubmit) => {
  await firestore.doc(docRef).set(dataToSubmit)
  const snapshot = await firestore.doc(docRef).get()
  const data = collectIdsAndDocs(snapshot)
  return data
}

//add doc
const addDoc = async (colectionRef, dataToSubmit) => {
  const added = await firestore.collection(colectionRef).add(dataToSubmit)
  const snapshot = await firestore.doc(`${colectionRef}/${added?.id}`).get()
  const data = collectIdsAndDocs(snapshot)
  return data
}

//get collection

//get doc
const getDoc = async (docRef) => {
  const snapshot = await firestore.doc(`${docRef}`).get()
  const data = collectIdsAndDocs(snapshot)
  return data
}

//update doc
const updateDoc = async (docRef, dataToSubmit) => {
  try {
    await firestore.doc(docRef).update(dataToSubmit)
    const snapshot = await firestore.doc(docRef).get()
    const data = collectIdsAndDocs(snapshot)
    return data
  } catch (error) {
    return error
  }
}

module.exports = {
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
}
