var store = {};

store.networkLength = 0;
store.newData = [];

function getStore() {
  return store;
}

function updNetwLength () {
  store.networkLength++;

  return store.networkLength
}

function setNetwLength (val) {
  store.networkLength = val;

  return store.networkLength
}

function addData (data) {
  store.newData.push(data);

  return store.newData.length;
}

function resetNewData () {
  store.newData = [];

  return store.newData
}

module.exports = {
  getStore: getStore,
  updNetwLength: updNetwLength,
  setNetwLength: setNetwLength,
  addData: addData,
  resetNewData: resetNewData
};
