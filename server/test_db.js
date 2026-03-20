require('dotenv').config();
const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
    console.error('No MONGODB_URI found in env');
    process.exit(1);
}

console.log('Connecting to URI starting with:', process.env.MONGODB_URI.substring(0, 20));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('ERROR Connecting to MongoDB:', err.message);
        process.exit(1);
    });
