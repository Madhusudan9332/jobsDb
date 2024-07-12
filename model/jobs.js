const { response } = require("express");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");

const jobSchema = mongoose.Schema({
  title: {
    type: String,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  postedDate: {
    type: Date,
  },
  jobDescription: {
    type: String,
  },
});
const jobModel = mongoose.model("jobs", jobSchema);

const jobScrapper = async (pageNo = 1) => {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`https://www.naukri.com/it-jobs-${pageNo}?src=gnbjobs_homepage_srch`);

  await page.waitForSelector(".styles_job-listing-container__OCfZC");

  const data = await page.evaluate(() => {
    const container = document.querySelector('.styles_job-listing-container__OCfZC');
    const jobElements = container ? Array.from(container.querySelectorAll(".srp-jobtuple-wrapper")) : [];

    return jobElements.map((element) => {
      const title = element.querySelector(".title").innerText;
      const company = element.querySelector(".comp-name").innerText;
      const location = element.querySelector(".locWdth").innerText;
      const postedDateText = element.querySelector(".job-post-day").innerText;
      const jobDescription = element.querySelector(".job-desc").innerText;

      let postedDate = new Date().toDateString();
      if(postedDateText !== 'Just Now'){
        const postedDateArray = postedDateText.split(" ");
        postedDate = postedDate.split(" ");
        postedDate[2] -= postedDateArray[0]
        postedDate = postedDate.join(" ")
      }

      return {
        title,
        company,
        location,
        postedDate,
        jobDescription,
      };
    });
  });
  await browser.close();
  return data;
};

const jobsModel = {
  jobModel,
  jobScrapper,
};

module.exports = jobsModel;
