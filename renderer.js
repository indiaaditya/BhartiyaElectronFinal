//index.html rendering

const CONDUCT_FRESH_TEST = 1;
const CONDUCT_PREVIOUS_TEST = 2;
const GENERATE_TEST_REPORT = 3;
const MODIFY_TEST_SETTINGS = 4;
const CLOSE_APPLICATION = 5;
const LOAD_INDEX_HTML = 6;
const START_TEST = 7;
const PAUSE_TEST = 8;
const RESUME_TEST = 9;
const STOP_TEST = 10;
const RESUME_TEST_LATER = 11;
const GET_TEST_PARAMETERS_FOR_FRESH_TEST = 12;
const GET_LIST_OF_INCOMPLETE_TESTS = 13;
const CLOSE_TEST_SETTING = 14;
const CLOSE_TEST_PARAM_WINDOW = 15;
const CLOSE_PREV_TEST_WINDOW = 16;
const CLOSE_GENERATE_RPT_WINDOW = 17;
const CLOSE_TEST_WINDOW = 18;




const NO_ERROR_DETECTED = 0;
const ERROR_DETECTED = 1;
const ERROR_ACTION_TAKEN = 2;

var vErrorShownFlag = NO_ERROR_DETECTED;


const ET_ERROR_INSUFFICIENT_INLET_PRESSURE = 1;
const ET_ERROR_INSUFFICIENT_OUTLET_PRESSURE = 2;
const ET_ERROR_EXCESS_OUTLET_PRESSURE = 3;
const ET_ERROR_VALVE_OPEN = 4;
const ET_ERROR_VALVE_CLOSE = 5;
const ET_ERROR_EMERGENCY_STOP = 6;
const ET_ERROR_SERVO_MECHANISM = 7;
const ET_ERROR_CALIBRATION_FAILURE = 8;
const ET_ERROR_JIG_SEAT_LEAKAGE = 9;
const ET_ERROR_JIG_LKG_OR_SPINDLE_JAM = 10;
const ET_ERROR_SEAT_LEAKAGE = 11;
const ET_TEST_COMPLETE = 12;


function hideDiv(divId) {
  if (divId == null)
    console.log('Errrrorrr');
  else
    console.log(divId);
  let lclInput = document.getElementById(divId);
  lclInput.style.visibility = 'hidden';
}

function unhideDiv(divId) {
  let lclInput = document.getElementById(divId);
  lclInput.style.visibility = 'visible';
}

function applyClassToElement(divId, classToApply) {
  console.log('Apply Class');
  document.getElementById(divId).classList.add(classToApply);
}

function removeClassToElement(divId, classToRemove) {
  document.getElementById(divId).classList.remove(classToRemove);
}

function elementSetFocus(rElementID) {
  var x = window.scrollX,
    y = window.scrollY;
  let el = document.getElementById(rElementID);
  console.log('Set Focus');
  el.setAttribute('tabindex', '0');
  el.focus();
  window.scrollTo(x, y);
}


function hoverFreshTest() {
  console.log('Hover detected');
  unhideDiv("divFreshTestDesc");
}

function dehoverFreshTest() {
  console.log('deHover detected');
  hideDiv("divFreshTestDesc");
}

function conductFreshTest() {
  console.log('Fresh Test');
  window.electronAPI.mainWindowDesiredAction(CONDUCT_FRESH_TEST);
}

function conductPreviousTest() {
  console.log('Prev Test');
  window.electronAPI.mainWindowDesiredAction(CONDUCT_PREVIOUS_TEST);
}

function generateTestReport() {
  console.log('Gen Test Rpt');
  window.electronAPI.mainWindowDesiredAction(GENERATE_TEST_REPORT);
}

function modifyTestSettings() {
  console.log('Mod Test');
  window.electronAPI.mainWindowDesiredAction(MODIFY_TEST_SETTINGS);
}

function closeApplication() {
  console.log('Close App');
  window.electronAPI.mainWindowDesiredAction(CLOSE_APPLICATION);
}

//*************************** 
//testparameter.html rendering
//**************************** 
var vReadyForEditing = 0;
var programmedParams = {
  "pressure": "0",
  "cycles": "0",
  "degreeOfRtn": "0",
  "torque": "0",
  "maxTorque": "0",
  "testName": "",
  "testConductor": "",
  "completedCycles": "0",
  "totalTestTime": "0",
};


function applyClassToElement(divId, classToApply) {
  console.log('Apply Class');
  document.getElementById(divId).classList.add(classToApply);
}

function removeClassToElement(divId, classToRemove) {
  document.getElementById(divId).classList.remove(classToRemove);
}

function elementSetFocus(rElementID) {
  var x = window.scrollX,
    y = window.scrollY;
  let el = document.getElementById(rElementID);
  console.log('Set Focus');
  el.setAttribute('tabindex', '0');
  el.focus();
  window.scrollTo(x, y);
}

function hideDivsOnLoad() {
  console.log('Hiding in progress...');
  hideDiv("divIDPgmdCycles");
  hideDiv("divIDDegreeOfRtn");
  hideDiv("divIDPgmdTq");
  hideDiv("divIDMaxTq");
  hideDiv("divIDTestName");
  hideDiv("divIDTestConductor");
  console.log('A');
  hideDiv("divLblTestPr");
  hideDiv("divLblPgmdCycles");
  hideDiv("divLblDegreeOfRtn");
  hideDiv("divLblPgmdTq");
  hideDiv("divLblMaxTq");
  hideDiv("divLblTestName");
  hideDiv("divLblTestConductor");
  console.log('B');

  document.getElementById("divTestPrDesc").classList.add("translateDivTestPrDesc");
  unhideDiv("divTestPrDesc");
  hideDiv("divPgmdCyclesDesc");
  hideDiv("divPgmdDegOfRtnDesc");
  hideDiv("divPgmdTqDesc");
  hideDiv("divMaxPgmdTqDesc");
  hideDiv("divTestNameDesc");
  hideDiv("divTestCondDesc");
  hideDiv("divEditTestParams");
  console.log('C');

  //hideDiv("divRngTestPressure");
  hideDiv("divRngPgmdCycles");
  hideDiv("divRngDegreeOfRotation");
  hideDiv("divRngPgmdTq");
  hideDiv("divRngMaxTq");

  document.getElementById("divRngTestPressure").classList.add("translateSliderTestPressure");
  document.getElementById("ipTestPressure").value = document.getElementById("pressureRange").value;

  elementSetFocus("ipTestPressure");

  hideDiv("divBtnSubmit");
  console.log('D');

}


function hideForEditing() {
  //Hide all descriptions
  hideDiv("divTestPrDesc");
  hideDiv("divPgmdCyclesDesc");
  hideDiv("divPgmdDegOfRtnDesc");
  hideDiv("divPgmdTqDesc");
  hideDiv("divMaxPgmdTqDesc");
  hideDiv("divTestNameDesc");
  hideDiv("divTestCondDesc");
  hideDiv("divEditTestParams");

  //hide all entry parameters and descriptions
  hideDiv("divIDTestPr");
  hideDiv("divIDPgmdCycles");
  hideDiv("divIDDegreeOfRtn");
  hideDiv("divIDPgmdTq");
  hideDiv("divIDMaxTq");
  hideDiv("divIDTestName");
  hideDiv("divIDTestConductor");

  //hide all sliders
  hideDiv("divRngTestPressure");
  hideDiv("divRngPgmdCycles");
  hideDiv("divRngDegreeOfRotation");
  hideDiv("divRngPgmdTq");
  hideDiv("divRngMaxTq");

  //hide submit button
  hideDiv("divBtnSubmit");
}

function removeClickEventOfAllAcceptBtns() {
  console.log('Remove events..');
  document.getElementById("btnAccPressure").removeAttribute("onclick", );
  document.getElementById("btnAccCycles").removeAttribute("onclick", );
  document.getElementById("btnAccRtn").removeAttribute("onclick", );
  document.getElementById("btnAccTq").removeAttribute("onclick", );
  document.getElementById("btnAccMaxTq").removeAttribute("onclick", );
  document.getElementById("btnAccTestName").removeAttribute("onclick", );
  document.getElementById("btnAccTestCond").removeAttribute("onclick", );
}

function acceptPressure() {
  //console.log('ADSDSDSDSDS');
  event.preventDefault();
  console.log('User Entry:' + document.getElementById("ipTestPressure").value);
  console.log('JSON:' + JSON.stringify(programmedParams));
  programmedParams.pressure = document.getElementById("ipTestPressure").value;
  console.log('Pressure:' + programmedParams.pressure);
  //applyClassToElement("btnAccPressure","buttonRestoreAcceptParam");
  if ((programmedParams.pressure > 640) || (programmedParams.pressure < 10)) {
    console.log('pressure out of range');
  } else {
    if (vReadyForEditing == 0) {
      hideDiv("divIDTestPr");
      unhideDiv("divIDPgmdCycles");
      console.log('Translate...');
      applyClassToElement("divIDPgmdCycles", "translateDivPgmdCycle");
      document.getElementById("divLblTestPr").classList.add("translateLblTestPressure");
      document.getElementById("LblIdTestPr").innerHTML = "Test Pressure: " + programmedParams.pressure + " bar";
      unhideDiv("divLblTestPr");
      hideDiv("divTestPrDesc");
      unhideDiv("divPgmdCyclesDesc");
      document.getElementById("divPgmdCyclesDesc").classList.add("translateDivPgmdCyclesDesc");

      document.getElementById("divRngTestPressure").classList.remove("translateSliderTestPressure");
      hideDiv("divRngTestPressure");

      unhideDiv("divRngPgmdCycles");
      document.getElementById("divRngPgmdCycles").classList.add("translateSliderPgmdCycle");

      document.getElementById("ipPgmdCycles").value = document.getElementById("cyclesRange").value;
      elementSetFocus("ipPgmdCycles");
    } else {
      document.getElementById("LblIdTestPr").innerHTML = "Test Pressure: " + programmedParams.pressure + " bar";

      console.log('AAAA');
      //document.getElementById("divTestPrDesc").classList.remove("translateDivTestPrDesc");
      hideDiv("divTestPrDesc");
      hideDiv("divIDTestPr");
      hideDiv("divRngTestPressure");
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");
      //removeClickEventOfAllAcceptBtns();

    }
  }
}

function acceptPgmdCycles() {
  programmedParams.cycles = document.getElementById("ipPgmdCycles").value;
  if ((programmedParams.cycles < 1) || (programmedParams.cycles > 10000)) {
    console.log('Pgmd Cycles out of range.');
  } else {
    if (vReadyForEditing == 0) {
      hideDiv("divIDPgmdCycles");
      unhideDiv("divIDDegreeOfRtn");
      document.getElementById("divIDDegreeOfRtn").classList.add("translateDegreeOfRtn");

      document.getElementById("divLblPgmdCycles").classList.add("translateLblPgmdCycle");
      document.getElementById("LblIdPgmdCycles").innerHTML = "Programmed Cycles: " + programmedParams.cycles;
      unhideDiv("divLblPgmdCycles");

      hideDiv("divPgmdCyclesDesc");
      unhideDiv("divPgmdDegOfRtnDesc");
      document.getElementById("divPgmdDegOfRtnDesc").classList.add("translateDivPgmdDegOfRtn");

      document.getElementById("divRngPgmdCycles").classList.remove("translateSliderPgmdCycle");
      hideDiv("divRngPgmdCycles");

      unhideDiv("divRngDegreeOfRotation");
      document.getElementById("divRngDegreeOfRotation").classList.add("translateSliderDegreeOfRtn");

      document.getElementById("ipDegreeOfRotation").value = document.getElementById("rtnRange").value;
      elementSetFocus("ipDegreeOfRotation");
    } else {
      document.getElementById("LblIdPgmdCycles").innerHTML = "Programmed Cycles: " + programmedParams.cycles;
      console.log('BBBB');
      hideDiv("divPgmdCyclesDesc");
      hideDiv("divIDPgmdCycles");
      hideDiv("divRngPgmdCycles");
      document.getElementById("divPgmdCyclesDesc").classList.remove("translateDivPgmdCyclesDesc");
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");
    }
  }
}

function acceptDegreeOfRtn() {
  programmedParams.degreeOfRtn = document.getElementById("ipDegreeOfRotation").value;
  if ((programmedParams.degreeOfRtn > 1440) || (programmedParams.degreeOfRtn < 10)) {
    console.log('Degree of Rotation must be atleast 10 degree and maximum 1440 degree');
  } else {
    if (vReadyForEditing == 0) {
      hideDiv("divIDDegreeOfRtn");
      unhideDiv("divIDPgmdTq");
      document.getElementById("divIDPgmdTq").classList.add("translateDivTorque");
      unhideDiv("divLblDegreeOfRtn");
      document.getElementById("divLblDegreeOfRtn").classList.add("translateLblDegreeOfRtn");
      document.getElementById("LblIdDegreeOfRtn").innerHTML = "Degree of Rotation: " + programmedParams
        .degreeOfRtn + "⁰";
      hideDiv("divPgmdDegOfRtnDesc");
      unhideDiv("divPgmdTqDesc");
      document.getElementById("divPgmdTqDesc").classList.add("translateDivPgmdTq");

      document.getElementById("divRngDegreeOfRotation").classList.remove("translateSliderDegreeOfRtn");
      hideDiv("divRngDegreeOfRotation");

      unhideDiv("divRngPgmdTq");
      document.getElementById("divRngPgmdTq").classList.add("translateSliderTorque");

      document.getElementById("ipPgmdTq").value = document.getElementById("tqRange").value;
      elementSetFocus("ipPgmdTq");
    } else {
      console.log('CCCC');
      document.getElementById("LblIdDegreeOfRtn").innerHTML = "Degree of Rotation: " + programmedParams
        .degreeOfRtn + "⁰";
      hideDiv("divPgmdDegOfRtnDesc");
      document.getElementById("divPgmdDegOfRtnDesc").classList.remove("translateDivPgmdDegOfRtn");
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");
    }
  }
}

function acceptTorque() {
  programmedParams.torque = document.getElementById("ipPgmdTq").value;
  if ((programmedParams.torque < 0.5) || (programmedParams.torque > 50)) {
    console.log('Torque should be atleast 0.5 N-m and atmost 50 N-m');
  } else {
    //if (vReadyForEditing == 0) {
    console.log('Tq acceptance in progress....')
    hideDiv("divIDPgmdTq");
    unhideDiv("divIDMaxTq");
    console.log('Translate...');
    document.getElementById("divIDMaxTq").classList.add("translateDivMaxTorque");
    unhideDiv("divLblPgmdTq");
    document.getElementById("divLblPgmdTq").classList.add("translateLblDivTorque");
    document.getElementById("LblIdPgmdTq").innerHTML = "Programmed Torque: " + programmedParams.torque + " N-m";
    document.getElementById("ipMaximumTq").min = programmedParams.torque;
    document.getElementById("maxTqRange").min = programmedParams.torque;
    console.log('Max Tq:' + document.getElementById("ipMaximumTq").min);
    hideDiv("divPgmdTqDesc");
    unhideDiv("divMaxPgmdTqDesc");
    document.getElementById("divMaxPgmdTqDesc").classList.add("translateDivMaxPgmdTq");

    document.getElementById("divRngPgmdTq").classList.remove("translateSliderTorque");
    hideDiv("divRngPgmdTq");

    unhideDiv("divRngMaxTq");
    document.getElementById("divRngMaxTq").classList.add("translateSliderMaxTorque");

    document.getElementById("ipMaximumTq").value = programmedParams.torque;
    elementSetFocus("ipMaximumTq");
    /*} else {
      console.log('DDDD');
      document.getElementById("LblIdPgmdTq").innerHTML = "Programmed Torque: " + programmedParams.torque + " N-m";
      hideDiv("divIDPgmdTq");
      hideDiv("divPgmdTqDesc");
      console.log('Pgmd Tq:'+ programmedParams.torque);
      document.getElementById("ipMaximumTq").min = programmedParams.torque;
      document.getElementById("ipMaximumTq").value = programmedParams.torque;
      document.getElementById("divPgmdTqDesc").classList.remove("translateDivPgmdTq");
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");
      unhideDiv("divRngMaxTq");
    }
    */

  }
}

function acceptMaxTorque() {
  programmedParams.maxTorque = document.getElementById("ipMaximumTq").value;
  console.log('MT:' + programmedParams.maxTorque);
  console.log('T:' + programmedParams.torque);
  let intTq = parseInt(programmedParams.torque);
  let intMaxTq = parseInt(programmedParams.maxTorque); 
  if ((intMaxTq > 0.5) && (intMaxTq < 50) && (intMaxTq >= intTq)) {
    if (vReadyForEditing == 0) {
      hideDiv("divIDMaxTq");
      unhideDiv("divIDTestName");
      document.getElementById("ipTestName").focus();
      document.getElementById("divIDTestName").classList.add("translateTestName");
      unhideDiv("divLblMaxTq");
      document.getElementById("divLblMaxTq").classList.add("translateLblDivMaxTorque");
      document.getElementById("LblIdMaxTq").innerHTML = "Maximum Torque: " + programmedParams.maxTorque + " N-m";

      hideDiv("divMaxPgmdTqDesc");
      unhideDiv("divTestNameDesc");
      document.getElementById("divTestNameDesc").classList.add("translateDivTestName");

      hideDiv("divRngMaxTq");
      document.getElementById("divRngMaxTq").classList.remove("translateSliderMaxTorque");
      //document.getElementById("ipTestName").value = "Test Name";

      setTimeout(testNameSetFocus, 100);
      elementSetFocus("ipTestName");

      document.getElementById("ipTestName").setSelectionRange(0, 12);
      //document.getElementById("ipTestName").select();
    } else {
      console.log('EEEE');
      document.getElementById("LblIdMaxTq").innerHTML = "Maximum Torque: " + programmedParams.maxTorque + " N-m";
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      hideDiv("divMaxPgmdTqDesc");
      hideDiv("divIDMaxTq");
      hideDiv("divRngMaxTq");
      document.getElementById("divMaxPgmdTqDesc").classList.remove("translateDivMaxPgmdTq");
      document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");

    }
  } else {
    console.log('Invalid Torque Value..')
  }
}

function testNameSetFocus() {
  document.getElementById("ipTestName").focus();
}

function acceptTestName() {
  console.log('RoE:' + vReadyForEditing);
  programmedParams.testName = document.getElementById("ipTestName").value;
  if (programmedParams.testName.length == 0) {
    console.log('Test name cannot be empty');
  } else {
    if (vReadyForEditing == 0) {
      hideDiv("divIDTestName");
      unhideDiv("divIDTestConductor");
      document.getElementById("divIDTestConductor").classList.add("translateTestConductor");
      unhideDiv("divLblTestName");
      document.getElementById("divLblTestName").classList.add("translateLblTestName");
      document.getElementById("LblIdTestName").innerHTML = "Test Name: " + programmedParams.testName;
      hideDiv("divTestNameDesc");
      unhideDiv("divTestCondDesc");
      document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");
      setTimeout(testConductorSetFocus, 100);
      elementSetFocus("ipTestConductor");
    } else {
      console.log('FFFF');
      document.getElementById("LblIdTestName").innerHTML = "Test Name: " + programmedParams.testName;
      document.getElementById("divTestNameDesc").classList.remove("translateDivTestName");
      hideDiv("divTestNameDesc");
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      hideDiv("divIDTestName");
    }

  }
}

function testConductorSetFocus() {
  document.getElementById("ipTestConductor").focus();
}


function acceptTestConductor() {
  programmedParams.testConductor = document.getElementById("ipTestConductor").value;
  if (programmedParams.testConductor.length == 0) {
    console.log('Test Conductor name cannot be empty.');
  } else {
    if (vReadyForEditing == 0) {
      hideDiv("divIDTestConductor");
      unhideDiv("divLblTestConductor");
      document.getElementById("divLblTestConductor").classList.add("translateLblTestConductor");
      document.getElementById("LblIdTestConductor").innerHTML = "Test Conductor: " + programmedParams.testConductor;
      hideDiv("divTestCondDesc");
      unhideDiv("divEditTestParams");
      document.getElementById("divEditTestParams").classList.add("translateEditTestParams");

      document.getElementById("divTestPrDesc").classList.remove("translateDivTestPrDesc");
      document.getElementById("divPgmdCyclesDesc").classList.remove("translateDivPgmdCyclesDesc");
      document.getElementById("divPgmdDegOfRtnDesc").classList.remove("translateDivPgmdDegOfRtn");
      document.getElementById("divPgmdTqDesc").classList.remove("translateDivPgmdTq");
      document.getElementById("divMaxPgmdTqDesc").classList.remove("translateDivMaxPgmdTq");
      document.getElementById("divTestNameDesc").classList.remove("translateDivTestName");
      document.getElementById("divTestCondDesc").classList.remove("translateDivTestCond");
      vReadyForEditing = 1;
      unhideDiv("divBtnSubmit");
    } else {
      console.log('GGGG');
      document.getElementById("LblIdTestConductor").innerHTML = "Test Conductor: " + programmedParams.testConductor;
      console.log('RoE:' + vReadyForEditing);
      hideDiv("divTestCondDesc");
      document.getElementById("divTestCondDesc").classList.remove("translateDivTestCond");
      unhideDiv("divBtnSubmit");
      unhideDiv("divEditTestParams");
      //document.getElementById("divTestCondDesc").classList.add("translateDivTestCond");
      document.getElementById("LblIdTestConductor").innerHTML = "Test Conductor: " + programmedParams.testConductor;
      hideDiv("divIDTestConductor");
    }
  }
}

function editTestPressure() {
  console.log('Edit Pressure');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDTestPr");
    unhideDiv("divTestPrDesc");
    applyClassToElement("btnAccPressure", "buttonAcceptParam");
    document.getElementById("divTestPrDesc").classList.add("translateDivTestPrDesc");
    unhideDiv("divRngTestPressure");
    document.getElementById("divRngTestPressure").classList.add("translateSliderTestPressure");
    elementSetFocus("ipTestPressure");
    //removeClickEventOfAllAcceptBtns();
    console.log('add pr..');
  }
}

function editPgmdCycles() {
  console.log('Edit Prgmd Cycles');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDPgmdCycles");
    unhideDiv("divPgmdCyclesDesc");
    applyClassToElement("divPgmdCyclesDesc", "translateDivPgmdCyclesDesc");
    unhideDiv("divRngPgmdCycles");
    document.getElementById("divRngPgmdCycles").classList.add("translateSliderPgmdCycle");
    elementSetFocus("ipPgmdCycles");
    //removeClickEventOfAllAcceptBtns();
    console.log('add cyc..');
    document.getElementById("btnAccCycles").addEventListener("click", acceptPgmdCycles);
  }
}

function editPgmdDegOfRtn() {
  console.log('Edit Degree of Rotation');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDDegreeOfRtn");
    unhideDiv("divPgmdDegOfRtnDesc");
    applyClassToElement("divPgmdDegOfRtnDesc", "translateDivPgmdDegOfRtn");
    unhideDiv("divRngDegreeOfRotation");
    document.getElementById("divRngDegreeOfRotation").classList.add("translateSliderDegreeOfRtn");
    elementSetFocus("ipDegreeOfRotation");
    //removeClickEventOfAllAcceptBtns();
    console.log('add rtn..');
    document.getElementById("btnAccRtn").addEventListener("click", acceptDegreeOfRtn);
  }
}

function editPgmdTq() {
  console.log('Edit Pgmd Tq');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDPgmdTq");
    unhideDiv("divPgmdTqDesc");
    applyClassToElement("divPgmdTqDesc", "translateDivPgmdTq");
    unhideDiv("divRngPgmdTq");
    document.getElementById("divRngPgmdTq").classList.add("translateSliderTorque");
    elementSetFocus("ipPgmdTq");
    //removeClickEventOfAllAcceptBtns();
    console.log('add Tq..');
    document.getElementById("btnAccTq").addEventListener("click", acceptTorque);
  }
}

function editPgmdMaxTq() {
  console.log('Edit Pgmd Max Tq');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDMaxTq");
    unhideDiv("divMaxPgmdTqDesc");
    applyClassToElement("divMaxPgmdTqDesc", "translateDivMaxPgmdTq");
    unhideDiv("divRngMaxTq");
    document.getElementById("divRngMaxTq").classList.add("translateSliderMaxTorque");
    elementSetFocus("ipMaximumTq");
    //removeClickEventOfAllAcceptBtns();
    console.log('add maxT..');
    document.getElementById("btnAccMaxTq").addEventListener("click", acceptMaxTorque);
  }
}

function editPgmdTestName() {
  console.log('Edit Pgmd Test Name');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDTestName");
    unhideDiv("divTestNameDesc");
    applyClassToElement("divTestNameDesc", "translateDivTestName");
    setTimeout(testNameSetFocus, 100);
    elementSetFocus("ipTestName");
    //removeClickEventOfAllAcceptBtns();
    console.log('Acc Test name...');
    document.getElementById("btnAccTestName").addEventListener("click", acceptTestName);
  }
}

function editPgmdTestConductor() {
  console.log('Edit Pgmd Test Conductor');
  if (vReadyForEditing == 1) {
    hideForEditing();
    unhideDiv("divIDTestConductor");
    unhideDiv("divTestCondDesc");
    applyClassToElement("divTestCondDesc", "translateDivTestCond");
    setTimeout(testConductorSetFocus, 100);
    elementSetFocus("ipTestConductor");
    //removeClickEventOfAllAcceptBtns();
    document.getElementById("btnAccTestCond").addEventListener("click", acceptTestConductor);
  }
}

function loadIndexHtml() {
  console.log('loadIndexHTML');
  window.electronAPI.mainWindowDesiredAction(LOAD_INDEX_HTML);
}

function closeTestParamWindow(){
  console.log('Close Test Parameter window');
  window.electronAPI.mainWindowDesiredAction(CLOSE_TEST_PARAM_WINDOW);
}

function closeTestSetting(){
  console.log('Close Test Setting');
  window.electronAPI.mainWindowDesiredAction(CLOSE_TEST_SETTING);
}

function closePreviousTest(){
  console.log('Close Previous Test');
  window.electronAPI.mainWindowDesiredAction(CLOSE_PREV_TEST_WINDOW);
}

function closeGenerateRptWindow(){
  console.log('Close Previous Test');
  window.electronAPI.mainWindowDesiredAction(CLOSE_GENERATE_RPT_WINDOW);
}

function closeTestWindow(){
  console.log('Close Test window');
  window.electronAPI.mainWindowDesiredAction(CLOSE_TEST_WINDOW);

}

//testparameter.html
function startTest() {
  console.log("Start Test");
  programmedParams.completedCycles = "0";
  programmedParams.totalTestTime = 0;
  window.electronAPI.testParameters(programmedParams);
}

//test.html

function rnGetTestParams() {
  console.log('Getting Test Parameters');
  window.electronAPI.mainWindowDesiredAction(GET_TEST_PARAMETERS_FOR_FRESH_TEST);
}

function rnSetGraphGaugeSettingsAsPerTestParams() {
  console.log('rnSetGraphGaugeSettingsAsPerTestParams');

}

function rnHideDivsOnLoad() {
  console.log('Hiding in progress...');
  hideDiv('divBtnResumeNow');
  hideDiv('divBtnResumeLater');
  hideDiv('divBtnPause');
  hideDiv('divBtnStop');
  hideDiv('divErrorWin');

}

var rnFirstLoad = 0;
function rnStartAction() {
  console.log('rnStartAction');
  hideDiv('divBtnStart');
  hideDiv('divBtnBack');
  unhideDiv('divBtnPause');
  unhideDiv('divBtnStop');
  rnFirstLoad = 1;
  console.log({vChartOverflowCntr});
  window.electronAPI.mainWindowDesiredAction(START_TEST);
}

function rnShowPauseOptions() {
  console.log('rnShowPauseOptions');
  hideDiv('divBtnPause');
  hideDiv('divBtnStop');
  hideDiv('divBtnBack');
  unhideDiv('divBtnResumeNow');
  unhideDiv('divBtnResumeLater');
  window.electronAPI.mainWindowDesiredAction(PAUSE_TEST);
}

function rnTakeStopAction() {
  console.log('rnTakeStopAction');
  window.electronAPI.mainWindowDesiredAction(STOP_TEST);
}

function rnTakeResumeNowAction() {
  console.log('rnTakeResumeNowAction');
  hideDiv('divBtnResumeNow');
  hideDiv('divBtnResumeLater');
  unhideDiv('divBtnPause');
  unhideDiv('divBtnStop');
  window.electronAPI.mainWindowDesiredAction(RESUME_TEST);
}

function rnTakeResumeLaterAction() {
  window.electronAPI.mainWindowDesiredAction(RESUME_TEST_LATER);
  console.log('rnTakeResumeLaterAction');
}

function rnStopTest() {
  console.log('Stop Test');
  window.electronAPI.mainWindowDesiredAction(STOP_TEST);

}

function rnResumeTest() {
  console.log('Resume Test');
  window.electronAPI.mainWindowDesiredAction(RESUME_TEST);
}

//previous Test
function markTestAsComplete() {
  console.log('Mark Test as Complete');
  console.log('IncompTest:' + JSON.stringify(jsonIncompleteTestList));
  window.electronAPI.onMarkTestAsComplete(testIndex);
  hideDiv('divMarkAsComplete');
  hideDiv('divResumeSelectedTest');
  hideDiv('divTestSelected');
  deleteAllRowsOfTable();
  prevTstGetIncompTests();
} 

function resumeSelectedTest() {
  console.log('Resume Selected Test');
  window.electronAPI.resumeTest(testIndex);
//  window.close();
//  hideDiv('divMarkAsComplete');
//  hideDiv('divResumeSelectedTest');
}

function hideReportDivs() {
  hideDiv('divrptTbl');
  hideDiv('divIDTestName');
  hideDiv('divIDTestCond');
  hideDiv('divIDStartDate');
  hideDiv('divIDEndtDate');
  hideDiv('divGenRpt');
  hideDiv('divIDXLrptStatus');
}

function rptListTestsByName() {
  console.log('rptListTestsByName');
  hideReportDivs();
  unhideDiv('divIDTestName');
  document.getElementById("divIDTestName").classList.add("rptTranslateDivIDTestName");

}

function rptListTestsByConductor() {
  console.log('rptListTestsByConductor');
  hideReportDivs();
  unhideDiv('divIDTestCond');
  document.getElementById("divIDTestCond").classList.add("rptTranslateDivIDTestCond");
}

function rptListTestsByDate() {
  console.log('rptListTestsByDate');
  hideReportDivs();
  unhideDiv('divIDStartDate');
  document.getElementById("divIDStartDate").classList.add("rptTranslateDivIDStartDate");
}

function rptAcceptTestName() {
  let lclStrTestName = document.getElementById('ipTestName').value;
  console.log('Test Name:' + lclStrTestName);
  if (lclStrTestName.length > 0) {
    /*console.log('rptAcceptTestName');
    hideReportDivs();
    unhideDiv('divrptTbl');*/
    window.electronAPI.testRptListReqByName(lclStrTestName);
  }
}

function rptAcceptTestConductor() {
  let lclStrTestConductor = '';
  lclStrTestConductor = document.getElementById('ipTestConductor').value;
  if (lclStrTestConductor.length > 0) {
    /*
    console.log('rptAcceptTestConductor');
    hideReportDivs();
    unhideDiv('divrptTbl');
    */
   window.electronAPI.testRptListReqByConductor(lclStrTestConductor);
  }
}


var repReqDateJSON = {
  'startDate':'',
  'endDate':'',
}

function rptAcceptStartDate() {
  let lclStrStartDate = ''; 
  lclStrStartDate = document.getElementById('ipDateStart').value;
  if(lclStrStartDate.length > 0){
    console.log('rptAcceptStartDate');
    hideReportDivs();
    unhideDiv('divIDEndtDate');
    document.getElementById("divIDEndtDate").classList.add("rptTranslateDivIDEndtDate");
    repReqDateJSON.startDate = lclStrStartDate;
  }

}

function rptAcceptEndDate() {
  let lclStrEndDate = '';
  lclStrEndDate = document.getElementById('ipDateEnd').value;
  if(lclStrEndDate.length > 0){
    /*
    console.log('rptAcceptEndDate');
    hideReportDivs();
    unhideDiv('divrptTbl');
    */
   repReqDateJSON.endDate = lclStrEndDate;
   window.electronAPI.testRptListReqByDate(repReqDateJSON);

  }
}

/*
function setProgressChartValue(rVal){
   var textRendererProgress = new TextRenderer(document.getElementById('cycles-value'))
   textRendererProgress.render = function (gaugeProgress) {
     this.el.innerHTML =   (rVal).toFixed(0);
   };
   gaugeProgress.setTextField(textRendererProgress);
 
}

function setTorqueChartValue(rVal){
  var textRendererTorque = new TextRenderer(document.getElementById('gaugeTorque-value'))
  textRendererTorque.render = function (gaugeTorque) {
    this.el.innerHTML = "Torque: " + (gaugeTorque.displayedValue).toFixed(1) + "N-m";
  };
  gaugeTorque.setTextField(textRendererTorque);

}
*/
var gaugeProgress;
window.electronAPI.onGetTestParams((_event, value) => {
  console.log('xReceived Test Params:' + value);
  document.getElementById("divTestParamPressure").innerHTML = "Test Pressure: " + value.pressure + "bar";
  document.getElementById("divTestParamPgmdCycles").innerHTML = "Programmed Cycles: " + value.cycles;
  document.getElementById("divTestParamDegRtn").innerHTML = "Degree of Rotation: " + value.degreeOfRtn + "deg.";
  document.getElementById("divTestParamPgmdTq").innerHTML = "Programmed Torque: " + value.torque + " -> " + value.maxTorque + "N-m";
  //value.cycles = 2000;
  console.log('pgmd cycles:' + value.cycles);
  //value.completedCycles = 1000;   
  var progressGauge = document.getElementById('cvsCycles'); // your canvas element
  progLabels = [0, Number(value.cycles)];
  console.log('ProgLabels:' + progLabels);
  //value.completedCycles = 1000;
  gaugeProgress = new Gauge(progressGauge).setOptions(optsProgress); // create sexy gauge!
  gaugeProgress.setMinValue(0); // Prefer setter over gauge.minValue = 0
  //console.log('Options:'+ JSON.stringify(optsProgress));
  //console.log("labels:"+ optsProgress.staticLabels.labels);
  gaugeProgress.maxValue = value.cycles; // set max gauge value
  //gaugeProgress.setMinValue(0); // Prefer setter over gauge.minValue = 0
  gaugeProgress.animationSpeed = 3; // set animation speed (32 is default value)
  setProgressValue(gaugeProgress, value.completedCycles);
  resetTestScreenBeforeRun();
})

window.electronAPI.onGetCompletedTests((_event, completedTestJSON) => {
  console.log('Completed Test List');
  //jsonIncompleteTestList = incompleteTestJson;
  unhideDiv("divrptTbl");
  hideDiv('divIDTestName');
  hideDiv('divIDTestCond');
  hideDiv('divIDStartDate');
  hideDiv('divIDEndtDate');
  hideDiv('divGenRpt');
  deleteAllRowsOfTable();
  console.log('CompTest:' + JSON.stringify(completedTestJSON));
  let lclCompTestList = document.getElementById("tblPrevTests");
  completedTestJSON.forEach((element) => {
    console.log('Inserting Rows..');
    let lclRow = lclCompTestList.insertRow(-1);
    lclRow.addEventListener("mouseover", () => {
      if(lclRow.classList.contains("rowClick") == false)
        lclRow.classList.add("rowHover");
    });
    lclRow.addEventListener("mouseout", () => {
      lclRow.classList.remove("rowHover");
    });
    lclRow.addEventListener("click", () => {
      removeClassFromAllTblRows();
      lclRow.classList.add("rowClick");
      unhideDiv('divGenRpt');
      unhideDiv('divBtnBack');
      console.log('Test Selected:' + JSON.stringify(completedTestJSON[lclRow.rowIndex - 1]));
      testIndex = completedTestJSON[lclRow.rowIndex - 1].col_test_id;
    })
    let lclDateCell = lclRow.insertCell(0);
    lclDateCell.classList.add("ptTblHeaderDate");
    let lclTestNameCell = lclRow.insertCell(1);
    lclTestNameCell.classList.add("ptTableHeaderTstName");
    let lclTestCondCell = lclRow.insertCell(2);
    lclTestCondCell.classList.add("ptTableHeaderTstCond");
    console.log('Date Ele:' + element.col_test_start_date);
    lclDateCell.innerHTML = element.col_test_start_date.toString().slice(4, 15);
    lclTestNameCell.innerHTML = element.col_test_name;
    lclTestCondCell.innerHTML = element.col_test_conductor;
  })
});


var vChartOverflowCntr = 0;

var prevCycleCntr = 0;

var prevInletIsoStat = 0;
var prevInletVentStat = 0;
var prevXhaustStat = 0;
//var prevErrorCode = "";

window.electronAPI.onGetCycleParams((_event, cycleParam) => {
  let avgCycleTime = 0;

  console.log('xReceived Cycle Params:' + JSON.stringify(cycleParam));

  //Set the gauges
  gaugeTorque.set(cycleParam.testTq);
  gaugeInlet.set(cycleParam.inletPressure);
  gaugeOutlet.set(cycleParam.outletPressure);

  if (rnFirstLoad == 1) {
    rnFirstLoad = 2;
    if (cycleParam.sampleNumber == 0) {
      vChartOverflowCntr = 300;
    } else {
      vChartOverflowCntr = cycleParam.sampleNumber + 300;
    }
  }

  //Set the timings
  document.getElementById("divCurrCycTimeVal").innerHTML = (parseInt(cycleParam.cycleTime / 2)).toString() + "s";
  console.log("cycleParam.cycleNumber:" + cycleParam.cycleNumber);
  if (prevCycleCntr != cycleParam.cycleNumber) {
    prevCycleCntr = cycleParam.cycleNumber;
    if (cycleParam.cycleNumber > 0) {
      //if (cycleParam.cycleNumber % 2 == 0) {
        avgCycleTime = parseInt(((cycleParam.testDuration / 2) / cycleParam.cycleNumber));
      //}
    }
    document.getElementById("divAvgCycTimeVal").innerHTML = avgCycleTime.toString() + "s";
  }

  document.getElementById("divTotTestTimeVal").innerHTML = convertHalfSecToHHMMSS_String(cycleParam.testDuration);
  setProgressValue(gaugeProgress, cycleParam.cycleNumber);

  if (cycleParam.sampleNumber > vChartOverflowCntr) {
    chartRemoveData(InletPrChart);
    chartRemoveData(OutletPrChart);
    chartRemoveData(TorqueChart);
  }
  chartAddData(InletPrChart, cycleParam.sampleNumber, cycleParam.inletPressure);
  chartAddData(OutletPrChart, cycleParam.sampleNumber, cycleParam.outletPressure);
  chartAddData(TorqueChart, cycleParam.sampleNumber, cycleParam.testTq);

  let inletIsoVlv = document.getElementById("divInletIsoVlvStat");
  let inletVentVlv = document.getElementById("divOtletIsoVlvStat");
  let outletXhaustVlv = document.getElementById("divXhaustVlvStat");



  if (cycleParam.inletSVstatus != prevInletIsoStat) {
    prevInletIsoStat = cycleParam.inletSVstatus;
    if (inletIsoVlv.className == "rnDivIsoValvStat")
      inletIsoVlv.className = "rnDivIsoValvStatON";
    else
      inletIsoVlv.className = "rnDivIsoValvStat";
  }


  if (cycleParam.inletVentingSVstatus != prevInletVentStat) {
    prevInletVentStat = cycleParam.inletVentingSVstatus;
    if (inletVentVlv.className == "rnDivOtltValvStat")
      inletVentVlv.className = "rnDivOtltValvStatON";
    else
      inletVentVlv.className = "rnDivOtltValvStat";
  }


  if (cycleParam.exhaustSVstatus != prevXhaustStat) {
    console.log('Toggle...')
    prevXhaustStat = cycleParam.exhaustSVstatus;
    if (outletXhaustVlv.className == "rnDivXhaustValvStat")
      outletXhaustVlv.className = "rnDivXhaustValvStatON";
    else
      outletXhaustVlv.className = "rnDivXhaustValvStat";
  }
  //cycleParam.errorCode = ; //ToDo: Have to send the error code!!!
  updateTestStatus(cycleParam.testStatus);
  rnShowHideError(cycleParam.errorCode);

})

function setProgressValue(rComp, rCompletedCycles) {
  rComp.set(rCompletedCycles); // set actual value
  var textRendererProgress = new TextRenderer(document.getElementById('cycles-value'))
  textRendererProgress.render = function (rComp) {
    this.el.innerHTML = (rComp.displayedValue);
  };
  rComp.setTextField(textRendererProgress);
}

//Set Current Cycle Time, Average Cycle Time, Total Test Time
function resetTestScreenBeforeRun() {
  //Set outlet pressure to 0
  gaugeOutlet.set(0);
  //Set inlet pressure to 0
  gaugeInlet.set(0);
  //Set torque to 0
  gaugeTorque.set(0);
  //Current Cycle Time, Average cycle time and Total test time set to 0.
  document.getElementById("divCurrCycTimeVal").innerHTML = "0s";
  document.getElementById("divAvgCycTimeVal").innerHTML = "0s"
  document.getElementById("divTotTestTimeVal").innerHTML = "00:00:00";

  updateTestStatus("Press Start");

}


function chartAddData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function chartRemoveData(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
  chart.update();
}

function updateTestStatus(strTestStatus) {
  document.getElementById("divTestStageContents").innerHTML = strTestStatus;

}

function convertHalfSecToHHMMSS_String(vHalfSec) {
  var vstrRetHHMMSS = "";
  convertHalfSecToHHMMSS(vHalfSec);
  vstrRetHHMMSS = "";

  if (vRetHrs === 0) {
    vstrRetHHMMSS = "00";
  } else {
    if (vRetHrs < 10) {
      vstrRetHHMMSS = "0" + vRetHrs.toString();
    } else
      vstrRetHHMMSS = vRetHrs.toString();
  }
  vstrRetHHMMSS += ":";


  if (vRetMins === 0) {
    vstrRetHHMMSS += "00";
  } else {
    if (vRetMins < 10)
      vstrRetHHMMSS += "0" + vRetMins.toString();
    else
      vstrRetHHMMSS += vRetMins.toString();
  }
  vstrRetHHMMSS += ":";
  if (vRetSecs === 0) {
    vstrRetHHMMSS += "00";
  } else {
    if (vRetSecs < 10)
      vstrRetHHMMSS += "0" + vRetSecs.toString();
    else
      vstrRetHHMMSS += vRetSecs.toString();
  }
  //alert(vstrRetHHMMSS);
  return vstrRetHHMMSS;
}

var vRetHrs = 0;
var vRetMins = 0;
var vRetSecs = 0;


function convertHalfSecToHHMMSS(vHalfSec) {
  vRetHrs = 0;
  vRetMins = 0;
  vRetSecs = 0;

  if (vHalfSec % 2 !== 0) //Indicates that the value is odd
    vHalfSec--; //This will make it even!

  vHalfSec = vHalfSec / 2; //This will convert it into seconds!    
  if (vHalfSec >= 3600) //Indicates that Hrs is not zero!
  {
    vRetHrs = parseInt(vHalfSec / 3600);
    vHalfSec = vHalfSec - (vRetHrs * 3600);
  }
  if (vHalfSec >= 60) //Idicates that minutes is not zero!
  {
    vRetMins = parseInt(vHalfSec / 60);
    vHalfSec = vHalfSec - (vRetMins * 60);
  }
  vRetSecs = parseInt(vHalfSec); //Whatever is left is seconds!!!
}



var vErrorElapsedInterval = 0;
let StrErrTxt = "";

function rnShowHideError(errCode) {


  console.log('rnShowHideError');
  console.log('Error Shown Flag:' + errCode);
  console.log('shownFlag' + vErrorShownFlag);
  if (errCode != 0) {
    switch (vErrorShownFlag) {
      case ERROR_DETECTED:
        vErrorElapsedInterval++;
        console.log('ET:' + vErrorElapsedInterval);
        if (vErrorElapsedInterval % 2 == 0) {
          ErrElapsedTime.innerHTML = "Elapsed Time: " + convertHalfSecToHHMMSS_String(vErrorElapsedInterval);
        }
        break;
      case NO_ERROR_DETECTED:
        StrErrTxt = "Error: ";
        vErrorShownFlag = ERROR_ACTION_TAKEN;
        switch (errCode) {
          case ET_ERROR_INSUFFICIENT_INLET_PRESSURE:
            StrErrTxt += "Insufficient Inlet Pressure";
            break;
          case ET_ERROR_INSUFFICIENT_OUTLET_PRESSURE:
            StrErrTxt += "Insufficient Outlet Pressure";
            break;
          case ET_ERROR_EXCESS_OUTLET_PRESSURE:
            StrErrTxt += "Excess Outlet Pressure";
            break;
          case ET_ERROR_VALVE_OPEN:
            StrErrTxt += "Valve Open Operation Failed";
            break;
          case ET_ERROR_VALVE_CLOSE:
            StrErrTxt += "Valve Close Operation Failed";
            break;
          case ET_ERROR_EMERGENCY_STOP:
            StrErrTxt += "Emergency Stop Activated";
            break;
          case ET_ERROR_SERVO_MECHANISM:
            StrErrTxt += "Servo Mechanism Error. Restart Required";
            break;
          case ET_ERROR_CALIBRATION_FAILURE:
            StrErrTxt += "Torque Calibration Failed";
            break;
          case ET_ERROR_JIG_SEAT_LEAKAGE:
            StrErrTxt += "JIG/Valve Leakage Detected";
            break;
          case ET_ERROR_JIG_LKG_OR_SPINDLE_JAM:
            StrErrTxt += "JIG Leakage or Spindle Damaged";
            break;
          case ET_ERROR_SEAT_LEAKAGE:
            StrErrTxt += "Seat Leakage Detected";
            break;
          case ET_TEST_COMPLETE:
            StrErrTxt += "Test Completed Successfully";
            alert('Test Completed!');
            //hideDiv();
            //hideDiv();
            unhideDiv('divBtnBack');
            break;
          default:
            //hideDiv("divErrorWin");
            vErrorShownFlag = NO_ERROR_DETECTED;
            break;
        }
        break;
      case ERROR_ACTION_TAKEN:
        console.log('A');
        unhideDiv("divErrorWin");
        console.log('B');
        ErrName.innerHTML = StrErrTxt;
        ErrTimeOfOccurence.innerHTML = "Time of Occurence: " + getCurrentTime();
        console.log('C');
        ErrElapsedTime.innerHTML = "Elapsed Time: " + convertHalfSecToHHMMSS_String(0);
        console.log('D');
        //ErrName.innerHTML("ASA");
        console.log('E');
        vErrorShownFlag = ERROR_DETECTED;
        break;

      default:
        break;
    }
  } else {
    
    if (vErrorShownFlag != NO_ERROR_DETECTED) {
      vErrorShownFlag = NO_ERROR_DETECTED;
      hideDiv("divErrorWin");
    }
  }
}


function getCurrentTime() {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let lclDate = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let lclMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let lclYear = date_ob.getFullYear();

  // current hours
  let lclHours = date_ob.getHours();

  // current minutes
  let lclMinutes = date_ob.getMinutes();

  // current seconds
  let lclSeconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  console.log(lclDate + "-" + lclMonth + "-" + lclYear);

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  let lclDateTimeString = lclDate + "-" + lclMonth + "-" + lclYear + " " + lclHours + ":" + lclMinutes + ":" + lclSeconds;
  console.log(lclDateTimeString);
  return lclDateTimeString;

}

function prevTstGetIncompTests() {
  window.electronAPI.mainWindowDesiredAction(GET_LIST_OF_INCOMPLETE_TESTS);
  hideDiv("divMarkAsComplete");
  hideDiv("divResumeSelectedTest");
  hideDiv("divTestSelected");
}

var jsonIncompleteTestList;
var testIndex = 0;
window.electronAPI.onGetIncompleteTests((_event, incompleteTestJson) => {
  jsonIncompleteTestList = incompleteTestJson;
  console.log('IncompTest:' + JSON.stringify(incompleteTestJson));
  let lclIncompTestList = document.getElementById("tblPrevTests");
  incompleteTestJson.forEach((element) => {
    console.log('Inserting Rows..');
    let lclRow = lclIncompTestList.insertRow(-1);
    lclRow.addEventListener("mouseover", () => {
      if(lclRow.classList.contains("rowClick") == false)
        lclRow.classList.add("rowHover");
    });
    lclRow.addEventListener("mouseout", () => {
      lclRow.classList.remove("rowHover");
    });
    lclRow.addEventListener("click", () => {
      removeClassFromAllTblRows();
      lclRow.classList.add("rowClick");
      console.log('Test Selected:' + JSON.stringify(incompleteTestJson[lclRow.rowIndex - 1]));
      unhideDiv("divMarkAsComplete");
      unhideDiv("divResumeSelectedTest");
      unhideDiv("divTestSelected");
      document.getElementById("divPr").innerHTML = "Test Pressure: " + incompleteTestJson[lclRow.rowIndex - 1].col_test_param_service_pressure + "Bar";
      document.getElementById("divTq").innerHTML = "Torque: " + incompleteTestJson[lclRow.rowIndex - 1].col_test_param_closing_torque + "N-m";
      document.getElementById("divMaxTq").innerHTML = "Max. Torque: " + incompleteTestJson[lclRow.rowIndex - 1].col_test_param_max_torque + "N-m";
      document.getElementById("divcycls").innerHTML = "Programmed Cycles: " + incompleteTestJson[lclRow.rowIndex - 1].col_test_param_pgmd_cycles;

      testIndex = incompleteTestJson[lclRow.rowIndex - 1].col_test_id;
    })
    let lclDateCell = lclRow.insertCell(0);
    lclDateCell.classList.add("ptTblHeaderDate");
    let lclTestNameCell = lclRow.insertCell(1);
    lclTestNameCell.classList.add("ptTableHeaderTstName");
    let lclTestCondCell = lclRow.insertCell(2);
    lclTestCondCell.classList.add("ptTableHeaderTstCond");
    console.log('Date Ele:' + element.col_test_start_date);
    lclDateCell.innerHTML = element.col_test_start_date.toString().slice(4, 15);
    lclTestNameCell.innerHTML = element.col_test_name;
    lclTestCondCell.innerHTML = element.col_test_conductor;
  })
});



function tsModifyTestSettingValues() {
  let jsonTestSettings = {
    'motorRPM': 0,
    'CCCOPMI': 0,
    'CCDOPMI': 0,
    'OCPMI': 0
  }
  jsonTestSettings.motorRPM = document.getElementById("inputMotorSpeed").value;
  jsonTestSettings.CCCOPMI = document.getElementById("inputCCCOPMI").value;
  jsonTestSettings.CCDOPMI = document.getElementById("inputCCDOPMI").value;
  jsonTestSettings.OCPMI = document.getElementById("inputOCPMI").value;
  console.log('Modify');
  window.electronAPI.onUpdateTestSettings(jsonTestSettings);
  //loadIndexHtml();
  closeTestSetting();
}

function tsRestoreTestSettingValues() {
  let jsonTestSettings = {
    'motorRPM': 15,
    'CCCOPMI': 6,
    'CCDOPMI': 6,
    'OCPMI': 6
  }
  console.log('Restore');
  window.electronAPI.onUpdateTestSettings(jsonTestSettings);
  //loadIndexHtml();
  closeTestSetting();
}

function removeClassFromAllTblRows(){
  const rows = Array.from(document.querySelectorAll('tr.rowClick'));
  rows.forEach(row => {
    row.classList.remove('rowClick');
  });
}

function deleteAllRowsOfTable(){
  console.log('Attempting to delete....');
  const rows = Array.from(document.querySelectorAll('tr'));
  rows.forEach(row => {
    if(row.classList.contains("ptTblHeaderRow") == false){
      console.log('Del..');
      row.remove();
    }
  });
  console.log('All rows deleted');
}

function rptGenerateReport(){
  console.log('Gen Rpt..');
  hideDiv('divrptTbl');
  unhideDiv('divIDXLrptStatus');
  hideDiv('divGenRpt');
  window.electronAPI.generateTestReport(testIndex);
}

window.electronAPI.onGetXLstatus((_event,value) =>{
  document.getElementById("divIDXLrptStatus").innerHTML = value; 
})