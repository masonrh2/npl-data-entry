/**
 * TO DO LIST
 * me: include some list of all status X blocks to choose from, and just click all of the ones you need
 * me: incluce some functionality for testing (add date and name to NL, checks?) (and file validation? could be really useful)
 * 
 * handle reloading/warning when there is old data in page...or when the input windows are open, automatically refresh
 * the dbns when have been entered every 10 seconds or so?
 * 
 * real time calculation of volume once all values are present/entered into dimensions
 * 
 * mass change of status/shipment date/shipment number (..etc?) (include option to enter list of DBNs) (also include a "find blocks be status" and way to
 * easily select blocks to change) (do some pretty thing with arrows showing status before and after)
 * 
 * could do a very multipurpose framework which allows you to select and DBNs and change values in any colummn(s)
 * (could be more dangerous?) (would be more work, but a lot could be borrowed from "find blocks" of info station)
 * (this would pretty much just be the database...)
 * 
 * make colors less weird or more clear?
 * 
 * include ghost text for what it should look like (e.g. HCS-56 and not 56) or do some basic data validation and show red if it fails
 * 
 * consider consolidating blocks class variables e.g. put all dimensions into a subobject or the like (block.dimensions.bt instead of block.bt) (would be cleaner)
 * 
 * look into caching and see if it could be use (quick access to a 20-minute old version of the database maybe?)
 * (https://developers.google.com/apps-script/guides/support/best-practices)
 * 
 * could add framework to add and remove tags from blocks (using the comments column)
 * this is probably a much better system than using non-numeric DBNs (but it's too late for that)
 * 
 * if we are unable to find a DBN, can ask return to HTML and say "unable to find this DBN, would you like to reload
 * the database and try again?" (this way our rows are updated and we are able to quickly find any newly added blocks)
 * 
 * find a way to update blocksCollection with blocks or with refreshing the database...
 * 
 * we can reload database every 60 seconds (if the previous call to google script has returned)
 * (or even call as soon as the previous call is returned, but that's excessive)
 * 
 * the index block property might not be necessary...
 * 
 * warnings if status is not as expected (perhaps include status column on all pages which is green/red)
 * (perhaps also check again what the status is on the google script side, and return a warning "are you sure?")
 * (or perhaps also allow you to change status)
 * 
 * catch data validation error (is there a way to check what the valdation rules in a cell are?) (e.g. powder)
 * 
 * option to remove all testing data from a block (sent back to machine shop, e.g.) (could also remove entries from data dumps, but this might not be necessary)
 * (leads to some confusion, though, since we don't have a record of all tests/machining dates.....)
 * 
 * add status volumes to all sections:
 * tungsten: 1 -> 2
 * epoxy: 2 -> 3
 * dimensions: 4 -> 5?
 * 
 * add volume column to density
 * 
 * do we need overwrite column, or is the red enough? would save some room
 * 
 * list of other sections/functionality to add:
 * - mass change of status/
 * 
 * begin each section with "how many blocks would you like to add?" then add that many rows
 * OR use select blocks by status (and other things?) easy to add checkboxes to datatable, I think (or just CSS grid)
 * 
 *  * clear row or clear all option?
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
  // database_ID: '1qnCxA6FPIh1Y5w-cG3LFzdPnkVu2b0p14_viVjkDldg',
  // TEST DATABASE:
  database_ID: '1wxlC31DsosIniAWJdhoCkAlekUpYYV0NygrA07QbMrs',
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
    const rowData = spreadsheet.getRange('A' + row + ':' + row).getDisplayValues()
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
  const rangesToSet = []

  for (let i = 0; i < data.length; i++) {
    const sheet = data[i].sheet
    const row = data[i].row
    const cols = data[i].cols
    const values = data[i].values

    let spreadsheet
    if (sheet === 0) {
      spreadsheet = blocks1_12
    } else if (sheet === 1) {
      spreadsheet = blocks13_64
    }

    // get and modify row
    const rangeName = 'A' + row + ':' + row
    const range = spreadsheet.getRange(rangeName)
    const rowData = range.getDisplayValues()[0]
    for (let j = 0; j < cols.length; j++) {
      // here we can alter behavior when database has changed during request
      const cur = rowData[cols[j]]
      if (cur != values[j].expected && !values[j].ignoreError) {
        unexpectedValueErrors.push({
          loc: { sheet: sheet, row: row, col: cols[j] },
          expected: values[j].expected,
          found: cur,
          fatal: false,
          id: [i, j]
        })
      }
      rowData[cols[j]] = values[j].set
    }

    // check if any values conflict with data validation
    const rules = range.getDataValidations()[0]
    for (let j = 0; j < cols.length; j++) {
      const rule = rules[cols[j]]
      const loc = { sheet: sheet, row: row, col: cols[j] }
      if (rule != null) {
        const type = rule.getCriteriaType().toString()
        const args = rule.getCriteriaValues()
        const value = rowData[cols[j]]
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
            if (!requiredValues.includes(value)) {
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
    rangesToSet.push([range, rowData])
    // range.setValues([rowData])
  }

  if (dataValidationErrors.length + unexpectedValueErrors.length === 0) {
    // should probably log to Logger which values were changed
    for (const arr of rangesToSet) {
      arr[0].setValues([arr[1]])
    }
  } else {
    // failed to set values beacuse we had at least one fatal or unchecked error
  }

  const msg = {
    dataValidationErrors: dataValidationErrors,
    unexpectedValueErrors: unexpectedValueErrors
  }
  // Logger.log(msg)
  return msg
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
