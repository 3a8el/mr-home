Mr. Home Website — Project Summary
Project Overview
Building a luxury interior design portfolio website for Mr. Home brand — a specialized manufacturer of custom Kitchens, Dressing Rooms, and Architectural Woodwork based in Abu Dhabi, UAE.
Live URL: https://mr-home.vercel.app/
GitHub: https://github.com/3a8el/mr-home
Figma: https://www.figma.com/design/Dimv5tb7vs745nI2L0poAD/Mr.-Home

Tech Stack

Pure HTML / CSS / Vanilla JS — no framework
GSAP + ScrollTrigger — all animations
Lenis (@studio-freight/lenis@1.0.42) — smooth scroll
Google Fonts — Montserrat
Hosted on Vercel, connected to GitHub (auto-deploy on push)


Project Structure
mr-home/
├── index.html          ← Home page
├── css/
│   ├── style.css       ← Global styles (all pages share this)
│   ├── about.css       ← About Us page styles
│   ├── contact.css     ← Contact page styles
├── js/
│   ├── main.js         ← Global JS (all pages)
│   ├── about.js        ← About page animations
│   ├── contact.js      ← Contact form + animations
├── pages/
│   ├── about.html      ← About Us (in progress)
│   ├── contact.html    ← Contact Us (done)
│   ├── projects.html   ← Not started
│   └── project.html    ← Not started
└── assets/images/

Design System
css--yellow-600: #E9C91C
--gs-100: #FFFFFF
--gs-200: #FAFAFA
--gs-1100: #252525
--gs-1200: #000000
Font body: Montserrat
Font display: Palatino/Georgia (simulating "Helony" serif)

Completed Pages
Home Page (index.html) ✅
Sections:

Hero — full viewport, dark bg, logo top-left, nav top-right, large serif title, subtitle, avatar stack, scroll widget
Journey + Services — textured card, staircase title "Since 2020 / we've been / driven by / a simple passion:", paragraph + button right, 3 service cards (Kitchens, Dressing Rooms, Architectural Woodwork)
Featured Projects — 3 panels expand from center on scroll (GSAP ScrollTrigger + clip-path), sticky container, 400vh track
CTA — "Transforming / Visions / Into Reality" with yellow highlight + brackets
Footer — nav links, social icons, contact info, MR.HOME watermark SVG (opacity 0.1, mix-blend-mode multiply), sticky bottom bar, yellow ribbon

Key Features:

Preloader with percentage bar + counter, clips upward when done
Page transition curtain (dark panel wipes in/out between pages)
Lenis smooth scroll (lerp: 0.08)
Custom cursor — white dot + ring, mix-blend-mode: difference, hides until first mousemove, detects hover via getBoundingClientRect (works in GSAP-pinned elements)
Mobile hamburger menu — ExoApe style, clip-path wipe animation
All GSAP animations wrapped in existence checks (safe on all pages)

Nav links (home page):
index.html → pages/about.html → pages/projects.html → pages/contact.html
Contact Us Page (pages/contact.html) ✅

Dark hero with "Connect With Us" title + 3 info cards (Address, Contact, Socials)
Form — name, phone, email, role dropdown, location dropdown, message textarea
Yellow focus underline on form fields
Submit button with success animation
Same footer as home

About Us Page (pages/about.html) 🔄 In Progress
Sections built:

Hero — height: 100vh, background: #000000, 50/50 split layout

Left (50%): "The Mr. Home Story" title (50px, display font), yellow highlight with left/right brackets + corner dots, subtitle, description, scroll widget
Right (50%): 4-image vertical grid, 4th image deliberately bleeds below hero


Journey — "Mr. Home's Journey" text, company history
Image collage — 2 overlapping images with parallax
The Mr. Home Difference — textured card, 4 culture cards (Excellence, Innovation, Passion, Reliability)
Sustainability — full-width image, "From Nature to Nurture"
CTA — same as home
Footer — same as home

Current About hero issues being fixed:

50/50 column split ✅
64px left padding ✅
180px content from top ✅
4th image bleeds below hero ✅ (grid height = calc(100vh - 84px + 140px))
Background #000000 ✅
Title highlight brackets ✅ (using .about-title-bracket-r, .about-title-dot-tr, .about-title-dot-bl spans in HTML)


Global JS Features (main.js)
javascript// All wrapped in existence checks for safety on non-home pages:
if (document.querySelector('#about')) { /* journey animations */ }
if (document.querySelector('.service-card')) { /* clip reveal */ }
if (document.querySelector('.project-track')) { /* expand panels */ }
if (document.querySelector('.section-cta')) { /* CTA animations */ }

// Always runs on all pages:
- Lenis smooth scroll
- Preloader (only fires if #preloader exists)
- Custom cursor (hidden until first mousemove)
- Mobile hamburger menu (ExoApe clip-path style)
- Page transition curtain
- Footer animations
- Button hover glow
- Desktop nav — shared yellow bar slides between links

Still To Do

About Us — finish and polish remaining sections
Projects page — grid with filtering
Project Single page — individual project detail
Fix nav links on home — SVG arrows got corrupted during link replacement, fixed manually
Real images — Figma asset URLs expire in 7 days
SEO — meta tags, favicon, og:image


Git Workflow
bash# After any change, in VS Code terminal (D:\mr-home):
git add .
git commit -m "description"
git push
# Vercel auto-redeploys in ~30 seconds
Important Notes

Nav SVG arrow path: M6.69937 9.67397L7.67848 6.01985L8.28354 3.78451C8.53671 2.83968 7.97421 1.8654 7.02938 1.61223L1.1327 0.0322193C0.358619 -0.175195 -0.274373 0.661765 0.121461 1.34737L2.45896 5.39604L5.05479 9.89215C5.45479 10.585 6.49195 10.4481 6.69937 9.67397Z
Pages in /pages/ folder use ../css/ and ../js/ for asset paths
The watermark SVG uses mix-blend-mode: multiply + opacity: 0.1
Cursor uses getBoundingClientRect() for hover detection (not elementFromPoint) because GSAP pinning breaks elementFromPoint