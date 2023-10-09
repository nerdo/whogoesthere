const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const template = fs.readFileSync(path.join(__dirname, 'ngrok.yml'), 'utf8')
const rendered = ejs.render(template, process.env)
fs.writeFileSync(path.join(__dirname, '../ngrok.yml'), rendered)
