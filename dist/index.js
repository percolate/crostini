"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.get('/campaign', (req, res) => res.send('Hello World!'));
app.get('/content', (req, res) => res.send('Hello World!'));
app.get('/asset', (req, res) => res.send('Hello World!'));
app.get('/request', (req, res) => res.send('Hello World!'));
app.get('/task', (req, res) => res.send('Hello World!'));
app.get('/top_nav', (req, res) => res.send('Hello World!'));
app.get('/settings', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=index.js.map