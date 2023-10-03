// main.js

// Modules to control application life and create native browser window
const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')
const path = require('path')
const mysql = require('mysql2');

const ModbusRTU = require("modbus-serial");
// open connection to a serial port
const mbusClient = new ModbusRTU();
const net = require("net");
const {SerialPort} = require('serialport');
const port = new SerialPort({
	path: 'COM4',
	baudRate: 9600,
  })

const HEADER_EXPECTED_ACTION_SET_DESIREDTQ_DIRN = 'CTD'; //Client Write Send Desired Torque and Direction
const HEADER_EXPECTED_ACTION_GET_TQ_POSITION = 'STP'; //Server Write Get Torque and Position
const HEADER_DUMMY_READ = "CTR"

const CONNECTED = true;
const NOT_CONNECTED = false;

//Excel Related
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
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

const TEST_STAT_IN_PROGRESS = 1;
const TEST_STAT_PAUSED_BY_USER = 2;
const TEST_STAT_ABORTED_BY_USER = 3;
const TEST_STAT_COMPLETE = 4;
const TEST_STAT_ABORTED_BY_ERROR = 5;



//Constant Parameters for Endurance Test Status
const ETTEST_UNKNOWN = 11;
const ETTEST_INIT_BEGIN = 22;
const ETTEST_INIT_DEPRESSURE_BEGIN = 33;
const ETTEST_INIT_DEPRESSURE_AWAIT = 44;
const ETTEST_INIT_DEPRESSURE_COMPLETE = 55;
const ETTEST_PREPARE_TEST_CLOSE_OUTLET = 66;
const ETTEST_PREPARE_TEST_APPLY_INLET = 77;
const ETTEST_PREPARE_TEST_AWAIT_INLET_APPLICATION_DLY = 78;
const ETTEST_PREPARE_TEST_AWAIT_DLY_COMPLETE_VALID_ACTION = 79;
const ETTEST_PREPARE_TEST_AWAIT_DLY_COMPLETE_INVALID_ACTION = 80;
const ETTEST_PREPARE_TEST_TORQUE_CAL = 81;
const ETTEST_PREPARE_TEST_AWAIT_COMPLETE = 82;
const ETTEST_PREPARE_TEST_TORQUE_MONITOR = 83;
const ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE = 84;
const ETTEST_PREPARE_TEST_TORQUE_AWAIT_OPEN_CMD_ACCEPT = 85
const ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE_MONITOR = 86;
const ETTEST_PREPARE_TEST_RETURN_TO_SRC = 87;
const ETTEST_EXEC_CLOSE_VALVE_BEGIN = 99;
const ETTEST_EXEC_MONITOR_VALVE_CLOSE = 110;
const ETTEST_EXEC_VALVE_CLOSE_ERROR_ACTION = 120;
const ETTEST_EXEC_VALVE_CLOSE_STD_ACTION = 130;
const ETTEST_EXEC_VALVE_CLOSE_MONITOR = 131;
const ETTEST_EXEC_VALVE_CLOSE_AWAIT_READING_UPDATE = 132;
const ETTEST_EXEC_JUST_CLOSE = 133;
const ETTEST_AWAIT_VALVE_CLOSE_BEGIN = 134;
const ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_BEGIN = 140;
const ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_MONITOR = 150;
const ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_INTERVAL_COMP_ACTION = 160;
const ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_NORMAL_ACTION = 170;
const ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_ERROR_ACTION = 180;
const ETTEST_EXEC_DISCHARGE_BEGIN = 190;
const ETTEST_EXEC_DISCHARGE_INTERVAL_AWAIT = 200;
const ETTEST_EXEC_DISCHARGE_INTERVAL_COMPLETE = 210;
const ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_BEGIN = 220;
const ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_MONITOR = 230;
const ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_INTERVAL_COMP_ACTION = 240;
const ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_NORMAL_ACTION = 250;
const ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_ERROR_ACTION = 260;
const ETTEST_EXEC_OPEN_VALVE_BEGIN = 270;
const ETTEST_EXEC_VALVE_OPEN = 271;
const ETTEST_EXEC_AWAIT_VALVE_OPEN_BEGIN = 272;
const ETTEST_EXEC_MONITOR_VALVE_OPEN = 280;
const ETTEST_EXEC_VALVE_OPEN_ERROR_ACTION = 290;
const ETTEST_EXEC_VALVE_OPEN_STD_ACTION = 300;
const ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_BEGIN = 310;
const ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_MONITOR = 320;
const ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_INTERVAL_COMP_ACTION = 330;
const ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_NORMAL_ACTION = 340;
const ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_ERROR_ACTION = 350;
const ETTEST_EMERGENCY_STOP_BEGIN = 360;
const ETTEST_EMERGENCY_STOP_MONITOR = 370;
const ETTEST_EMERGENCY_STOP_COMPLETE = 380;
const ETTEST_CYCLE_COMPLETE_BEGIN = 390;
const ETTEST_CYCLE_COMPLETE_MONITOR = 400;
const ETTEST_CYCLE_COMPLETE_COMPLETE = 410;
const ETTEST_PAUSE_BEGIN = 420;
const ETTEST_RESUME_BEGIN = 430;
const ETTEST_AWAIT_RESUME_COMPLETE = 440;
const ETTEST_TAKE_STOP_TEST_ACTION = 450;
const ETTEST_NON_RECOVERABLE_ERROR_ACTION_BEGIN = 460;
const ETTEST_NON_RECOVERABLE_ERROR_ACTION_DELAY = 470;
const ETTEST_NON_RECOVERABLE_ERROR_ACTION_END = 480;



//Constant declarations
const ETPARAMENTRY_TESTPRESSURE_NEW = 1;
const ETPARAMENTRY_OPEN_ROTATION_NEW = 2;
const ETPARAMENTRY_CLOSING_TORQUE_NEW = 3;
const ETPARAMENTRY_END_TORQUE_NEW = 8;
const ETPARAMENTRY_TEST_CYCLES_NEW = 4;
const ETPARAMENTRY_TEST_ID_NEW = 5;
const ETPARAMENTRY_TEST_CONDUCTOR_NEW = 6;
const ETPARAMENTRY_AWAIT_USER_ACCEPTANCE = 7;

//Constant declarations for min and max values for param entry
const ETPARAMENTRY_TESTPRESSURE_MIN = 15;
const ETPARAMENTRY_TESTPRESSURE_MAX = 400;
const ETPARAMENTRY_OPEN_ROTATION_MIN = 20;
const ETPARAMENTRY_OPEN_ROTATION_MAX = 1440;
const ETPARAMENTRY_CLOSING_TORQUE_MIN = 3.5;
const ETPARAMENTRY_CLOSING_TORQUE_MAX = 33;
const ETSET_CYCLES_MIN = 1;
const ETSET_CYCLES_MAX = 100000;

const SERVO_CMD_STAT_UNKNOWN = 0;
const SERVO_CMD_STAT_LOADED = 1;
const SERVO_CMD_STAT_ACCEPTED = 2;
const SERVO_CMD_STAT_COMPLETED = 3;
const SERVO_CMD_REACHED_OPEN_POSN = 5;
const SERVO_CMD_STAT_COMPLETED_TQ = 6;
const SERVO_CMD_STAT_COMPLETED_OPEN_POSN = 7;
const SERVO_CMD_STAT_ERR = 5;
const SERVO_CMD_STAT_REJECTED = 6;

const COMM_FAIL_DECLARE_TIMEOUT = 10;
var commFailCntr = 0;
var commFailFlag = 0;


/*const CMD_STAT_UNKNOWN =	0;
const CMD_STAT_LOADED = 1;
const CMD_STAT_ACCEPTED = 2;
const CMD_STAT_COMPLETED_POSN = 3;
const CMD_STAT_COMPLETED_TQ = 4;
const CMD_STAT_ERR = 5;
const CMD_STAT_REJECTED = 6;
*/


const PRESSURE_OK = 0;
const PRESSURE_LESS = -1;
const PRESSURE_MORE = 1;

const CW = 1; //Full Marks for being right handed
const ACW = 0; //Zero Marks for being left handed.... Indian Preconcieved notions become predefined definitions!!

//Positive Negative Tolerances for Inlet OutletPressure
/*const ET_InletPrPositiveTolerance = 5;
const ET_OutletPrPositiveTolerance = 5;
const ET_InletPrNegativeTolerance = 5;
const ET_OutletPrNegativeTolerance = 5;
*/
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

var ET_ERROR_DISPLAYED_FLAG = 0;
var ET_TorqueIncrementPercentage = 0;

const TORQUE_CORRECTION_FACTOR = 0.4;
const MAX_TQ_CAL_ATTEMPTS = 20;

const Q0 = 0x01;
const Q1 = 0x02;
const Q2 = 0x04;
const Q3 = 0x08;
const Q4 = 0x10;
const Q5 = 0x20;
const Q6 = 0x40;
const Q7 = 0x80;

var jsonCycleParam = {
	'testId': 0,
	'cycleNumber': 0,
	'inletPressure': 0.0,
	'outletPressure': 0.0,
	'pgmdTq': 0.0,
	'testTq': 0.0,
	'inletSVstatus': 0,
	'inletVentingSVstatus': 0,
	'exhaustSVstatus': 0,
	'servoStatus': 0,
	'timeOfRecord': '',
	'sampleNumber': 0,
	'errorCode': 0,
	'cycleTime': 0,
	'testDuration': 0,
	'testStatus': '',
	'testStatusVal': 0,
}

var cycleParam = jsonCycleParam;

var vlCntrRlyDesired = 0;
var vlRstRlyDesired = 0;
var vlInletIsolatingDesired = 0;
var vlIntletVentingDesired = 0;
var vlOutletExhaustDesired = 0;
var vlLowPressureAlarm = 0;


//const OP_INLET_ISOLATING_VALVE 


var ETParamEntryStatus = ETPARAMENTRY_TESTPRESSURE_NEW;

var GrTqPrevVal = 0;

var jsonTestParam = {
	'Name': '',
	'Cond': '',
	'startDate': '',
	'servicePressure': 0,
	'openingDegree': 0,
	'closingTorque': 0.0,
	'maxTorque': 0.0,
	'pgmdCycles': 0,
	'motorRPM': 0,
	'CCCOPMI': 0,
	'CCDOPMI': 0,
	'OCPMI': 0
}
//If modify Test parameters is not called these values will retain their default status
jsonTestParam.motorRPM = 15;
jsonTestParam.CCCOPMI = 6;
jsonTestParam.CCDOPMI = 6;
jsonTestParam.OCPMI = 6;

const EXCEL_BASE_FILE = path.join("E:", "Proff", "Clients", "TeknoValves", "Reports", "EnduranceTestFundamental.xlsx");
//const EXCEL_BASE_FILE = path.join("C:", "Users", "Admin", "Documents", "Reports", "EnduranceReport-25-03-2023-21-44-42.xlsx");

const EXCEL_DESTINATION_FILE = path.join("C:", "Users", "Admin", "Documents", "Reports");

var testParamsRcvd;
var vTimeoutCntrAwaitCmdAccept = 0;

function handleMainWindowDesiredAction(event, desiredAction) {
	////consolelog('handleMainWindowDesiredAction');
	////consolelog('DA:' + desiredAction);
	switch (desiredAction) {
		case CONDUCT_FRESH_TEST:
			////consolelog("CONDUCT_FRESH_TEST");
			paramWindow();
			break;

		case CONDUCT_PREVIOUS_TEST:
			////consolelog("CONDUCT_PREVIOUS_TEST");
			prevTestWindow();
			break;

		case GENERATE_TEST_REPORT:
			////consolelog("GENERATE_TEST_REPORT");
			reportWindow();
			break;

		case MODIFY_TEST_SETTINGS:
			////consolelog("MODIFY_TEST_SETTINGS");
			modTestSettingWindow();
			break;

		case CLOSE_APPLICATION:
			////consolelog("Close Application");
			closeApplication();
			break;

		case LOAD_INDEX_HTML:
			////consolelog("Show Index html");
			createWindow();
			//loadIndexWindow();
			break;

		case START_TEST:
			////consolelog("Start test");
			startTest();
			break;

		case PAUSE_TEST:
			////consolelog("Pause Test");
			pauseTest();
			break;

		case RESUME_TEST:
			////consolelog("Resume Test");
			resumeTest();
			break;

		case STOP_TEST:
			////consolelog("Stop Test");
			stopTest();
			break;

		case RESUME_TEST_LATER:
			////consolelog("Resume Test later");
			resumeLaterTest();
			break;

		case GET_TEST_PARAMETERS_FOR_FRESH_TEST:
			////consolelog("Sending Test Parameters to the test window");
			sendTestParametersForFreshTest();
			break;
		
		case GET_LIST_OF_INCOMPLETE_TESTS:
			getListofIncompleteTests();
			break;

		case CLOSE_TEST_SETTING:
			modifyTestSettingWindow.close();
			createWindow();
			break;

		case CLOSE_TEST_PARAM_WINDOW:
			newTestParamWindow.close();
			newTestParamWindow = null;
			createWindow();
			//loadIndexWindow();
			break;	

		case CLOSE_PREV_TEST_WINDOW:
			previousTestWindow.close();
			previousTestWindow = null;
			createWindow();
			//loadIndexWindow();
			break;		

		case CLOSE_GENERATE_RPT_WINDOW:
			reportSelWindow.close();
			reportSelWindow = null;
			createWindow();
			//loadIndexWindow();
			break;
		
		case CLOSE_TEST_WINDOW:
			TestWindow.close();
			TestWindow = null;
			createWindow();
			//loadIndexWindow();
			break;

		default:
			////consolelog("Invalid...");
			break;
	}
}

function handleTestParamExchange(event, testParams) {
	////consolelog('handleTestParamExchange');
	const webContents = event.sender;
	//const win = BrowserWindow.fromWebContents(webContents);
	testParamsRcvd = testParams;
	//testParamsRcvd.totalTestTime = convertHalfSecToHHMMSS_String(testParamsRcvd.totalTestTime);
	///consolelog('Received Test params:' + JSON.stringify(testParamsRcvd));
	////consolelog("Show test html");
	vTestStartFlag = START_FRESH_TEST;
	loadTestWindowAction();
}

var resumeTestId = 0;
function handleResumeTest(event, rTestID){
	const webContents = event.sender;
	console.log('ITHE AAALLLOOO........*********');
	resumeTestId = rTestID;
	dbResumeGetMaxCycleCompleted(rTestID,(rTestID)=>{dbGetTestByID(rTestID,dbGetMaxSampleNumbers)});
	//loadTestWindow();
	
}

function handleMarkAsComplete(event, rTestID){
	const webContents = event.sender;
	dbUpdateTestResult(rTestID,TEST_STAT_ABORTED_BY_USER);
}

function handleUpdateTestSettings(event, jsonTestSettings){
	const webContents = event.sender;
	
	jsonTestParam.motorRPM = jsonTestSettings.motorRPM;
	jsonTestParam.CCCOPMI = jsonTestSettings.CCCOPMI;
	jsonTestParam.CCDOPMI = jsonTestSettings.CCDOPMI;
	jsonTestParam.OCPMI = jsonTestSettings.OCPMI;
    console.log('Modified Test Settings:' + JSON.stringify(jsonTestParam));

}

function handle_dbReqCompTestByName(event,strTestName){
	console.log('handle_dbReqCompTestByName');
	const webContents = event.sender;
	dbGetTestsByNameofTest(strTestName,()=>{sendListOfTestsForReportGeneration();});
		
	
}
function handle_dbReqCompTestByConductor(event,strTestConductor){
	console.log('handle_dbReqCompTestByConductor');
	const webContents = event.sender;
	dbGetTestsByConductor(strTestConductor,()=>{sendListOfTestsForReportGeneration();});

}

function handle_dbReqCompTestByDate(event,repReqDateJSON){
	console.log('handle_dbReqCompTestByDate',);
	const webContents = event.sender;
	dbGetTestsByDate(repReqDateJSON.startDate, repReqDateJSON.endDate,()=>{sendListOfTestsForReportGeneration();});
}

function handleReportGeneration(event, testID){
	console.log('Handle rpt Gen...');
	reportGenSequence(testID);
}


var mainWindow = null;
var newTestParamWindow = null;
var previousTestWindow = null;
var reportSelWindow = null;
var TestWindow = null;
var modifyTestSettingWindow = null;
//var loadMainIndexWindow = null;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: false, //Make it true for release
	})

	// and load the index.html of the app.
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	//mainWindow.webContents.openDevTools()
}


const paramWindow = () => {
	// Create the browser window.
	newTestParamWindow = new BrowserWindow({
		//parent: mainWindow,
		modal: true,
		width: 800,
		height: 600,
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: false, //Make it true for release
	})
	newTestParamWindow.loadFile('testparameter.html')
	//newTestParamWindow.webContents.openDevTools();

	mainWindow.close();
	mainWindow = null;
}



const prevTestWindow = () => {
	// Create the browser window.
	previousTestWindow = new BrowserWindow({
		//parent: mainWindow,
		modal: true,
		width: 800,
		height: 600,
		fullscreen: true,
		//alwaysOnTop:true, 
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: true,
	})
	previousTestWindow.loadFile('previousTest.html');
//	previousTestWindow.webContents.openDevTools();
	mainWindow.close();
	mainWindow = null;

}


const reportWindow = () => {
	// Create the browser window.
	reportSelWindow = new BrowserWindow({
		//parent: mainWindow,
		modal: true,
		width: 800,
		height: 600,
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: true,
	})
	reportSelWindow.loadFile('report.html');
	mainWindow.close();
	mainWindow = null;
	//Open the DevTools.
	//reportSelWindow.webContents.openDevTools();
}

const modTestSettingWindow = () => {
	// Create the browser window.
	modifyTestSettingWindow = new BrowserWindow({
		//parent: mainWindow,
		modal: true,
		width: 800,
		height: 600,
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: true,
	})
	modifyTestSettingWindow.loadFile('testSettings.html');
	mainWindow.close();
	mainWindow = null;
	//modifyTestSettingWindow.webContents.openDevTools();
}

const loadTestWindow = () => {
	TestWindow = new BrowserWindow({
		modal: true,
		width: 800,
		height: 600,
		fullscreen: true,
		//alwaysOnTop:true, 
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: true,
	})
	TestWindow.loadFile('test.html');
	//TestWindow.webContents.openDevTools();
}

const closeApplication = () => {
	//consolelog('Close Application');
	app.quit();
}


const pauseTest = () => {
	//consolelog('Pause Test');
	vET_Return_Status = EnduranceTestExecuteCurrrentStat;
	EnduranceTestExecuteCurrrentStat = ETTEST_PAUSE_BEGIN;
	dbUpdateTestResult(cycleParam.testId, TEST_STAT_PAUSED_BY_USER);
}


const stopTest = () => {
	EnduranceTestExecuteCurrrentStat = ETTEST_EMERGENCY_STOP_BEGIN;
	dbUpdateTestResult(cycleParam.testId, TEST_STAT_ABORTED_BY_USER);
	//consolelog('Stop Test');
}

const resumeTest = () => {
	EnduranceTestExecuteCurrrentStat = ETTEST_RESUME_BEGIN;
	dbUpdateTestResult(cycleParam.testId, TEST_STAT_IN_PROGRESS);
	//consolelog('Resume Test Now');
}

const resumeLaterTest = () => {
	//consolelog('Resume the test later');
	EnduranceTestExecuteCurrrentStat = ETTEST_EMERGENCY_STOP_BEGIN;
	dbUpdateTestResult(cycleParam.testId, TEST_STAT_PAUSED_BY_USER);
}


var vIntervalId; //Interval variable for controlling running test and it's interval
var vModbusIntervalId;
const startTest = () => {
	
	if(vTestStartFlag == START_FRESH_TEST){
		fillTestParamJson(testParamsRcvd);
		dbStoreTestParam(jsonTestParam,dbGetTestID);
	}
	EnduranceTestExecuteCurrrentStat = ETTEST_UNKNOWN;
	vIntervalId = setInterval(ExecuteEnduranceTest, 500);

}

const sendTestParametersForFreshTest = () => {
	//consolelog(': ' + JSON.stringify(testParamsRcvd));
	TestWindow.webContents.send('testParams', testParamsRcvd);
	console.log('CycleParam2:'+ JSON.stringify(cycleParam));
	transferCycleParametersWithoutDB();
}

const sendCycleParameters = () => {
	//console.log('CycParamSent...');
	TestWindow.webContents.send('testCycleParams', cycleParam);
}

const sendListOfIncompleteTests = () => {
	console.log("\n\n\n\n\n\n****************************\n\n\n\n"+incompleteTestJson);
	previousTestWindow.webContents.send('IncompleteTestList',incompleteTestJson);
}

const sendListOfTestsForReportGeneration = () => {
	console.log("\n\n\n\n\n\n****************************\n\n\n\n");
	reportSelWindow.webContents.send('CompletedTestList',completedTestJSON);
}

function getCurrentTimeInDBFormat(){
	const lclDate = new Date();
	let dd = lclDate.getDate();
	let mm = lclDate.getMonth() + 1;
	let yy = lclDate.getFullYear();
	let hh = lclDate.getHours();
	let min = lclDate.getMinutes();
	let ss = lclDate.getSeconds();
	let dateTimeStr = `${yy}-${mm}-${dd} ${hh}:${mm}:${ss}`;
	return dateTimeStr;
}

function fillTestParamJson(rTestJSONFromTestJS) {


	//rTestJSONtoDB = jsonTestParam;

	jsonTestParam.servicePressure = rTestJSONFromTestJS.pressure;
	jsonTestParam.pgmdCycles = rTestJSONFromTestJS.cycles;
	jsonTestParam.openingDegree = rTestJSONFromTestJS.degreeOfRtn;
	jsonTestParam.closingTorque = rTestJSONFromTestJS.torque;
	jsonTestParam.maxTorque = rTestJSONFromTestJS.maxTorque;
	jsonTestParam.Name = rTestJSONFromTestJS.testName;
	jsonTestParam.Cond = rTestJSONFromTestJS.testConductor;
	
	jsonTestParam.startDate = getCurrentTimeInDBFormat();
	//Decision of filling these parameters is to be taken

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

	ipcMain.on('set-mainWindowAction', handleMainWindowDesiredAction);
	ipcMain.on('testParamExchange', handleTestParamExchange);
	ipcMain.on('resumeTest',handleResumeTest);
	ipcMain.on('updateTestSettings',handleUpdateTestSettings);
	ipcMain.on('markAsComplete',handleMarkAsComplete);
	ipcMain.on('dbReqCompTestByName',handle_dbReqCompTestByName);
	ipcMain.on('dbReqCompTestByConductor',handle_dbReqCompTestByConductor);
	ipcMain.on('dbReqCompTestByDate',handle_dbReqCompTestByDate);
	ipcMain.on('generateXcelRpt', handleReportGeneration);


	createWindow()

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Wait for the read of the excel file to be completed
var dbCon = mysql.createConnection({
	host: "localhost",
	port: "3306",
	user: "root",
	password: "aquafinaHotMAA26!",
	database: 'endurance_new'
});


function dbResumeGetMaxCycleCompleted(rTestID,callback){
	dbCon.execute("Select MAX(col_cycle_number) FROM endurance_new.tbl_test_cycles WHERE col_test_id = ?", [rTestID],
		function (err, result, fields) {
			//consolelog(err);
			//consolelog(result);
			maxExecutedCycles = result[0]["MAX(col_cycle_number)"];
			if(maxExecutedCycles == null)
				maxExecutedCycles = 0;
		  	console.log('maxCycls:' + maxExecutedCycles);
			callback(rTestID);
			////consolelog(fields);
		})
}

function dbGetMaxSampleNumbers(rTestID, callback){
	dbCon.execute("Select MAX(col_test_sample_number) FROM endurance_new.tbl_test_cycles WHERE col_test_id = ?", [rTestID],
	function (err, result, fields) {
		ET_SampleCntr = result[0]["MAX(col_test_sample_number)"];
		loadTestWindowAction();
		//previousTestWindow.close();
		//previousTestWindow = null;
		console.log({ET_SampleCntr});
	});	
	
}

function dbGetMaxCycleCompleted(rTestID, callback) {
	//consolelog('dbGetMaxCycleCompleted');
	dbCon.execute("Select MAX(col_cycle_number) FROM endurance_new.tbl_test_cycles WHERE col_test_id = ?", [rTestID],
		function (err, result, fields) {
			//consolelog(err);
			//consolelog(result);
			maxExecutedCycles = result[0]["MAX(col_cycle_number)"];
			if(maxExecutedCycles == null)
				maxExecutedCycles = 0;
		  	console.log('maxCycls:' + maxExecutedCycles);
			callback(rTestID, maxExecutedCycles);
			////consolelog(fields);
		});
}

var completedTestJSON;
function dbGetTestsByConductor(rStrNameOfConductor,callback) {
	//consolelog('dbGetTestsByConductor');
	let strCondName = '%' + rStrNameOfConductor + '%';
	dbCon.execute("Select * from endurance_new.tbl_test_parameters where `col_test_conductor` like ?", [strCondName],
		function (err, result, fields) {
			//consolelog(err);
			console.log(result);
			completedTestJSON = result;
			callback();
			////consolelog(fields);
		});
}

function dbGetTestsByDate(rStartDate, rEndDate,callback) {
	//consolelog('dbGetTestsByDate');
	dbCon.execute("Select * from endurance_new.tbl_test_parameters where `col_test_start_date` between ? and ?", [rStartDate, rEndDate],
		function (err, result, fields) {
			//consolelog(err);
			console.log(result);
			completedTestJSON = result;
			callback();
			////consolelog(fields);
		});
}

function dbGetTestsByNameofTest(rstrNameOfTest,callback) {
	//consolelog('dbGetTestsByNameofTest');
	let strTestName = '%' + rstrNameOfTest + '%';
	dbCon.execute("Select * from endurance_new.tbl_test_parameters where `col_test_name` like ?", [strTestName],
		function (err, result, fields) {
			//consolelog(err);
			console.log(result);
			completedTestJSON = result;
			callback();
			////console.log(fields);
		});

}


var incompleteTestJson;
function dbGetIncompleteTest(callback){
	console.log('dbGetIncompleteTest');
	dbCon.execute("Select * from endurance_new.tbl_test_parameters where `col_test_result` = 1 OR `col_test_result` = 2",
		function (err, result, fields) {
			console.log("Error:" + err);
			if(err == null){
				console.log(result);
				incompleteTestJson = result;
				callback();
			}
			
			//console.log(fields);
		});
}

function dbUpdateTestResult(rTestID, rResult) {
	//consolelog('dbUpdateTestResult');
	dbCon.execute("UPDATE endurance_new.tbl_test_parameters SET col_test_result = ? where col_test_id = ?", [rResult, rTestID],
		function (err, result, fields) {
			//consolelog(err);
			//consolelog(result);workbook
		});
}

function dbGetIndividualRecord(arr, callback) {
	console.log('dbGetIndividualRecord' + JSON.stringify(arr));
	console.log('getting record' + arr[2]);
	dbCon.execute("Select * FROM endurance_new.tbl_test_cycles WHERE col_test_id = ? AND col_test_sample_number = ?", [arr[0], arr[2]],
		function (err, result, fields) {
			//consolelog(err);
			////consolelog(result);
			cycleParam.testId = result[0].col_cycle_id;
			cycleParam.cycleNumber = result[0].col_cycle_number;
			cycleParam.inletPressure = result[0].col_inlet_pressure;
			cycleParam.outletPressure = result[0].col_outlet_pressure;
			cycleParam.pgmdTq = result[0].col_pgmd_torque;
			cycleParam.testTq = result[0].col_test_torque;
			cycleParam.inletSVstatus = result[0].col_inlet_sv_status;
			cycleParam.inletVentingSVstatus = result[0].col_outlet_sv_status;
			cycleParam.exhaustSVstatus = result[0].col_exhaust_sv_status;
			cycleParam.servoStatus = result[0].col_servo_stat;
			cycleParam.timeOfRecord = result[0].col_test_time_of_record;
			cycleParam.sampleNumber = result[0].col_test_sample_number;
			XLintegratedWriteActivity(cycleParam.sampleNumber, cycleParam.sampleNumber, cycleParam.cycleNumber, cycleParam.outletPressure);
			if (arr[2] <= arr[1]) {
				callback(arr);
			} else {
				//consolelog('Got all the records');
				console.log('W1');
				worksheet = workbook.getWorksheet("Endurance Test Chart");
				XLWriteFile();
			}
		});

}


var arrTestIDRcdCntAndRcdToRead = new Array(3);

function dbPrepareToGetRecords(rResultArr, callback) {
	//consolelog('dbPrepareToGetRecords' + JSON.stringify(rResultArr));
	arrTestIDRcdCntAndRcdToRead = rResultArr;
	arrTestIDRcdCntAndRcdToRead[2] = 1; //This is indicative of the number of the record to be read.
	if (arrTestIDRcdCntAndRcdToRead[1] > 0)
		callback(arrTestIDRcdCntAndRcdToRead);
}

var arrTestIDAndRcdCnt = new Array(2);

function dbGetNumberOfRecordsOfParticularTest(rTestID, callback) {
	////consolelog({workbook});
	worksheet = workbook.getWorksheet("EnduranceTest");
	////consolelog({worksheet});
	//consolelog('dbGetNumberOfRecordsOfParticularTest');
	dbCon.execute("Select COUNT(*) FROM endurance_new.tbl_test_cycles WHERE col_test_id = ?", [rTestID],
		function (err, result, fields) {
			//consolelog(err);
			//consolelog(result);
			////consolelog('Res:'+ result[0]["MAX(col_cycle_number)"]);

			arrTestIDAndRcdCnt[0] = rTestID;
			arrTestIDAndRcdCnt[1] = result[0]["COUNT(*)"];
			callback(arrTestIDAndRcdCnt);
			////consolelog(fields);
		});
}


function dbWrapperGetIndividualRecord(arr) {
	//consolelog('dbWrapperGetIndividualRecord');
	//consolelog("Rcd To Read:" + arrTestIDRcdCntAndRcdToRead[2]);
	//consolelog("Total Records:" + arrTestIDRcdCntAndRcdToRead[1]);
	let lclStrXlStatus = '';
	if (arrTestIDRcdCntAndRcdToRead[2] <= arrTestIDRcdCntAndRcdToRead[1]) {
		dbGetIndividualRecord(arr, dbWrapperGetIndividualRecord);
		lclStrXlStatus = "Stroring Record " + arrTestIDRcdCntAndRcdToRead[2] + " of " + arrTestIDRcdCntAndRcdToRead[1]; 
		arrTestIDRcdCntAndRcdToRead[2]++;
	} else {
		lclStrXlStatus = "All records Stored";
		console.log('W2');
		//XLWriteFile();
	}
	reportSelWindow.webContents.send('xlStatus',lclStrXlStatus);
}

var maxExecutedCycles = 0;
var maxSampleNumber = 0;
var TestParamsJSON;

const START_FRESH_TEST = 0;
const START_PREVIOUSLY_PAUSED_TEST = 1;
var vTestStartFlag = START_FRESH_TEST;

function dbGetTestByID(rTestID,callback){
	dbCon.execute("Select * FROM endurance_new.tbl_test_parameters WHERE col_test_id = ?", [rTestID],
		function (err, result, fields) {
			//consolelog(err);
			console.log('dbGetTestByID:' + {result});
			let lclProgrammedParams = {
				"pressure": "0",
				"cycles": "0",
				"degreeOfRtn": "0",
				"torque": "0",
				"maxTorque": "0",
				"testName": "",
				"testConductor": "",
				"completedCycles": "0",
				"totalTestTime": "0",
				"motorRPM": "0",
				"CCCOPMI": "0",
				"CCDOPMI": "0",
				"OCPMI":"",
			  };

			
			  lclProgrammedParams.pressure = result[0].col_test_param_service_pressure;
			  console.log('P1:'+ lclProgrammedParams.pressure);
			  console.log("P2:"+ result[0].col_test_param_service_pressure);
			  lclProgrammedParams.cycles = result[0].col_test_param_pgmd_cycles;
			  lclProgrammedParams.degreeOfRtn = result[0].col_test_param_degree_to_open;
			  lclProgrammedParams.torque = result[0].col_test_param_closing_torque;
			  lclProgrammedParams.maxTorque = result[0].col_test_param_max_torque;
			  lclProgrammedParams.motorRPM = result[0].col_test_motor_test_rpm;
			  lclProgrammedParams.CCCOPMI = result[0].col_test_CCCOPMI;
			  lclProgrammedParams.CCDOPMI = result[0].col_test_CCDOPMI;
			  lclProgrammedParams.OCPMI = result[0].col_test_OCPMI;
			  lclProgrammedParams.completedCycles = maxExecutedCycles;
			  CyclesCounter = maxExecutedCycles;
			  lclProgrammedParams.totalTestTime = 0;



			testParamsRcvd = lclProgrammedParams;
			console.log('Pgmd Params:'+ JSON.stringify(lclProgrammedParams));
			console.log('Test ID:'+ rTestID);

			  
			vTestStartFlag = START_PREVIOUSLY_PAUSED_TEST;
			console.log('Selected Test:'+ JSON.stringify(testParamsRcvd));
			callback(rTestID);
			
		});
}


function dbGetTestParameters(rTestID, rMaxExecutedCycles, callback) {
	//consolelog("dbGetTestParameters");
	worksheet = workbook.getWorksheet("SettingResultSheet");
	dbCon.execute("Select * FROM endurance_new.tbl_test_parameters WHERE col_test_id = ?", [rTestID],
		function (err, result, fields) {
			//consolelog(err);
			console.log(result);
			TestParamsJSON = result;
			callback(rTestID, rMaxExecutedCycles, TestParamsJSON);
			////consolelog(fields);
		});
}




function reportGenSequence(rTestID) {
	console.log('Path of the file:' + EXCEL_BASE_FILE);
	XLprepare(EXCEL_BASE_FILE, () => {
		dbGetMaxCycleCompleted(rTestID, () => {
			dbGetTestParameters(rTestID, maxExecutedCycles, () => {
				XLwriteTestParameters(rTestID, maxExecutedCycles, TestParamsJSON, () => {
					dbGetRecords(rTestID);
				})
			})
		})
	})
}

function dbGetRecords(rTestID) {
	//consolelog('dbGetRecords');
	dbGetMaxCycleCompleted(rTestID, () => {
		dbGetNumberOfRecordsOfParticularTest(rTestID, () => {
			dbPrepareToGetRecords(arrTestIDAndRcdCnt, () => {
				dbWrapperGetIndividualRecord(arrTestIDRcdCntAndRcdToRead)
			})
		})
	})
}



var testParams = jsonTestParam; //temp params

function dbStoreTestRecord(rTestDescriptor) {
	let temp;
	//console.log('dbStoreTestRecord:' + JSON.stringify(rTestDescriptor));

	dbCon.execute("INSERT INTO endurance_new.tbl_test_cycles (col_test_id,col_cycle_number,col_inlet_pressure,col_outlet_pressure,col_pgmd_torque,col_test_torque,col_inlet_sv_status,col_outlet_sv_status,col_exhaust_sv_status,col_servo_stat,col_test_time_of_record,col_test_sample_number) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [rTestDescriptor.testId, rTestDescriptor.cycleNumber, rTestDescriptor.inletPressure, rTestDescriptor.outletPressure, rTestDescriptor.pgmdTq, rTestDescriptor.testTq, rTestDescriptor.inletSVstatus, rTestDescriptor.inletVentingSVstatus, rTestDescriptor.exhaustSVstatus, rTestDescriptor.servoStatus, rTestDescriptor.timeOfRecord, rTestDescriptor.sampleNumber], (error, results) => {
		if (error) console.log(error);
		else {
			//console.log('Success!');
		}
	});
}


function dbStoreTestParam(rTestParams,callback) {
	//console.log('dbStoreTestParam:' + JSON.stringify(rTestParams));
	dbCon.execute("INSERT INTO endurance_new.tbl_test_parameters (col_test_name,col_test_conductor,col_test_start_date,col_test_result,col_test_param_service_pressure,col_test_param_degree_to_open,col_test_param_closing_torque,col_test_param_max_torque,col_test_param_pgmd_cycles,col_test_motor_test_rpm,col_test_CCCOPMI,col_test_CCDOPMI,col_test_OCPMI) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [rTestParams.Name, rTestParams.Cond, rTestParams.startDate,TEST_STAT_IN_PROGRESS, rTestParams.servicePressure, rTestParams.openingDegree, rTestParams.closingTorque, rTestParams.maxTorque, rTestParams.pgmdCycles, rTestParams.motorRPM, rTestParams.CCCOPMI, rTestParams.CCDOPMI, rTestParams.OCPMI], (error, results) => {
		if (error) console.log(error);
		else {
			callback();
			//consolelog('Success!');//Vanessa Alessia
		}
	});
}

 
function dbGetTestID() {
	//const myTimeout = setTimeout(XLWriteFile, 10000);
	dbCon.execute("Select MAX(col_test_id) FROM endurance_new.tbl_test_parameters",
		function (err, result, fields) {
			cycleParam.testId = result[0]["MAX(col_test_id)"];
			console.log('Current Test ID:'+ cycleParam.testId);

		});
}





function delMePrintMaxCycles(rParam) {
	//consolelog('Max Cyc:' + rParam);
}

function generateReport(rTestID, rDestinationFile) {
	consolelog('generateReport' + {
		rTestID
	} + {
		rDestinationFile
	});
	//Get 
}


dbCon.connect(function (err) {
	if (err) throw err;
	//consolelog("db Connected!");

	//dbStoreTestParam(testParams);
	//dbStoreTestRecord(cycleParam);    
	//dbGetTestsByConductor('Ad');
	//dbGetTestsByDate('2022-09-15T20:34:00', '2022-09-18 20:34:00');
	//dbGetTestsByNameofTest('T1');
	//dbSetTestResult(1, 2);
	//dbGetMaxCycleCompleted(1,delMePrintMaxCycles);
	//dbGetNumberOfRecordsOfParticularTest(1,delMePrintMaxCycles);
	//dbGetRecords(1);
	//dbGetRecords(1);
	//reportGenSequence(1);
});

var worksheet;

async function XLprepare(filename, callback) {
	await workbook.xlsx.readFile(filename);
	callback();
}



function XLgenerateFileName() {
	let fileName = "";
	let dateObj = new Date();
	// current date
	// adjust 0 before single digit date
	let date = ("0" + dateObj.getDate()).slice(-2);

	// current month
	let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);

	// current year
	let year = dateObj.getFullYear();

	// current hours
	let hours = ("0" + dateObj.getHours()).slice(-2);

	// current minutes
	let minutes = ("0" + dateObj.getMinutes()).slice(-2);

	// current seconds
	let seconds = ("0" + dateObj.getSeconds()).slice(-2);

	fileName = "EnduranceReport-" + date + "-" + month + "-" + year + "-" + hours + "-" + minutes + "-" + seconds + ".xlsx";
	//consolelog('Filename:' + fileName);
	let destinationPath = path.join(EXCEL_DESTINATION_FILE, fileName);
	return (destinationPath);
}

function XLWriteCell(rRow, rColumn, rData) {
	// worksheet.getCell('A7').value = 199;
	// worksheet.getCell('B7').value = 199;
	let lclCol = String.fromCharCode((rColumn + 0x40));
	let lclRow = rRow.toString();
	console.log({
		lclCol
	}, {
		lclRow
	});
	let xlCell = lclCol + lclRow;
	////consolelog('Val:' + worksheet.getCell(xlCell).value);
	worksheet.getCell(xlCell).value = rData;
}

function XLgenerateWriteLocation(rRecordNumber) {
	let retCell = new Array(2);
	let ColOffset = rRecordNumber / 30000;
	/*Col*/
	retCell[0] = Math.floor(1 + (4 * ColOffset));
	/*Row*/
	retCell[1] = (rRecordNumber % 30000) + 5;
	console.log('Generated Location:', {
		retCell
	});
	return retCell;
}

function XLWriteRecord(rRow, rColumn, rSecond, rCycle, rOtltPr) {
	//console.log("XLWriteRecord");
	console.log({
		rRow
	}, {
		rColumn
	}, {
		rSecond
	}, {
		rCycle
	}, {
		rOtltPr
	});
	XLWriteCell(rRow, rColumn, rSecond);
	rColumn++;
	XLWriteCell(rRow, rColumn, rCycle);
	rColumn++;
	XLWriteCell(rRow, rColumn, rOtltPr);
}



function XLwriteTestParameters(rTestID, rMaxExecutedCycles, rJsonTstParams, callback) {
	console.log({
		rJsonTstParams
	});
	XLWriteCell(10, 8, rJsonTstParams[0].col_test_param_service_pressure); //Test Pressure
	XLWriteCell(12, 8, rJsonTstParams[0].col_test_param_degree_to_open); //Selected Rotation
	XLWriteCell(14, 8, rJsonTstParams[0].col_test_param_pgmd_cycles); //Test Cycles
	XLWriteCell(16, 8, (rJsonTstParams[0].col_test_param_closing_torque) + '-->' + (rJsonTstParams[0].col_test_param_max_torque)); //Closing Torque
	XLWriteCell(28, 8, rJsonTstParams[0].col_test_name); //Test ID


	let lclTestFailFlag = true;
	let lclTestResult = "Failure";
	XLWriteCell(23, 8, rMaxExecutedCycles); //Executed Cycles
	if (rMaxExecutedCycles == rJsonTstParams[0].col_test_param_pgmd_cycles) {
		lclTestResult = "Success";
		lclTestFailFlag = false;
	}

	XLWriteCell(21, 8, lclTestResult); //Test Result

	//ToDo: Find out how the failure reason was found in previous project 
	//XLWriteCell(25,8, );  //Failure Reason  
	let dateObj = new Date();
	// current date
	// adjust 0 before single digit date
	let date = ("0" + dateObj.getDate()).slice(-2);

	// current month
	let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);

	// current year
	let year = dateObj.getFullYear();

	let currDate = date + "/" + month + "/" + year;
	XLWriteCell(4, 6, currDate); //Date
	callback(rTestID);
}

function XLintegratedWriteActivity(rRecordNumber, rSecond, rCycle, rOtltPr) {
	//consolelog("XLintegratedWriteActivity");
	let retArr = XLgenerateWriteLocation(rRecordNumber);
	XLWriteRecord(retArr[1], retArr[0], rSecond, rCycle, rOtltPr);
}

function XLWriteFile() {
	console.log('Writing file...');
	let destinationFile = XLgenerateFileName();
	return workbook.xlsx.writeFile(destinationFile);
}

function ValidatePressure(vActualPressure, vSetPressure, vPercentPositiveTolerance, vPercentNegativeTolerance) {
	let vMaxPositivePressure = 0;
	let vMaxNegativePressure = 0;
	let vPressureReturnVal = PRESSURE_OK;

	vMaxPositivePressure = (vSetPressure + (vSetPressure * vPercentPositiveTolerance / 100));
	vMaxNegativePressure = (vSetPressure - (vSetPressure * vPercentNegativeTolerance / 100));

	if (vActualPressure > vMaxPositivePressure) {
		vPressureReturnVal = PRESSURE_MORE;
	}
	if (vActualPressure < vMaxNegativePressure) {
		vPressureReturnVal = PRESSURE_LESS;
	}

	return vPressureReturnVal;
}

function Extract_ParameterToInteger(ItemId, varName) {
	let lclPressureString;
	lclId = document.getElementById(ItemId);
	lclPressureString = lclId.value;
	varName = parseInt(lclPressureString);
}

var vRetHrs = 0;
var vRetMins = 0;
var vRetSecs = 0;

//var ET_InsufficientInletPressureCntr = 0;
var ET_InsufficientOutletPressureCntr = 0;
var ET_ExcessOutletPressureCntr = 0;
var ET_ValveOpenErrCntr = 0;
var ET_ValveCloseErrCntr = 0;
var ET_EmergencyStopCntr = 0;
//var ET_ServoMechErrorCntr = 0;
var ET_JigLeakageCntr = 0;
var ET_SeatLeakageCntr = 0;
var ET_JigSpindleCntr = 0;



const vInitDepressurizationInterval = 10; //10 --- 10*500 --- 5000mSec
const vValveCloseTimeoutInterval = 8; //10 --- 10*500 --- 5000mSec
const vValveInletPrApplicationInterval = 35; //10 --- 10*500 --- 5000mSec
var vChargedOutletPressureMonitorInterval = 12; //10 --- 10*500 --- 5000mSec
var vChargedOutletDischargeInterval = 10; //10 --- 10*500 --- 5000mSec
var vDischargedOutletMonitorInterval = 12; //10 --- 10*500 --- 5000mSec
const vValveOpenTimeoutInterval = 10; //10 --- 10*500 --- 5000mSec
const vOpenChannelPressureMonitorInterval = 12; //10 --- 10*500 --- 5000mSec
const vEmergencyStopInterval = 20; //20 --- 20*500 --- 5000mSec
const RESUME_INTERVAL = 20;

var EnduranceTestExecuteCurrrentStat = ETTEST_UNKNOWN;
var ETSet_UsedClosingTorque = 0;
var ETSet_Pressure = 0;
var vTqMaxTolerance = 0;
var vCycleInProgress = 0;
var vDlyCntr = 0;
var strET_Test_Status = "";
var ET_SampleCntr = 0;
var vAppliedTq = 0
var vTqPeakNegativeVal = 0;
var bMonitorPeakTq = 0;
var vEmergencyStopFlag = 0;
var vET_Return_Status = 0;
var vET_Tq_InitialCalDone = 0;
var ETSet_OpeningRotation = 0;
var ETSet_Cycles = 0;
var ETSet_RPM = 0;

var DelMeCntr = 0;
var ET_Inlet_Pressure = 0;
var ET_Outlet_Pressure = 0;
var CounterDisplayActivated = 0;
var CyclesCounter = 0;
var ET_DoNotIncrementCycleCntrFlag = 0;
var vCurrrentCycleInterval = 0;
var vTestInterval = 0;
var vCycleAction = 0;
var vCloseAttemptCntr = 0;
var vResumeTestFlag = 0;
var vTqMeasurementSkipCntr = 0;
var vAwaitOpenCloseAcceptTimeout = 0;
const OPEN_CLOSE_ACCEPTANCE_MAX_TIME = 10;
function ExecuteEnduranceTest() {
	var vReturnVal;
	console.log('Stat:' + EnduranceTestExecuteCurrrentStat);
	commFailCntr++;
	if(commFailCntr > COMM_FAIL_DECLARE_TIMEOUT){
		console.log("Serial comm with RPI failed...");
		commFailFlag = 1;
	}
	switch (EnduranceTestExecuteCurrrentStat) {
		case ETTEST_UNKNOWN:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0; //Reset Delay	    
			if (vTestStartFlag == START_FRESH_TEST) {
				ETSet_UsedClosingTorque = parseFloat(jsonTestParam.closingTorque); //ETSet_ClosingTorque;
				ETSet_Pressure = parseInt(jsonTestParam.servicePressure);
				ETSet_OpeningRotation = parseInt(jsonTestParam.openingDegree);
				ETSet_Cycles = parseInt(jsonTestParam.pgmdCycles);
				vChargedOutletPressureMonitorInterval = jsonTestParam.CCCOPMI * 2; //10 --- 10*500 --- 5000mSec
				vChargedOutletDischargeInterval = jsonTestParam.CCDOPMI * 2; //10 --- 10*500 --- 5000mSec
				vDischargedOutletMonitorInterval = jsonTestParam.OCPMI * 2; //10 --- 10*500 --- 5000mSec
				ETSet_RPM = jsonTestParam.motorRPM;
			}
			else{//These parameters are being received from the database
				ETSet_UsedClosingTorque = parseFloat(testParamsRcvd.torque); //ETSet_ClosingTorque;
				ETSet_Pressure = parseInt(testParamsRcvd.pressure);
				ETSet_OpeningRotation = parseInt(testParamsRcvd.degreeOfRtn);
				ETSet_Cycles = parseInt(testParamsRcvd.cycles);
				ETSet_UsedClosingTorque = parseFloat(testParamsRcvd.torque);
				//testParamsRcvd.maxTorque = result[0].col_test_param_max_torque;
				ETSet_RPM = testParamsRcvd.motorRPM;
				vChargedOutletPressureMonitorInterval = testParamsRcvd.CCCOPMI * 2;
				vChargedOutletDischargeInterval = testParamsRcvd.CCDOPMI * 2;
				vDischargedOutletMonitorInterval = testParamsRcvd.OCPMI * 2;
				fillTestParamJson(testParamsRcvd);
			}
			console.log({ETSet_UsedClosingTorque});
			console.log({ETSet_Pressure});
			console.log({ETSet_OpeningRotation});
			console.log({ETSet_Cycles});


			vTqMaxTolerance = (ETSet_UsedClosingTorque * 3) / 100;
			//consolelog("Used Closing:" + ETSet_UsedClosingTorque);
			//consolelog("Set Closing Torque:" + jsonTestParam.closingTorque);
			console.log("Max Tolerance:" + vTqMaxTolerance);
			//Start modbus and servo monitoring
			vModbusIntervalId = setInterval(modbusAction, 250);
			vCycleAction = setInterval(transferCycleParameters,500);
			strET_Test_Status = "Test Status Unknown.";
			cycleParam.errorCode = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_INIT_BEGIN;
			break;

		case ETTEST_INIT_BEGIN:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0; //Reset Delay
			strET_Test_Status = "Test Initialization in Progress";
			vET_TestStatusUpdateStausFlag = 1;
			EnduranceTestExecuteCurrrentStat = ETTEST_INIT_DEPRESSURE_BEGIN;
			break;

		case ETTEST_INIT_DEPRESSURE_BEGIN:
			vCycleInProgress = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_INIT_DEPRESSURE_AWAIT;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 1;
			vDlyCntr = 0; //Reset Delay	    
			break;

		case ETTEST_INIT_DEPRESSURE_AWAIT:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 1;
			vDlyCntr++; //Increment Delay
			if (vDlyCntr > vInitDepressurizationInterval) {
				EnduranceTestExecuteCurrrentStat = ETTEST_INIT_DEPRESSURE_COMPLETE;
				vDlyCntr = 0;
			}
			break;

		case ETTEST_INIT_DEPRESSURE_COMPLETE:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0; //Reset Delay
			vET_Return_Status = ETTEST_PREPARE_TEST_APPLY_INLET;
			vET_Tq_InitialCalDone = 0;
			//ET_ServoMechErrorCntr = 0;
			vTqCalCntr = 0;
			strET_Test_Status = "Torque Calibration In Progress";
			vET_TestStatusUpdateStausFlag = 1;
			vServoDelayCntr = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_CAL;
			console.log('SAS 55:' + uiSrvoActualStatus);

			//EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_APPLY_INLET;
			break;

		case ETTEST_PREPARE_TEST_TORQUE_CAL:
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vCycleInProgress = 0;

			if(vTqCalCntr >= MAX_TQ_CAL_ATTEMPTS){
				cycleParam.errorCode = ET_ERROR_CALIBRATION_FAILURE;
				//ToDo: Non recoverable error action here
				break;
			}
			console.log('SAS:' + uiSrvoActualStatus);
			if (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN ) {
				//First Check if this is the first calibration or Torque Modification cal!
				if (vET_Tq_InitialCalDone == 0) { //This indicates that this is the first cycle or the cycle is resumed from a cold start!
					set20PercentLessTqForCal();
				} 
				else { //This indicates that torque Modification is in progress!
					if (vTqPeakNegativeVal > ETSet_UsedClosingTorque) {
						increaseTqForCal();
					}
					if (vTqPeakNegativeVal < ETSet_UsedClosingTorque) {
						decreaseTqForCal();
					}
					if (vTqPeakNegativeVal === ETSet_UsedClosingTorque) {
						EnduranceTestExecuteCurrrentStat = vET_Return_Status;
					}
				}
				//Reset the values of Peak torque Values
				vTqPeakPositiveVal = 0;
				vTqPeakNegativeVal = 0;

				if (EnduranceTestExecuteCurrrentStat != vET_Return_Status) {
					//console.log('***********');
					//console.log('Set Rtn1:' + ETSet_OpeningRotation);
					//console.log('Set Rtn:' + (ETSet_OpeningRotation + (ETSet_OpeningRotation / 2)));
					bMonitorPeakTq = 1;
					SetDesiredTqAndDegOfRtn((ETSet_OpeningRotation + (ETSet_OpeningRotation / 2)), vAppliedTq, 1, CW, ETSet_RPM);
					vServoDelayCntr = 0;
					EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_AWAIT_COMPLETE;
				}
			}		
			else{
				vServoDelayCntr++;
				if (vServoDelayCntr > 100){
					//ToDo: Non recoverable error action here
					//Servo mechanism CLosing error.
				}

			}
			break;

		case ETTEST_PREPARE_TEST_AWAIT_COMPLETE:
			vServoDelayCntr++;
			if (vServoDelayCntr > 100){
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_CAL;
				vServoDelayCntr = 0;
			}
			if (uiSrvoActualStatus == SERVO_CMD_STAT_COMPLETED_TQ) {
				vServoDelayCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_MONITOR;
			}
			break;

		case ETTEST_PREPARE_TEST_TORQUE_MONITOR:
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vCycleInProgress = 0;
			//console.log('SCS:'+ uiSrvoActualStatus);
			if (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) {
				bMonitorPeakTq = 0;
				SetDesiredTqAndDegOfRtn(0, 0, 1, 0, 0);
				vServoDelayCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE;
			} else {
				vServoDelayCntr++;
				if (vServoDelayCntr > 100)
				{
					//ToDo: Non recoverable error action here
					//Servo mechanism error.
				}	
				//console.log('DLCNTR:'+ vServoDelayCntr);
			}
		
			break;


		case ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE:
			if (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) {
				vlCntrRlyDesired = 0;
				vlRstRlyDesired = 0;
				vCycleInProgress = 0;
				vTqCalCntr++;
				vServoDelayCntr = 0;
				bMonitorPeakTq = 0;
				SetDesiredTqAndDegOfRtn(ETSet_OpeningRotation, vAppliedTq + 15, 1, ACW, ETSet_RPM);
				vServoDelayCntr = 0;
				vTimeoutCntrAwaitCmdAccept = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_AWAIT_OPEN_CMD_ACCEPT;
			}
			else{
				vServoDelayCntr++;
				if(vServoDelayCntr > 30){
					//ToDo: Non recoverable error action here
					//Servo mechanism error.
				}
			}
			break;

		case ETTEST_PREPARE_TEST_TORQUE_AWAIT_OPEN_CMD_ACCEPT:
			vTimeoutCntrAwaitCmdAccept++;
			if(vTimeoutCntrAwaitCmdAccept > OPEN_CLOSE_ACCEPTANCE_MAX_TIME)
			EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE;
			if (uiSrvoActualStatus != SERVO_CMD_STAT_UNKNOWN)
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE_MONITOR;
			break;

		case ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE_MONITOR:
			vCycleInProgress = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vServoDelayCntr++;
			
			if ((uiSrvoActualStatus === SERVO_CMD_STAT_COMPLETED_OPEN_POSN)  || (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) ) {
				vServoDelayCntr = 0; // To be added to Tekno Valves Code also!
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_CAL;
			}
			else{
				vServoDelayCntr++;
				if(vServoDelayCntr > 180)
				EnduranceTestExecuteCurrrentStat =  ETTEST_PREPARE_TEST_TORQUE_OPEN_VALVE;

			}
			break;
		case ETTEST_PREPARE_TEST_APPLY_INLET:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			strET_Test_Status = "Applying Inlet Pressure..";
			vET_TestStatusUpdateStausFlag = 1;
			EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_AWAIT_INLET_APPLICATION_DLY;
			break;

		case ETTEST_PREPARE_TEST_AWAIT_INLET_APPLICATION_DLY:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vDlyCntr++; //Increment Delay
			if (vDlyCntr > vValveInletPrApplicationInterval) {
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_AWAIT_DLY_COMPLETE_VALID_ACTION;
			}
			break;

		case ETTEST_PREPARE_TEST_AWAIT_DLY_COMPLETE_VALID_ACTION:
			vCycleInProgress = 0;
			vDlyCntr = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			//Important Step: Torque Values being filled here

			//This is commented because now the torque value is already calibrated!
			//vAppliedTq = ETSet_UsedClosingTorque;
			vReturnVal = ValidatePressure(ET_Inlet_Pressure, ETSet_Pressure, 5, 10);
			//alert("This is the return Val of Validate Pressure" + vReturnVal);
			if ((vReturnVal == PRESSURE_OK) || (vReturnVal == PRESSURE_MORE)) {
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_CLOSE_VALVE_BEGIN;
			} else //PRESSURE_LESS
			{
				//ET_InsufficientInletPressureCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_AWAIT_DLY_COMPLETE_INVALID_ACTION;
			}

			break;

		case ETTEST_PREPARE_TEST_AWAIT_DLY_COMPLETE_INVALID_ACTION:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vReturnVal = ValidatePressure(ET_Inlet_Pressure, ETSet_Pressure, 5, 10);

			//*****************************************************************************************************************************
			//
			//Debug: Remove Later! Allowed to let the test go through!
			/*DelMeCntr++;
			if (DelMeCntr > 30) {
				DelMeCntr = 0;
				vReturnVal = PRESSURE_OK;
			}*/
			if ((vReturnVal === PRESSURE_OK) || (vReturnVal === PRESSURE_MORE)) {
				vServoDelayCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_CLOSE_VALVE_BEGIN;
				cycleParam.errorCode = 0;
			} else { //indicates that there is insufficient pressure!
				cycleParam.errorCode = ET_ERROR_INSUFFICIENT_INLET_PRESSURE;
			}
			break;
		case ETTEST_EXEC_CLOSE_VALVE_BEGIN:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			if (CounterDisplayActivated === 1)
				vlCntrRlyDesired = 1;
			else
				vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			strET_Test_Status = "Closing Test Valve";
			vET_TestStatusUpdateStausFlag = 1;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_VALVE_CLOSE;
			vTqMeasurementSkipCntr = 0;

			break;
		case ETTEST_EXEC_MONITOR_VALVE_CLOSE:
			vCycleInProgress = 1;
			vCloseAttemptCntr = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			if (CounterDisplayActivated === 1) {
				vlCntrRlyDesired = 1;
				CounterDisplayActivated = 0;
			} else
				vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
						
			if (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) {
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_CLOSE_STD_ACTION;
			} else {
				cycleParam.errorCode = ET_ERROR_SERVO_MECHANISM;
				//ET_ServoMechErrorCntr++;
			}
			break;


		case ETTEST_EXEC_VALVE_CLOSE_STD_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			let lclRetTqAction = 0;


			//Todo: Resume TEST FLAG needs to be checked here!!!!
			if (CyclesCounter > 0 && vResumeTestFlag == 0) { //Previous cycle completed or test starting after resume!
				lclRetTqAction = takeTorqueModificationAction();				
				//Reset the values of Peak torque Values
				vTqPeakPositiveVal = 0;
				vTqPeakNegativeVal = 0;
			}
			else{
				if(vResumeTestFlag == 1)
					vResumeTestFlag = 0;
			}
			vServoDelayCntr = 0;
			//if (lclRetTqAction >= 0) {
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_JUST_CLOSE;
			//}
			// else{
			// 	console.log('Show Servo Error!');
			// 	while(1);
			// }
			break;
		case ETTEST_EXEC_JUST_CLOSE:
				bMonitorPeakTq = 1;
				SetDesiredTqAndDegOfRtn((ETSet_OpeningRotation + (ETSet_OpeningRotation / 2)), vAppliedTq, 1, CW, ETSet_RPM);
				EnduranceTestExecuteCurrrentStat = ETTEST_AWAIT_VALVE_CLOSE_BEGIN;
				vAwaitOpenCloseAcceptTimeout = 0;
			break;	

		case ETTEST_AWAIT_VALVE_CLOSE_BEGIN:
			if(uiSrvoActualStatus != SERVO_CMD_STAT_UNKNOWN)
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_CLOSE_MONITOR;
			else{
				vAwaitOpenCloseAcceptTimeout++;
				if(vAwaitOpenCloseAcceptTimeout > OPEN_CLOSE_ACCEPTANCE_MAX_TIME){
					EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_JUST_CLOSE; 
				}
			}
			break;		
		case ETTEST_EXEC_VALVE_CLOSE_MONITOR:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;

			vServoDelayCntr++;
			//console.log('SAS:'+ uiSrvoActualStatus);
			//console.log('SDC:'+ vServoDelayCntr);

			if ((uiSrvoActualStatus == SERVO_CMD_STAT_COMPLETED_TQ) || ((uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN)) ){
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_CLOSE_AWAIT_READING_UPDATE;
			}
			break;

		case ETTEST_EXEC_VALVE_CLOSE_AWAIT_READING_UPDATE:
			if (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) {
				if (vTqPeakNegativeVal > (0.9 * ETSet_UsedClosingTorque))
					EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_BEGIN;
				else {

					vTqMeasurementSkipCntr++;
					if (vTqMeasurementSkipCntr > 3) {
						cycleParam.errorCode = ET_ERROR_SERVO_MECHANISM;
						//ET_ServoMechErrorCntr++;
					}
					else {
						EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_CLOSE_STD_ACTION;
					}
				}
			}
			break;	

		case ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_BEGIN:
			vCycleInProgress = 1;
			vDlyCntr = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			SetDesiredTqAndDegOfRtn(0, 0, 1, 0, 0);
			strET_Test_Status = "Monitoring External Leakage";
			vET_TestStatusUpdateStausFlag = 1;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_MONITOR;

			break;
		case ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_MONITOR:
			if(uiSrvoActualStatus != SERVO_CMD_STAT_UNKNOWN){
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;

			vDlyCntr++;
			if (vDlyCntr > vChargedOutletPressureMonitorInterval) {
				vDlyCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_INTERVAL_COMP_ACTION;
			}
		}
			break;
		case ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_INTERVAL_COMP_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;

			//vReturnVal = ValidatePressure(ET_Outlet_Pressure,ET_Inlet_Pressure,2,4);
			if ((ET_Inlet_Pressure - ET_Outlet_Pressure) > 10) { //Error Condition Jig/Seat Leakage
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_ERROR_ACTION;
				cycleParam.errorCode = ET_ERROR_JIG_SEAT_LEAKAGE;
				ET_JigLeakageCntr = 0;
			} else {
				//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_NORMAL_ACTION;
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_DISCHARGE_BEGIN;
			}

			break;
		case ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_NORMAL_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_DISCHARGE_BEGIN;
			break;
		case ETTEST_EXEC_MONITOR_CHARGED_OUTLET_PR_ERROR_ACTION:
			vCycleInProgress = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			ET_JigLeakageCntr++;
			if (ET_JigLeakageCntr < 15) {
				vlInletIsolatingDesired = 0;
				vlIntletVentingDesired = 1;
				vlOutletExhaustDesired = 1;
			} else {
				vlInletIsolatingDesired = 0;
				vlIntletVentingDesired = 0;
				vlOutletExhaustDesired = 0;
			}
			break;
			
		case ETTEST_EXEC_DISCHARGE_BEGIN:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			strET_Test_Status = "Venting Outlet Pressure";
			vET_TestStatusUpdateStausFlag = 1;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_DISCHARGE_INTERVAL_AWAIT;
			break;

		case ETTEST_EXEC_DISCHARGE_INTERVAL_AWAIT:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr++;
			if (vDlyCntr > vChargedOutletDischargeInterval || ET_Outlet_Pressure < 1)
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_DISCHARGE_INTERVAL_COMPLETE;
			break;
		case ETTEST_EXEC_DISCHARGE_INTERVAL_COMPLETE:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_BEGIN;
			break;
		case ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_BEGIN:
			vCycleInProgress = 1;
			vDlyCntr = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			strET_Test_Status = "Monitoring Internal Leakage";
			vET_TestStatusUpdateStausFlag = 1;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_MONITOR;
			break;
		case ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_MONITOR:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr++;
			if (vDlyCntr > vDischargedOutletMonitorInterval) {
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_INTERVAL_COMP_ACTION;
			}
			break;
		case ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_INTERVAL_COMP_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			if (ET_Outlet_Pressure <= 5)
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_NORMAL_ACTION;
			else
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_ERROR_ACTION;
			break;
		case ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_NORMAL_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_OPEN_VALVE_BEGIN;
			break;
		case ETTEST_EXEC_MONITOR_DISCHARGED_OUTLET_PR_ERROR_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			strET_Test_Status = "Torque Modification in Progress";
			vET_TestStatusUpdateStausFlag = 1;
			//This is a critical stage. It indicates that a> either the valve is leaking or b> Insufficient torque has been applied!!
			//Actions to be taken:
			//a. Set a flag to not increment the cycle counter... this cycle is to be ignored.....Done! 
			//b. Increase the value of torque to be applied by 5%
			//c. Increment a counter to indicate the number of consequtive torque increments.
			//d. If the counter has exceeded say 10 steps then declare an error: Seat Leakage Error

			//***************DEBUG!!!!!!*******************************
			//ET_DoNotIncrementCycleCntrFlag = 1;


			//DEBUG:::commented on 2607 for testing of applied tq!!!
			if (ETSet_UsedClosingTorque < jsonTestParam.maxTorque) {
				ET_TorqueIncrementPercentage = 5;
				console.log('********************************');
				console.log('% increase:' + ET_TorqueIncrementPercentage);
				console.log('Original ETSet_UsedClosingTorque:' + ETSet_UsedClosingTorque);
				//console.log('Pgmd Tq:' + jsonTestParam.closingTorque);

				//let tmp2  = jsonTestParam.closingTorque;
				//console.log('jsonTestParam.closingTorque:' + jsonTestParam.closingTorque);
				let tmp3 = (ET_TorqueIncrementPercentage / 100);
				console.log('ET_TorqueIncrementPercentage / 100:' + tmp3);
				let tmp1 = (ETSet_UsedClosingTorque * (ET_TorqueIncrementPercentage / 100));
				console.log('(jsonTestParam.closingTorque * (ET_TorqueIncrementPercentage / 100)):' + tmp1);
				//let lclNewTq = ET_TorqueIncrementPercentage * ;
				ETSet_UsedClosingTorque = (ETSet_UsedClosingTorque * (ET_TorqueIncrementPercentage / 100)) + ETSet_UsedClosingTorque;
				console.log('Modified ETSet_UsedClosingTorque:' + ETSet_UsedClosingTorque);
				console.log('jsonTestParam.maxTorque:' + jsonTestParam.maxTorque);
			}

			if (ETSet_UsedClosingTorque > jsonTestParam.maxTorque) {
				//ToDo: Seat Leakage!!!
				if(cycleParam.errorCode != ET_ERROR_SEAT_LEAKAGE)
					ET_SeatLeakageCntr = 0;
				cycleParam.errorCode = ET_ERROR_SEAT_LEAKAGE;
				ET_SeatLeakageCntr++;
				//alert("Torque has been increased by 50% of the set Torque and yet leakage is detected.\n Possible Reasons: \n 1. Incorrect value of Torque was fed in. \n 2. Test Piece Failure");
			} else {
				vTqCalCntr = 0;
				vTqMaxTolerance = (ETSet_UsedClosingTorque * 3) / 100;
				vServoDelayCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_PREPARE_TEST_TORQUE_CAL;
				console.log('Sending back for calibration.....');
				vET_Return_Status = ETTEST_EXEC_VALVE_OPEN_STD_ACTION;
				//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_OPEN_VALVE_BEGIN;
				//Reset the values of Peak torque Values
				vTqPeakPositiveVal = 0;
				//while(1);
				//vTqPeakNegativeVal = vAppliedTq;
				//vAppliedTq = vAppliedTq + (vAppliedTq/20);
			}
			//alert("This is the modified Torque:" + ETSet_UsedClosingTorque);

			//Remove this when removing comments on top!!!
			//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_OPEN_VALVE_BEGIN;
			break;

		case ETTEST_EXEC_OPEN_VALVE_BEGIN:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			//AjaxServoGetStatus();
			strET_Test_Status = "Opening Test Valve";
			vET_TestStatusUpdateStausFlag = 1;

			if ( uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) {
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN;
				//alert("Servo Status" + uiSrvoActualStatus);
			} else {
				//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN_ERROR_ACTION;
				/*
				alert("The Servo is in an unexpected status. \nPlease check if Error is displayed on the servo!\n Exiting and Restarting the test may resolve the issue");
				alert("The Servo is in an unexpected status. \nPlease check if Error is displayed on the servo!\n Exiting and Restarting the test may resolve the issue");
				alert("The Servo is in an unexpected status. \nPlease check if Error is displayed on the servo!\n Exiting and Restarting the test may resolve the issue");
				*/
			}

			break;
		case ETTEST_EXEC_VALVE_OPEN:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			bMonitorPeakTq = 0;
			SetDesiredTqAndDegOfRtn(ETSet_OpeningRotation, (vAppliedTq + 15), 1, ACW, ETSet_RPM);
			//AjaxServoSetStatus(ETSet_OpeningRotation, ACW, jsonTestParam.closingTorque + 10);
			vServoDelayCntr = 0;
			vAwaitOpenCloseAcceptTimeout = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_AWAIT_VALVE_OPEN_BEGIN;
			break;

		case ETTEST_EXEC_AWAIT_VALVE_OPEN_BEGIN:
			if(uiSrvoActualStatus != SERVO_CMD_STAT_UNKNOWN)
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_VALVE_OPEN;
			else{
				vAwaitOpenCloseAcceptTimeout++;
				if(vAwaitOpenCloseAcceptTimeout > OPEN_CLOSE_ACCEPTANCE_MAX_TIME){
					EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN; 
				}
			}
			break;	
		case ETTEST_EXEC_MONITOR_VALVE_OPEN:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			//AjaxServoGetStatus();
			if (uiSrvoActualStatus == SERVO_CMD_STAT_COMPLETED_OPEN_POSN || (uiSrvoActualStatus == SERVO_CMD_STAT_UNKNOWN) ) {
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN_STD_ACTION;
				bMonitorPeakTq = 0;
			} else {
				vServoDelayCntr++;
				if ( /*(uiSrvoActualStatus === SERVO_CMD_STAT_ERR) ||*/ (vServoDelayCntr > 160)) //ToDo: Servo Error Detected
				{
					if ((ET_Outlet_Pressure - ET_Inlet_Pressure) > 10)
						EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN_ERROR_ACTION;
					else
						EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN_STD_ACTION;
					ET_ValveOpenErrCntr = 0;
				}
			}
			break;
		case ETTEST_EXEC_VALVE_OPEN_ERROR_ACTION:
			vCycleInProgress = 1;
			ET_ValveOpenErrCntr++;
			if (ET_ValveOpenErrCntr > 15) {
				vlInletIsolatingDesired = 0;
				vlIntletVentingDesired = 0;
				vlOutletExhaustDesired = 0;
			}
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			//Declare Error:  Spindle Jammed!!!
			cycleParam.errorCode = ET_ERROR_VALVE_OPEN;
			//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_VALVE_OPEN_STD_ACTION;	    
			break;
		case ETTEST_EXEC_VALVE_OPEN_STD_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_BEGIN;
			break;
		case ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_BEGIN:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr++;
			strET_Test_Status = "Temperature Stabilization/Resting";
			vET_TestStatusUpdateStausFlag = 1;
			if (vDlyCntr > vValveOpenTimeoutInterval) {
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_MONITOR;
			}
			break;

		case ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_MONITOR:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vReturnVal = ValidatePressure(ET_Outlet_Pressure, ET_Inlet_Pressure, 2, 10);
			//if((vReturnVal === PRESSURE_OK) || (vReturnVal === PRESSURE_MORE))
			//{
			EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_NORMAL_ACTION;
			//}
			//else
			//{		
			//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_ERROR_ACTION;		
			//ET_ValveOpenCntr = 0;
			//}

			break;

			//case ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_INTERVAL_COMP_ACTION:
			//vlInletIsolatingDesired = 1;
			//vlIntletVentingDesired = 0;
			//vlOutletExhaustDesired = 0;	    
			//EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_NORMAL_ACTION;
			//break;

		case ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_NORMAL_ACTION:
			vCycleInProgress = 1;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			if (ET_DoNotIncrementCycleCntrFlag === 0) //indicates that this cycle has to be accounted for!!!
			{
				CyclesCounter++;
				vlCntrRlyDesired = 1;
				CounterDisplayActivated = 1;
				//Store the last cycle interval in this variable
				vLastCycleInterval = vCurrrentCycleInterval;
				vCurrrentCycleInterval = 0;
				vAverageCycleInterval = vTestInterval / CyclesCounter;
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_CLOSE_VALVE_BEGIN; //Check if this is correct!!!    
				if (CyclesCounter >= ETSet_Cycles) //Indicates that the test is complete!!
				{
					EnduranceTestExecuteCurrrentStat = ETTEST_CYCLE_COMPLETE_BEGIN;
					dbUpdateTestResult(cycleParam.testId, TEST_STAT_COMPLETE);
				}
			} else {

				ET_DoNotIncrementCycleCntrFlag = 0; //Reset the flag!!
				EnduranceTestExecuteCurrrentStat = ETTEST_EXEC_CLOSE_VALVE_BEGIN; //Check if this is correct!!!
			}
			break;
		case ETTEST_EXEC_MONITOR_OPEN_CHANNEL_OUTLET_PR_ERROR_ACTION:
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vCycleInProgress = 0;
			cycleParam.errorCode = ET_ERROR_JIG_LKG_OR_SPINDLE_JAM;
			ET_JigSpindleCntr++;
			if (ET_JigSpindleCntr < 20) {
				vlInletIsolatingDesired = 0;
				vlIntletVentingDesired = 1;
				vlOutletExhaustDesired = 1;
			} else {
				vlInletIsolatingDesired = 0;
				vlIntletVentingDesired = 0;
				vlOutletExhaustDesired = 0;
			}

			//ET_ValveOpenCntr++;
			//Show Error Message Open Mechanism Error 
			break;

		case ETTEST_EMERGENCY_STOP_BEGIN:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_EMERGENCY_STOP_MONITOR;
			vEmergencyStopFlag = 0;
			break;

		case ETTEST_EMERGENCY_STOP_MONITOR:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vDlyCntr++;
			ET_EmergencyStopCntr = 0;
			if (vDlyCntr > vEmergencyStopInterval)
				EnduranceTestExecuteCurrrentStat = ETTEST_EMERGENCY_STOP_COMPLETE;
			break;

		case ETTEST_EMERGENCY_STOP_COMPLETE:
			vCycleInProgress = 0;
			vDlyCntr = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			ET_EmergencyStopCntr++;
			if(ET_EmergencyStopCntr > 10)		
				EnduranceTestExecuteCurrrentStat = ETTEST_CYCLE_COMPLETE_COMPLETE;
			//Show Error Message Emergency Stop Message. 
			break;

		case ETTEST_CYCLE_COMPLETE_BEGIN:
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_CYCLE_COMPLETE_MONITOR;
			break;

		case ETTEST_CYCLE_COMPLETE_MONITOR:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 1;
			vlOutletExhaustDesired = 1;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr++;
			if (vDlyCntr > vEmergencyStopInterval) {
				//Send Message Test Completed!
				cycleParam.errorCode =  ET_TEST_COMPLETE;
				EnduranceTestExecuteCurrrentStat = ETTEST_CYCLE_COMPLETE_COMPLETE;
			}
			break;

		case ETTEST_CYCLE_COMPLETE_COMPLETE:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_TAKE_STOP_TEST_ACTION; 
			break;
		
		case ETTEST_TAKE_STOP_TEST_ACTION:
			
			vDlyCntr++;
			if(vDlyCntr > 3){
				cycleParam.errorCode = 0;
			}
			if(vDlyCntr > 5){
				vDlyCntr = 0;
				stopTestAction();
				cycleParam.errorCode = 0;
				vTestStartFlag = START_FRESH_TEST;
			}
			break;

		case ETTEST_PAUSE_BEGIN:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			vDlyCntr = 0;
			strET_Test_Status = "Test paused By User"
			break;
		case ETTEST_RESUME_BEGIN:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 1;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_AWAIT_RESUME_COMPLETE;
			strET_Test_Status = "Resuming Test..."
			break;
		
		case ETTEST_AWAIT_RESUME_COMPLETE:
			vDlyCntr++;
			if(vDlyCntr > RESUME_INTERVAL){
				vCycleInProgress = 1;
				EnduranceTestExecuteCurrrentStat = vET_Return_Status;
			}
			break;


			case ETTEST_NON_RECOVERABLE_ERROR_ACTION_BEGIN:
				vlInletIsolatingDesired = 0;
				vlIntletVentingDesired = 1;
				vlOutletExhaustDesired = 1;
				vlCntrRlyDesired = 0;
				vlRstRlyDesired = 0;
				strET_Test_Status = "Shutting down."
				vDlyCntr = 0;
				EnduranceTestExecuteCurrrentStat = ETTEST_NON_RECOVERABLE_ERROR_ACTION_DELAY;
				break;
			case ETTEST_NON_RECOVERABLE_ERROR_ACTION_DELAY:
				if(vDlyCntr > 10){
					vlInletIsolatingDesired = 0;
					vlIntletVentingDesired = 0;
					vlOutletExhaustDesired = 0;
					vlCntrRlyDesired = 0;
					vlRstRlyDesired = 0;
				}
				break;
			case ETTEST_NON_RECOVERABLE_ERROR_ACTION_END:
				break;
			
		default:
			vCycleInProgress = 0;
			vlInletIsolatingDesired = 0;
			vlIntletVentingDesired = 0;
			vlOutletExhaustDesired = 0;
			vlCntrRlyDesired = 0;
			vlRstRlyDesired = 0;
			EnduranceTestExecuteCurrrentStat = ETTEST_UNKNOWN;
			break;
	}


	//ETConduct_ShowHideCanvas('canvasErrWindow');
	//OutletPrGauge.refresh(ET_Outlet_Pressure);
	//InletPrGauge.refresh(ET_Inlet_Pressure);
	//var VGaugeTq = 0;
	//VGaugeTq = Math.round(vTqPeakNegativeVal * 100);
	//VGaugeTq = (VGaugeTq * -1 / 100);
	//TqGauge.refresh(VGaugeTq);
	//x = x + 2;
	//y = y + 1;

	ET_SampleCntr++;

	//ET_Inlet_Pressure = ET_Inlet_Pressure + 4;
	//ET_Outlet_Pressure = ET_Outlet_Pressure + 2;
	//ET_Tq = ET_Tq + 1;

	//CalculateInletPressure();
	//CalculateOutletPressure();

	if (vCycleInProgress == 1) {
		vTestInterval++; //This variable counts the time for which the test has been executed
		vCurrrentCycleInterval++; //This variable stores the time required for completion of the current cycle
	}

	if (vEmergencyStopFlag == 1)
		EnduranceTestExecuteCurrrentStat = ETTEST_EMERGENCY_STOP_BEGIN;
}


mbusClient.connectRTUBuffered("COM3", {
	baudRate: 9600
});
mbusClient.setTimeout(120);

var connStat = 0
var tqErr = 0;
async function torqueRead() {
	//cycleParam.testTq = 7.5;
	//vTqPeakNegativeVal = 7.5;

	try {
		mbusClient.setID(2);
		let val = await mbusClient.readHoldingRegisters(1, 4);
		let lclTq = val.data[1];
		if ((lclTq & 0x8000) > 0)
			lclTq = lclTq - 0x10000;
		lclTq = lclTq / 100;
		console.log('Torque:' + lclTq);
		if (lclTq < 0)
			lclTq = lclTq * (-1);
		if (bMonitorPeakTq == 1) {
			console.log("PK:" + vTqPeakNegativeVal);			
			if (vTqPeakNegativeVal < lclTq) {
				cycleParam.testTq = lclTq;
				vTqPeakNegativeVal = lclTq;
				console.log('PK TQ:' + vTqPeakNegativeVal);
			}
		}
		tqErr = 0;
		return lclTq;
	} catch (e) {
		tqErr = 1;
		console.log('ErrorTq');
		return -1;
	}
	
}



async function InletPressureRead() {
	let lclPr = 0;
	let lclErrFlag = 0;
	try {
		mbusClient.setID(1);
		let val = await mbusClient.readInputRegisters(0, 1);
		lclPr = val.data[0];
		if ((lclPr & 0x8000) > 0)
			lclPr = lclPr - 0x10000;
		//console.log('InPr:' + lclPr);
		//console.log('SAStat:'+ uiSrvoActualStatus);
		
	} catch (e) {
		//consolelog('Outlet Pressure Read Error');
		lclErrFlag = 1;
	}
	if (lclErrFlag == 0) {
		cycleParam.inletPressure = lclPr / 10;
		ET_Inlet_Pressure = cycleParam.inletPressure; //Variable being filled to maintain the previous code sanctity.
	}
}

async function OutletPressureRead() {
	//console.log('OPR');
	let lclPr = 0;
	let lclErrFlag = 0;
	try {
		mbusClient.setID(3);
		let val = await mbusClient.readInputRegisters(0, 1);
		lclPr = val.data[0];
		if ((lclPr & 0x8000) > 0)
			lclPr = lclPr - 0x10000;
		//console.log('OtPr:' + lclPr);
	} catch (e) {
		console.log('err OPR');
		//consolelog('Outlet Pressure Read Error');
		lclErrFlag = 1;
	}
	if (lclErrFlag == 0) {
		cycleParam.outletPressure = lclPr / 10;
		ET_Outlet_Pressure = cycleParam.outletPressure; //Variable being filled to maintain the previous code sanctity.
	}
}

var dataToWrite = 0x00;
async function setPLCoutput() {
	let lclErrFlag = 0;

	try {
		dataToWrite = 0;
		//consolelog('write..');
		mbusClient.setID(4);
		if (vlInletIsolatingDesired == 1) {
			dataToWrite |= Q5;
			//console.log('Q0:'+dataToWrite);
		}
		if (vlIntletVentingDesired == 1) {
			dataToWrite |= Q6;
			//console.log('Q1:'+dataToWrite);
		}
		if (vlOutletExhaustDesired == 1) {
			dataToWrite |= Q7;
			//console.log('Q2:'+dataToWrite);
		}
		if (vlCntrRlyDesired == 1) {
			dataToWrite |= Q4;
			//console.log('Q3:'+dataToWrite);
		}
		if (vlRstRlyDesired == 1) {
			dataToWrite |= Q3;
			//console.log('Q4:'+dataToWrite);

		}
		if (vlLowPressureAlarm == 1) {
			dataToWrite |= Q5;
			//console.log('Q5:'+dataToWrite);
		}
		if(cycleParam.errorCode != 0){
			dataToWrite |= Q0;
		}
		//console.log('Data to Write:'+ dataToWrite);
		await mbusClient.writeRegisters(0, [dataToWrite]);
	} catch (e) {
		//consolelog('PLC Write Error' + JSON.stringify(e));
		lclErrFlag = 1;
	}
	if (lclErrFlag == 0) {
		cycleParam.inletSVstatus = vlInletIsolatingDesired;
		cycleParam.inletVentingSVstatus = vlIntletVentingDesired;
		cycleParam.exhaustSVstatus = vlOutletExhaustDesired;
	}

}

function transferCycleParametersWithoutDB(){
	cycleParam.cycleNumber = CyclesCounter;
	//cycleParam.pgmdTq = ;
	cycleParam.inletSVstatus = vlInletIsolatingDesired;
	cycleParam.inletVentingSVstatus = vlIntletVentingDesired;
	cycleParam.exhaustSVstatus = vlOutletExhaustDesired;
	//cycleParam.servoStatus = ;
	//cycleParam.timeOfRecord = ;
	cycleParam.sampleNumber = ET_SampleCntr;
	//cycleParam.errorCode = ; //ToDo: Have to send the error code!!!
	cycleParam.cycleTime = vCurrrentCycleInterval;
	cycleParam.testDuration = vTestInterval;
	cycleParam.testStatusVal = EnduranceTestExecuteCurrrentStat; 
	cycleParam.testStatus = strET_Test_Status;
	cycleParam.timeOfRecord = getCurrentTimeInDBFormat();
	sendCycleParameters();
}

function transferCycleParameters() {
	transferCycleParametersWithoutDB();
	dbStoreTestRecord(cycleParam);
}


function loadTestWindowAction(){
	vlInletIsolatingDesired = 0;
	vlIntletVentingDesired = 0;
	vlOutletExhaustDesired = 0;
	strET_Test_Status = "";
	cycleParam.inletSVstatus = vlInletIsolatingDesired;
	cycleParam.inletVentingSVstatus = vlIntletVentingDesired;
	cycleParam.exhaustSVstatus = vlOutletExhaustDesired;

	if(vTestStartFlag == START_FRESH_TEST){
		ET_SampleCntr = 0;
		CyclesCounter = 0;
		cycleParam.cycleNumber = CyclesCounter;
	}
	else{
		cycleParam.cycleNumber = maxExecutedCycles;
		cycleParam.testId = resumeTestId;
		vResumeTestFlag = 1;
	}
	console.log('This is the cycle that is to be executed:'+ cycleParam.cycleNumber);
	cycleParam.sampleNumber = ET_SampleCntr;
	cycleParam.errorCode = 0; 
	vCurrrentCycleInterval = 0;
	vTestInterval = 0;
	cycleParam.cycleTime = vCurrrentCycleInterval;
	cycleParam.testDuration = vTestInterval;
	cycleParam.testStatusVal = EnduranceTestExecuteCurrrentStat; 
	cycleParam.testStatus = strET_Test_Status;
	EnduranceTestExecuteCurrrentStat = ETTEST_UNKNOWN;
	cycleParam.timeOfRecord = getCurrentTimeInDBFormat();
	console.log('CycleParam1:'+ JSON.stringify(cycleParam));
	

	loadTestWindow();
	
	//ToDo: Close the Test Parameters window here
	if(vTestStartFlag == START_FRESH_TEST){
		newTestParamWindow.close();
		newTestParamWindow = null;
	}
	else{
		previousTestWindow.close();
		previousTestWindow = null;
	}
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var vModbusOwnership = 0;
const TorqueRead = 0;
const InletPrRead = 1;
const OutletPrRead = 2;
const PlcRead = 3;
const SkipRead1 = 4;
const SkipRead2 = 5; 

async function modbusAction() {
	//console.log({vModbusOwnership});
	switch(vModbusOwnership){
		case TorqueRead:
			await torqueRead();
			vModbusOwnership = InletPrRead; 
		break;

		case InletPrRead:
			await InletPressureRead();
			vModbusOwnership = OutletPrRead; 
		break;

		case OutletPrRead:
			await OutletPressureRead();
			vModbusOwnership = PlcRead; 
		break;

		case PlcRead:
			await setPLCoutput();
			vModbusOwnership = TorqueRead;
			//vModbusOwnership = SkipRead1;
			break;
		case SkipRead1:
			if(tqErr == 1){
				await torqueRead();
			}
			vModbusOwnership = SkipRead2;
			break;
		case SkipRead2:
			if(tqErr == 1){
				await torqueRead();
			}
			vModbusOwnership = TorqueRead;
			break;
		default:
			break;	
	}
}





var uiSrvoActualPosn = 0;
var uiSrvoDesiredPosn = 0;
var uiSrvoActualStatus = 0;
var strData = '';
var serverDataUpdateFlag = 0;
var connectionStatus = NOT_CONNECTED;

var strlenXtractBuff = 0;
var bufferFlag = 0;
var rcvDataLen = 0;
var rcvData = new Array(50); 
var extractedData = new Array(50);
var extractedDataLen = 0;
var extractedString = '';

var startOfFrameRcvd = 0;

var rcvdString = '';

port.on('data', function (data) {//1
	//console.log(data);
	if(startOfFrameRcvd == 0){//2
		if(data == '#'){//3
			rcvdString = '';
			startOfFrameRcvd = 1;
		}//\3
	}//\2
	else {//2
		if (data == '$') {//3
			startOfFrameRcvd = 0;
			let retString = rcvdString.slice(0, 3);
			if (retString == HEADER_EXPECTED_ACTION_GET_TQ_POSITION) 
				GetActualTqAndPosn(rcvdString);
		}//\3
		else {//3
			//console.log(rcvdString);
			rcvdString += data;
			if (rcvdString.length > 30) {//4
				rcvdString = '';
				startOfFrameRcvd = 0;
			}//\4
		}//\3
	}//\2
});//\1




var servoMotionDesiredFlag = 0;
var strServoCmdWrite = '';

function SetDesiredTqAndDegOfRtn(uirBuffDesiredDegreeOfRtn, frBuffDesiredTq, uirBuffDesiredStatus, uirBuffDesiredDirectionOfRtn, uirBuffDesiredRPM) {
	//consolelog('SetDesiredTqAndDegOfRtn');
	let strDataToWrite = '';
	strDataToWrite = HEADER_EXPECTED_ACTION_SET_DESIREDTQ_DIRN;
	console.log('Deg:' + uirBuffDesiredDegreeOfRtn);
	console.log('Tq:' + frBuffDesiredTq.toString());
	console.log('RPM:' + uirBuffDesiredRPM.toString());
	console.log('Dirn:' + uirBuffDesiredDirectionOfRtn.toString());
	console.log('DesStat:' + uirBuffDesiredStatus.toString());

	//Prepare data to send
	//Step 1: Convert to string
	let lclStrDegOfRtn = uirBuffDesiredDegreeOfRtn.toString();
	let intDesTq = Math.floor((frBuffDesiredTq * 100));
	let lclStrTq = intDesTq.toString();
	let lclStrRPM = uirBuffDesiredRPM.toString();

	//Step 2: Check the length
	let diffLen = 0;
	diffLen = 4 - lclStrDegOfRtn.length; 
	while(diffLen > 0){
		lclStrDegOfRtn = "0" + lclStrDegOfRtn;
		diffLen--;
	}
	diffLen = 4 - lclStrTq.length;
	while(diffLen > 0){
		lclStrTq = "0" + lclStrTq;
		diffLen--;
	}
	diffLen = 2 - lclStrRPM.length;
	while(diffLen > 0){
		lclStrRPM = "0" + lclStrRPM;
		diffLen--;
	}

	servoMotionDesiredFlag = 1;	//This variable is currently unused but could be used later so not removed!
	
	let lclValveOpen = 'OOO';
	let lclValveClose = 'CCC';
	//let lclValveCmdToSend  = '';


	//#CCC,1000,10,0525$
	if(uirBuffDesiredDirectionOfRtn == CW){
		console.log("\n\n\n\n *********CLOSE ISSUED");
		//lclValveCmdToSend = lclValveClose;
		strDataToWrite = '#' + lclValveClose + ',' +  lclStrDegOfRtn + ',' + lclStrRPM + ',' + lclStrTq + '$';

	}
	if(uirBuffDesiredDirectionOfRtn == ACW){
		console.log("\n\n\n\n****** OPEN ISSUED");
		//lclValveCmdToSend = lclValveOpen
		strDataToWrite = '#' + lclValveOpen + ',' +  lclStrDegOfRtn + ',' + lclStrRPM + ',' + lclStrTq + '$';
	}


	console.log(strDataToWrite);
	port.write(strDataToWrite)
	//client.write('CmdSent:' + strDataToWrite);
}

function dummyWrite() {
	//consolelog('dummyWrite');
	let strDataToWrite = '';
	strDataToWrite = HEADER_DUMMY_READ;
	strDataToWrite += ',' + 0 + ',' + 0 + ',' + 0 + ',' + 0 + ',' + 0 + ',';
	//consolelog(strDataToWrite);
	client.write(strDataToWrite);
}

var Dirn = ACW;

function GetActualTqAndPosn(stringToExtract) {
	//consolelog('GetActualTqAndPosn');
	let lclString = '';
	lclString = stringToExtract; //Make a local copy
	let lclSplitStringArr = lclString.split(',');
	//console.log('l:' + lclSplitStringArr.length);
	//console.log('Source:' + lclString);
	//console.log('Split Arr:' + lclSplitStringArr);
	uiSrvoActualPosn = parseInt(lclSplitStringArr[1]);
	uiSrvoDesiredPosn = parseInt(lclSplitStringArr[2]);
	uiSrvoActualStatus = parseInt(lclSplitStringArr[3]);
	//console.log('Str:' + stringToExtract );
	console.log("PAV: " + uiSrvoActualPosn + "PDe:" + uiSrvoDesiredPosn + "SAS:" +  uiSrvoActualStatus);
	commFailCntr = 0;
}

//Remove these functions later
var cw = 0;

var MotorStatusChangeDesiredFlag = 0;

function setMotorMovementDesiredStatus() {
	MotorStatusChangeDesiredFlag = 1;
}


function stopTestAction(){
	clearInterval(vCycleAction);
	vCycleAction = null;
	clearInterval(vModbusIntervalId);
	vModbusIntervalId = null;
	clearInterval(vIntervalId);
	vIntervalId = null;
	TestWindow.close();
	TestWindow = null;
	createWindow();
	//loadIndexWindow();

}

function getListofIncompleteTests(){
	console.log('Incomp Test Request Received..');
	dbGetIncompleteTest(() => {
		sendListOfIncompleteTests();		
	});
}


/*
Note: 
ETSet_UsedClosingTorque: This is the torque programmed by the user
vAppliedTq: The torque command which is sent to the servo as command
vTqPeakNegativeVal: The measured value of the torque which has been received from the torque X'ducer

*/



const MAX_ALLOWABLE_TORQUE_DIFF = 2;
const PERCENTAGE_CHANGE_FOR_MODIFICATION = 0.0;	//0.4 is 40%

const NO_TORQUE_MODIFICATION_REQUIRED = 0;
const ERR_TQ_DIFF_TOO_LARGE_ON_LESS_SIDE = -1;
const ERR_TQ_DIFF_TOO_LARGE_ON_MORE_SIDE = -2;
const TORQUE_MODIFICATION_REQUIRED_INC = 1;
const TORQUE_MODIFICATION_REQUIRED_DEC = 2;




function takeLessTorqueModificationAction(rDiff){
	if(rDiff < MAX_ALLOWABLE_TORQUE_DIFF){
		//Increase the torque to be applied
		vAppliedTq = vAppliedTq + (PERCENTAGE_CHANGE_FOR_MODIFICATION * rDiff);
		return TORQUE_MODIFICATION_REQUIRED_INC;
	}
	else
		return ERR_TQ_DIFF_TOO_LARGE_ON_LESS_SIDE;
}

function takeMoreTorqueModificationAction(rDiff){
	if(rDiff < MAX_ALLOWABLE_TORQUE_DIFF){
		//Decrease the torque to be applied
		vAppliedTq = vAppliedTq - (PERCENTAGE_CHANGE_FOR_MODIFICATION * rDiff);
		return TORQUE_MODIFICATION_REQUIRED_DEC;
	}
	else
		return ERR_TQ_DIFF_TOO_LARGE_ON_MORE_SIDE;
}



function takeTorqueModificationAction(){
	let lclTqModificationAction = NO_TORQUE_MODIFICATION_REQUIRED;
	let lclTqDiff = vTqPeakNegativeVal - ETSet_UsedClosingTorque;
	console.log({vAppliedTq} + 'BM');

	console.log({lclTqDiff});
	if(lclTqDiff > 0){	//Indicates more torque was applied than expected
		if(lclTqDiff > 0.4){
			lclTqModificationAction = takeMoreTorqueModificationAction(lclTqDiff);
		}
	}
	if(lclTqDiff < 0){ //Indicates less torque was applied than expected
		lclTqDiff = lclTqDiff * -1;	//convert to positive number
		if(lclTqDiff > 0.4){
			lclTqModificationAction = takeLessTorqueModificationAction(lclTqDiff);
		}
	}

	console.log({ETSet_UsedClosingTorque});
	console.log({vAppliedTq});
	console.log({vTqPeakNegativeVal});
	console.log({lclTqModificationAction});
	return lclTqModificationAction;
}

function set20PercentLessTqForCal(){
	vAppliedTq = ETSet_UsedClosingTorque - (ETSet_UsedClosingTorque / 5);
	console.log('App. Tq:' + vAppliedTq);
	vET_Tq_InitialCalDone = 1;
}

function increaseTqForCal() {
	//Seems More Torque was applied!
	if ((vTqPeakNegativeVal - ETSet_UsedClosingTorque) <= vTqMaxTolerance){
		//torque value is within range and no more modification is required.
		EnduranceTestExecuteCurrrentStat = vET_Return_Status;
		console.log('\n\n\n\n*************** Pgmd Tq Val:' + vAppliedTq);
		return;
	}

	//The program came to this point indicates that torque modification is required.
	let lclDiff;
	lclDiff = vTqPeakNegativeVal - ETSet_UsedClosingTorque;

	if(lclDiff <= 5){
		//Decreasing the pgmd Tq Value
		vAppliedTq = vAppliedTq - ((vTqPeakNegativeVal - ETSet_UsedClosingTorque) / 3);
		return;
	}

	//If program came to this point it indicates that calibration failed!
	//console.log(vTqPeakNegativeVal);
	cycleParam.errorCode = ET_ERROR_CALIBRATION_FAILURE;
	
	 
	 
}

function decreaseTqForCal(){
	//Seems Less Torque was applied.
	if (ETSet_UsedClosingTorque - vTqPeakNegativeVal <= vTqMaxTolerance) {
		//torque value is within range and no more modification is required.
		EnduranceTestExecuteCurrrentStat = vET_Return_Status;
		console.log('\n\n\n\n*************** Pgmd Tq Val:' + vAppliedTq);
		return;
	}
	//The program came to this point indicates that torque modification is required.
	let diff2;
	diff2 = (jsonTestParam.closingTorque - vTqPeakNegativeVal);

	if(diff2 <= 5){
		//Increasing the pgmd Tq Value
		vAppliedTq = vAppliedTq + ((ETSet_UsedClosingTorque - vTqPeakNegativeVal) / 3);
		console.log("Increasing the pgmd Tq Value:" + vAppliedTq);
		return;
	}	
	//If program came to this point it indicates that calibration failed!
	//console.log("Too large a difference! No point in making adjustments!");
	cycleParam.errorCode = ET_ERROR_CALIBRATION_FAILURE;
}