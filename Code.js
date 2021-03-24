/**
 * TO DO LIST
 * 
 * include ghost text for what it should look like (e.g. HCS-56 and not 56) or do some basic data validation and show red if it fails
 * this is a problem since we use placeholder for the current database values (if they exist) ... I think the basic validation is sufficient
 * 
 * option to remove all testing data from a block (sent back to machine shop, e.g.) (could also remove entries from data dumps, but this might not be necessary)
 * (leads to some confusion, though, since we don't have a record of all tests/machining dates.....)
 * 
 * + 2.5 hrs
 * + 6.5 hrs
 * + 3 hrs
 * + 3 hrs
 * + 3.5 hrs
 * + 1 hrs (2/1/2021 1:00 PM)
 * + 5 hrs (2/1/2021 10:00 PM)
 * + 0.5 hrs (2/2/2021 12:00 PM)
 * 
 * could make some object where you can do obj.selectDensity which takes care of changing displays
 * 
 * current TODO:
 * - test grading section?
 * - testing section for testers (based on test) (check for shipment which verifies all?) (LT: 13holes, missing row, name)
 *     (NL: name, date) (LT check: database cols, also check for files in google drive, status?)
 *     (NL check) (database cols, also check for files in google drive, status?)
 *     somewhere also veryify dates? fiber load -> w fill -> epoxy -> mach -> tests (ensure UP-TO-DATE TESTS)
 * - perhaps streamline retreival of data for display-only spans
 * - status is NOT checked for status in pic tests, since there is no submission data associtated...
 * - could clean up the error checking (make it less of a fucking mess) (make it easier to add new checks/types of checks)
 * - think about other ways to check for errors (see above not about ensuring up-to-date tests)
 * - change all "submit" to "fill" for clarity (just because the name is in filler initial does not mean it is in the rows
 *      and will be submitted to the database)
 * - add some more basic error checking? e.g. are you sure that empty mold weighs 121 g?
 * 
 * BUGS:
 * - block status does not update after submission (but does on refresh database)
 * - caroline: deleting DBN does not remove some numbers from the corresponding cells?
 * submitting x to mold series gives an error (see logs) ()
 * 
 * CURRENT ISSUES:
 * - 
 * 
 * reconigure shipment tab:
 * - load all blocks in status 6 [fill them in automatically?]
 * - display their shipment number and allow changes (if needed) []
 * - allow to add shipment date as bulk
 * - move to status 7
 * 
 * show date suffix for LT (why doesn't this appear? just because input box is too short?)
 * 
 * add blocks from list option (comma or space or tab separated?
 * 
 * when entering DBNs, press enter to move to next row (listen for enter...either use clever tab indexing (gross) or use HTMLelement.focus()
 *    to select next row input, and do nothing if in last row)
 * 
 * select blocks from status in some sections:
 * - use datatables for nice scrolling?
 * - OR use a grid format and display in multiple rows and columns (more compact, no need to scroll?)
 * - ask for input status and get all blocks with that status
 * - display DBN, block, and a checkbox (dbn bold, block grey)
 * - when checkbox is checked, add a row with that dbn
 * - when a checkbox is unchecked, remove every row with that dbn
 * 
 * migrate project to google cloud platform for logging that actually works?
 * 
 * change shipment section:
 * - add blocks to grade (select from status 5 blocks and auto set status to its pregrade if all tests are complete, else warn)
 * 
 * functionality for density checking? seperate window?
 * break all tests sections down?:
 * 
 * Epoxy: input epoxy data (status 2 -> 3)
 *    [choose from status 2, sort by DBN? sort by tungsten filling date?]
 * 
 * Density: (status 3, 4 -> 5?)
 *    [choose from status 3 and/or 4? sort by DBN? sort by potting date or machining date?]
 * Light Trans: (status 5)
 *    (dbn, block*, status, fiber count*, missing row, 13 holes, tester)
 *    [choose from status 5, sort by most recently LT tested, then by DBN]
 * Natural Light: (status 5)
 *    (dbn, block*, status, date, tester)
 *    [choose from status 5, sort by most recently NL tested, then by DBN]
 * 
 * Density Check: (status 5 or 5abc, 8?)
 *    [choose from status 5, sort by those missing check, then by DBN]
 * Light Trans Check: (status 5 or 5abc, 8?)
 *    [choose from status 5, sort by those missing check, then by DBN]
 * Natural Light Check: (status 5 or 5abc, 8?)
 *    [choose from status 5, sort by those missing check, then by DBN]
 * 
 * Block Grading: (status 5 -> 5abc, 8)
 *    (dbn, block*, pregrade, status, density*, {indicate dim grades}*, fiber count*, {inidicate tower grades}*, missing row,
 *        13 holes, scint ratio*)
 *    [choose from status 5, sort by test completeness?]
 *    {diplay how many blocks are status 5 (and how many need tests, need checks, finished 5a/b/c, finished 8), 5a/b/c}
 * Shipment: (status 5abc -> 8 OR status 6 -> 7)
 *    (dbn, block*, status, pregrade)
 *    [choose from status 5a, 5b, 5c, sort by block? grade? dbn?]
 *    {add a "add all status __ blocks" input, to avoid so much clicking?}
 * 
 * need to be able to remove rows individually?
 * 
 * PLAN: "add blocks by status"
 * - also highlight the selected cells somehow? (darker grey, e.g.)
 * 
 * functionality to verify dates and integrity of all tests:
 * Dates: fiber fill date < tungsten date < epoxy date < (density, light trans, natural light, scint)
 * (and all are valid dates (some are US dates which may not be valid))
 * Database: all cells are filled
 * Google Drive: LT original W and N images are in block pictures, W and N histograms are in analysis,
 * txt files are in scintiallation folder
 * 
 * need to handle errors much better (code is a fucking mess and dialogs are confusing and clunky)
 * - you should be able to make an array which specifies error-checking functions, the order to try them in,
 *      when to inform user/ask confirmation, and how to confirmation should appear
 * - something like this (they should be separated by how they should appear to the end user):
 *    [
 *      {fns: [checkInitials, checkDate, checkNumber], msg: alertFn}, // a screw is a screw
 *      {fns: [checkStatus, checkDateProgression], msg: alertFn}, // are you sure this is the right block?
 *      {fns: [trySubmit], msg: alertFn} // look good on client-side, try to submit to script
 *    ]
 * - when submit is pressed, the first set of checks are run to completion, then display a confirm dialog
 *    if there were any errors, otherwise continue onto the second set of checks
 * - repeat the above process with the second set of checks
 * - trySubmit should simply run a modified server-side submission function
 * 
 *  - somehow need to store what the checking state is (to avoid infinite loops)
 *  - this was previously handled by adding ignore flags, but this is not very elegant
 *      (and at least could be significantly improved)
 * 
 * ...how to handle script error (incl. unhandled errors and my homemade errors (such as data validation))
 * 
 * allow enter user to enter a comma-separated list of DBNs?
 * could change tabbing or have nicer dbn entry (seperate box) which makes inputting many DBNS easier
 * add a warning "are you sure you want to submit to database without filling this column you entered data for?"?
 * 
 * other:
 * - start logging cropped stencil with difference form template for LT
 * - improve LT stencil recognition
 * 
 * on refresh database, call selectBlocksTableUpdate for all sections
 * 
 * change clearTables to clearTable in confirm dialog error clusterfuck
 */

function doGet () {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle('NPL Data Entry')
}

function include (filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate()
    .getContent()
}
// store google drive file (and folder) ID for faster access
const fileIDs = {
  QATestsFolder_ID: '1z3Ez8X3hzAhQMH3YYLa7PsPFSHhCNW4b',
  // REAL DATABASE:
  database_ID: '1qnCxA6FPIh1Y5w-cG3LFzdPnkVu2b0p14_viVjkDldg',
  // TEST DATABASE:
  // database_ID: '1wxlC31DsosIniAWJdhoCkAlekUpYYV0NygrA07QbMrs',
  imageUrlsSheet_ID: null,
  lightTransAnalysisFolder_ID: '1bPgaSd7G4TevyRDPs7fjbxsvPrIHkI32',
  lightTransArchiveAnalysisFolder_ID: '12de-XwXEKke-PAjQ0KUgBHSErzj2EiVC',
  lightTransArchiveFolder_ID: '12PmOQSZc3MC-kwTfhmzdndgGFYvbXL1Q',
  lightTransArchiveOriginalFolder_ID: '19v0Qg2_JwEk_wSRe7bg9aFoy0DFLXIec',
  lightTransCroppedFolder_ID: '13_MYlf7YuXZV-UaB2Fvb7EzwpeZtTWPW',
  lightTransOriginalFolder_ID: '1hSVk78Oyfrmnjr8rHQ4jb0WOGiV9LRel',
  lightTransTestFolder_ID: '1QY2pmdBmaOGShkIfEFe1nHd53Dr9lJqs',
  naturalLightArchiveFolder_ID: '1B-AhosgSFJy2cVSns73vxblfcJ5NPl0Y',
  naturalLightFolder_ID: '1Rp0USqFRaWsm5nDGBP1vUBfx6qEchBb9',
  sphenixNewFolder_ID: '1vM9pL9jRZ_Nc2VyJU6pzo1g5zliLUn0R'
}

/**
 * returns entire database (blocks1-12 and blocks13-64)
 */
function getDatabase () {
  // const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  return {
    sheet1: null, // blocks1_12.getDataRange().getDisplayValues(),
    sheet2: blocks13_64.getDataRange().getDisplayValues()
  }
}
/**
 * returns the requested range
 */
function getA1Range (_requestedRange) {
  const requestedRange = 'Q2'
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  const range = blocks13_64.getRange(requestedRange)
  const rule = range.getDataValidation()
  if (rule != null) {
    const criteria = rule.getCriteriaType()
    const args = rule.getCriteriaValues()
    console.log(criteria)
    console.log(args)
  } else {
    console.log('cell ' + requestedRange + ' has no data validation rules')
  }
  return range.getDisplayValue()
}

/**
 * gets row data for requested blocks
 * @param {}
 * @return {}
 */
function getRowData (blocks) {
  // for testing:
  // const blocks = [ { sheet: 0, row: 2}, { sheet: 1, row: 2}, { sheet: 1, row: 1500} ]
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  const data = []
  for (let i = 0; i < blocks.length; i++) {
    const sheet = blocks[i].sheet
    const row = blocks[i].row
    let spreadsheet
    if (sheet === 0) {
      spreadsheet = blocks1_12
    } else if (sheet === 1) {
      spreadsheet = blocks13_64
    }
    const rowData = spreadsheet.getRange('A' + row + ':' + row).getValues()
    data.push(rowData)
  }
  // console.log(data)
  return data
}

/**
 * sets block data for requested dbns and columns to passed values
 * @param {}
 * @return {}
 */
function setBlockData (data) {
  // const data = [{sheet: 1, row: 2, cols: [4,5,6], values: [{set: 5, expected: 0},{set: '10/26/2020', expected: 0},{set: 5, expected: 0}]}]
  // useful to save these as const in google script or to open them in a function every time? might not make a difference
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  const unexpectedValueErrors = []
  const dataValidationErrors = []
  const curRowData = []
  const newRowData = []
  const sheets = []
  const rows = []
  const rangesToSet = []
  const headers = [null, null]
  const loadSheets = [false, false]
  for (let i = 0; i < data.length; i++) {
    loadSheets[data[i].sheet] = true
  }
  let allSheetData = [null, null]
  if (loadSheets[0]) {
    allSheetData[0] = blocks1_12.getDataRange().getDisplayValues() // returns strings only
    headers[0] = allSheetData[0][0]
  }
  if (loadSheets[1]) {
    allSheetData[1] = blocks13_64.getDataRange().getDisplayValues() // returns strings only
    headers[1] = allSheetData[1][0]
  }
  for (let i = 0; i < data.length; i++) {
    const sheet = data[i].sheet
    const dbn = data[i].expectedDBN
    const row = data[i].row
    const cols = data[i].cols
    const values = data[i].values

    let spreadsheet
    if (sheet === 0) {
      spreadsheet = blocks1_12
    } else if (sheet === 1) {
      spreadsheet = blocks13_64
    } else {
      // idk what the sheet is
      console.log('ERROR: unexpected sheet: ' + sheet + ' (expected 0 for sector 1-12 or 1 for sector 13-64)')
    }
    // get and modify row
    const rangeName = 'A' + row + ':' + row
    const range = spreadsheet.getRange(rangeName)
    const rowData = allSheetData[sheet][row - 1]
    curRowData.push(rowData)
    const rowDataToSet = new Array(rowData.length).fill(null)
    if (dbn !== rowData[0]) { // !== beacause HTML casts block.dbn to a string
      // I thought there was another DBN here! stop everything!
      console.log('found unexpected DBN in sheet ' + spreadsheet.getName() + ', row ' + row + ': ' + rowData[0] + ' (expected ' + dbn + '); not submitting')
      return {
        unexpectedDBNError: {
          loc: { sheet: sheet, row: row },
          expectedDBN: dbn,
          foundDBN: rowData[0]
        }
      }
    }
    for (let j = 0; j < cols.length; j++) {
      // here we can alter behavior when database has changed during request
      const cur = rowData[cols[j]]
      // we use a castful comparison since google script does not know when to cast to Number
      // so do some automatic casting (which means '' == 0, but I think that's fine for Excel)
      if (cur != values[j].expected && !values[j].ignoreError) {
        unexpectedValueErrors.push({
          loc: { sheet: sheet, row: row, col: cols[j] },
          expected: values[j].expected,
          found: cur,
          fatal: false,
          id: [i, j]
        })
      }
      rowDataToSet[cols[j]] = values[j].set
    }

    // check if any values conflict with data validation
    const rules = range.getDataValidations()[0]
    for (let j = 0; j < cols.length; j++) {
      const rule = rules[cols[j]]
      const loc = { sheet: sheet, row: row, col: cols[j] }
      if (rule != null) {
        const type = rule.getCriteriaType().toString()
        const args = rule.getCriteriaValues()
        const value = values[j].set
        const allowInvalid = rule.getAllowInvalid()
        const err = {
          loc: loc,
          type: type,
          value: value,
          args: args,
          fatal: !allowInvalid,
          id: [i, j]
        }
        if (!allowInvalid || (allowInvalid && !values[j].ignoreError)) {
          if (type === 'VALUE_IN_LIST') {
            const requiredValues = args[0]
            // perform a castful comparison, since we have not cast to numbers where appropriate...
            // (this way, '' == 0, but I think that's fine, since excel does that)
            if (!requiredValues.some(function (element) { return element == value })) {
              dataValidationErrors.push(err)
            }
          } else if (type === 'DATE_IS_VALID_DATE') {
            if (!isValidDate(value)) {
              dataValidationErrors.push(err)
            }
          } else {
            console.log('unexpected data validation type: ' + type)
            dataValidationErrors.push(err)
            // will need to add some function to evaluate any new data validation types, otherwise
            // we will always push errors (no way to check if it will cause a prolem or not)
          }
        }
      }
    }
    //                  0          1         2     3    4
    rangesToSet.push([range, rowDataToSet, sheet, row, dbn])
    // range.setValues([rowData])
  }
  // console.log(rangesToSet)
  // only submit data to the database if there were no errors for ANY of the blocks in this submission
  if (dataValidationErrors.length + unexpectedValueErrors.length === 0) {
    // should probably log to console which values were changed
    let logMsg = 'SUBMISSION to database (by ' + Session.getActiveUser().getEmail() + '):\n'
    let startRow = Infinity
    let endRow = 0
    const dbnsModified = []
    for (let i = 0; i < rangesToSet.length; i++) { // (const arr of rangesToSet) {
      // first check if this row has any data to submit
      if (rangesToSet[i][1].every(function (element) { return element === null })) {
        continue
      } // otherwise, there is data to submit
      const sheet = rangesToSet[i][0].getSheet().getName()
      const row = rangesToSet[i][3]
      if (row < startRow) { startRow = row }
      if (row > endRow) { endRow = row }
      const dbn = rangesToSet[i][4]
      dbnsModified.push(dbn)
      const columns = []
      const setValues = []
      for (let j = 0; j < rangesToSet[i][1].length; j++) {
        if (rangesToSet[i][1][j] !== null) { // if null, we ignore this cell and choose not to overwrite it's formula
          // HTML told us to write this value
          rangesToSet[i][0].getCell(1, j + 1).setValue(rangesToSet[i][1][j])
          curRowData[i][j] = rangesToSet[i][1][j]
          // log this
          columns.push(headers[rangesToSet[i][2]][j] + ' [col ' + columnToLetter(j + 1) + ']')
          setValues.push(rangesToSet[i][1][j])
        }
      }

      logMsg += 'In sheet ' + sheet + ', DBN ' + dbn + ' [row ' + row + '], wrote data: '
      for (let i = 0; i < columns.length - 1; i++) {
        logMsg += columns[i] + ': ' + "'" + setValues[i] + "', "
      }
      logMsg += columns[columns.length - 1] + ': ' + "'" + setValues[columns.length - 1] + "'"
      logMsg += '\n'
      newRowData.push(rangesToSet[i][1])
      sheets.push(rangesToSet[i][2])
      rows.push(rangesToSet[i][3])
    }
    console.log(logMsg)
    // console.log(`Modified DBNs: ${JSON.stringify(dbnsModified)}`)
    DatabaseScripts.updateRowFormulas(blocks13_64, startRow, endRow, Session.getActiveUser(), dbnsModified)
    // console.log(curRowData)
  } else {
    // failed to set values beacuse we had at least one fatal or unchecked error
    console.log('found data validation and/or unexpected value errors; not submitting')
  }

  return {
    dataValidationErrors: dataValidationErrors,
    unexpectedValueErrors: unexpectedValueErrors,
    newBlockData: { rowData: curRowData, sheets: sheets, rows: rows }
  }
}

/**
 * @param {String} value
 * @return {Boolean}
 */
function isValidDate (value) {
  return true
}
/**
 * @param {Number} column
 * @return {String}
 */
function columnToLetter (column) {
  let temp = ''
  let letter = ''
  while (column > 0) {
    temp = (column - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }
  return letter
}
/**
 * @param {String}
 * @return {Number} the (one-based) column index
 */
function letterToColumn (letter) {
  let column = 0
  const length = letter.length
  for (let i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1)
  }
  return column
}
