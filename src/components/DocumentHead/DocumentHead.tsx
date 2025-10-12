import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface MetaTag {
    path: string | RegExp;
    title: string | ((pathname: string) => string);
    description: string | ((pathname: string) => string);
    keywords?: string | ((pathname: string) => string);
    noIndex?: boolean;
}

// Helper function to check if a path matches a route pattern
const isMatchingPath = (path: string, pattern: string | RegExp): boolean => {
    if (typeof pattern === 'string') {
        // Exact match only for string patterns
        return path === pattern;
    }
    // Handle regex patterns
    return pattern.test(path);
};

// Helper function to get meta tag value (supports both static and dynamic values)
const getMetaValue = (
    value: string | ((pathname: string) => string),
    pathname: string
): string => {
    return typeof value === 'function' ? value(pathname) : value;
};

const metaTags: MetaTag[] = [
    // Homepage
    {
        path: '/',
        title: 'DPCon India | Professional Construction & Renovation Services in Mumbai',
        description: 'DPCon India offers expert construction, renovation, and maintenance services in Mumbai. Specializing in core cutting, painting, plumbing, and facade work with trusted professionals.',
        keywords: 'DPCon India, construction services Mumbai, home renovation, building contractors, Mumbai construction',
    },

    // 1. Services List Page
    {
        path: '/services/service-list',
        title: 'Core Cutting, Painting, Plumbing and Facade Services in Mumbai | DPCon India',
        description: 'Discover expert home and commercial solutions with DPCon India. From core cutting services and painting contractors to plumbing, tiles work, and facade cleaning services in Mumbai – trusted professionals for every project.',
        keywords: 'core cutting services, painting contractors, plumbing services, tiles work, facade cleaning, Mumbai, DPCon India'
    },

    // 2. Home Page
    {
        path: '/home',
        title: 'Core Cutting Services in Mumbai | Painting Services in Mumbai',
        description: 'DPCon India connects you with trusted professionals for core cutting services in Mumbai, reliable painting services in Mumbai, and expert painting contractors for homes, offices, and projects.',
        keywords: 'core cutting services Mumbai, painting services Mumbai, painting contractors, home painting, office painting, DPCon India'
    },

    // 3. Gallery Page
    {
        path: '/pages/gallery',
        title: 'Plumbing Services in Mumbai | Bathroom Tiles work in Mumbai',
        description: 'DPCon India connects you with trusted professionals for plumbing services in Mumbai, bathroom tiles work in Mumbai, and expert tiles work for homes and offices.',
        keywords: 'plumbing services Mumbai, bathroom tiles work, tiles installation, home renovation, DPCon India'
    },

    // 4. About Us Page
    {
        path: '/pages/about-us',
        title: 'Painting Contractors in Mumbai | Home Painting Services – DPCon India',
        description: 'Looking for expert painting contractors in Mumbai? DPCon India offers reliable home painting services in Mumbai with trusted professionals for quality finishes.',
        keywords: 'painting contractors Mumbai, home painting services, professional painters, quality painting, DPCon India'
    },

    // 5. Blog Grid Page
    {
        path: '/blog/blog-grid',
        title: 'Facade cleaning services in mumbai | Facade restoration services in mumbai',
        description: 'DPCon India offers professional facade cleaning services in Mumbai and expert facade restoration services in Mumbai to keep your buildings spotless and well-maintained.',
        keywords: 'facade cleaning services Mumbai, facade restoration services, building cleaning, commercial cleaning, DPCon India'
    },

    // 6. Contact Us Page
    {
        path: '/pages/contact-us',
        title: 'Plumbing Services in Mumbai | Bathroom and Tiles Work Experts – DPCon India',
        description: 'DPCon India connects you with trusted professionals for plumbing services in Mumbai, bathroom tiles work in Mumbai, and expert tiles work for homes and offices.',
        keywords: 'plumbing services Mumbai, bathroom tiles work, tiles experts, contact DPCon India, get quote'
    },

    // 7. Crack Filling Services
    {
        path: '/services/service-details/67e4fb6d11d5f5a8a416ec38',
        title: 'Crack Filling Services in Mumbai | Expert Wall and Ceiling Repairs – DPCon India',
        description: 'DPCon India specializes in reliable crack filling services in Mumbai. Our professional team delivers long-lasting crack filling services in Mumbai for homes and commercial spaces.',
        keywords: 'crack filling services Mumbai, wall repair, ceiling repair, crack repair, DPCon India'
    },

    // 8. Building Painting Services
    {
        path: '/services/service-details/67bec42efc8baa5726a62beb',
        title: 'Building Painting Services in Mumbai | Painting Contractors in Mumbai',
        description: 'DPCon India connects you with trusted painting contractors in Mumbai for professional building painting services and expert home painting solutions. Quality, reliable, and hassle-free service.',
        keywords: 'building painting services Mumbai, painting contractors, professional painting, home painting, DPCon India'
    },

    // 9. Waterproofing Services
    {
        path: '/services/service-details/67cfd623a94130f4469f4904',
        title: 'Waterproofing Services in Mumbai | Water Leakage Detection Experts – DPCon India',
        description: 'DPCon India offers reliable waterproofing services in Mumbai along with advanced water leakage detection services in Mumbai to protect your home and buildings from damage.',
        keywords: 'waterproofing services Mumbai, water leakage detection, leak repair, waterproofing contractors, DPCon India'
    },

    // 10. Tiles Work Services
    {
        path: '/services/service-details/67d13a23a94130f4469fdec4',
        title: 'Tiles Work in Mumbai | Professional Tiling Services – DPCon India',
        description: 'DPCon India provides expert tiles work in Mumbai, offering high-quality tiles installation and finishing for bathrooms, kitchens, floors, and commercial spaces.',
        keywords: 'tiles work Mumbai, tiling services, tiles installation, bathroom tiles, kitchen tiles, DPCon India'
    },

    // 11. Bathroom Tiles Work
    {
        path: '/services/service-details/67d13c1da94130f4469fe030',
        title: 'Bathroom Tiles Work in Mumbai | DPCon India',
        description: 'DPCon India offers expert bathroom tiles work in Mumbai with professional installation, quality materials, and reliable service for homes and commercial spaces.',
        keywords: 'bathroom tiles work Mumbai, bathroom renovation, tiles installation, bathroom remodeling, DPCon India'
    },

    // 12. Waterproofing Painting Services
    {
        path: '/services/service-details/67d1896ca94130f4469fefeb',
        title: 'Waterproofing Painting Services in Mumbai | DPCon India',
        description: 'DPCon India offers professional waterproofing painting services in Mumbai to protect your walls and buildings from leaks, dampness, and weather damage with lasting results.',
        keywords: 'waterproofing painting Mumbai, waterproof paint, damp proofing, weather protection, DPCon India'
    },

    // 13. Building Repair Services
    {
        path: '/services/service-details/67d161bea94130f4469fe48d',
        title: 'Building repair services in mumbai | Civil contractor services in Mumbai',
        description: 'DPCon India offers reliable building repair services in Mumbai and professional civil contractor services to deliver quality construction and maintenance solutions.',
        keywords: 'building repair services Mumbai, civil contractor services, construction services, building maintenance, DPCon India'
    },

    // Blog (general)
    {
        path: /^\/blog(\/|$)/, // Matches /blog, /blog/, /blog/*
        title: (pathname: string) => {
            if (pathname === '/blog' || pathname === '/blog/') {
                return 'Latest Articles & News - DPCon India Blog';
            } else if (pathname.startsWith('/blog/')) {
                return 'DPCon India Blog';
            }
            return 'DPCon India Blog';
        },
        description: 'Stay updated with the latest construction trends, home improvement tips, and industry insights from DPCon India\'s expert team in Mumbai.',
        keywords: 'construction blog, home improvement tips, Mumbai construction news, renovation ideas, DPCon India blog'
    },

    // Blog Details
    {
        path: /^\/blog\/blog-details/,
        title: (pathname: string) => 'Blog Post | DPCon India',
        description: 'Read our latest blog post with expert insights and tips from DPCon India.',
        keywords: 'construction blog, renovation tips, home improvement, DPCon India blog'
    },

    // Service Details (dynamic)
    {
        path: /^\/services\/service-details\/[a-zA-Z0-9]+$/,
        title: () => 'Service Details | DPCon India',
        description: 'Learn more about our professional construction and renovation services in Mumbai. DPCon India delivers quality and reliability for every project.',
        keywords: 'construction services, renovation services Mumbai, professional contractors, DPCon India services'
    },

    // 404 Page
    {
        path: '*',
        title: 'Page Not Found | DPCon India',
        description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
        noIndex: true
    }
];

const DocumentHead = () => {
    // Debug: Log when component mounts/updates
    console.log('=== DocumentHead Component Mounted/Updated ===');

    const location = useLocation();
    const { pathname, search } = location;

    // Debug: Log location changes
    console.log('🔍 Location changed:', {
        pathname,
        search,
        fullPath: `${pathname}${search}`,
        timestamp: new Date().toISOString()
    });

    // Debug: Log all available meta tags
    console.log('📋 Available meta tags in config:', metaTags.map(tag => ({
        path: tag.path.toString(),
        title: typeof tag.title === 'function' ? '[Function]' : tag.title,
        matches: isMatchingPath(pathname, tag.path) ? '✅' : '❌'
    })));

    // Find the meta tag configuration for the current path
    const matchedIndex = metaTags.findIndex(tag => isMatchingPath(pathname, tag.path));
    let currentMeta = matchedIndex >= 0 ? metaTags[matchedIndex] : undefined;

    if (!currentMeta) {
        console.warn('⚠️ No specific meta tags found for path, using fallback');
        currentMeta = metaTags.find(tag => tag.path === '*');
    } else {
        console.log('🎯 Using meta tags for path:', pathname, '(Index:', matchedIndex, ')');
        console.log('📝 Found meta object:', {
            index: matchedIndex,
            path: currentMeta.path,
            title: typeof currentMeta.title === 'function' ? '[Function]' : currentMeta.title,
            description: typeof currentMeta.description === 'function' ? '[Function]' : currentMeta.description.substring(0, 100) + '...'
        });
    }

    if (!currentMeta) {
        console.error('❌ No meta tags found for path (including fallback):', pathname);
        return null;
    }

    // Get meta values
    const title = getMetaValue(currentMeta.title, pathname);
    const description = getMetaValue(currentMeta.description, pathname);
    const keywords = currentMeta.keywords ? getMetaValue(currentMeta.keywords, pathname) : '';

    console.log('🏷️ Extracted values:', {
        rawTitle: currentMeta.title,
        processedTitle: title,
        rawDesc: typeof currentMeta.description === 'string' ? currentMeta.description.substring(0, 50) + '...' : '[Function]',
        processedDesc: description.substring(0, 50) + '...'
    });
    const cleanPath = pathname.split('?')[0];
    const canonicalUrl = `https://www.dpconindia.com${cleanPath}${search || ''}`;
    const robotsContent = currentMeta.noIndex ? 'noindex, nofollow' : 'index, follow';

    console.log('Setting meta tags:', { title, description, keywords, canonicalUrl });

    // Remove the site name from individual page titles since it's already in the title
    const pageTitle = title.endsWith(' | DPCon India')
        ? title
        : `${title} | DPCon India`;

    return (
        <Helmet
            // This ensures Helmet knows when the route changes
            key={pathname}
            // Use a simpler title template to prevent duplication
            titleTemplate="%s"
            defaultTitle="DPCon India | Professional Construction & Renovation Services"
        >
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robotsContent} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {/* Additional meta tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        </Helmet>
    );
};

export default DocumentHead;
