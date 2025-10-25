import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
    },
    date: {
    type: Date,
    default: Date.now
    },
    students: [
    {
        student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        },
        status: {
        type: String,
        enum: ["present", "leave","absent"],
        default: "absent"
        },
    },
    ],
}, { timestamps: true });


export function validateSubject(obj) {
const schema = Joi.object({
    subject: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    students: Joi.array().items(
    Joi.object({
    student: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    status: Joi.valid("present", "leave").default("present").required(),
    })
    ).min(1).required(),
});

return schema.validate(obj);
}


export default mongoose.model("Attendance", attendanceSchema);