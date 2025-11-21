import React, { useState, useEffect } from 'react';
import type { ProductCategory } from '../types/products/models/ProductCategory';
import type { Product } from '../types/products/models/Product';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Card,
    Badge,
    SimpleGrid,
    rem,
    Box,
    Grid,
    ThemeIcon,
    Overlay,
    Slider,
    Tabs,
    Avatar,
    Divider,
    Image,
    ActionIcon,
    Paper,
} from '@mantine/core';
import {
    IconCreditCard,
    IconPigMoney,
    IconHome,
    IconShield,
    IconTrendingUp,
    IconCalculator,
    IconArrowRight,
    IconStar,
    IconDeviceMobile,
    IconBolt,
    IconUsers,
    IconChartAreaLine,
    IconLock,
    IconRobot,
    IconSearch,
    IconChevronRight,
    IconChevronLeft,
    IconQuote,
    IconAward,
    IconTarget,
    IconWallet,
} from '@tabler/icons-react';
import { ProductsService } from '../types/products/services/ProductsService';
import { Carousel } from '@mantine/carousel';

const Home: React.FC = () => {
    const navigate = useNavigate();
    // const { state } = useAppStore();
    const [loanAmount, setLoanAmount] = useState(50000);
    const [loanTerm, setLoanTerm] = useState(24);
    const [activePromoSlide, setActivePromoSlide] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Rotating promo slides
    const promoSlides = [
        {
            title: "Top Cashback Credit Cards",
            subtitle: "Updated Weekly with Best Offers",
            description: "Get up to 5% cashback on all purchases with our featured credit cards",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
            cta: "Compare Cards"
        },
        {
            title: "Lowest Home Loan Rates",
            subtitle: "Starting from 8.5% APR",
            description: "Find the perfect home loan with competitive rates and flexible terms",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
            cta: "Check Rates"
        },
        {
            title: "Finverse SmartMatch AI",
            subtitle: "Instant Recommendations",
            description: "Get personalized product recommendations powered by AI technology",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
            cta: "Try AI Assistant"
        }
    ];

    // Customer testimonials
    const testimonials = [
        {
            name: "Priya Jayawardena",
            role: "Business Owner",
            photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            quote: "FinVerse saved me Rs. 45,000 in annual credit card fees. The comparison tool is incredibly detailed!",
            rating: 5
        },
        {
            name: "Roshan Silva",
            role: "IT Professional",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            quote: "Found the perfect home loan in minutes. The AI assistant understood exactly what I needed.",
            rating: 5
        },
        {
            name: "Sanduni Fernando",
            role: "Doctor",
            photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
            quote: "Best platform for comparing investment options. The insights helped me make better financial decisions.",
            rating: 5
        }
    ];

    // Categories and top products state
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTopProducts, setLoadingTopProducts] = useState(true);

    // Icon and image mapping for categories
    const categoryIconMap = {
        'credit-cards': IconCreditCard,
        'loans': IconPigMoney,
        'mortgages': IconHome,
        'savings': IconCalculator,
        'investments': IconTrendingUp,
        'insurance': IconShield,
    };
    const categoryImageMap = {
        'credit-cards': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
        'loans': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
        'mortgages': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop',
        'savings': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop',
        'investments': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
        'insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop',
    };
    const fallbackImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop';

    // Fetch categories from API
    useEffect(() => {
        setLoadingCategories(true);
        ProductsService.getProductsCategories()
            .then((data: any) => setCategories(Array.isArray(data.data) ? data.data.slice(3, 9) : []))
            .catch(() => setCategories([]))
            .finally(() => setLoadingCategories(false));
    }, []);

    // Fetch top/featured products from API
    useEffect(() => {
        setLoadingTopProducts(true);
        ProductsService.getProducts(undefined, undefined, true, true, undefined, 1, 3, 'createdAt', 'desc')
            .then((res) => setTopProducts((res.data || []) as Product[]))
            .catch(() => setTopProducts([]))
            .finally(() => setLoadingTopProducts(false));
    }, []);

    // Partner banks with logos
    const partnerBanks = [
        {
            name: "Commercial Bank",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Commercial_Bank_of_Ceylon_logo.svg/200px-Commercial_Bank_of_Ceylon_logo.svg.png",
            shortName: "COMB"
        },
        {
            name: "Hatton National Bank",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/HNB_Logo.svg/200px-HNB_Logo.svg.png",
            shortName: "HNB"
        },
        {
            name: "Peoples Bank",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/People%27s_Bank_Logo.svg/200px-People%27s_Bank_Logo.svg.png",
            shortName: "PEOP"
        },
        {
            name: "Sampath Bank",
            logo: "https://www.sampathbank.com/images/logo.png",
            shortName: "SAMP"
        },
        {
            name: "Nations Trust Bank",
            logo: "https://www.nationstrust.com/images/ntb-logo.png",
            shortName: "NTB"
        },
        {
            name: "DFCC Bank",
            logo: "https://www.dfcc.lk/images/dfcc-logo.png",
            shortName: "DFCC"
        },
        {
            name: "Pan Asia Banking",
            logo: "https://www.panasiabank.com/images/logo.png",
            shortName: "PAB"
        },
        {
            name: "Union Bank",
            logo: "https://www.unionb.com/images/logo.png",
            shortName: "UBC"
        }
    ];

    // Auto-rotate promo slides
    useEffect(() => {
        const timer = setInterval(() => {
            setActivePromoSlide((prev) => (prev + 1) % promoSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [promoSlides.length]);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const calculateMonthlyPayment = () => {
        const rate = 0.12 / 12; // 12% annual rate
        const payment = (loanAmount * rate * Math.pow(1 + rate, loanTerm)) / (Math.pow(1 + rate, loanTerm) - 1);
        return payment.toFixed(0);
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0B74FF 0%, #20C997 50%, #4DABF7 100%)',
                    position: 'relative',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                }}
            >
                <Overlay opacity={0.1} color="#000" />

                {/* Floating Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    right: '8%',
                    opacity: 0.1,
                    zIndex: 1,
                }}>
                    <IconWallet size={180} className="animate-float" />
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '3%',
                    opacity: 0.1,
                    zIndex: 1,
                }}>
                    <IconChartAreaLine size={120} className="animate-float animate-delay-2" />
                </div>

                <Container size="xl" style={{ position: 'relative', zIndex: 2, paddingTop: rem(100) }}>
                    <Grid align="center" gutter="xl">
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Stack gap="xl" className="animate-fadeInLeft">
                                <Title
                                    order={1}
                                    size="h1"
                                    fw={700}
                                    c="white"
                                    style={{ fontSize: rem(64), lineHeight: 1.1 }}
                                >
                                    Find, Compare & Choose
                                    <br />
                                    <span style={{ color: '#FFD43B' }}>the Right Financial Product.</span>
                                    <br />
                                    <Text component="span" size="xl" fw={400} c="rgba(255,255,255,0.9)">
                                        Smarter decisions powered by AI.
                                    </Text>
                                </Title>

                                <Text size="xl" c="rgba(255,255,255,0.85)" style={{ maxWidth: rem(600), lineHeight: 1.6 }}>
                                    Trusted by thousands across Sri Lanka to compare cards, loans, investments & more.
                                    Get personalized recommendations and make informed financial decisions.
                                </Text>

                                <Group gap="lg" className="animate-fadeInUp animate-delay-1">
                                    <Button
                                        size="xl"
                                        variant="filled"
                                        color="white"
                                        c="dark"
                                        leftSection={<IconSearch size={20} />}
                                        rightSection={<IconArrowRight size={20} />}
                                        style={{
                                            borderRadius: rem(50),
                                            paddingLeft: rem(32),
                                            paddingRight: rem(32),
                                            fontSize: rem(18),
                                            fontWeight: 600,
                                            height: rem(60)
                                        }}
                                        className="hover-lift"
                                        onClick={() => navigate('/products')}
                                    >
                                        Start Comparing
                                    </Button>
                                    <Button
                                        size="xl"
                                        variant="outline"
                                        c="white"
                                        leftSection={<IconRobot size={20} />}
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            borderRadius: rem(50),
                                            paddingLeft: rem(32),
                                            paddingRight: rem(32),
                                            fontSize: rem(18),
                                            height: rem(60)
                                        }}
                                        className="hover-lift animate-pulse"
                                    >
                                        Ask FinVerse AI
                                    </Button>
                                </Group>

                                {/* Trust Indicators */}
                                <Group gap="xl" className="animate-fadeInUp animate-delay-3" mt="xl">
                                    <Group gap="xs">
                                        <IconUsers size={24} color="white" />
                                        <div>
                                            <Text c="white" size="lg" fw={600}>500K+</Text>
                                            <Text c="rgba(255,255,255,0.7)" size="sm">Trusted Users</Text>
                                        </div>
                                    </Group>
                                    <Group gap="xs">
                                        <IconAward size={24} color="white" />
                                        <div>
                                            <Text c="white" size="lg" fw={600}>4.8★</Text>
                                            <Text c="rgba(255,255,255,0.7)" size="sm">User Rating</Text>
                                        </div>
                                    </Group>
                                    <Group gap="xs">
                                        <IconLock size={24} color="white" />
                                        <div>
                                            <Text c="white" size="lg" fw={600}>Bank-level</Text>
                                            <Text c="rgba(255,255,255,0.7)" size="sm">Security</Text>
                                        </div>
                                    </Group>
                                </Group>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <div className="animate-fadeInRight animate-delay-2">
                                <Carousel
                                    withIndicators
                                    height={rem(450)}
                                    slideSize="100%"
                                    slideGap="md"
                                    styles={{
                                        indicator: {
                                            background: 'rgba(255,255,255,0.5)',
                                            '&[data-active]': { background: 'white' }
                                        }
                                    }}
                                >
                                    <Carousel.Slide>
                                        <Card
                                            p="xl"
                                            radius="xl"
                                            style={{
                                                background: 'rgba(255,255,255,0.15)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                height: '100%'
                                            }}
                                            className="animate-float"
                                        >
                                            <Stack gap="lg" h="100%" justify="space-between">
                                                <div>
                                                    <Group justify="space-between" mb="lg">
                                                        <Text c="white" size="sm" opacity={0.8}>Financial Dashboard</Text>
                                                        <IconChartAreaLine size={24} color="white" opacity={0.8} />
                                                    </Group>
                                                    <Title order={2} c="white" fw={700} size="h1">Rs. 2,458,000</Title>
                                                    <Text c="rgba(255,255,255,0.8)" size="lg">Total Portfolio Value</Text>
                                                    <Text c="#4AE54A" size="sm" fw={600}>+12.5% this month</Text>
                                                </div>

                                                <SimpleGrid cols={2} spacing="sm">
                                                    <Paper p="md" radius="lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                        <Text c="white" size="xs" opacity={0.8}>Monthly Income</Text>
                                                        <Text c="white" fw={700} size="lg">Rs. 524,000</Text>
                                                    </Paper>
                                                    <Paper p="md" radius="lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                        <Text c="white" size="xs" opacity={0.8}>Savings</Text>
                                                        <Text c="white" fw={700} size="lg">Rs. 312,000</Text>
                                                    </Paper>
                                                </SimpleGrid>
                                            </Stack>
                                        </Card>
                                    </Carousel.Slide>
                                    <Carousel.Slide>
                                        <Card
                                            p="xl"
                                            radius="xl"
                                            style={{
                                                background: 'rgba(255,255,255,0.15)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                height: '100%'
                                            }}
                                        >
                                            <Stack gap="lg" align="center" justify="center" h="100%">
                                                <IconCreditCard size={80} color="white" />
                                                <div style={{ textAlign: 'center' }}>
                                                    <Text c="white" fw={700} size="xl">Compare Products</Text>
                                                    <Text c="rgba(255,255,255,0.8)" size="lg">Side by side</Text>
                                                </div>
                                            </Stack>
                                        </Card>
                                    </Carousel.Slide>
                                </Carousel>
                            </div>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            <Container size="xl">
                {/* Featured Product Categories */}
                <Stack gap="xl" py={rem(100)}>
                    <div className="animate-fadeInUp" style={{ textAlign: 'center' }}>
                        <Title order={2} mb="sm" style={{ fontSize: rem(42) }}>
                            Explore Financial Products
                        </Title>
                        <Text size="xl" c="dimmed" style={{ maxWidth: rem(600), margin: '0 auto' }}>
                            Choose a category and start comparing instantly with our advanced comparison tools
                        </Text>
                    </div>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mt={rem(50)}>
                        {loadingCategories ? (
                            <Text>Loading categories...</Text>
                        ) : Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category, index) => {
                                // Robust slug: prefer name, fallback to id
                                const base = (category.name || category.id || '').toString().trim();
                                const slug: string = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                                const icon = categoryIconMap[slug as keyof typeof categoryIconMap] || IconCreditCard;
                                // If not mapped, use Unsplash search for the category name
                                const image = categoryImageMap[slug as keyof typeof categoryImageMap]
                                    || `https://source.unsplash.com/600x400/?${encodeURIComponent(base || 'finance')}`
                                    || fallbackImage;
                                return (
                                    <Card
                                        key={category.id || index}
                                        p={0}
                                        radius="xl"
                                        withBorder
                                        className={`hover-lift animate-fadeInUp animate-delay-${Math.floor(index / 3) + 1}`}
                                        style={{
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid #f1f3f4'
                                        }}
                                        onClick={() => navigate(`/products?category=${category.id}`)}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <Image
                                                src={image}
                                                height={200}
                                                alt={category.name || 'Category'}
                                                onError={e => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                                            />
                                            <Overlay opacity={0.3} color="#000" />
                                            <div style={{
                                                position: 'absolute',
                                                top: rem(20),
                                                left: rem(20),
                                                zIndex: 2
                                            }}>
                                                <ThemeIcon
                                                    size={50}
                                                    radius="xl"
                                                    variant="filled"
                                                    color="blue"
                                                    style={{ background: 'rgba(255,255,255,0.9)' }}
                                                >
                                                    {icon && React.createElement(icon, { size: 25 })}
                                                </ThemeIcon>
                                            </div>
                                        </div>

                                        <Stack gap="md" p="xl">
                                            <div>
                                                <Text size="xl" fw={700} mb="xs" c="dark.8">
                                                    {category.name}
                                                </Text>
                                                <Text size="sm" c="dimmed" lh={1.6}>
                                                    {category.description}
                                                </Text>
                                            </div>
                                            <Group justify="space-between" align="center" mt="auto">
                                                <Text size="sm" fw={600} c="blue">
                                                    Compare Now
                                                </Text>
                                                <IconArrowRight size={16} />
                                            </Group>
                                        </Stack>
                                    </Card>
                                );
                            })
                        ) : (
                            <Text>No categories found.</Text>
                        )}
                    </SimpleGrid>
                </Stack>

                {/* Promo Banner Carousel */}
                <Box py={rem(80)}>
                    <Card
                        radius="xl"
                        style={{
                            overflow: 'hidden',
                            position: 'relative',
                            minHeight: rem(300)
                        }}
                        className="animate-fadeInUp"
                    >
                        <div style={{
                            backgroundImage: `url(${promoSlides[activePromoSlide].image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }} />
                        <Overlay opacity={0.7} color="#000" />

                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <Grid align="center" h={rem(300)}>
                                <Grid.Col span={{ base: 12, md: 8 }}>
                                    <Stack gap="lg" p="xl">
                                        <Badge variant="light" color="yellow" size="lg">
                                            {promoSlides[activePromoSlide].subtitle}
                                        </Badge>
                                        <Title order={2} c="white" size="h1">
                                            {promoSlides[activePromoSlide].title}
                                        </Title>
                                        <Text size="lg" c="rgba(255,255,255,0.9)">
                                            {promoSlides[activePromoSlide].description}
                                        </Text>
                                        <Button
                                            size="lg"
                                            variant="filled"
                                            color="yellow"
                                            c="dark"
                                            rightSection={<IconArrowRight size={18} />}
                                            style={{ width: 'fit-content' }}
                                        >
                                            {promoSlides[activePromoSlide].cta}
                                        </Button>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </div>

                        {/* Slide indicators */}
                        <Group
                            gap="xs"
                            justify="center"
                            style={{
                                position: 'absolute',
                                bottom: rem(20),
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 3
                            }}
                        >
                            {promoSlides.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: rem(12),
                                        height: rem(12),
                                        borderRadius: '50%',
                                        background: index === activePromoSlide ? 'white' : 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => setActivePromoSlide(index)}
                                />
                            ))}
                        </Group>
                    </Card>
                </Box>

                {/* Smart Product Finder */}
                <Box
                    py={rem(80)}
                    style={{
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        marginLeft: 'calc(-50vw + 50%)',
                        marginRight: 'calc(-50vw + 50%)',
                        borderRadius: rem(40)
                    }}
                >
                    <Container size="xl">
                        <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: rem(50) }}>
                            <Title order={2} mb="sm" style={{ fontSize: rem(36) }}>
                                Not sure what you need?
                            </Title>
                            <Text size="xl" c="dimmed">
                                Let FinVerse guide you to the perfect financial product
                            </Text>
                        </div>

                        <Card p="xl" radius="xl" shadow="lg" style={{ maxWidth: rem(800), margin: '0 auto' }}>
                            <Tabs defaultValue="goal" orientation="horizontal">
                                <Tabs.List grow>
                                    <Tabs.Tab value="goal">Your Goal</Tabs.Tab>
                                    <Tabs.Tab value="income">Monthly Income</Tabs.Tab>
                                    <Tabs.Tab value="risk">Risk Level</Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="goal" pt="xl">
                                    <Stack gap="md">
                                        <Text fw={600} size="lg" mb="md">What's your primary financial goal?</Text>
                                        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                                            {[
                                                { label: "Save Money", icon: IconPigMoney },
                                                { label: "Build Credit", icon: IconCreditCard },
                                                { label: "Get Discounts", icon: IconTarget },
                                                { label: "Invest", icon: IconTrendingUp },
                                                { label: "Borrow", icon: IconCalculator },
                                                { label: "Protect", icon: IconShield }
                                            ].map((goal, index) => (
                                                <Button
                                                    key={index}
                                                    variant="light"
                                                    size="lg"
                                                    leftSection={<goal.icon size={20} />}
                                                    style={{ height: rem(60) }}
                                                >
                                                    {goal.label}
                                                </Button>
                                            ))}
                                        </SimpleGrid>
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="income" pt="xl">
                                    <Stack gap="lg">
                                        <Text fw={600} size="lg">Monthly Income Range</Text>
                                        <div>
                                            <Slider
                                                min={25000}
                                                max={500000}
                                                step={25000}
                                                value={loanAmount}
                                                onChange={setLoanAmount}
                                                marks={[
                                                    { value: 25000, label: 'Rs. 25K' },
                                                    { value: 100000, label: 'Rs. 100K' },
                                                    { value: 250000, label: 'Rs. 250K' },
                                                    { value: 500000, label: 'Rs. 500K+' },
                                                ]}
                                                mb="xl"
                                            />
                                            <Text size="xl" fw={700} ta="center" c="blue.6">
                                                Rs. {loanAmount.toLocaleString()}
                                            </Text>
                                        </div>
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="risk" pt="xl">
                                    <Stack gap="lg">
                                        <Text fw={600} size="lg">Risk Tolerance</Text>
                                        <SimpleGrid cols={3} spacing="lg">
                                            <Button variant="outline" size="xl" color="green">
                                                <Stack gap="xs" align="center">
                                                    <Text fw={600}>Low</Text>
                                                    <Text size="xs" c="dimmed">Conservative</Text>
                                                </Stack>
                                            </Button>
                                            <Button variant="outline" size="xl" color="yellow">
                                                <Stack gap="xs" align="center">
                                                    <Text fw={600}>Moderate</Text>
                                                    <Text size="xs" c="dimmed">Balanced</Text>
                                                </Stack>
                                            </Button>
                                            <Button variant="outline" size="xl" color="red">
                                                <Stack gap="xs" align="center">
                                                    <Text fw={600}>High</Text>
                                                    <Text size="xs" c="dimmed">Aggressive</Text>
                                                </Stack>
                                            </Button>
                                        </SimpleGrid>
                                    </Stack>
                                </Tabs.Panel>
                            </Tabs>

                            <Button
                                size="xl"
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'teal' }}
                                fullWidth
                                mt="xl"
                                rightSection={<IconArrowRight size={20} />}
                            >
                                Show My Recommendations
                            </Button>
                        </Card>
                    </Container>
                </Box>

                {/* Featured Comparisons */}
                <Stack gap="xl" py={rem(80)}>
                    <Group justify="space-between" align="center">
                        <div>
                            <Title order={2} mb="sm">Top Comparisons This Week</Title>
                            <Text size="lg" c="dimmed">Popular product comparisons by Sri Lankan users</Text>
                        </div>
                        <Group gap="xs">
                            <ActionIcon size="lg" variant="outline" radius="xl">
                                <IconChevronLeft size={20} />
                            </ActionIcon>
                            <ActionIcon size="lg" variant="outline" radius="xl">
                                <IconChevronRight size={20} />
                            </ActionIcon>
                        </Group>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                        {loadingTopProducts ? (
                            <Text>Loading top products...</Text>
                        ) : topProducts.map((product: any, index: number) => (
                            <Card
                                key={product.id}
                                p="lg"
                                radius="xl"
                                withBorder
                                className={`hover-lift animate-scaleIn animate-delay-${index + 1}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <Stack gap="md">
                                    <Group justify="space-between">
                                        <Badge variant="light" color="blue" size="sm">
                                            {product.categoryId || 'Product'}
                                        </Badge>
                                        <Badge variant="light" color="yellow" size="sm">
                                            Most Popular
                                        </Badge>
                                    </Group>

                                    <div>
                                        <Text size="lg" fw={700} mb="xs">
                                            {product.name}
                                        </Text>
                                        <Text size="sm" c="dimmed" mb="md">
                                            {product.details?.provider || product.details?.institution || 'Provider'}
                                        </Text>
                                    </div>

                                    <Stack gap="xs">
                                        {product.details?.interestRate && (
                                            <Group justify="space-between">
                                                <Text size="sm">APR</Text>
                                                <Text size="lg" fw={700} c="green.6">
                                                    {product.details.interestRate}%
                                                </Text>
                                            </Group>
                                        )}
                                        {product.details?.annualFee !== undefined && (
                                            <Group justify="space-between">
                                                <Text size="sm">Annual Fee</Text>
                                                <Text fw={600}>
                                                    {product.details.annualFee === 0 ? 'Free' : `Rs. ${product.details.annualFee.toLocaleString()}`}
                                                </Text>
                                            </Group>
                                        )}
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconStar size={16} fill="currentColor" color="gold" />
                                                <Text size="sm" fw={500}>{product.details?.rating || 0}</Text>
                                            </Group>
                                            <Text size="sm" c="blue.6" fw={600}>
                                                Compare side-by-side →
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Stack>

                {/* Loan Calculator Section */}
                <Box
                    py={rem(80)}
                    style={{
                        background: 'linear-gradient(135deg, #1a1b23 0%, #2d3748 100%)',
                        marginLeft: 'calc(-50vw + 50%)',
                        marginRight: 'calc(-50vw + 50%)',
                    }}
                >
                    <Container size="xl">
                        <Grid align="center" gutter="xl">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Stack gap="xl" className="animate-fadeInLeft">
                                    <div>
                                        <Title order={2} c="white" mb="lg" style={{ fontSize: rem(36) }}>
                                            Looking for a loan?
                                            <br />
                                            Calculate your monthly payments
                                        </Title>
                                        <Text c="rgba(255,255,255,0.8)" size="lg">
                                            Use our smart calculator to get instant estimates for personal loans,
                                            home loans, and more.
                                        </Text>
                                    </div>

                                    <Tabs defaultValue="personal" variant="pills">
                                        <Tabs.List>
                                            <Tabs.Tab value="personal" leftSection={<IconPigMoney size={16} />}>
                                                Personal Loan
                                            </Tabs.Tab>
                                            <Tabs.Tab value="auto" leftSection={<IconDeviceMobile size={16} />}>
                                                Auto Loan
                                            </Tabs.Tab>
                                            <Tabs.Tab value="home" leftSection={<IconHome size={16} />}>
                                                Home Loan
                                            </Tabs.Tab>
                                        </Tabs.List>

                                        <Tabs.Panel value="personal" pt="xl">
                                            <Card p="xl" radius="xl" style={{ background: 'white' }}>
                                                <Stack gap="lg">
                                                    <div>
                                                        <Text fw={600} mb="md">How much would you like to borrow</Text>
                                                        <Slider
                                                            min={50000}
                                                            max={2000000}
                                                            step={25000}
                                                            value={loanAmount}
                                                            onChange={setLoanAmount}
                                                            marks={[
                                                                { value: 50000, label: 'Rs. 50K' },
                                                                { value: 500000, label: 'Rs. 500K' },
                                                                { value: 1000000, label: 'Rs. 1M' },
                                                                { value: 2000000, label: 'Rs. 2M' },
                                                            ]}
                                                            mb="lg"
                                                        />
                                                        <Group justify="space-between">
                                                            <Text size="sm">Rs. 50,000</Text>
                                                            <Text fw={700} size="lg" c="blue.6">
                                                                Rs. {loanAmount.toLocaleString()}
                                                            </Text>
                                                            <Text size="sm">Rs. 2,000,000</Text>
                                                        </Group>
                                                    </div>

                                                    <div>
                                                        <Text fw={600} mb="md">You want to repay it over</Text>
                                                        <Slider
                                                            min={12}
                                                            max={84}
                                                            step={6}
                                                            value={loanTerm}
                                                            onChange={setLoanTerm}
                                                            marks={[
                                                                { value: 12, label: '1 Year' },
                                                                { value: 36, label: '3 Years' },
                                                                { value: 60, label: '5 Years' },
                                                                { value: 84, label: '7 Years' },
                                                            ]}
                                                            mb="lg"
                                                        />
                                                        <Group justify="space-between">
                                                            <Text size="sm">1 Year</Text>
                                                            <Text fw={700} size="lg" c="blue.6">
                                                                {loanTerm} months
                                                            </Text>
                                                            <Text size="sm">7 Years</Text>
                                                        </Group>
                                                    </div>

                                                    <Divider />

                                                    <Group justify="space-between" align="center">
                                                        <Text size="lg" fw={600}>Monthly Payments</Text>
                                                        <Text size="xl" fw={700} c="green.6">
                                                            Rs. {calculateMonthlyPayment()}
                                                        </Text>
                                                    </Group>

                                                    <Text size="xs" c="dimmed">
                                                        Effective rate: 12% p.a. Terms and conditions apply.
                                                        Interest rates vary by tenor & subject to bank policy
                                                    </Text>

                                                    <Button
                                                        size="lg"
                                                        variant="gradient"
                                                        gradient={{ from: 'blue', to: 'teal' }}
                                                        fullWidth
                                                        rightSection={<IconArrowRight size={18} />}
                                                    >
                                                        Apply for a loan now
                                                    </Button>
                                                </Stack>
                                            </Card>
                                        </Tabs.Panel>
                                    </Tabs>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Stack gap="lg" className="animate-fadeInRight animate-delay-1">
                                    <Card p="xl" radius="xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                        <Group justify="space-between" mb="lg">
                                            <Text c="white" fw={600}>Borrow wisely</Text>
                                            <IconTarget size={24} color="white" />
                                        </Group>
                                        <Stack gap="sm">
                                            <Text c="rgba(255,255,255,0.8)" size="sm">
                                                ✓ Compare rates from multiple lenders
                                            </Text>
                                            <Text c="rgba(255,255,255,0.8)" size="sm">
                                                ✓ Check your eligibility before applying
                                            </Text>
                                            <Text c="rgba(255,255,255,0.8)" size="sm">
                                                ✓ No impact on your credit score
                                            </Text>
                                            <Text c="rgba(255,255,255,0.8)" size="sm">
                                                ✓ Get pre-approved in minutes
                                            </Text>
                                        </Stack>
                                        <Button variant="outline" c="white" mt="lg" fullWidth>
                                            Read more →
                                        </Button>
                                    </Card>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </Box>

                {/* Trust & Credibility Strip */}
                <Box
                    py={rem(60)}
                    style={{
                        background: '#f8f9fa',
                        marginLeft: 'calc(-50vw + 50%)',
                        marginRight: 'calc(-50vw + 50%)',
                    }}
                >
                    <Container size="xl">
                        <Stack gap="xl" align="center">
                            <div style={{ textAlign: 'center' }}>
                                <Title order={3} mb="sm">Trusted by leading financial institutions</Title>
                                <Text c="dimmed">Partnered with Sri Lanka's top banks and financial services</Text>
                            </div>

                            <SimpleGrid cols={{ base: 4, md: 8 }} spacing="xl">
                                {partnerBanks.map((bank, index) => (
                                    <Card
                                        key={index}
                                        p="lg"
                                        radius="md"
                                        withBorder
                                        style={{
                                            textAlign: 'center',
                                            background: 'white',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            height: '100px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        className="hover-lift"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.borderColor = '#339af0';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = '';
                                            e.currentTarget.style.boxShadow = '';
                                            e.currentTarget.style.borderColor = '';
                                        }}
                                    >
                                        <img
                                            src={bank.logo}
                                            alt={bank.name}
                                            style={{
                                                height: '32px',
                                                width: 'auto',
                                                maxWidth: '100px',
                                                objectFit: 'contain',
                                                marginBottom: '8px'
                                            }}
                                            onError={(e) => {
                                                // Fallback to text if logo fails to load
                                                e.currentTarget.style.display = 'none';
                                                const textElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (textElement) textElement.style.display = 'block';
                                            }}
                                        />
                                        <Text
                                            size="xs"
                                            fw={600}
                                            c="dimmed"
                                            tt="uppercase"
                                            style={{ display: 'none' }}
                                        >
                                            {bank.shortName}
                                        </Text>
                                    </Card>
                                ))}
                            </SimpleGrid>

                            <Group gap="xl" justify="center">
                                <Group gap="xs">
                                    <IconStar size={20} fill="currentColor" color="gold" />
                                    <Text fw={600}>4.8/5 average rating</Text>
                                </Group>
                                <Text c="dimmed">•</Text>
                                <Text fw={600}>Rated Excellent by 2000+ Sri Lankan users</Text>
                            </Group>
                        </Stack>
                    </Container>
                </Box>

                {/* Customer Testimonials */}
                <Stack gap="xl" py={rem(80)}>
                    <div style={{ textAlign: 'center' }}>
                        <Title order={2} mb="sm">What our customers say</Title>
                        <Text size="lg" c="dimmed">Real stories from real customers</Text>
                    </div>

                    <Card
                        p="xl"
                        radius="xl"
                        withBorder
                        style={{ maxWidth: rem(800), margin: '0 auto' }}
                        className="animate-fadeInUp"
                    >
                        <Stack gap="lg" align="center" style={{ textAlign: 'center' }}>
                            <IconQuote size={40} color="gray" />
                            <Text size="xl" fw={500} lh={1.6}>
                                "{testimonials[activeTestimonial].quote}"
                            </Text>
                            <Group gap="xs">
                                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                                    <IconStar key={i} size={16} fill="currentColor" color="gold" />
                                ))}
                            </Group>
                            <Group gap="md">
                                <Avatar
                                    src={testimonials[activeTestimonial].photo}
                                    size="lg"
                                    radius="xl"
                                />
                                <div>
                                    <Text fw={600}>{testimonials[activeTestimonial].name}</Text>
                                    <Text size="sm" c="dimmed">{testimonials[activeTestimonial].role}</Text>
                                </div>
                            </Group>
                        </Stack>
                    </Card>

                    <Group gap="xs" justify="center">
                        {testimonials.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    width: rem(10),
                                    height: rem(10),
                                    borderRadius: '50%',
                                    background: index === activeTestimonial ? '#228be6' : '#e9ecef',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => setActiveTestimonial(index)}
                            />
                        ))}
                    </Group>
                </Stack>

                {/* FinVerse AI Section */}
                <Box
                    py={rem(80)}
                    style={{
                        background: 'linear-gradient(135deg, #1a1b23 0%, #2d3748 100%)',
                        marginLeft: 'calc(-50vw + 50%)',
                        marginRight: 'calc(-50vw + 50%)',
                    }}
                >
                    <Container size="xl">
                        <Grid align="center" gutter="xl">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Stack gap="xl" className="animate-fadeInLeft">
                                    <div>
                                        <Title order={2} c="white" mb="lg" style={{ fontSize: rem(36) }}>
                                            FinVerse AI Assistant
                                        </Title>
                                        <Text c="rgba(255,255,255,0.8)" size="lg" mb="xl">
                                            Your personal financial helper available 24/7
                                        </Text>
                                    </div>

                                    <Stack gap="md">
                                        {[
                                            "Ask product questions",
                                            "Get instant comparisons",
                                            "Understand complex fees",
                                            "Learn eligibility criteria"
                                        ].map((feature, index) => (
                                            <Group key={index} gap="md">
                                                <ThemeIcon size="sm" radius="xl" color="teal">
                                                    <IconBolt size={12} />
                                                </ThemeIcon>
                                                <Text c="white">{feature}</Text>
                                            </Group>
                                        ))}
                                    </Stack>

                                    <Button
                                        size="xl"
                                        variant="gradient"
                                        gradient={{ from: 'teal', to: 'blue' }}
                                        leftSection={<IconRobot size={20} />}
                                        rightSection={<IconArrowRight size={20} />}
                                        style={{ width: 'fit-content' }}
                                        className="animate-pulse"
                                    >
                                        Chat with AI Now
                                    </Button>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <div className="animate-fadeInRight animate-delay-1">
                                    <Card
                                        p="xl"
                                        radius="xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                        }}
                                        className="animate-float"
                                    >
                                        <Stack gap="md">
                                            <Group>
                                                <Avatar color="teal" radius="xl">
                                                    <IconRobot size={20} />
                                                </Avatar>
                                                <div>
                                                    <Text c="white" fw={600}>FinVerse AI</Text>
                                                    <Text c="rgba(255,255,255,0.7)" size="xs">Online now</Text>
                                                </div>
                                            </Group>

                                            <Card p="md" radius="lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                <Text c="white" size="sm">
                                                    Hi! I can help you find the perfect credit card.
                                                    What's your monthly spending?
                                                </Text>
                                            </Card>

                                            <Card p="md" radius="lg" style={{ background: 'rgba(32, 201, 151, 0.2)', marginLeft: 'auto', maxWidth: '80%' }}>
                                                <Text c="white" size="sm">
                                                    Around Rs. 50,000 per month
                                                </Text>
                                            </Card>

                                            <Card p="md" radius="lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                <Text c="white" size="sm">
                                                    Perfect! I found 3 cards that offer great rewards for your spending.
                                                    Would you like cashback or travel rewards?
                                                </Text>
                                            </Card>
                                        </Stack>
                                    </Card>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </Box>

                {/* Final CTA Banner */}
                <Box py={rem(80)}>
                    <Card
                        p="xl"
                        radius="xl"
                        style={{
                            background: 'linear-gradient(135deg, #0B74FF 0%, #20C997 100%)',
                            textAlign: 'center',
                        }}
                        className="animate-fadeInUp"
                    >
                        <Stack gap="xl" align="center">
                            <div>
                                <Title order={2} c="white" mb="lg" style={{ fontSize: rem(42) }}>
                                    Ready to compare and choose the best financial product?
                                </Title>
                                <Text size="xl" c="rgba(255,255,255,0.9)" style={{ maxWidth: rem(700) }}>
                                    Join thousands of Sri Lankans who trust FinVerse to make smarter financial decisions
                                </Text>
                            </div>

                            <Group gap="lg">
                                <Button
                                    size="xl"
                                    variant="white"
                                    color="dark"
                                    leftSection={<IconSearch size={20} />}
                                    rightSection={<IconArrowRight size={20} />}
                                    style={{
                                        height: rem(60),
                                        paddingLeft: rem(32),
                                        paddingRight: rem(32),
                                        fontSize: rem(18)
                                    }}
                                    onClick={() => navigate('/products')}
                                >
                                    Start Comparing
                                </Button>
                                <Button
                                    size="xl"
                                    variant="outline"
                                    c="white"
                                    leftSection={<IconRobot size={20} />}
                                    style={{
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        height: rem(60),
                                        paddingLeft: rem(32),
                                        paddingRight: rem(32),
                                        fontSize: rem(18)
                                    }}
                                >
                                    Ask AI Anything
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                </Box>
            </Container>
        </div>
    );
};

export default Home;
