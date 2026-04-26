const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update menu array
content = content.replace(
  /\['About', 'Gallery', 'Services', 'Location', 'Menu', 'Order'\]/,
  "['About', 'Services', 'Gallery', 'Location', 'Menu', 'Order']"
);

// Markers
const markers = [
  '      {/* Order Portals Section */}',
  '      {/* Services / Menu Section */}',
  '      {/* Menu Section */}',
  '      {/* About Section - Asymmetrical Layout */}',
  '      {/* Gallery Section */}',
  '      {/* Location & Contact - Glassmorphism */}',
  '      {/* Customer Reviews */}',
  '      {/* Footer */}'
];

const indices = markers.map(m => content.indexOf(m));

const order = content.substring(indices[0], indices[1]);
const services = content.substring(indices[1], indices[2]);
const menu = content.substring(indices[2], indices[3]);
const about = content.substring(indices[3], indices[4]);
const gallery = content.substring(indices[4], indices[5]);
const location = content.substring(indices[5], indices[6]);
const reviews = content.substring(indices[6], indices[7]);

const prefix = content.substring(0, indices[0]);
const suffix = content.substring(indices[7]);

// New order: About, Services, Gallery, Location, Reviews, Menu, Order
const newOrder = about + services + gallery + location + reviews + menu + order;

let newContent = prefix + newOrder + suffix;

// 3. Remove the footer top section
const footerTopStart = '          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">';
const footerTopEnd = '          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-sm text-neutral-500">';

const ftStartIdx = newContent.indexOf(footerTopStart);
const ftEndIdx = newContent.indexOf(footerTopEnd);

if (ftStartIdx !== -1 && ftEndIdx !== -1) {
  newContent = newContent.substring(0, ftStartIdx) + newContent.substring(ftEndIdx);
}

fs.writeFileSync('src/App.tsx', newContent);
console.log('Done');
