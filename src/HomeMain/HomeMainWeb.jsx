import React, { useContext } from 'react'
import { Fragment } from 'react'
import Navbar from '../components/Navbar'
import AnimatedHero from '../components/AnimatedHero'
import {
  Box,
  Typography,
  Button,
  Stack,

  Chip,

} from '@mui/material'
import AstrologerCard from '../components/AstrologerCard'
import PhoneIcon from '@mui/icons-material/Phone'
import VerifiedIcon from '@mui/icons-material/Verified'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { allUserDetailsContext } from '../DashbordComponents/ApiContext/ApiContextUserData'



function HomeMainWeb() {
  const { allConsultant } = useContext(allUserDetailsContext)
console.log("allConsultant", allConsultant)
  return (
    <Fragment>
      <div>
        <Navbar />
        {/* <AnimatedHero> */}
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
              `,
            zIndex: 0
          }} />

          <Box sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            mx: 'auto',
            px: 3,
            textAlign: 'center'
          }}>
            {/* Main Hero Content */}
            <Stack spacing={4} alignItems="center">
              {/* Badge */}
              <Chip
                icon={<VerifiedIcon />}
                label="Trusted by 50,000+ Clients"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: '600',
                  px: 2,
                  py: 1
                }}
              />

              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '3rem' },
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #10b981 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                  mb: 2
                }}
              >
                Connect with Expert
                <br />
                <span style={{ color: '#10b981' }}>Consultants</span>
              </Typography>

              {/* Subheading */}
              <Typography
                variant="h5"
                sx={{
                  color: '#94a3b8',
                  maxWidth: '600px',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1rem' }
                }}
              >
                Get instant guidance from verified astrologers, numerologists, and spiritual advisors.
                Your journey to clarity starts here.
              </Typography>

              {/* Stats */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={4}
                sx={{ mt: 4 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#10b981', fontWeight: '700', fontSize: { xs: '1.1rem', md: '2rem' } }}>
                    50K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', }}>
                    Happy Clients
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: '700', fontSize: { xs: '1.1rem', md: '2rem' } }}>
                    4.9★
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Average Rating
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: '700', fontSize: { xs: '1.1rem', md: '2rem' } }}>
                    24/7
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Available
                  </Typography>
                </Box>
              </Stack>


              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    px: 4,
                    py: 1,
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={<PhoneIcon />}
                >
                  Start Consultation
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: '#f8fafc',
                    px: 4,
                    py: 1,
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Learn More
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>


        <Box sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              my: 5,
            }}
          >
            <Typography sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
            }}
            >
              Explore our Expertise
            </Typography>
            <Typography sx={{
              color: "gray",
              fontSize: "md",
            }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </Typography>

          </Box>

          {
            allConsultant ?

              <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mt: 3,
                width: "100%",
                px: 10,


              }}>

                {

                  allConsultant?.map((data, index) => (
                    <AstrologerCard
                      id={data?._id}
                      key={index}
                      photo={data?.photo}
                      name={data?.fullname}
                      specialization={data?.profession}
                      rating={data?.rating}
                      experience={data?.experience}
                      orders={data?.orders}
                      price={data?.fees}
                      discount={data?.fees}
                      language={data?.language}
                      consultantStatus={data?.isActive}

                    />
                  ))
                }

              </Box>
              :
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}>
                <Typography sx={{ color: "white" }}>No consultant found</Typography>
              </Box>
          }
        </Box>
      </div>
    </Fragment>
  )
}

export default HomeMainWeb