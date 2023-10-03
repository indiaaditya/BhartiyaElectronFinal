// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  mainWindowDesiredAction: (desiredAction) => ipcRenderer.send('set-mainWindowAction', desiredAction),
  testParameters: (testParamJSON) => ipcRenderer.send('testParamExchange', testParamJSON),
  onGetTestParams: (testParamJSON) => ipcRenderer.on('testParams', testParamJSON),
  onGetCycleParams: (cycleParam) => ipcRenderer.on('testCycleParams', cycleParam),
  onGetIncompleteTests: (incompleteTestJson) => ipcRenderer.on('IncompleteTestList',incompleteTestJson),
  resumeTest: (testID) => ipcRenderer.send('resumeTest', testID),
  onMarkTestAsComplete: (testID) => ipcRenderer.send('markAsComplete', testID),
  onUpdateTestSettings: (jsonTestSettings) => ipcRenderer.send('updateTestSettings',jsonTestSettings),
  testRptListReqByName: (strTestName) => ipcRenderer.send('dbReqCompTestByName', strTestName),
  testRptListReqByConductor: (strTestConductor) => ipcRenderer.send('dbReqCompTestByConductor', strTestConductor),
  testRptListReqByDate: (repReqDateJSON) => ipcRenderer.send('dbReqCompTestByDate', repReqDateJSON),
  onGetCompletedTests: (completedTestJSON) => ipcRenderer.on('CompletedTestList', completedTestJSON),
  generateTestReport: (testID) => ipcRenderer.send('generateXcelRpt', testID),
  onGetXLstatus: (xlStatusStr) => ipcRenderer.on('xlStatus',xlStatusStr),

})






// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})