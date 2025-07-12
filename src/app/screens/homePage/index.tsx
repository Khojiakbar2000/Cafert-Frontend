import React, { useEffect, useState, useRef } from "react";
import { Container, Box, Typography, Card, CardContent, Button } from "@mui/material";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import "../../../css/home.css"
import VerticalMovingBasket from "../../../mui-coffee/components/VerticalMovingBasket";

export default function HomePage() {
    const [popularDishes, setPopularDishes] = useState<Product[]>([]);
    const [newDishes, setNewDishes] = useState<Product[]>([]);
    const [topUsers, setTopUsers] = useState<Member[]>([]);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        // Backend server data fetch => Data
        const product = new ProductService();
        product
            .getProducts({
                page: 1,
                limit: 4,
                order: "productViews",
                productCollection: ProductCollection.DISH
            })
            .then(data => {
                setPopularDishes(data);
            })
            .catch(err => console.log(err));

        product.getProducts({
            page: 1,
            limit: 4,
            order: "createdAt",
            productCollection: ProductCollection.DISH
        })
            .then(data => {
                setNewDishes(data);
            })
            .catch(err => console.log(err));

        const member = new MemberService();
        member.getTopUsers()
            .then((data) => setTopUsers(data))
            .catch((err) => console.log(err))
    }, [])

    // Enhanced animation variants with better timing and easing
    const fadeInUp = {
        hidden: { 
            opacity: 0, 
            y: 100,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1
            }
        }
    } as const;

    const fadeInLeft = {
        hidden: { 
            opacity: 0, 
            x: -100,
            scale: 0.9
        },
        visible: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: { 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    } as const;

    const fadeInRight = {
        hidden: { 
            opacity: 0, 
            x: 100,
            scale: 0.9
        },
        visible: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: { 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    } as const;

    const scaleIn = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            rotateY: -15
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            rotateY: 0,
            transition: { 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    } as const;

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    } as const;

    const cardHover = {
        hover: {
            scale: 1.05,
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    } as const;

    return (
        <div className={"homepage"} ref={containerRef}>
            <VerticalMovingBasket itemCount={3} />
            
            {/* Hero Section with Parallax */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Parallax Background Elements */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        filter: 'blur(40px)'
                    }}
                    animate={{
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '15%',
                        width: '150px',
                        height: '150px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '50%',
                        filter: 'blur(30px)'
                    }}
                    animate={{
                        y: [0, 30, 0],
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                <Container>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    mb: 3, 
                                    fontWeight: 900,
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontSize: { xs: '3rem', md: '5rem' },
                                    textShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                Welcome to Cafert
                            </Typography>
                        </motion.div>
                        
                        <motion.div variants={fadeInUp}>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.9)',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    fontWeight: 300,
                                    mb: 4
                                }}
                            >
                                Experience the finest coffee moments
                            </Typography>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Box sx={{ textAlign: 'center' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card sx={{ 
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 4,
                                        maxWidth: 400,
                                        mx: 'auto',
                                        p: 3
                                    }}>
                                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                                            Discover Our World
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            Where every cup tells a story
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Box>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Happy Hour Section with Enhanced Animations */}
            <Box sx={{ py: 12, background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    mb: 4, 
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    textShadow: '0 5px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                Happy Hour Every Day
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    textAlign: 'center',
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 6,
                                    fontStyle: 'italic'
                                }}
                            >
                                Join us for special moments and amazing deals
                            </Typography>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                                {[
                                    { time: "2-4 PM", title: "Afternoon Delight" },
                                    { time: "50% OFF", title: "Selected Drinks" },
                                    { time: "Daily", title: "Special Events" }
                                ].map((item, index) => (
                                    <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' }, maxWidth: { md: '300px' } }}>
                                        <motion.div 
                                            variants={cardHover}
                                            whileHover="hover"
                                        >
                                            <Card sx={{ 
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                textAlign: 'center',
                                                p: 4,
                                                height: '100%',
                                                cursor: 'pointer'
                                            }}>
                                                <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
                                                    {item.time}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    {item.title}
                                                </Typography>
                                            </Card>
                                        </motion.div>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Delicious Selection Section */}
            <Box sx={{ py: 12, background: '#fff' }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInRight}>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    mb: 6, 
                                    textAlign: 'center',
                                    color: '#2c3e50',
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                                }}
                            >
                                Delicious Selection
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeInRight}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    textAlign: 'center',
                                    color: '#7f8c8d',
                                    mb: 8,
                                    fontStyle: 'italic'
                                }}
                            >
                                Handcrafted with love and premium ingredients
                            </Typography>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
                                    <motion.div 
                                        variants={cardHover}
                                        whileHover="hover"
                                    >
                                        <Card sx={{ 
                                            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <CardContent sx={{ p: 6, textAlign: 'center' }}>
                                                <Typography variant="h3" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                                                    {popularDishes.length}
                                                </Typography>
                                                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Popular Items
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Box>
                                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
                                    <motion.div 
                                        variants={cardHover}
                                        whileHover="hover"
                                    >
                                        <Card sx={{ 
                                            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <CardContent sx={{ p: 6, textAlign: 'center' }}>
                                                <Typography variant="h3" sx={{ color: '#2c3e50', mb: 2, fontWeight: 600 }}>
                                                    {newDishes.length}
                                                </Typography>
                                                <Typography variant="h5" sx={{ color: '#34495e' }}>
                                                    Fresh Items
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Box>
                            </Box>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Coffee Moments Section with Enhanced Scrolling */}
            <Box sx={{ py: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInLeft}>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    mb: 6, 
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    textShadow: '0 5px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                Coffee Moments
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeInLeft}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    textAlign: 'center',
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 8,
                                    fontStyle: 'italic'
                                }}
                            >
                                Every sip tells a story, every moment creates memories
                            </Typography>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {[
                                    { 
                                        image: "/coffee-hero.jpg", 
                                        title: "Morning Ritual", 
                                        desc: "Start your day with our signature blends",
                                        overlay: "rgba(139, 69, 19, 0.3)"
                                    },
                                    { 
                                        image: "/coffee-latte.jpg", 
                                        title: "Artisanal Latte", 
                                        desc: "Perfectly crafted lattes with rich flavors",
                                        overlay: "rgba(101, 67, 33, 0.3)"
                                    },
                                    { 
                                        image: "/coffee-cappuccino.jpg", 
                                        title: "Classic Cappuccino", 
                                        desc: "Traditional Italian coffee experience",
                                        overlay: "rgba(160, 82, 45, 0.3)"
                                    },
                                    { 
                                        image: "/coffee-espresso.jpg", 
                                        title: "Pure Espresso", 
                                        desc: "Strong and authentic espresso shots",
                                        overlay: "rgba(139, 69, 19, 0.3)"
                                    },
                                    { 
                                        image: "/coffee-beans.jpg", 
                                        title: "Fresh Coffee Beans", 
                                        desc: "Premium quality beans from around the world",
                                        overlay: "rgba(101, 67, 33, 0.3)"
                                    },
                                    { 
                                        image: "/coffee-shop.jpg", 
                                        title: "Cozy Atmosphere", 
                                        desc: "Perfect place to relax and enjoy coffee",
                                        overlay: "rgba(160, 82, 45, 0.3)"
                                    }
                                ].map((item, index) => (
                                    <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                                        <motion.div 
                                            variants={cardHover}
                                            whileHover="hover"
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <Card sx={{ 
                                                background: `linear-gradient(${item.overlay}, ${item.overlay}), url(${item.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                textAlign: 'center',
                                                p: 4,
                                                height: '300px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'rgba(0,0,0,0.4)',
                                                    zIndex: 1
                                                }} />
                                                <Box sx={{ position: 'relative', zIndex: 2 }}>
                                                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                        {item.desc}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ py: 12, background: '#f8f9fa' }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInRight}>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    mb: 6, 
                                    textAlign: 'center',
                                    color: '#2c3e50',
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                                }}
                            >
                                What Our Customers Say
                            </Typography>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {[
                                    { 
                                        quote: "Amazing coffee!", 
                                        text: "The best coffee I've ever had. The atmosphere is perfect for working and relaxing.", 
                                        author: "Sarah Johnson",
                                        image: "/coffee-latte.jpg"
                                    },
                                    { 
                                        quote: "Perfect atmosphere!", 
                                        text: "Love the cozy vibe and friendly staff. My go-to place for coffee meetings.", 
                                        author: "Mike Chen",
                                        image: "/coffee-cappuccino.jpg"
                                    },
                                    { 
                                        quote: "Outstanding service!", 
                                        text: "The staff is incredibly friendly and the coffee is consistently excellent.", 
                                        author: "Emily Davis",
                                        image: "/coffee-espresso.jpg"
                                    },
                                    { 
                                        quote: "Fresh beans!", 
                                        text: "The quality of their coffee beans is exceptional. You can taste the difference.", 
                                        author: "David Wilson",
                                        image: "/coffee-beans.jpg"
                                    },
                                    { 
                                        quote: "Cozy environment!", 
                                        text: "Perfect place to work, study, or just enjoy a great cup of coffee.", 
                                        author: "Lisa Anderson",
                                        image: "/coffee-shop.jpg"
                                    },
                                    { 
                                        quote: "Best in town!", 
                                        text: "Hands down the best coffee shop in the area. Highly recommended!", 
                                        author: "Tom Martinez",
                                        image: "/coffee-hero.jpg"
                                    }
                                ].map((testimonial, index) => (
                                    <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                                        <motion.div 
                                            variants={cardHover}
                                            whileHover="hover"
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <Card sx={{ 
                                                background: '#fff',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                borderRadius: 4,
                                                p: 4,
                                                height: '100%',
                                                cursor: 'pointer',
                                                overflow: 'hidden'
                                            }}>
                                                <Box sx={{
                                                    height: '120px',
                                                    background: `url(${testimonial.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: '8px',
                                                    mb: 3,
                                                    position: 'relative'
                                                }}>
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'rgba(139, 69, 19, 0.3)',
                                                        borderRadius: '8px'
                                                    }} />
                                                </Box>
                                                <Typography variant="h6" sx={{ color: '#e74c3c', mb: 2, fontWeight: 600 }}>
                                                    "{testimonial.quote}"
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2 }}>
                                                    "{testimonial.text}"
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 600 }}>
                                                    - {testimonial.author}
                                                </Typography>
                                            </Card>
                                        </motion.div>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Reservations Section */}
            <Box sx={{ py: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInLeft}>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    mb: 6, 
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    textShadow: '0 5px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                Make a Reservation
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeInLeft}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    textAlign: 'center',
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 8,
                                    fontStyle: 'italic'
                                }}
                            >
                                Secure your spot for the perfect coffee experience
                            </Typography>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Box sx={{ textAlign: 'center' }}>
                                <motion.div 
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card sx={{ 
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 4,
                                        maxWidth: 500,
                                        mx: 'auto',
                                        p: 6,
                                        cursor: 'pointer'
                                    }}>
                                        <Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>
                                            Book Your Table
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
                                            Reserve your spot and enjoy our premium coffee experience
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            size="large"
                                            sx={{ 
                                                background: 'rgba(255,255,255,0.2)',
                                                color: '#fff',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                px: 4,
                                                py: 2,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'rgba(255,255,255,0.3)',
                                                    border: '2px solid rgba(255,255,255,0.5)'
                                                }
                                            }}
                                        >
                                            Reserve Now
                                        </Button>
                                    </Card>
                                </motion.div>
                            </Box>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Footer Section */}
            <Box sx={{ py: 8, background: '#2c3e50' }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                    >
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                textAlign: 'center',
                                color: '#fff',
                                fontWeight: 300
                            }}
                        >
                            Join the Cafert Experience
                        </Typography>
                    </motion.div>
                </Container>
            </Box>
        </div>
    );
}