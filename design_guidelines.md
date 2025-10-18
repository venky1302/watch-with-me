# Watch With Me - Design Guidelines

## Design Approach: Reference-Based (Social + Media Platforms)

Drawing inspiration from **Discord's** approachable social interface, **Zoom's** clear video conferencing layout, **Netflix Party's** synchronized viewing experience, and **Airbnb's** welcoming invitation flows. The goal is to create something simpler, more engaging, and instantly accessible.

**Key Principles:**
- Instant clarity: Users understand what to do within 3 seconds
- Welcoming warmth: Friendly, non-technical, approachable
- Visual richness: Generous use of imagery, gradients, and depth
- Zero friction: Every interaction feels effortless

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 250 85% 60% (vibrant purple-pink) - CTAs, active states, brand moments
- Secondary: 215 75% 55% (bright blue) - secondary actions, links
- Background: 0 0% 98% (off-white)
- Surface: 0 0% 100% (white cards)
- Text: 220 15% 20% (dark charcoal)
- Borders: 220 10% 90% (subtle gray)

**Dark Mode:**
- Primary: 250 75% 65% (lighter purple-pink)
- Secondary: 215 70% 60% (lighter blue)
- Background: 220 20% 10% (deep charcoal)
- Surface: 220 18% 14% (elevated cards)
- Text: 0 0% 95% (near-white)
- Borders: 220 15% 25% (subtle borders)

**Accent Colors:**
- Success: 145 65% 50% (emerald green) - for active camera/mic
- Warning: 35 90% 60% (warm orange) - for notifications
- Error: 0 75% 60% (vibrant red) - for destructive actions

### B. Typography

**Fonts:** 
- Primary: 'Inter' (Google Fonts) - all UI elements, body text
- Display: 'Space Grotesk' (Google Fonts) - hero headlines, section titles

**Scale:**
- Headline: text-5xl/text-6xl font-bold (Space Grotesk)
- Subheadline: text-2xl/text-3xl font-semibold
- Section Title: text-xl font-semibold
- Body: text-base font-normal
- Caption: text-sm font-medium
- Label: text-xs font-semibold uppercase tracking-wide

### C. Layout System

**Spacing Units:** Consistent use of 4, 8, 12, 16, 24, 32 (Tailwind units)
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-24
- Grid gaps: gap-4, gap-6, gap-8

**Container Widths:**
- Landing page: max-w-7xl
- Room interface: Full viewport with sidebar pattern
- Modals/Cards: max-w-md to max-w-2xl

### D. Component Library

**Navigation:**
- Minimal top bar with logo and room code (in-room only)
- Mobile: Bottom sheet navigation for controls

**Buttons:**
- Primary: Gradient background (purple to pink), white text, rounded-full, shadow-lg
- Secondary: Outline with primary color, hover fill
- Icon buttons: Circular, subtle background, hover lift effect
- Size variants: px-6 py-3 (default), px-8 py-4 (large), p-2 (icon)

**Cards:**
- Background: Surface color
- Border: 1px solid border color
- Shadow: shadow-md on hover, shadow-lg
- Rounded: rounded-2xl
- Padding: p-6 to p-8

**Forms:**
- Input fields: rounded-xl, border-2, focus ring with primary color
- Avatar selector: Grid of circular images with selected state (ring-4 ring-primary)
- Labels: text-sm font-semibold, mb-2

**Video Components:**
- Main video: Large central area with rounded-xl overflow hidden
- Participant tiles: Grid layout, aspect-video, rounded-lg
- Controls overlay: Bottom-positioned, glass-morphism background (backdrop-blur-xl, bg-black/40)

**Chat Interface:**
- Right sidebar (desktop) or bottom sheet (mobile)
- Message bubbles: rounded-2xl, alternate alignment for self/others
- Reactions: Floating animated overlays on video
- Emoji/GIF picker: Popover with search

**Modals:**
- Centered overlay with backdrop-blur-sm
- Card-style with rounded-2xl, shadow-2xl
- Close button: Top-right, circular

### E. Animations

**Use Sparingly:**
- Button hover: subtle scale transform (scale-105)
- Card hover: gentle lift (shadow transition)
- Modal entrance: fade + scale from 95% to 100%
- Chat messages: slide-in from bottom
- Reactions: pop-in with spring physics (use CSS keyframes)
- Page transitions: crossfade (300ms)

---

## Page-Specific Guidelines

### Landing Page

**Hero Section (70vh):**
- Large, vibrant gradient background (purple to pink to blue)
- Centered content with headline, subheadline, and two prominent CTAs
- Background pattern: Subtle geometric shapes or abstract illustrations
- Include floating preview cards showing room experience (video thumbnails, chat bubbles)

**Features Section:**
- 3-column grid (lg:grid-cols-3)
- Each feature: Icon (large, gradient), title, description
- Icons use gradient fills matching brand colors

**How It Works Section:**
- Stepped process visualization (1-2-3)
- Split layout: Visuals on left, text on right (alternating)
- Include mockup images showing each step

**Social Proof/Trust Section:**
- Stats in 4-column grid: "X rooms created", "Y hours watched together"
- Large numbers with gradient text

**Final CTA Section:**
- Centered, bold call-to-action
- Gradient background matching hero
- Single large button "Start Watching Together"

**Footer:**
- Minimal: Logo, tagline, social links, privacy notice
- Background: Surface color

### Room Creation/Join Modals

**Layout:**
- Centered card (max-w-lg)
- Progress indicator at top (step 1/2/3)
- Form fields with generous spacing (space-y-6)
- Avatar grid: 8-12 options in grid-cols-4
- Prominent submit button at bottom

### In-Room Interface

**Layout Structure:**
- Main video area: Center-left (60-70% width on desktop)
- Sidebar: Right (30-40% width) - Chat + Participants
- Bottom controls: Floating bar with glass-morphism
- Mobile: Full-screen video, bottom sheet for chat

**Video Area:**
- Host screen/YouTube player: Full-width with rounded corners
- Participant video grid: Small tiles in corner or bottom row
- Reaction overlays: Floating emojis that rise and fade

**Control Bar:**
- Icons: Mic, Camera, Share Screen, Reactions, Settings, Leave
- Active state: Green glow for mic/camera
- Tooltips on hover

**Chat Sidebar:**
- Tabs: Chat | Participants (toggle on mobile)
- Message input: Bottom-pinned with emoji/GIF buttons
- Participant list: Avatars + names + host badge

**Host Controls:**
- Dropdown menu for each participant (mute, remove, ban)
- Transfer host: Modal confirmation
- Approve/Deny entry: Toast notification with actions

---

## Images

**Hero Section:**
- Large hero image: Illustration or photo showing diverse group enjoying content together (warm, inclusive vibes)
- Style: Modern, colorful illustration OR authentic photo with gradient overlay

**Feature Showcases:**
- Screenshots/mockups of key features (video sync, chat, reactions)
- Clean device frames (laptop/phone mockups)

**How It Works:**
- Step-by-step visual guides (animated or static)
- UI screenshots highlighting specific actions

**Avatars:**
- 12 pre-defined avatar images (diverse, friendly, illustrated style)
- Consistent art style across all avatars

---

## Responsive Behavior

**Desktop (lg+):** Side-by-side layouts, multi-column grids
**Tablet (md):** 2-column grids, stacked sections
**Mobile:** Single column, bottom sheets for modals, fullscreen video

All touch targets minimum 44x44px for accessibility.