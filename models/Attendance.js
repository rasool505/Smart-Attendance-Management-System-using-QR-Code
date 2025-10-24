import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
    },
    date: {
    type: Date,
    default: Date.now
    },
    status: {
    type: String,
    enum: ["present", "absent", "late"],
    default: "present"
    },
}, { timestamps: true });


export function validateSubject(obj) {
const schema = Joi.object({
    student: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    subject: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    status: Joi.valid("present", "absent", "late").default("present").required(),
});

return schema.validate(obj);
}


export default mongoose.model("Attendance", attendanceSchema);