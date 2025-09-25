// routes/marketing.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Customer = require('../models/Customer');
const MarketingCampaign = require('../models/MarketingCampaign');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/marketing/campaign - Create a new marketing campaign
router.post('/campaign', upload.single('image'), async (req, res) => {
  try {
    const { message, campaignName } = req.body;
    
    if (!message || !campaignName) {
      return res.status(400).json({ 
        message: 'Campaign name and message are required.' 
      });
    }

    let imageUrl = null;
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'marketing_campaigns'
      });
      
      imageUrl = uploadResponse.secure_url;
    }

    // Create campaign in database
    const campaign = new MarketingCampaign({
      name: campaignName,
      message,
      imageUrl,
      sent: false
    });

    await campaign.save();

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });

  } catch (err) {
    console.error('❌ Error creating marketing campaign:', err);
    res.status(500).json({ 
      message: 'Server error while creating marketing campaign.' 
    });
  }
});

// POST /api/marketing/send/:campaignId - Send campaign to all customers
router.post('/send/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    // Find the campaign
    const campaign = await MarketingCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ 
        message: 'Marketing campaign not found.' 
      });
    }

    // Get all customer phone numbers
    const customers = await Customer.find({}, 'contact');
    const phoneNumbers = customers.map(customer => customer.contact);
    
    // In a real implementation, you would integrate with a WhatsApp API here
    // Example using axios to call a WhatsApp API:

    try {
      const response = await axios.post('https://api.whatsapp.com/send', {
        numbers: phoneNumbers,
        message: campaign.message,
        image: campaign.imageUrl
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        }
      });
      
      console.log('WhatsApp API response:', response.data);
    } catch (error) {
      console.error('Error calling WhatsApp API:', error);
      return res.status(500).json({ 
        message: 'Failed to send via WhatsApp API' 
      });
    }
    
    
    // For now, we'll simulate the sending process
    console.log(`Sending campaign "${campaign.name}" to ${phoneNumbers.length} numbers`);
    
    // Update campaign status
    campaign.sent = true;
    campaign.sentAt = new Date();
    campaign.recipientCount = phoneNumbers.length;
    await campaign.save();
    
    res.status(200).json({
      message: `Campaign sent successfully to ${phoneNumbers.length} customers`,
      recipientCount: phoneNumbers.length
    });

  } catch (err) {
    console.error('❌ Error sending marketing campaign:', err);
    res.status(500).json({ 
      message: 'Server error while sending marketing campaign.' 
    });
  }
});

// GET /api/marketing/campaigns - Get all marketing campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await MarketingCampaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('❌ Error fetching marketing campaigns:', err);
    res.status(500).json({ 
      message: 'Server error while fetching marketing campaigns.' 
    });
  }
});

module.exports = router;