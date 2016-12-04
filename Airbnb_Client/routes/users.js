
var mq_client = require("../rpc/client.js");
exports.getUserProfile=function(request,response) {
  var userId = request.params.userId;
  console.log(userId);
  var msg_payload =
  {
    userId: userId
  };
  mq_client.make_request('getUserProfile_queue', msg_payload, function (err, result) {

    if (err) {
      console.log(err);
    }
    else
    {
      console.log(result);
      response.send({user:result});
    }

  });
};

exports.getUserReview=function(request,response)
{
  var userId = request.params.userId;
  var msg_payload =
  {
    userId: userId
  }
  mq_client.make_request('getUserReview_queue', msg_payload, function (err, result) {

    if (err) {
      console.log(err);
    }
    else
    {
      response.send({userReview:result});
    }

  });
}

exports.getHostReview=function(request,response)
{
  var hostId = request.params.hostId;
  var msg_payload =
  {
    hostId: hostId
  }
  mq_client.make_request('getHostReview_queue', msg_payload, function (err, result) {

    if (err) {
      console.log(err);
    }
    else
    {
      response.send({hostReview:result});
    }

  });
}


exports.addUserReview=function(request,response)
{
  var msg_payload=
  {
    userId:request.body.userId,
    hostId:request.session.userId,
    review:request.body.review,
    rating:request.body.rating,
    image:request.body.image,
    createdDate:Date.now()
  }

  mq_client.make_request('addUserReview_queue', msg_payload, function (err, result) {

    if (err)
    {
      console.log(err);
      response.send({statusCode:401});
    }
    else
    {
      response.send({statusCode:200});
    }

  });
}


exports.addHostReview=function(request,response)
{
  var msg_payload=
  {
    userId:request.session.userId,
    hostId:request.body.hostId,
    review:request.body.review,
    rating:request.body.rating,
    imageUrl:request.body.image,
    createdDate:Date.now()
  }

  mq_client.make_request('addHostReview_queue', msg_payload, function (err, result) {

    if (err)
    {
      console.log(err);
      response.send({statusCode:401});
    }
    else
    {
      response.send({statusCode:200});
    }

  });
}