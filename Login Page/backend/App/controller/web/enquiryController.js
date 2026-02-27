const enquiryModel = require('../../models/enquiry.model');
// alias this model as Enquiry for clarity
const Enquiry = require('../../models/enquiry.model');

// Controller function: just handles the request
const enquiryInsert = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const enquiry = new Enquiry({ name, email, phone, message });
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

let getEnquiryList = async (req, res) => {
  enquiryModel.find()
    .then((enquiry) => {
      // return a consistent property name expected by the frontend
      res.send({ status: 1, enquiryList: enquiry });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

let enquiryDelete = async (req, res) => {
  try {
    let enId = req.params.id;
    let enquiry = await enquiryModel.deleteOne({ _id: enId });

    if (enquiry.deletedCount === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    // ✅ Send success response back
    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

let enquiryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    const enquiry = await enquiryModel.findByIdAndUpdate(
      id,
      { name, email, phone, message },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.status(200).json({ message: 'Enquiry updated successfully', enquiry });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { enquiryInsert, getEnquiryList, enquiryDelete, enquiryUpdate };
