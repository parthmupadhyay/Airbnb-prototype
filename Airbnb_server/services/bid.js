var Property = require('../model/property');
var Bidding = require('../model/bidding');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;


exports.updateBasePrice = function (msg, callback) {
    var res = {};
    var propertyId = msg.propertyId;
    var maxBidPrice = msg.maxBidPrice;
    var hostId = msg.hostId;
    var latestBidder = msg.latestBidder;
    var userId = msg.userId;
    var currentTime = Date.now();
    Property.update({_id: new ObjectId(propertyId)}, {
        $set: {
            maxBidPrice: maxBidPrice,
            latestBidder: latestBidder
        }
    }, function (err, result) {
        if (err) {
            console.log("err in update");
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var bidding = new Bidding();
            bidding.propertyId = propertyId;
            bidding.bidPrice = maxBidPrice;
            bidding.createdDate = currentTime;
            bidding.userId = userId;
            bidding.hostId = hostId;

            bidding.save(function (err) {

                if (err) {
                    console.log(err);
                }
                else {
                    res.code = 200;
                    res.message = "success";
                    callback(null, res);
                }

            });

        }

    });
};