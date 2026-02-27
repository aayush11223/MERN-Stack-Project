const express = require('express');
const app = express();
const enquiryRouter = require('./App/routes/web/enquiryRoutes');
const port = process.env.PORT || 3000;
const cors = require('cors');

// initialize database connection
const db= require('./db');

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount router
app.use('/api/website/enquiry', enquiryRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
