
var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require("ejs");
/*var log = require("./log");*/
/*
 var mongo = require("./mongo");
 var config = require('./config.js');
 */


exports.loadDetailPg = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName,
        "userSSN": req.session.userId,
        "lastName": req.session.lastName,
        "userId": req.session.userId,
        "isHost": req.session.isHost,
        "profileImage":req.session.profileImage
    };

    res.render('detail',user_data);
};

exports.getProperty = function (req, res, next) {
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
            console.log(result);
            // var json_responses = {"statusCode": 200, "data": result};
            res.send(result);
            res.end();

        }
    });
};



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



