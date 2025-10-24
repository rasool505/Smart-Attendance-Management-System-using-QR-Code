import mongoose from "mongoose";
import Joi from "joi";

const subjectSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true,
    },
    instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
    stage: {
    type: String,
    required: true
    },
    department: {
    type: String,
    required: true
    }
}, { timestamps: true });

// subjectSchema.pre("save", function (next) {
//     if (!this.code) {
//     const shortDept = this.department.substring(0, 3).toUpperCase();
//     const rand = Math.floor(1000 + Math.random() * 9000);
//     this.code = `${shortDept}-${rand}`;
//     }
//     next();
// });


export function validateSubject(obj) {
const schema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    instructor: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    stage: Joi.string().trim().required(),
    department: Joi.string().trim().required()
});

return schema.validate(obj);
}

export default mongoose.model("Subject", subjectSchema);