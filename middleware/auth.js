const express = require('express');
require('dotenv').config();

module.exports = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!token) return res.sendStatus(401);

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next()
    } catch (err) {
        res.sendStatus(403);
    }
};

