// Validates the manifest's JSON.

var fs = require('fs')

fs.readFile('public/manifest.json', 'utf8', function(err, contents) {
    if (err) throw err
    // will cause exit with status 1 if invalid json
    JSON.parse(contents)
})
