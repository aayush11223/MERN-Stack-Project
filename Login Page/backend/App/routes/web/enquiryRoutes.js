const express = require('express');
const { enquiryInsert, getEnquiryList, enquiryDelete, enquiryUpdate } = require('../../controller/web/enquiryController');

const enquiryRouter = express.Router();

// Route calls controller
enquiryRouter.post('/insert', enquiryInsert);
enquiryRouter.get('/view', getEnquiryList);
enquiryRouter.delete('/delete/:id', enquiryDelete);
enquiryRouter.put('/update/:id', enquiryUpdate);

module.exports = enquiryRouter;
