/**
 * Created by karan on 11/6/2016.
 */
var User = require('../models/user');
var Transaction = require('../models/transaction');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Bid = require('../models/bid');


exports.bidCron_request = function (msg, callback) {
    "use strict";
    var res={};
    var currentTime = msg.currentTime;


    console.log("bid cron");
    Product.find({bidCompleteTime: {$lte: currentTime}, forBid: '1', isBidComplete: '0'}, function (err, result1) {
        if (err) {
            throw err;
        }
        else {

            for (let i = 0; i < result1.length; i++) {

                Bid
                    .findOne({productId: result1[i]._id}, 'amount')
                    .sort('-amount')
                    .exec(function (err, maxBid) {
                        if (maxBid != null) {
                            var temp = [];
                            temp.push(maxBid.amount);
                            Bid.find({amount: {$in: temp}, productId: result1[i]._id}, function (err, result2) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    var transaction = new Transaction();
                                    transaction.productId = result2[i].productId;
                                    transaction.buyerId = result2[i].userId;
                                    transaction.amount = result2[i].amount;
                                    transaction.quantity = 1;
                                    transaction.isCreated = Date.now();

                                    transaction.save(function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {

                                            var conditions = {_id: result1[i]._id};
                                            var update = {
                                                'isBidComplete': 1

                                            };
                                            Product.update(conditions, update, function (err, result4) {

                                                if (err) {
                                                    throw err;
                                                } else {
                                                    console.log("Flag Updated");
                                                }
                                            });
                                        }
                                    });


                                }
                            });
                        }
                        else {
                            var conditions = {_id: result1[i]._id};
                            var update = {
                                'isBidComplete': 1

                            };
                            Product.update(conditions, update, function (err, result5) {

                                if (err) {
                                    throw err;
                                } else {
                                    console.log("Flag Updated");
                                }
                            });

                        }
                    });
            }
            res.code=200;
            callback(null,res);

        }
    });

};