/**
 * TO DO LIST
 * me: include some list of all status X blocks to choose from, and just click all of the ones you need
 * me: incluce some functionality for testing (add date and name to NL, checks?) (and file validation? could be really useful)
 * 
 * 
 * mass change of status/shipment date/shipment number (..etc?) (include option to enter list of DBNs) (also include a "find blocks be status" and way to
 * easily select blocks to change) (do some pretty thing with arrows showing status before and after)
 * 
 * include ghost text for what it should look like (e.g. HCS-56 and not 56) or do some basic data validation and show red if it fails
 * this is a problem since we use placeholder for the current database values (if they exist) ... I think the basic validation is sufficient
 * 
 * look into caching and see if it could be use (quick access to a 20-minute old version of the database maybe?)
 * (https://developers.google.com/apps-script/guides/support/best-practices)
 * 
 * could add framework to add and remove tags from blocks (using the comments column)
 * this is probably a much better system than using non-numeric DBNs (but it's too late for that)
 * 
 * catch data validation error (is there a way to check what the valdation rules in a cell are?) (e.g. powder)
 * 
 * option to remove all testing data from a block (sent back to machine shop, e.g.) (could also remove entries from data dumps, but this might not be necessary)
 * (leads to some confusion, though, since we don't have a record of all tests/machining dates.....)
 * 
 * use select blocks by status (and other things?) easy to add checkboxes to datatable, I think (or just CSS grid)
 * 
 * clear row or clear all option?
 * 
 * + 2.5 hrs
 * + 6.5 hrs
 * + 3 hrs
 * + 1 hrs
 * + 3 hrs
 * + 3.5 hrs
 * + 2.5 hrs
 * + 1.5 hrs
 * + 1 hrs (2/1/2021 1:00 PM)
 * + 5 hrs (2/1/2021 10:00 PM)
 * + 0.5 hrs (2/2/2021 12:00 PM)
 * 
 * 
 * shipment
 * 
 * experiment or think about unexpected behavior (mashing submit button, things like that)
 * perhaps safest to hide submit button while interacting with the google script
 * (that way, if something goes wrong like an unexpected error, you can't press the submit button)
 * 
 * could make some object where you can do obj.selectDensity which takes care of changing displays
 * 
 * explain possible discrepancies between database grading and app grading (i.e. < vs <=)
 * 
 * current TODO:
 * - test grading section?
 * - testing section for testers (based on test) (check for shipment which verifies all?) (LT: 13holes, missing row, name)
 *     (NL: name, date) (LT check: database cols, also check for files in google drive, status?)
 *     (NL check) (database cols, also check for files in google drive, status?)
 *     somewhere also veryify dates? fiber load -> w fill -> epoxy -> mach -> tests (ensure UP-TO-DATE TESTS)
 * - perhaps streamline retreival of data for display-only spans
 * - status is NOT checked for status in pic tests, since there is no submission data associtated...
 * - could clean up the error checking (allow ) (make it less of a fucking mess) (make it easier to add new checks/types of checks)
 * - think about other ways to check for errors (see above not about ensuring up-to-date tests)
 * 
 * - warning for incomplete data submission in SOME sections (warning...some entries are blank, e.g.) (not for pic tests, e.g.)
 * 
 * BUGS:
 * - block status does not update after submission (but does on refresh database)
 * - caroline: submitting 8 blocks, and then 8 blocks gives script error?
 * - caroline: deleting DBN does not remove some numbers from the corresponding cells?
 * submitting x to mold series gives an error (see logs) ()
 * 
 * CURRENT ISSUES:
 * - Logs are mostly empty when I don't run them? perhaps look into linking the script to a google cloud project for better logging?
 * 
 * reconigure shipment tab:
 * - load all blocks in status 6 [fill them in automatically?]
 * - display their shipment number and allow changes (if needed) []
 * - allow to add shipment date as bulk
 * - move to status 7
 * 
 * show date suffix for LT
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
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  return {
    sheet1: blocks1_12.getDataRange().getDisplayValues(),
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
    Logger.log(criteria)
    Logger.log(args)
  } else {
    Logger.log('cell ' + requestedRange + ' has no data validation rules')
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
  // Logger.log(data)
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
  for (let i = 0; i < data.length; i++) {
    const sheet = data[i].sheet
    const dbn = data[i].expectedDBN
    const row = data[i].row
    const cols = data[i].cols
    const values = data[i].values

    let spreadsheet
    if (sheet === 0) {
      spreadsheet = blocks1_12
      if (headers[0] === null) {
        headers[0] = spreadsheet.getRange('A1:1').getDisplayValues()[0]
      }
    } else if (sheet === 1) {
      spreadsheet = blocks13_64
      if (headers[1] === null) {
        headers[1] = spreadsheet.getRange('A1:1').getDisplayValues()[0]
      }
    } else {
      // idk what the sheet is
      Logger.log('ERROR: unexpected sheet: ' + sheet + ' (expected 0 for sector 1-12 or 1 for sector 13-64')
    }
    // get and modify row
    const rangeName = 'A' + row + ':' + row
    const range = spreadsheet.getRange(rangeName)
    const rowData = range.getDisplayValues()[0]
    curRowData.push(rowData)
    const rowDataToSet = new Array(rowData.length).fill(null)
    if (dbn !== rowData[0]) {
      // I thought there was another DBN here! stop everything!
      Logger.log('found unexpected DBN in sheet ' + spreadsheet.getName() + ', row ' + row + ': ' + rowData[0] + ' (expected ' + dbn + '); not submitting')
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
            Logger.log('unexpected data validation type: ' + type)
            dataValidationErrors.push(err)
            // will need to add some function to evaluate any new data validation types, otherwise
            // we will always push errors (no way to check if it will cause a prolem or not)
          }
        }
      }
    }
    rangesToSet.push([range, rowDataToSet, sheet, row, dbn])
    // range.setValues([rowData])
  }
  // Logger.log(rangesToSet)
  // only submit data to the database if there were no errors for ANY of the blocks in this submission
  if (dataValidationErrors.length + unexpectedValueErrors.length === 0) {
    // should probably log to Logger which values were changed
    let logMsg = 'SUBMISSION to database (by ' + Session.getActiveUser().getEmail() + '):\n'
    for (let i = 0; i < rangesToSet.length; i++) { // (const arr of rangesToSet) {
      // first check if this row has any data to submit
      if (rangesToSet[i][1].every(function (element) { return element === null })) {
        continue
      } // otherwise, there is data to submit
      const sheet = rangesToSet[i][0].getSheet().getName()
      const row = rangesToSet[i][3]
      const dbn = rangesToSet[i][4]
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
      // rangesToSet[i][0].setValues([rangesToSet[i][1]])
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
    Logger.log(logMsg)
    // Logger.log(curRowData)
  } else {
    // failed to set values beacuse we had at least one fatal or unchecked error
    Logger.log('found data validation and/or unexpected value errors; not submitting')
  }

  return {
    dataValidationErrors: dataValidationErrors,
    unexpectedValueErrors: unexpectedValueErrors,
    newBlockData: { rowData: curRowData, sheets: sheets, rows: rows }
  }
}

function debugGetFormulas () {
  // for testing:
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  const row = 14
  const data = blocks13_64.getRange('A' + row + ':' + row).getFormulas()
  Logger.log(data)
  return data
}
function debugGetDisplayValues () {
  // for testing:
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  const row = 14
  const data = blocks13_64.getRange('A' + row + ':' + row).getDisplayValues()
  Logger.log(data)
  return data
}
function debugGetValues () {
  // for testing:
  const blocks1_12 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks DB')
  const blocks13_64 = SpreadsheetApp.openById(fileIDs.database_ID).getSheetByName('Blocks1364DB')
  const row = 14
  const data = blocks13_64.getRange('A' + row + ':' + row).getValues()
  Logger.log(data)
  return data
}

/**
 * @param {String} value
 * @return {Boolean}
 */
function isValidDate (value) {
  return true
}
/**
 * @param {Number}
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

// handle location in database here, or just pass the range and values to google script?
// if we want to check with CURRENT values, we must either load the relevant dbns before submitting (only takes a few seconds, can easily
// show user the current values) or check values in google script and put logic there (if anything goes wrong, we have to pass info back to javascript..)
// maybe, for the very rare case, pass expected values to google script and compare them with the current ones queried in google script before overwriting
