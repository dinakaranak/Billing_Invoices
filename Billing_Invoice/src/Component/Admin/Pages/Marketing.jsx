import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CardActions,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  CloudUpload,
  Send,
  Campaign,
  History,
  Close,
  Analytics,
  Schedule,
  Edit,
  Delete,
  AddPhotoAlternate
} from '@mui/icons-material';
import api from '../../../service/api';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`campaign-tabpanel-${index}`}
      aria-labelledby={`campaign-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Marketing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [campaigns, setCampaigns] = useState([]);
  const [sending, setSending] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [campaignToSchedule, setCampaignToSchedule] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [segment, setSegment] = useState('all');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size exceeds 5MB limit',
          severity: 'error'
        });
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim() || !message.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide both a campaign name and message',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('campaignName', campaignName);
    formData.append('message', message);
    formData.append('segment', segment);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await api.post('/marketing/campaign', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbar({
        open: true,
        message: 'Campaign created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setCampaignName('');
      setMessage('');
      setImage(null);
      setPreviewUrl('');
      setSegment('all');
      
      // Refresh campaigns list
      fetchCampaigns();
      setTabValue(1); // Switch to campaigns tab
    } catch (error) {
      console.error('Error creating campaign:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create campaign',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/marketing/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch campaigns',
        severity: 'error'
      });
    }
  };

  const handleSendCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to send this campaign to all customers?')) {
      return;
    }

    setSending(true);
    try {
      const response = await api.post(`/marketing/send/${campaignId}`);
      setSnackbar({
        open: true,
        message: `Campaign sent to ${response.data.recipientCount} customers!`,
        severity: 'success'
      });
      
      // Refresh campaigns list to update status
      fetchCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send campaign',
        severity: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCampaign = (campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    try {
      await api.delete(`/marketing/campaign/${campaignToDelete._id}`);
      setSnackbar({
        open: true,
        message: 'Campaign deleted successfully',
        severity: 'success'
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete campaign',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleScheduleCampaign = (campaign) => {
    setCampaignToSchedule(campaign);
    setScheduledDate('');
    setScheduledTime('12:00');
    setScheduleDialogOpen(true);
  };

  const confirmScheduleCampaign = async () => {
    try {
      const datetime = `${scheduledDate}T${scheduledTime}:00`;
      await api.post(`/marketing/schedule/${campaignToSchedule._id}`, { scheduledAt: datetime });
      setSnackbar({
        open: true,
        message: 'Campaign scheduled successfully',
        severity: 'success'
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      setSnackbar({
        open: true,
        message: 'Failed to schedule campaign',
        severity: 'error'
      });
    } finally {
      setScheduleDialogOpen(false);
      setCampaignToSchedule(null);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate stats for dashboard
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.sent).length;
  const scheduledCampaigns = campaigns.filter(c => c.scheduledAt && !c.sent).length;
  const totalRecipients = campaigns.reduce((sum, campaign) => sum + (campaign.recipientCount || 0), 0);

  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: 0,
            width: 60,
            height: 4,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 2
          }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            fontWeight="600"
            color="primary"
          >
            Marketing Campaigns
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Create and manage marketing campaigns to send to your customers
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalCampaigns}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Campaigns
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {sentCampaigns}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sent
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {scheduledCampaigns}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Scheduled
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {totalRecipients}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Recipients
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { 
                py: 2,
                fontWeight: 500,
                fontSize: isMobile ? '0.8rem' : '1rem'
              }
            }}
          >
            <Tab icon={<Campaign />} iconPosition="start" label="Create Campaign" />
            <Tab icon={<History />} iconPosition="start" label="Campaign History" />
            {/* <Tab icon={<Analytics />} iconPosition="start" label="Analytics" disabled />
             */}
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12} md={7}>
                <Paper sx={{ 
                  borderRadius: 3,
                  p: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                  background: 'white'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Campaign color="primary" sx={{ mr: 1 }} />
                    <Typography variant={isMobile ? "h6" : "h5"} fontWeight="500">
                      Create New Campaign
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Campaign Name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    margin="normal"
                    required
                    size={isMobile ? "small" : "medium"}
                  />
                  
                  <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
                    <InputLabel>Customer Segment</InputLabel>
                    <Select
                      value={segment}
                      label="Customer Segment"
                      onChange={(e) => setSegment(e.target.value)}
                    >
                      <MenuItem value="all">All Customers</MenuItem>
                      <MenuItem value="new">New Customers (last 30 days)</MenuItem>
                      <MenuItem value="active">Active Customers</MenuItem>
                      <MenuItem value="inactive">Inactive Customers</MenuItem>
                      <MenuItem value="premium">Premium Customers</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    multiline
                    rows={isMobile ? 3 : 4}
                    required
                    placeholder="Type your marketing message here..."
                    size={isMobile ? "small" : "medium"}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${message.length}/500 characters`}
                  />
                  
                  <Box sx={{
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    my: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {previewUrl ? (
                          <>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                              <Box
                                component="img"
                                src={previewUrl}
                                alt="Preview"
                                sx={{ 
                                  borderRadius: 2,
                                  height: isMobile ? 120 : 150,
                                  width: 'auto',
                                  maxWidth: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: -10, 
                                  right: -10, 
                                  backgroundColor: 'error.main',
                                  color: 'white',
                                  '&:hover': { backgroundColor: 'error.dark' }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImage(null);
                                  setPreviewUrl('');
                                }}
                              >
                                <Close />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                              Click to change image
                            </Typography>
                          </>
                        ) : (
                          <>
                            <CloudUpload color="primary" sx={{ fontSize: isMobile ? 32 : 40, mb: 1 }} />
                            <Typography variant="body2" color="primary">
                              Upload Campaign Image
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                              PNG, JPG or JPEG (max 5MB)
                            </Typography>
                          </>
                        )}
                      </Box>
                    </label>
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateCampaign}
                    disabled={loading}
                    fullWidth
                    size={isMobile ? "medium" : "large"}
                    sx={{ 
                      py: isMobile ? 1 : 1.5,
                      borderRadius: 2,
                      fontWeight: '600',
                      mt: 2
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Campaign'}
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Paper sx={{ 
                  borderRadius: 3,
                  p: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                  background: 'white',
                  height: '100%'
                }}>
                  <Typography variant="h6" fontWeight="500" gutterBottom>
                    Preview
                  </Typography>
                  
                  {(!campaignName && !message && !previewUrl) ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: 300,
                      border: `2px dashed ${alpha(theme.palette.text.disabled, 0.3)}`,
                      borderRadius: 2
                    }}>
                      <AddPhotoAlternate sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="textSecondary" align="center">
                        Campaign preview will appear here
                      </Typography>
                    </Box>
                  ) : (
                    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
                      {previewUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={previewUrl}
                          alt="Campaign preview"
                        />
                      )}
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {campaignName || '[Campaign Name]'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message || '[Your message will appear here]'}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Chip 
                          label={segment === 'all' ? 'All Customers' : segment} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Typography variant="caption" color="textSecondary">
                          Preview
                        </Typography>
                      </CardActions>
                    </Card>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Paper sx={{ 
              borderRadius: 3,
              p: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              background: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <History color="primary" sx={{ mr: 1 }} />
                  <Typography variant={isMobile ? "h6" : "h5"} fontWeight="500">
                    Campaign History
                  </Typography>
                </Box>
                <Chip 
                  label={`${sentCampaigns}/${totalCampaigns} sent`} 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
              
              {campaigns.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Campaign sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="textSecondary">
                    No campaigns created yet.
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Create your first campaign to get started!
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {campaigns.map((campaign) => (
                    <Grid item xs={12} key={campaign._id}>
                      <Card sx={{ 
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                          {campaign.imageUrl && (
                            <CardMedia
                              component="img"
                              sx={{ 
                                width: isMobile ? '100%' : 200, 
                                height: isMobile ? 160 : 180,
                                objectFit: 'cover' 
                              }}
                              image={campaign.imageUrl}
                              alt={campaign.name}
                            />
                          )}
                          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 0, mr: 1 }}>
                                  {campaign.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {campaign.sent ? (
                                    <Chip 
                                      label="Sent" 
                                      size="small" 
                                      color="success" 
                                      variant="outlined" 
                                    />
                                  ) : campaign.scheduledAt ? (
                                    <Chip 
                                      label="Scheduled" 
                                      size="small" 
                                      color="warning" 
                                      variant="outlined" 
                                    />
                                  ) : (
                                    <Chip 
                                      label="Draft" 
                                      size="small" 
                                      color="default" 
                                      variant="outlined" 
                                    />
                                  )}
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {campaign.message}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                <Chip 
                                  label={campaign.segment || 'All Customers'} 
                                  size="small" 
                                  variant="outlined" 
                                />
                                {campaign.recipientCount && (
                                  <Chip 
                                    label={`${campaign.recipientCount} recipients`} 
                                    size="small" 
                                    variant="outlined" 
                                    color="info" 
                                  />
                                )}
                              </Box>
                              
                              <Typography variant="caption" color="textSecondary">
                                Created: {new Date(campaign.createdAt).toLocaleString()}
                              </Typography>
                              {campaign.scheduledAt && !campaign.sent && (
                                <Typography variant="caption" color="warning.main" display="block">
                                  Scheduled for: {new Date(campaign.scheduledAt).toLocaleString()}
                                </Typography>
                              )}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                              {!campaign.sent && (
                                <>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleSendCampaign(campaign._id)}
                                    disabled={sending}
                                    startIcon={<Send />}
                                    variant="contained"
                                  >
                                    Send Now
                                  </Button>
                                  <Button
                                    size="small"
                                    color="inherit"
                                    onClick={() => handleScheduleCampaign(campaign)}
                                    startIcon={<Schedule />}
                                  >
                                    Schedule
                                  </Button>
                                </>
                              )}
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDeleteCampaign(campaign)}
                              >
                                <Delete />
                              </IconButton>
                            </CardActions>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </TabPanel>
        </Paper>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Campaign</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the campaign "{campaignToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteCampaign} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Schedule Campaign Dialog */}
        <Dialog
          open={scheduleDialogOpen}
          onClose={() => setScheduleDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule Campaign</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Schedule the campaign "{campaignToSchedule?.name}" for later delivery.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmScheduleCampaign} 
              color="primary" 
              variant="contained"
              disabled={!scheduledDate}
            >
              Schedule
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Marketing;