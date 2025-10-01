import React from 'react'
import { Box, Grid, Card, CardContent, Avatar, Typography, Button, Chip, Divider, Stack, IconButton, LinearProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import StarIcon from '@mui/icons-material/Star'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

function Profile() {
  return (
    <Box sx={{ p: 3, color: '#e5e7eb' }}>
      {/* Header Card */}
      <Card sx={{
        mb: 3,
        overflow: 'hidden',
        bgcolor: 'transparent',
        border: '1px solid rgba(148,163,184,0.15)'
      }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
          height: 140
        }} />
        <CardContent sx={{ pt: 0 }}>
          <Stack direction="row" spacing={2} alignItems="end" sx={{ mt: -8 }}>
            <Avatar
              src="/avatar.png"
              sx={{ width: 96, height: 96, border: '4px solid #0b0b0b' }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  Consultant Name
                </Typography>
                <Chip icon={<WorkOutlineIcon />} label="Consultant" size="small" sx={{ bgcolor: '#0ea5e9', color: 'white' }} />
                <Chip icon={<StarIcon />} label="4.9" size="small" sx={{ bgcolor: '#22c55e', color: 'white' }} />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 1, color: '#94a3b8' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">Remote • Worldwide</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">consultant@example.com</Typography>
                </Stack>
              </Stack>
            </Box>
            <Button variant="contained" startIcon={<EditIcon />} sx={{ textTransform: 'none', bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}>
              Edit Profile
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Stats Cards */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                      <Typography variant="overline" sx={{ color: '#94a3b8' }}>Clients</Typography>
                      <Typography variant="h5" sx={{ color: '#f1f5f9', fontWeight: 700 }}>128</Typography>
                    </Stack>
                    <PeopleAltIcon sx={{ color: '#38bdf8' }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                      <Typography variant="overline" sx={{ color: '#94a3b8' }}>Sessions</Typography>
                      <Typography variant="h5" sx={{ color: '#f1f5f9', fontWeight: 700 }}>342</Typography>
                    </Stack>
                    <EventAvailableIcon sx={{ color: '#a78bfa' }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                      <Typography variant="overline" sx={{ color: '#94a3b8' }}>Rating</Typography>
                      <Typography variant="h5" sx={{ color: '#f1f5f9', fontWeight: 700 }}>4.9</Typography>
                    </Stack>
                    <StarIcon sx={{ color: '#fbbf24' }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* About */}
          <Card sx={{ mt: 3, bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>About</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                Experienced consultant specializing in strategy, product, and team enablement. I help
                teams ship faster with clarity, clean execution, and measurable outcomes.
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(148,163,184,0.15)' }} />
              <Typography variant="overline" sx={{ color: '#94a3b8' }}>Skills</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {['Agile Coaching', 'Product Strategy', 'User Research', 'Roadmapping', 'OKRs', 'Stakeholder Mgmt'].map((skill) => (
                  <Chip key={skill} label={skill} sx={{ bgcolor: 'rgba(148,163,184,0.12)', color: '#e5e7eb' }} />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ mt: 3, bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 2 }}>Recent Activity</Typography>
              <Stack spacing={2}>
                {[
                  { title: 'Completed session with Jane Cooper', time: '2h ago' },
                  { title: 'Reviewed Q4 roadmap with ACME', time: '1d ago' },
                  { title: 'New client onboarding: NovaTech', time: '3d ago' },
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <Typography variant="body2">{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{item.time}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Contact */}
          <Card sx={{ mb: 3, bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 2 }}>Contact</Typography>
              <Stack spacing={1.5} sx={{ color: '#cbd5e1' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  <Typography variant="body2">consultant@example.com</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  <Typography variant="body2">+1 (555) 012-3456</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  <Typography variant="body2">San Francisco, CA</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card sx={{ mb: 3, bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>Availability</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>This week</Typography>
              <LinearProgress variant="determinate" value={72} sx={{ mt: 1.5, height: 8, borderRadius: 2, bgcolor: 'rgba(148,163,184,0.12)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block' }}>72% booked</Typography>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card sx={{ bgcolor: '#0b0b0b', border: '1px solid rgba(148,163,184,0.15)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>Specialties</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['SaaS', 'FinTech', 'Go-to-Market', 'Design Systems', 'Data'].map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(148,163,184,0.12)', color: '#e5e7eb' }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile