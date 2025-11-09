const fs = require('fs');
const path = require('path');
const axios = require('axios');

const api = 'https://api.dpconindia.com/api/';

const fetchServices = async () => {
  try {
    const { data } = await axios.get(`${api}service`);
    return data || [];
  } catch (error) {
    console.log('⚠️ Could not fetch services:', error.message);
    return [];
  }
};

const updatePackageJson = async () => {
  const services = await fetchServices();
  console.log(`✅ Found ${services.length} services`);
  
  const staticPages = [
    "/",
    "/home", 
    "/services/service-list",
    "/pages/gallery",
    "/pages/about-us",
    "/pages/contact-us",
    "/blog/blog-grid"
  ];
  
  const servicePages = services.map(service => `/services/service-details/${service._id}`);
  const allPages = [...staticPages, ...servicePages];
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.reactSnap.include = allPages;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  
  console.log(`🎉 Updated react-snap with ${allPages.length} pages!`);
};

updatePackageJson().catch(console.error);