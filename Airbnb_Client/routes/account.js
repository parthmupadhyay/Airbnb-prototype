
var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require('ejs');

exports.editUser = function (req, res) {

    var firstName = req.param("firstName");
    var lastName = req.param("lastName");
    var email = req.param("email");
    var address = req.param("address");
    var state = req.param("state");
    var city = req.param("city");
    var zip = req.param("zip");
    var userId = req.session.userId;

    var msg_payload = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        state: state,
        city: city,
        zip: zip,
        userId: userId
    };


    mq_client.make_request('editUser_queue', msg_payload, function (err, user) {
        if (err) {
            console.log(err);
            console.log("In err to save");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();
        } else {
            console.log("After editing user in client");
            //console.log(user);
            var json_responses = {"statusCode": 200};
            res.send(json_responses);
            res.end();
        }
    });
};


exports.getEditProfilePage = function (req, res) {

    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn,
        "firstname": sess.firstName
    };
    // ejs.renderFile('../views/profile_edit_profile.ejs', user_data, function (err, result) {
    //     if (err) {
    //         console.log("Error in getting edit profile page");
    //         res.send("An error occured to get profile edit page");
    //     } else {
    //         res.end(result);
    //     }
    // });
    res.render('profile_edit_profile',user_data);
};


exports.loadEditUserPage = function (req, res) {
    var userId = req.session.userId;
    var msg_payload = {
        userId: userId
    };

    mq_client.make_request('loadEditUser_queue', msg_payload, function (err, user) {
        if (err) {
            console.log(err);
            console.log("In err to loadedit user queue");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();
        } else {
            console.log("After editing user in client");
            console.log(user);
            var json_responses = {"statusCode": 200, "data": user};
            res.send(json_responses);
            res.end();
        }
    });
};

exports.getUserPhotoPage = function (req, res) {
    var sess = req.session;
    var user_data = {
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn,
        "firstname" : sess.firstName,
        "userSSN": sess.userSSN,
        "lastName": sess.lastName,
        "userId": sess.userId,
        "isHost": sess.isHost
    };

    // ejs.renderFile('../views/profile_photo_tab.ejs', user_data, function (err, result) {
    //     if (err) {
    //         console.log("Error in getting  profile photo page");
    //         res.send("An error occured to get profile photo page");
    //     } else {
    //         res.end(result);
    //     }
    // });
    res.render('profile_photo_tab',user_data);
};


exports.getUserReviewAboutPage = function (req, res) {

    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn,
        "firstname": sess.firstName
    };

    ejs.renderFile('../views/profile_review_about_you.ejs', user_data, function (err, result) {
        if (err) {
            console.log("Error in getting  profile review about page");
            res.send("An error occured to get profile review about page");
        } else {
            res.end(result);
        }
    });
};


exports.getUserReviewbyPage = function (req, res) {

    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn,
        "firstname": sess.firstName
    };

    ejs.renderFile('../views/profile_review_by_you.ejs', user_data, function (err, result) {
        if (err) {
            console.log("Error in getting  profile review by page");
            res.send("An error occured to get profile review by page");
        } else {
            res.end(result);
        }
    });
};


exports.uploadProfileImage = function (req, res) {

    var file;

    if (!req.files) {
        var json = {"statusCode": 400}
        res.send(json);

    }
    else {
        var fileName = req.session.userId + '.png';
        file = req.files.profile_pic;
        console.log("File detais");
        console.log(file);
        file.mv('public/images/user/' + fileName, function (err) {
            if (err) {
                console.log("Error in uploading")
                console.log(err);
                res.status(500).send(err);
            }
            else {

                console.log("File uploaded");
                var userId = req.session.userId;
                var msg_payload = {
                    userId: userId,
                    fileName: fileName
                };

                mq_client.make_request('uploadProfileImage_queue', msg_payload, function (err, user) {
                    if (err) {

                        console.log(err);
                        console.log("In err to upload imaage user queue");
                        res.redirect('/getUserPhotoPage')
                    } else {
                        console.log("After uploading image client");
                        console.log(user);
                        res.redirect('/getUserPhotoPage')
                    }
                });
            }
        });
    }
};

exports.loadProfilePhotoPage = function (req, res) {

    var userId = req.session.userId;
    var msg_payload = {
        userId: userId
    };

    mq_client.make_request('loadProfilePhotoPage_queue', msg_payload, function (err, user) {
        if (err) {
            console.log(err);
            console.log("In err to load profile page queue");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();
        } else {
            console.log("After loading profile photo page in client");
            console.log(user);
            var json_responses = {"statusCode": 200, "data": user};
            res.send(json_responses);
            res.end();
        }
    });
};


exports.getDashBoardPage = function (req, res) {

    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn,
        "firstname": sess.firstName,
        "userId": sess.userId + '.png'
    };

    ejs.renderFile('../views/dashboard.ejs', user_data, function (err, result) {
        if (err) {
            console.log("Error in getting  dashboard by page");
            res.send("An error occured to get dashboared by page");
        } else {
            res.end(result);
        }
    });

};