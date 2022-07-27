const collectIdsAndDocs = (doc) => {
  return {
    id: doc.id,
    ...doc.data(),
  };
};

module.exports = collectIdsAndDocs;
