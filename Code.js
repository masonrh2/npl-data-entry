function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle('NPL Data Entry')
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate()
    .getContent()
}

var database
var blocksSheet1
var blocksSheet2
var filesLoaded = false
var error
function loadFiles () {
  let errorMessage = ''
  // Note that changing the names or locations of the folders in google drive may temporarily break this, until the paths below are chagned
  if (DriveApp.getFilesByName('Blocks database').hasNext()) {
    // ...found database, now save it
    database = DriveApp.getFilesByName('Blocks database').next()
    blocksSheet1 = SpreadsheetApp.open(database).getSheetByName('Blocks DB')
    blocksSheet2 = SpreadsheetApp.open(database).getSheetByName('Blocks1364DB')
    // ...check if you found both sheets
    if (blocksSheet1 == null || blocksSheet2 == null) {
      // Failed to locate both sheets
      Logger.log('failed to locate database sheet(s) in database spreadsheet')
    }
  } else {
    // ...failed to locate database
    Logger.log('failed to locate file "Blocks Database" in drive')
    errorMessage += 'failed to locate file "Blocks Database" in drive; '
  }
  filesLoaded = true
  error = errorMessage
}

function getDatabase () {
  if (!filesLoaded) {
    loadFiles()
  }
  if (error !== '') {
    // an error occured while loading files, do don't try to pass database var to fns
    // also pass the error to HTML so the user can be alerted
    return {
      sheet1: null,
      sheet2: null,
      err: error
    }
  } else {
    const sheets = SpreadsheetApp.open(database).getSheets()
    return {
      sheet1: sheets[0].getDataRange().getDisplayValues(),
      sheet2: sheets[1].getDataRange().getDisplayValues(),
      err: null
    }
  }
}

function putTungstenData () {

  return {}
}

function putEpoxyData () {

  return {}
}

function putDensityData () {

  return {}
}
