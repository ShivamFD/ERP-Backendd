

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation: { type: String },
  salary: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  profileImage: { type: String },

  // Salary Structure with better defaults
  salaryStructure: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    totalCTC: { type: Number, default: 0 }
  },
  
  // Bank Details
  bankDetails: {
    accountNumber: { type: String, default: '' },
    bankName: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    branch: { type: String, default: '' }
  },
  
  
  // PF & ESI Details
  pfNumber: { type: String, default: '' },
  esiNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },

  // Leave balances
  leaveBalances: {
    casualLeave: { type: Number, default: 12 },
    sickLeave: { type: Number, default: 7 },
    earnedLeave: { type: Number, default: 15 }
  },
  
  // Work schedule
  workSchedule: {
    startTime: { type: String, default: '10:00' },
    endTime: { type: String, default: '19:00' },
    weekOff: { type: String, enum: ['sunday', 'monday', 'saturday'], default: 'sunday' }
  }
}, {
  timestamps: true
});

// ✅ ENHANCED: Better pre-save middleware for salary structure
employeeSchema.pre('save', function(next) {
  // If salary is set but salary structure is empty or basic is 0, auto-calculate
  if (this.salary > 0 && (!this.salaryStructure || this.salaryStructure.basic === 0)) {
    this.calculateAndSetSalaryStructure();
  }
  next();
});

// ✅ ADD: Method to calculate salary structure
employeeSchema.methods.calculateAndSetSalaryStructure = function() {
  const basic = Math.round(this.salary * 0.5); // 50% basic
  const hra = Math.round(basic * 0.4); // 40% of basic
  const da = Math.round(basic * 0.2);  // 20% of basic
  const conveyance = 1600; // Fixed
  const medical = 1250;   // Fixed
  const specialAllowance = this.salary - (basic + hra + da + conveyance + medical);
  
  this.salaryStructure = {
    basic: Math.max(0, basic),
    hra: Math.max(0, hra),
    da: Math.max(0, da),
    conveyance: Math.max(0, conveyance),
    medical: Math.max(0, medical),
    specialAllowance: Math.max(0, specialAllowance),
    totalCTC: this.salary
  };
};

// ✅ ADD: Virtual to check if salary structure is defined
employeeSchema.virtual('hasSalaryStructure').get(function() {
  return this.salaryStructure && this.salaryStructure.basic > 0;
});

module.exports = mongoose.model('Employee', employeeSchema);