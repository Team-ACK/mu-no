const path = require("path");
const routes = require("../routes");
const express = require("express");


module.exports = ( app ) => {
    app.use(express.static(path.join(__dirname, '../../../client/build')));
    app.use(routes());
};