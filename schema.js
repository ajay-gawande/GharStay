const Joi =require("joi");  // validations
const Listing = require("./models/listing"); 

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        description:Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().uri().allow("", null)
        }).optional(),
          geometry: Joi.object({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array()
                .items(Joi.number().required())
                .length(2)
                .required()
        }).required()
    
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
});