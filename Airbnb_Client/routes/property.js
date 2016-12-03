
var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require("ejs");
var redis = require('redis');
var client = redis.createClient();
/*var log = require("./log");*/
/*
 var mongo = require("./mongo");
 var config = require('./config.js');
 */

client.on('ready', function () {

    console.log("Redis Ready");

});

client.on('error', function (err) {
    console.log("Error " + err);
});

exports.loadDetailPg = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName,
        "userSSN": req.session.userSSN,
        "lastName": req.session.lastName,
        "userId": req.session.userId,
        "isHost": req.session.isHost,
        "profileImage":req.session.profileImage
    };

    res.render('detail',user_data);
};

exports.getPropertyRedis = function(req, res){

    var id = req.param("propertyId");

    client.hget("properties", id, function (err, obj) {

        if(obj) {
            console.log("From redis");
            res.end(obj);
        }
        else {
            getProperty(req, res);
        }
    });
};


exports.fetchPropertyRedis = function (req, callback) {
    var msg_payload = {
        id: req
    };

    mq_client.make_request('property_detail_queue', msg_payload, function (err, result) {
        if (err) {
            // console.log(err);
            var json_responses = {"statusCode": 401};
            callback(err, json_responses);
        } else {
            // console.log(result);
            // var json_responses = {"statusCode": 200, "data": result};
            callback(err, result);
        }
    });
};


function getProperty (req, res, next) {
    var id = req.param("propertyId");

    var msg_payload = {
        id: id
    };

    mq_client.make_request('property_detail_queue', msg_payload, function (err, result) {
        if (err) {
            console.log(err);
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
        } else {
            console.log(result.id);
            console.log("From mongoose");
            client.hmset("properties", result.id, JSON.stringify(result), redis.print);
            // var json_responses = {"statusCode": 200, "data": result};
            res.send(result);
            res.end();

        }
    });
}



exports.editProperty = function (req, res, next) {

    console.log("In Edit property function");

    var Id = req.body.propertyId;



    var conditions ={propertyId:Id};
    var update = {

        'name': req.param("name"),
        'category': req.param("category"),
        'maxGuest': req.param("maxGuest"),
        'bedrooms': req.param("bedrooms"),
        'bathrooms': req.param("bathrooms"),
        'description': req.param("description"),
        'price': req.param("price")


    };


    var msg_payload = { "conditions": conditions, "update": update};

    mq_client.make_request('editProperty_queue', msg_payload, function(err, results){
        if(err){
            console.log(err);
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
        }
        else
        {
            if(results.code == 200){

                console.log("Property updated");
                console.log(results);
                res.send(results);
                res.end();}
            else if (results.code == 0){

                console.log("Unsuccessful update of property");
            }
        }
    })
};


exports.getEditPropertyPage = function (req, res) {

    var Id = req.params.propertyId;


    var msg_payload = { "id":Id};
    mq_client.make_request('getDatainEditProperty_queue',msg_payload, function(err,results){

        console.log(results);

        if(err){
            console.log("Error");

        }
        else
        {
            if(results.code == 200){

                res.end(JSON.stringify(results))

            }
            else if (results.code == 400){

                console.log("Not found");

            }
            else if (results.code == 0){

                console.log("DB Operation Failed");

            }
        }
    });

};


exports.getProperty = getProperty;
