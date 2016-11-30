var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propertyReviewSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    review: {type: String},
    rating: {type: Number},
    imageUrl: {type: String},
    createdDate: {type: Number}

});

var PropertyReview = mongoose.model('PropertyReview', propertyReviewSchema);
module.exports = PropertyReview;