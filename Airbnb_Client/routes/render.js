/**
 * Created by Parth on 27-11-2016.
 */

function getUserData(request)
{
    var sess = request.session;

    if(sess.isHost == undefined){
        sess.isHost = false;
    }

    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn,
        "firstname" : sess.firstName,
        "userSSN": sess.userSSN,
        "lastName": sess.lastName,
        "userId": sess.userId,
        "isHost": sess.isHost,
        "profileImage":sess.profileImage
    };
    return user_data;
}

exports.renderHomePage = function(req,res){

    res.render('homewithoutlogin',getUserData(req));

};

exports.renderProfilePhotoPage = function(req,res){

    res.render('profile_photo_tab',getUserData(req));

};


exports.addListing = function(request, response){


    response.render("becomehostDescription",getUserData(request));

};

exports.becomeHost = function(request, response){

    response.render("becomeHostMainPage",getUserData(request));

};

/**
 * Created by Salmaan on 11/21/2016.
 */

exports.header = function(request,response){

    response.render("header");
};

exports.modal = function(request,response){

    response.render("modal");
};

exports.home = function(request, response){

    response.render("home");
};

exports.footer = function(request,response){

    response.render("footer");
};

exports.tripPage = function(request, response){

    response.render("profile_yourTrips",getUserData(request));

};
exports.editPropertyPage = function (req, res) {

    res.render('editProperty',getUserData(req));
};
exports.addProperty = function(request, response){

    response.render("becomehostMainPage",getUserData(request));
};

exports.yourListings = function(request, response){

    response.render("profile_activeListings",getUserData(request));
};

exports.test = function(request, response){

    response.render("viewitinerary", {hello:"hello"});
};



exports.itinerary = function(request, response){


    response.render("viewitinerary",getUserData(request));
};

exports.userProfile=function(request,response) {
    response.render("user_profile", getUserData(request));
};

exports.getEditProfilePage = function (req, res) {

    res.render('profile_edit_profile',getUserData(req));
};

exports.accountPage = function (req, res, next) {

    res.render('Account_Transactions', getUserData(req));
};

exports.accountSecurityPage = function (req, res, next) {

    res.render('Account_Security', getUserData(req));
};

exports.accountPaymentMethodPage = function (req, res, next) {

    res.render('Account_Payment_Method', getUserData(req));
};

exports.paymentPage = function (req, res, next) {

    res.render('paymentpage', getUserData(req));
};