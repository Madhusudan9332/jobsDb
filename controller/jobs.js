const mongoose = require('mongoose');
const dotenv = require('dotenv')
const jobsModel = require('../model/jobs')


dotenv.config()
const jobs = async (req,res)=>{
    const data = await jobsModel.jobScrapper()
    res.json({
        status: 'success',
        results : data || "No data found"
    })
}


const jobController = {
    jobs
}

module.exports = jobController
