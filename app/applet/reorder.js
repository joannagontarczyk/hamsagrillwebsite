const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update menu array
content = content.replace(
  /\['About', 'Gallery', 'Services', 'Location', 'Menu', 'Order'\]/,
  "['About', 'Services', 'Gallery', 'Location', 'Menu', 'Order']"
);

// 2. Extract sections
const extractSection = (startMarker, endMarker) => {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex);
  if (startIndex === -1 || endIndex === -1) throw new Error(`Could not find ${startMarker} or ${endMarker}`);
  const section = content.substring(startIndex, endIndex);
  content = content.substring(0, startIndex) + content.substring(endIndex);
  return section;
};

// Markers
const orderStart = '      {/* Order Portals Section */}';
const orderEnd = '      {/* Services / Menu Section */}';

const servicesStart = '      {/* Services / Menu Section */}';
const servicesEnd = '      {/* Menu Section */}';

const menuStart = '      {/* Menu Section */}';
const menuEnd = '      {/* About Section - Asymmetrical Layout */}';

const aboutStart = '      {/* About Section - Asymmetrical Layout */}';
const aboutEnd = '      {/* Gallery Section */}';

const galleryStart = '      {/* Gallery Section */}';
const galleryEnd = '      {/* Location & Contact - Glassmorphism */}';

const locationStart = '      {/* Location & Contact - Glassmorphism */}';
const locationEnd = '      {/* Customer Reviews */}';

const reviewsStart = '      {/* Customer Reviews */}';
const reviewsEnd = '      {/* Footer */}';

// Extract all sections in reverse order of their appearance to avoid messing up indices
const reviews = extractSection(reviewsStart, reviewsEnd);
const location = extractSection(locationStart, locationEnd);
const gallery = extractSection(galleryStart, galleryEnd);
const about = extractSection(aboutStart, aboutEnd);
const menu = extractSection(menuStart, menuEnd);
const services = extractSection(servicesStart, servicesEnd);
const order = extractSection(orderStart, orderEnd);

// Now content has a gap where all these sections were.
// The gap is right before {/* Footer */}
const footerIndex = content.indexOf('      {/* Footer */}');

const newOrder = about + services + gallery + location + reviews + menu + order;

content = content.substring(0, footerIndex) + newOrder + content.substring(footerIndex);

// 3. Remove the footer top section
const footerTopStart = '          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">';
const footerTopEnd = '          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-sm text-neutral-500">';

const ftStartIdx = content.indexOf(footerTopStart);
const ftEndIdx = content.indexOf(footerTopEnd);

if (ftStartIdx !== -1 && ftEndIdx !== -1) {
  content = content.substring(0, ftStartIdx) + content.substring(ftEndIdx);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Done');
