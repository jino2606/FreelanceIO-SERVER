/* import mongoose */
const mongoose = require('mongoose')

/* Add conndection string */
const connectionString = process.env.DATABASE

/* connect to mongodb using mongoose */
mongoose.connect(connectionString).then((res)=>{
    console.log("Momgo Db Connected Success");
}).catch((err)=>{
    console.log("Failed due to", err);
})