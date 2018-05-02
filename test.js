var fs = require('fs');
var babel = require('@babel/core')
var etherfx = require('./etherfx-transform')

var fileName = process.argv[2];

if(fileName) {
    fs.readFile(fileName, (err, data) => {
        if(err) throw err;

        var src = data.toString();

        var out = babel.transform(src, {
            plugins: ["@babel/plugin-syntax-typescript", etherfx]
        })

        console.log(out.code);
    })
}