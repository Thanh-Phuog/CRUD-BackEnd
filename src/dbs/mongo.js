require("dotenv").config();
const mongoose = require("mongoose");

class Mongo {
  constructor() {
    this.connect();
  }

  connect() {
    const env = process.env.NODE_ENV;
    console.log(env);
    let URI = "";
    if (env === "dev") {
      URI = process.env.MONGO_URI_DEV;
    } else if (env === "qc") {
      URI = process.env.MONGO_URI_QC;
    }
    console.log("URI:", URI);
    mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}
module.exports = new Mongo();
