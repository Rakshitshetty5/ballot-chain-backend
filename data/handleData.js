const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Voter = require('../models/voterDetails.model');

dotenv.config({ path: './config.env' });

mongoose
  .connect("mongodb://localhost/ballotchain", {

  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const  VOTER_DETAILS  = require('./voter')
 

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Voter.create(VOTER_DETAILS);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Voter.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}