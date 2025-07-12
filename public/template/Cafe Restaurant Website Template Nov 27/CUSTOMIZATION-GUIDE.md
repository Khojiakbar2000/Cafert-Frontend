# 🎨 Cafert Website Customization Guide

## Quick Start - Make It Your Own!

### 1. 🏠 Update Your Business Information

**File: `Template/index.html` (and other pages)**

Find and replace:
```html
<!-- Replace "Cafert" with your business name -->
<title>Home | Your Business Name</title>

<!-- Update the logo text -->
<a class="logo h3" href="index.html">
    <span class="logo_img">...</span>
    Your Business Name
</a>

<!-- Update contact information -->
<div class="contact-info">
    <p>Your Address Here</p>
    <p>Phone: (555) 123-4567</p>
    <p>Email: info@yourbusiness.com</p>
</div>
```

### 2. 📸 Replace Images

**Folder: `Template/img/`**

Replace these key images:
- Hero/banner images
- Menu item photos
- Team member photos
- Gallery images
- Logo (if you have one)

**Recommended image sizes:**
- Hero images: 1920x1080px
- Menu items: 400x300px
- Team photos: 300x400px
- Gallery: 800x600px

### 3. 🍽️ Customize Your Menu

**File: `Template/menu.html`**

Update menu categories and items:
```html
<!-- Example menu item -->
<div class="menu-item">
    <div class="menu-item_img">
        <img src="img/your-dish.jpg" alt="Your Dish Name">
    </div>
    <div class="menu-item_content">
        <h4>Your Dish Name</h4>
        <p>Description of your delicious dish...</p>
        <span class="price">$12.99</span>
    </div>
</div>
```

### 4. 👥 Add Your Team

**File: `Template/team.html`**

Replace team member information:
```html
<div class="team-member">
    <img src="img/team-member.jpg" alt="Team Member Name">
    <h4>Team Member Name</h4>
    <p>Position/Role</p>
    <p>Brief description about this team member...</p>
</div>
```

### 5. 📞 Update Contact Information

**Files: `Template/contacts.html`, `Template/reservations.html`**

Update:
- Business address
- Phone numbers
- Email addresses
- Social media links
- Opening hours

### 6. 🎨 Customize Colors (Optional)

**File: `Template/css/index.css`**

Find CSS variables and update:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --accent-color: #your-color;
}
```

### 7. 📝 Add Your Content

**Blog: `Template/blog.html`**
- Add your own blog posts
- Update post titles and content
- Add relevant images

**About: `Template/about.html`**
- Tell your business story
- Add your mission and values
- Include your history

**Services: `Template/services.html`**
- List your services
- Add service descriptions
- Include pricing if applicable

## 🚀 Next Steps

1. **Test Everything**: Click through all pages and links
2. **Mobile Test**: Check how it looks on phones and tablets
3. **Contact Forms**: Test the contact and reservation forms
4. **Images**: Optimize images for web (compress them)
5. **SEO**: Update meta titles and descriptions
6. **Analytics**: Add Google Analytics if needed

## 📱 Mobile Optimization

The template is already mobile-responsive, but check:
- Text readability on small screens
- Button sizes on mobile
- Image loading speed
- Touch-friendly navigation

## 🔧 Advanced Customization

### Adding New Pages
1. Copy an existing HTML file
2. Rename it (e.g., `special-events.html`)
3. Update the navigation menu
4. Customize the content

### Changing Fonts
1. Add your font files to `Template/fonts/`
2. Update CSS font-family declarations
3. Test across different browsers

### Adding Animations
The template uses AOS (Animate On Scroll) library:
```html
<div data-aos="fade-up" data-aos-duration="1000">
    Your content here
</div>
```

## 🎯 Business-Specific Tips

**For Restaurants:**
- Add online ordering links
- Include allergen information
- Show daily specials

**For Cafes:**
- Highlight coffee origins
- Add loyalty program info
- Show cozy atmosphere photos

**For Bakeries:**
- Add custom cake ordering
- Show baking process
- Include ingredient sourcing

**For Bars:**
- Add cocktail menus
- Show events/entertainment
- Include age verification

## 📞 Need Help?

- Check the `Documentation/` folder
- Visit: https://docs.merkulov.design/category/html-templates/
- Test everything thoroughly before going live!

---

**Remember**: Start with the basics (business info, images, menu) and gradually add more features. The template is designed to be easy to customize! 🎉 