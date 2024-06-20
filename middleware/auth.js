const express = require('express');
require('dotenv').config();

module.exports = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!token) return res.status(401).json({message: "Доступ запрещен"});

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next()
    } catch (err) {
        res.status(403);
    }
};

