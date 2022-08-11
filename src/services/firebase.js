const { setDoc, addDoc } = require("./api");

const CreateQuickMatch = (collectionRef, data) => addDoc(collectionRef, data);

module.exports = {
  CreateQuickMatch,
};
