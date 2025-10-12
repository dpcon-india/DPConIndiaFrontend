const fs = require('fs');
const path = require('path');

// SEO data from your sheet - ALL 13 PAGES
const seoPages = [
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
    },
    {
        path: 'services/service-details/67e4fb6d11d5f5a8a416ec38/index.html',
        title: 'Crack Filling Services in Mumbai | Expert Wall and Ceiling Repairs – DPCon India',
        description: 'DPCon India specializes in reliable crack filling services in Mumbai. Our professional team delivers long-lasting crack filling services in Mumbai for homes and commercial spaces.',
        keywords: 'crack filling services Mumbai, wall repairs, ceiling repairs, structural repair, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67e4fb6d11d5f5a8a416ec38'
    },
    {
        path: 'services/service-details/67bec42efc8baa5726a62beb/index.html',
        title: 'Building Painting Services in Mumbai | Painting Contractors in Mumbai',
        description: 'DPCon India connects you with trusted painting contractors in Mumbai for professional building painting services and expert home painting solutions. Quality, reliable, and hassle-free service.',
        keywords: 'building painting services Mumbai, painting contractors, professional painting, home painting, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67bec42efc8baa5726a62beb'
    },
    {
        path: 'services/service-details/67cfd623a94130f4469f4904/index.html',
        title: 'Waterproofing Services in Mumbai | Water Leakage Detection Experts – DPCon India',
        description: 'DPCon India offers reliable waterproofing services in Mumbai along with advanced water leakage detection services in Mumbai to protect your home and buildings from damage.',
        keywords: 'waterproofing services Mumbai, water leakage detection, leak repair, waterproofing contractors, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67cfd623a94130f4469f4904'
    },
    {
        path: 'services/service-details/67d13a23a94130f4469fdec4/index.html',
        title: 'Tiles Work in Mumbai | Professional Tiling Services – DPCon India',
        description: 'DPCon India provides expert tiles work in Mumbai, offering high-quality tiles installation and finishing for bathrooms, kitchens, floors, and commercial spaces.',
        keywords: 'tiles work Mumbai, tiling services, tiles installation, floor tiles, wall tiles, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67d13a23a94130f4469fdec4'
    },
    {
        path: 'services/service-details/67d13c1da94130f4469fe030/index.html',
        title: 'Bathroom Tiles Work in Mumbai | DPCon India',
        description: 'DPCon India offers expert bathroom tiles work in Mumbai with professional installation, quality materials, and reliable service for homes and commercial spaces.',
        keywords: 'bathroom tiles work Mumbai, bathroom tiling, tiles installation, bathroom renovation, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67d13c1da94130f4469fe030'
    },
    {
        path: 'services/service-details/67d1896ca94130f4469fefeb/index.html',
        title: 'Waterproofing Painting Services in Mumbai | DPCon India',
        description: 'DPCon India offers professional waterproofing painting services in Mumbai to protect your walls and buildings from leaks, dampness, and weather damage with lasting results.',
        keywords: 'waterproofing painting Mumbai, waterproof paint, damp proofing, exterior painting, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67d1896ca94130f4469fefeb'
    },
    {
        path: 'services/service-details/67d161bea94130f4469fe48d/index.html',
        title: 'Building repair services in mumbai | Civil contractor services in Mumbai',
        description: 'DPCon India offers reliable building repair services in Mumbai and professional civil contractor services to deliver quality construction and maintenance solutions.',
        keywords: 'building repair services Mumbai, civil contractor, construction services, building maintenance, DPCon India',
        canonical: 'https://www.dpconindia.com/services/service-details/67d161bea94130f4469fe48d'
    }
];

// Read the base index.html from build folder
const buildDir = path.join(__dirname, '..', 'build');
const baseHtmlPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ Build folder not found. Run npm run build first.');
    process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

// Generate SEO pages
seoPages.forEach(page => {
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

    // Replace canonical URL
    customHtml = customHtml.replace(
        /<link rel="canonical" href=".*?">/,
        `<link rel="canonical" href="${page.canonical}">`
    );

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

console.log('\n🎉 All SEO pages generated successfully!');
console.log('📝 Run "npx serve -s build" to test');

