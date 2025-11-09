const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Use exact same API endpoint as config.js
const api = 'https://api.dpconindia.com/api/';

// Node.js compatible version of fetchServices (matches APICalls.js exactly)
const fetchServices = async () => {
  try {
    const { data } = await axios.get(`${api}service`);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log('⚠️ Could not fetch services from API:', error.message);
    return [];
  }
};

// Static pages SEO data
const staticPages = [
    {
        path: 'index.html',
        title: 'DPCon India | Professional Construction & Renovation Services in Mumbai',
        description: 'DPCon India offers expert construction, renovation, and maintenance services in Mumbai. Specializing in core cutting, painting, plumbing, and facade work with trusted professionals.',
        keywords: 'DPCon India, construction services Mumbai, home renovation, building contractors, Mumbai construction',
        canonical: 'https://www.dpconindia.com/'
    },
    {
        path: 'services/service-list/index.html',
        title: 'Core Cutting, Painting, Plumbing and Facade Services in Mumbai | DPCon India',
        description: 'Discover expert home and commercial solutions with DPCon India. From core cutting services and painting contractors to plumbing, tiles work, and facade cleaning services in Mumbai – trusted professionals for every project.',
        keywords: 'core cutting services, painting contractors, plumbing services, tiles work, facade cleaning, Mumbai, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-list'
    },
    {
        path: 'home/index.html',
        title: 'Core Cutting Services in Mumbai | Painting Services in Mumbai',
        description: 'DPCon India connects you with trusted professionals for core cutting services in Mumbai, reliable painting services in Mumbai, and expert painting contractors for homes, offices, and projects.',
        keywords: 'core cutting services Mumbai, painting services Mumbai, painting contractors, home painting, office painting, DPCon India',
        canonical: 'https://www.dpconindia.com/home'
    },
    {
        path: 'pages/gallery/index.html',
        title: 'Plumbing Services in Mumbai | Bathroom Tiles work in Mumbai',
        description: 'DPCon India connects you with trusted professionals for plumbing services in Mumbai, bathroom tiles work in Mumbai, and expert tiles work for homes and offices.',
        keywords: 'plumbing services Mumbai, bathroom tiles work, tiles installation, home renovation, DPCon India',
        canonical: 'https://www.dpconindia.com/pages/gallery'
    },
    {
        path: 'pages/about-us/index.html',
        title: 'Painting Contractors in Mumbai | Home Painting Services – DPCon India',
        description: 'Looking for expert painting contractors in Mumbai? DPCon India offers reliable home painting services in Mumbai with trusted professionals for quality finishes.',
        keywords: 'painting contractors Mumbai, home painting services, professional painters, quality painting, DPCon India',
        canonical: 'https://www.dpconindia.com/pages/about-us'
    },
    {
        path: 'blog/blog-grid/index.html',
        title: 'Facade cleaning services in mumbai | Facade restoration services in mumbai',
        description: 'DPCon India offers professional facade cleaning services in Mumbai and expert facade restoration services in Mumbai to keep your buildings spotless and well-maintained.',
        keywords: 'facade cleaning services Mumbai, facade restoration services, building cleaning, commercial cleaning, DPCon India',
        canonical: 'https://www.dpconindia.com/blog/blog-grid'
    },
    {
        path: 'pages/contact-us/index.html',
        title: 'Plumbing Services in Mumbai | Bathroom and Tiles Work Experts – DPCon India',
        description: 'DPCon India connects you with trusted professionals for plumbing services in Mumbai, bathroom tiles work in Mumbai, and expert tiles work for homes and offices.',
        keywords: 'plumbing services Mumbai, bathroom tiles work, tiles experts, contact DPCon India, get quote',
        canonical: 'https://www.dpconindia.com/pages/contact-us'
    }
];



// SEO mapping with priority (most specific first)
const seoMapping = [
    {
        keywords: ['waterproofing painting'],
        priority: 10,
        seo: {
            title: 'Waterproofing Painting Services in Mumbai | DPCon India',
            description: 'DPCon India offers professional waterproofing painting services in Mumbai to protect your walls and buildings from leaks, dampness, and weather damage with lasting results.',
            keywords: 'waterproofing painting Mumbai, waterproof paint, damp proofing, exterior painting, DPCon India'
        }
    },
    {
        keywords: ['bathroom tiles', 'bathroom tile'],
        priority: 9,
        seo: {
            title: 'Bathroom Tiles Work in Mumbai | DPCon India',
            description: 'DPCon India offers expert bathroom tiles work in Mumbai with professional installation, quality materials, and reliable service for homes and commercial spaces.',
            keywords: 'bathroom tiles work Mumbai, bathroom tiling, tiles installation, bathroom renovation, DPCon India'
        }
    },
    {
        keywords: ['building painting'],
        priority: 8,
        seo: {
            title: 'Building Painting Services in Mumbai | Painting Contractors in Mumbai',
            description: 'DPCon India connects you with trusted painting contractors in Mumbai for professional building painting services and expert home painting solutions. Quality, reliable, and hassle-free service.',
            keywords: 'building painting services Mumbai, painting contractors, professional painting, home painting, DPCon India'
        }
    },
    {
        keywords: ['building repair'],
        priority: 8,
        seo: {
            title: 'Building repair services in mumbai | Civil contractor services in Mumbai',
            description: 'DPCon India offers reliable building repair services in Mumbai and professional civil contractor services to deliver quality construction and maintenance solutions.',
            keywords: 'building repair services Mumbai, civil contractor, construction services, building maintenance, DPCon India'
        }
    },
    {
        keywords: ['crack filling'],
        priority: 7,
        seo: {
            title: 'Crack Filling Services in Mumbai | Expert Wall and Ceiling Repairs – DPCon India',
            description: 'DPCon India specializes in reliable crack filling services in Mumbai. Our professional team delivers long-lasting crack filling services in Mumbai for homes and commercial spaces.',
            keywords: 'crack filling services Mumbai, wall repairs, ceiling repairs, structural repair, DPCon India'
        }
    },
    {
        keywords: ['tiles work', 'tile work', 'tiling'],
        priority: 6,
        seo: {
            title: 'Tiles Work in Mumbai | Professional Tiling Services – DPCon India',
            description: 'DPCon India provides expert tiles work in Mumbai, offering high-quality tiles installation and finishing for bathrooms, kitchens, floors, and commercial spaces.',
            keywords: 'tiles work Mumbai, tiling services, tiles installation, floor tiles, wall tiles, DPCon India'
        }
    },
    {
        keywords: ['waterproofing'],
        priority: 5,
        seo: {
            title: 'Waterproofing Services in Mumbai | Water Leakage Detection Experts – DPCon India',
            description: 'DPCon India offers reliable waterproofing services in Mumbai along with advanced water leakage detection services in Mumbai to protect your home and buildings from damage.',
            keywords: 'waterproofing services Mumbai, water leakage detection, leak repair, waterproofing contractors, DPCon India'
        }
    }
];

// Function to find best matching SEO data
const findSEOMatch = (serviceTitle) => {
    const title = serviceTitle.toLowerCase();
    let bestMatch = null;
    let highestPriority = 0;
    
    // Find highest priority match
    for (const mapping of seoMapping) {
        for (const keyword of mapping.keywords) {
            if (title.includes(keyword) && mapping.priority > highestPriority) {
                bestMatch = mapping.seo;
                highestPriority = mapping.priority;
                break;
            }
        }
    }
    
    // Return best match or default
    return bestMatch || {
        title: `${serviceTitle} in Mumbai | DPCon India`,
        description: `DPCon India offers professional ${serviceTitle.toLowerCase()} in Mumbai with expert service and reliable results.`,
        keywords: `${serviceTitle.toLowerCase()}, ${serviceTitle.toLowerCase()} Mumbai, construction services, DPCon India`
    };
};

// Function to generate service page SEO data
const generateServiceSEO = (service) => {
    const serviceTitle = service.serviceTitle || service.title || 'Service';
    const seoData = findSEOMatch(serviceTitle);
    
    return {
        path: `services/service-details/${service._id}/index.html`,
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        canonical: `https://www.dpconindia.com/services/service-details/${service._id}`
    };
};

// Main function to generate all SEO pages
const generateAllSEOPages = async () => {

    // Fetch dynamic services
    console.log('🔄 Fetching services from API...');
    const services = await fetchServices();
    console.log(`✅ Found ${services.length} services`);
    
    // Combine static pages with dynamic service pages
    const dynamicServicePages = services.map(generateServiceSEO);
    const allPages = [...staticPages, ...dynamicServicePages];
    
    // Read the base index.html from build folder
    const buildDir = path.join(__dirname, '..', 'build');
    const baseHtmlPath = path.join(buildDir, 'index.html');
    
    if (!fs.existsSync(baseHtmlPath)) {
        console.error('❌ Build folder not found. Run npm run build first.');
        process.exit(1);
    }
    
    const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
    
    // Generate SEO pages
    allPages.forEach(page => {
    // Update the HTML with custom meta tags
    let customHtml = baseHtml;

    // Replace title
    customHtml = customHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${page.title}</title>`
    );

    // Replace or add description
    customHtml = customHtml.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${page.description}">`
    );

    // Replace or add keywords
    if (customHtml.includes('<meta name="keywords"')) {
        customHtml = customHtml.replace(
            /<meta name="keywords" content=".*?">/,
            `<meta name="keywords" content="${page.keywords}">`
        );
    } else {
        customHtml = customHtml.replace(
            '</title>',
            `</title>\n    <meta name="keywords" content="${page.keywords}">`
        );
    }

    // Replace or add canonical URL
    if (customHtml.includes('<link rel="canonical"')) {
        customHtml = customHtml.replace(
            /<link rel="canonical" href=".*?">/,
            `<link rel="canonical" href="${page.canonical}">`
        );
    } else {
        customHtml = customHtml.replace(
            '</head>',
            `    <link rel="canonical" href="${page.canonical}">
</head>`
        );
    }

    // Create directory if it doesn't exist
    const filePath = path.join(buildDir, page.path);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }

        // Write the file
        fs.writeFileSync(filePath, customHtml, 'utf8');
        console.log(`✅ Generated: ${page.path}`);
        console.log(`   Title: ${page.title.substring(0, 60)}...`);
    });
    
    console.log(`\n🎉 Generated ${allPages.length} SEO pages successfully!`);
    console.log(`   📄 Static pages: ${staticPages.length}`);
    console.log(`   🔧 Service pages: ${dynamicServicePages.length}`);
    console.log('📝 Run "npx serve -s build" to test');
};

// Run the script
generateAllSEOPages().catch(error => {
    console.error('❌ Error generating SEO pages:', error);
    process.exit(1);
});

