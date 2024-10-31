const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(bodyParser.json()); 
app.use(cors());


const RECAPTCHA_SECRET_KEY = '6Ldoy3AqAAAAAH38c1KbvPRHwUc8lMTRP76atOBo';

// POST route to handle reCAPTCHA verification
app.post('127.0.0.1:5501/verify-recaptcha', async (req, res) => {
  console.log("post run")
  const token = req.body.token;
  console.log(req.body)

  try {
    // Send token to Google for verification
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    if (response.data.success && response.data.score > 0.8) {
      res.json({ success: true, message: 'reCAPTCHA verified successfully.' });
    } else {
      res.json({ success: false, message: 'Failed to verify reCAPTCHA.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during reCAPTCHA verification.' });
  }
});

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
