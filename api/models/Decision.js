const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
    title: {
        type: String,
        required: true,
    },
    choiceA: {
        type: String,
        required: true,
    },
    choiceB: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    situation: {
        type: String,
    },
    tradeoff: {
        type: String,
    },
    avoidanceCheck: {
        type: String,
    },
    recommendation: {
        type: String, 
    },
    
    recommendedChoice: {
        type: String,
    },
    followUpConversation: [{
            role: { type: String, required: true },
            content: { type: String, required: true }, 
            timestamp: { type: Date, default: Date.now },
    }],
    
}, { timestamps: true });

module.exports = mongoose.model('Decision', decisionSchema);
