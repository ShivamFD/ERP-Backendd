const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
employeeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
createdAt: { type: Date, default: Date.now }
});



userSchema.methods.comparePassword = async function (candidate) {
return bcrypt.compare(candidate, this.password);
};


module.exports = mongoose.model('User', userSchema);