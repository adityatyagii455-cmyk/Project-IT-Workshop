# NSS (National Seva Sangh) IIIT-NR Unit Website

A professional, responsive, and delightful website for the National Seva Sangh IIIT-NR unit. Built with pure HTML, CSS, and minimal vanilla JavaScript for optimal performance and accessibility.

## 🚀 Quick Start

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **No build process required**: The site works directly from the file system
3. **No dependencies**: Everything is self-contained

## 📁 Project Structure

```
NSS-Website/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Complete stylesheet with CSS variables
├── scripts/
│   └── main.js            # Minimal vanilla JavaScript
├── assets/
│   └── placeholder/       # Placeholder images and icons
│       ├── photo-01.jpg   # Gallery images (6 total)
│       ├── photo-02.jpg
│       ├── photo-03.jpg
│       ├── photo-04.jpg
│       ├── photo-05.jpg
│       ├── photo-06.jpg
│       ├── hero-image.jpg # Hero section image
│       ├── about-image.jpg # About section image
│       ├── nss-logo.svg   # NSS logo
│       ├── icon-education.svg
│       ├── icon-health.svg
│       ├── icon-environment.svg
│       └── icon-community.svg
└── README.md              # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: `#2563eb` (Muted Blue)
- **Primary Dark**: `#1d4ed8` (Darker Blue)
- **Accent**: `#f59e0b` (Saffron)
- **Text Primary**: `#1f2937` (Dark Gray)
- **Text Secondary**: `#6b7280` (Medium Gray)
- **Background**: `#ffffff` (White)
- **Background Secondary**: `#f9fafb` (Off-white)

### Typography
- **Headings**: Playfair Display (Google Fonts)
- **Body Text**: Inter (Google Fonts)
- **Responsive**: Uses `rem` and viewport units

### CSS Variables
All colors, spacing, and design tokens are defined in CSS variables at the top of `main.css` for easy customization:

```css
:root {
  --primary-color: #2563eb;
  --accent-color: #f59e0b;
  --spacing-md: 1rem;
  --radius-lg: 0.75rem;
  /* ... and more */
}
```

## 🔧 Customization Guide

### 1. Replace Images

**Gallery Photos** (`assets/placeholder/`):
- Replace `photo-01.jpg` through `photo-06.jpg` with your actual photos
- Recommended size: 800x600px or similar aspect ratio
- Format: JPG, PNG, or WebP

**Hero Image**:
- Replace `hero-image.jpg` with your main hero image
- Recommended size: 1200x800px
- Should represent your NSS unit's activities

**About Image**:
- Replace `about-image.jpg` with a group photo or activity image
- Recommended size: 600x400px

**Logo**:
- Replace `nss-logo.svg` with your actual NSS logo
- SVG format preferred for scalability

**Icons**:
- Replace icon files in `assets/placeholder/` with your preferred icons
- SVG format recommended

### 2. Update Content

**Achievements Section**:
Look for this comment in `index.html`:
```html
<!-- ADD ACHIEVEMENTS HERE -->
```

Replace the placeholder achievement cards with your actual achievements.

**Contact Information**:
Update the contact details in the Contact section:
- Email: `nss@iiitnr.edu.in`
- Phone: `+91 98765 43210`
- Address: IIIT-NR Campus, Naya Raipur, Chhattisgarh - 493661

**About Section**:
- Update the IIIT-NR NSS unit description
- Modify the statistics (volunteers, initiatives, beneficiaries)

### 3. Color Customization

To change the color scheme, modify the CSS variables in `styles/main.css`:

```css
:root {
  --primary-color: #your-color;     /* Main brand color */
  --accent-color: #your-accent;     /* Accent color */
  --text-primary: #your-text;       /* Main text color */
  /* ... */
}
```

### 4. Add More Gallery Items

To add more photos to the gallery:

1. Add the image file to `assets/placeholder/`
2. Copy a gallery item in `index.html`:
```html
<div class="gallery-item" data-category="your-category">
    <img src="assets/placeholder/your-image.jpg" alt="Description" class="gallery-img">
    <div class="gallery-overlay">
        <h3 class="gallery-title">Your Title</h3>
        <p class="gallery-desc">Your description</p>
    </div>
</div>
```

## ✨ Features

### Responsive Design
- **Desktop**: Full layout with side-by-side content
- **Tablet**: Adjusted grid layouts and spacing
- **Mobile**: Single column layout with hamburger menu

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- Skip links for navigation
- Proper ARIA labels
- High contrast ratios
- Focus indicators

### Animations & Interactions
- Smooth scroll animations
- Hover effects on cards and buttons
- Mobile menu toggle
- Gallery lightbox
- Filter functionality
- Tab switching
- Scroll-triggered animations

### Performance
- Minimal JavaScript (~200 lines)
- CSS-only animations where possible
- Optimized images
- No external dependencies
- Fast loading times

## 🎯 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features

- Hamburger menu with smooth animations
- Touch-friendly buttons (44px minimum)
- Responsive gallery grid
- Optimized typography scaling
- Swipe-friendly interactions

## 🖨️ Print Styles

The website includes print-optimized styles:
- Removes navigation and decorative elements
- Optimizes achievement cards for printing
- Maintains readability in black and white
- Uses the "Print Achievements" button for best results

## 🔍 SEO & Meta Tags

The HTML includes:
- Proper meta descriptions
- Semantic HTML structure
- Alt attributes for images
- Open Graph ready structure

## 🛠️ Development Notes

### JavaScript Features
- Mobile menu toggle
- Gallery lightbox with keyboard navigation
- Smooth scrolling navigation
- Filter functionality
- Tab switching
- Form handling with mailto fallback
- Scroll animations with Intersection Observer
- Accessibility enhancements

### CSS Architecture
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- CSS custom properties (variables)
- BEM-like naming convention
- Organized sections: base, layout, components, utilities

## 🚨 Important Notes

### Image Requirements
- Use high-quality images for best results
- Optimize images for web (compress without losing quality)
- Maintain consistent aspect ratios for gallery items
- Use descriptive alt text for accessibility

### Content Guidelines
- Keep descriptions concise and engaging
- Use consistent terminology throughout
- Update contact information regularly
- Add new achievements as they occur

### Maintenance
- Test the website on different devices regularly
- Update content and images as needed
- Check for broken links periodically
- Keep the design fresh with new photos

## 🎨 Customization Examples

### Changing the Primary Color
```css
:root {
  --primary-color: #059669; /* Green theme */
  --primary-dark: #047857;
}
```

### Adding a New Gallery Category
1. Add filter button:
```html
<button class="filter-btn" data-filter="new-category">New Category</button>
```

2. Add gallery items with the new category:
```html
<div class="gallery-item" data-category="new-category">
  <!-- content -->
</div>
```

### Modifying Spacing
```css
:root {
  --spacing-lg: 2rem; /* Increase large spacing */
  --spacing-xl: 3rem; /* Increase extra large spacing */
}
```

## 📞 Support

For questions or issues:
1. Check this README first
2. Review the HTML comments for guidance
3. Test in different browsers
4. Validate HTML and CSS if needed

## 📄 License

This website template is provided for educational and non-commercial use. Please respect the NSS guidelines and use appropriately.

---

**Built with ❤️ for the National Seva Sangh IIIT-NR community**