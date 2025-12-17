import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    sessionDate: {
        type: Date,
        default: Date.now
    },
    records: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            default: 'absent'
        },
        markedAt: {
            type: Date
        }
    }],
    startedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
