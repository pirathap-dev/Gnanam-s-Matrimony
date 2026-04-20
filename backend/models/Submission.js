const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  religion: { type: String, required: true },
  caste: { type: String, required: true },
  location: { type: String, required: true },
  
  education: { type: String, required: true },
  job: { type: String, required: true },
  familyDetails: { type: String, required: true },
  description: { type: String, required: true },
  
  preferences: {
    ageRange: { type: String, required: true },
    religion: { type: String, required: true },
    location: { type: String, required: true }
  },
  
  profileImageUrl: { type: String, required: true },
  horoscopeFileUrl: { type: String, required: true },
  
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  
  status: { type: String, enum: ['new', 'contacted', 'matched'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
