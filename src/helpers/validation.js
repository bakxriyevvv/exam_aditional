import Joi from "joi";

export const userValidator = Joi.object({
    email: Joi.string().email().trim().required(),
    username: Joi.string().min(6).max(20).trim().required(),
    password: Joi.string().min(8).max(20).alphanum().trim().required(),
});