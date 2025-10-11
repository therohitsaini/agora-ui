import React, { useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Avatar,
    Chip,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import {
    CardGiftcard,
    ShoppingCart,
    Close,
    CheckCircle
} from '@mui/icons-material'

// Gift data matching the image
const giftData = [
    {
        id: 1,
        name: 'Flowers',
        price: 10.00,
        image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=150&h=150&fit=crop&crop=center',
        category: 'nature'
    },
    {
        id: 2,
        name: 'chocolates',
        price: 20.00,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop&crop=center',
        category: 'food'
    },
    {
        id: 3,
        name: 'Bouquet',
        price: 30.00,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=center',
        category: 'nature'
    },
    {
        id: 4,
        name: 'Daily Dairy',
        price: 50.00,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=150&fit=crop&crop=center',
        category: 'stationery'
    },
    {
        id: 5,
        name: 'Champion',
        price: 100.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop&crop=center',
        category: 'achievement'
    },
    {
        id: 6,
        name: 'Ganesha',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop&crop=center',
        category: 'spiritual'
    },
    {
        id: 7,
        name: 'Coffee cheers',
        price: 200.00,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&crop=center',
        category: 'beverage'
    },
    {
        id: 8,
        name: 'Golden Pot',
        price: 250.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop&crop=center',
        category: 'decorative'
    },
    {
        id: 9,
        name: 'Success',
        price: 300.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop&crop=center',
        category: 'achievement'
    },
    {
        id: 10,
        name: 'Happy Birthday',
        price: 350.00,
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=150&h=150&fit=crop&crop=center',
        category: 'celebration'
    },
    {
        id: 11,
        name: 'Gold Royalty',
        price: 450.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop&crop=center',
        category: 'luxury'
    },
    {
        id: 12,
        name: 'Power of pen',
        price: 500.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop&crop=center',
        category: 'stationery'
    },
    {
        id: 13,
        name: 'Great Time',
        price: 1000.00,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop&crop=center',
        category: 'electronics'
    },
    {
        id: 14,
        name: 'Earphone',
        price: 2000.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&crop=center',
        category: 'electronics'
    },
    {
        id: 15,
        name: 'Appreciation',
        price: 20000.00,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop&crop=center',
        category: 'electronics'
    },
    {
        id: 16,
        name: 'Inspiration',
        price: 45000.00,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop&crop=center',
        category: 'electronics'
    }
]

function SendGift() {
    const [selectedGifts, setSelectedGifts] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)

    const handleGiftSelect = (gift) => {
        const isSelected = selectedGifts.find(item => item.id === gift.id)
        if (isSelected) {
            // Remove from selection
            const updated = selectedGifts.filter(item => item.id !== gift.id)
            setSelectedGifts(updated)
            setTotalAmount(updated.reduce((sum, item) => sum + item.price, 0))
        } else {
            // Add to selection
            const updated = [...selectedGifts, gift]
            setSelectedGifts(updated)
            setTotalAmount(updated.reduce((sum, item) => sum + item.price, 0))
        }
    }

    const handleSendGift = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setSelectedGifts([])
        setTotalAmount(0)
    }

    return (
        <Box sx={{
            minHeight: '100%',
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
            // background:'white',
         
            width: '100%'
        }}>
            <Paper sx={{
                maxWidth: '100%',
                mx: 'auto',
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Typography variant="" sx={{
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <CardGiftcard sx={{ color: '#3b82f6' }} />
                        Send a Gift
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Typography variant="h5" sx={{
                            fontWeight: 600,
                            color: 'white'
                        }}>
                            ₹{totalAmount.toFixed(2)}
                        </Typography>

                        {selectedGifts.length > 0 && (
                            <Button
                                variant="contained"
                                startIcon={<ShoppingCart />}
                                onClick={handleSendGift}
                                sx={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
                                    }
                                }}
                            >
                                Send Gift ({selectedGifts.length})
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Gift Grid */}
                <Grid container spacing={2}>
                    {giftData.map((gift) => {
                        const isSelected = selectedGifts.find(item => item.id === gift.id)
                        return (
                            <Grid item xs={6} sm={4} md={3} key={gift.id}>
                                <Card
                                    sx={{

                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                       
                                        // border: isSelected ? '3px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        width: '140px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                            background: 'rgba(255, 255, 255, 0.08)'
                                        }
                                    }}
                                    onClick={() => handleGiftSelect(gift)}
                                >
                                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                        {/* Gift Image */}
                                        <Box sx={{
                                            position: 'relative',
                                            mb: 2,
                                            
                                        }}>
                                            <Avatar
                                                src={gift.image}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    mx: 'auto',
                                                    border: '2px solid #f8f9fa'
                                                }}
                                            />
                                            {isSelected && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: -5,
                                                    right: -5,
                                                    background: '#3b82f6',
                                                    borderRadius: '50%',
                                                    width: 24,
                                                    height: 24,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <CheckCircle sx={{ color: 'white', fontSize: 16 }} />
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Gift Name */}
                                        <Typography variant="subtitle1" sx={{
                                            fontWeight: 600,
                                            color: 'white',
                                            mb: 1,
                                            fontSize: '0.9rem'
                                        }}>
                                            {gift.name}
                                        </Typography>

                                        {/* Price */}
                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: '#3b82f6',
                                            fontSize: '1.1rem'
                                        }}>
                                            ₹ {gift.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>

                {/* Selected Gifts Summary */}
                {selectedGifts.length > 0 && (
                    <Box sx={{
                        mt: 4,
                        p: 3,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: 2,
                        color: 'white'
                    }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Selected Gifts ({selectedGifts.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedGifts.map((gift) => (
                                <Chip
                                    key={gift.id}
                                    label={`${gift.name} - ₹${gift.price}`}
                                    onDelete={() => handleGiftSelect(gift)}
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'white'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'white',
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
                }}>
                    <CardGiftcard sx={{ color: '#3b82f6' }} />
                    Gift Sent Successfully!
                </DialogTitle>
                <DialogContent sx={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                    color: 'white'
                }}>
                    <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
                        Your gift has been sent successfully! The recipient will receive:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedGifts.map((gift) => (
                            <Box key={gift.id} sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1,
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 1
                            }}>
                                <Typography variant="body2" sx={{ color: 'white' }}>{gift.name}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                    ₹{gift.price}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <Typography variant="h6" sx={{
                        mt: 2,
                        textAlign: 'center',
                        fontWeight: 700,
                        color: '#3b82f6'
                    }}>
                        Total: ₹{totalAmount.toFixed(2)}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
                }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SendGift