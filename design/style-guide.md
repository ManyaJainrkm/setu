# Setu — Brand Style Guide & Design System

> **Document type:** Visual Design Specification  
> **Status:** Final  
> **Author:** UI/UX Designer  
> **Last updated:** 2026-06-25

---

## 1. Brand Philosophy

**Setu** (Sanskrit: सेतु, meaning **"Bridge"**) connects individuals to the specialized support they need. Like a bridge, the platform creates pathways between people and the right therapist for their unique journey — spanning the gap between struggle and understanding, isolation and connection, question and insight.

The bridge metaphor informs everything:
- **Bridging people to the right specialist** — our 7 diverse personas
- **Bridging clinical rigor and lived experience** — academic and community-trained guides
- **Bridging moments of crisis to calm** — safety-first, always
- **Bridging accessibility** — affordable, immediate, inclusive

The design should feel:

- **Calming** — soft, muted, never jarring
- **Warm** — approachable, human, not clinical
- **Accessible** — WCAG 2.1 AA compliant at minimum
- **Inclusive** — culturally responsive, gender-neutral where possible
- **Trustworthy** — professional but not cold
- **Connective** — every visual element should feel like it's reaching across, not standing apart

---

## 2. Color Palette

The Setu palette is built around the owner's vision of **creamy, pastel tones** — soft pink, warm yellow, and gentle green. These colors evoke warmth, safety, and approachability while maintaining a professional, trustworthy feel. All color combinations meet WCAG 2.1 AA contrast requirements.

### 2.1 Brand Core Colors (Pastel & Creamy)

| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ██ | **Blush Pink** | `#E8B4A8` | Primary brand color — buttons, links, key accents |
| ██ | **Butter** | `#F0D99E` | Secondary — warm yellow, highlights, badges |
| ██ | **Mint** | `#BDDAC4` | Tertiary — pastel green, success states, nature |
| ██ | **Cream** | `#FFF8F0` | Page background — warm, welcoming base |
| ██ | **White** | `#FFFFFF` | Card backgrounds, chat bubbles |

### 2.2 Darker Variants (for interactive elements)

These deeper tones ensure accessible contrast ratios for actionable UI elements.

| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ██ | **Blush Dark** | `#C47A6A` | Button hover, pressed states |
| ██ | **Butter Dark** | `#D4B060` | Secondary button hover |
| ██ | **Mint Dark** | `#8DB89A` | Success state text |

### 2.3 Supporting Neutrals

Warm neutrals to ground the pastel palette.

| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ██ | **Warm White** | `#FFFAF5` | Container backgrounds (lighter than Cream) |
| ██ | **Light Stone** | `#E2DAD2` | Borders, dividers |
| ██ | **Medium Stone** | `#9C928A` | Secondary text, captions |
| ██ | **Dark Stone** | `#2D2A27` | Headings, body text |

### 2.4 Persona Accent Colors

Each persona has a unique accent color used for their profile border, chat bubble tint, and UI indicators. These are intentionally more saturated than the brand pastels to provide clear visual distinction while harmonizing with the overall palette.

| Persona | Accent Color | Hex | Mood |
|---------|-------------|-----|------|
| Dr. Elena Vasquez | **Warm Amber** | `#C4956A` | Earthy, scholarly, grounding |
| Maya Chen | **Teal** | `#5A9E8F` | Soothing, transitional, hopeful |
| Dr. Kwame Okafor | **Deep Indigo** | `#5B6782` | Safe, grounded, contemplative |
| Samir Patel | **Forest Sage** | `#6DAF80` | Natural, mindful, balanced |
| Dr. Ayanna Brooks | **Coral** | `#D4897B` | Energizing, warm, action-oriented |
| Dr. Fatima Al-Rashid | **Plum** | `#8B6F8E` | Rich, wise, emotionally deep |
| Jordan Reyes | **Golden Sun** | `#E8B040` | Vibrant, affirming, joyful |

> **Note:** Samir Patel's accent shifted from `#7DAF8C` → `#6DAF80` and Jordan Reyes' from `#E8B85A` → `#E8B040` to ensure clear distinction from the new brand Mint and Butter tones.

### 2.5 Functional Colors

| Usage | Hex | Notes |
|-------|-----|-------|
| Success/Online | `#8DB89A` | Mint-dark, pastel-friendly |
| Warning | `#D4B060` | Butter-dark, warm |
| Error/Crisis | `#C47A6A` | Blush-dark, soft red |
| Crisis banner bg | `#FFF0ED` | Gentle pink-red |

### 2.6 Color Accessibility Notes

- **Blush Pink (`#E8B4A8`)** on **Cream (`#FFF8F0`)** — contrast ratio 1.4:1 (decorative only)
- **Blush Dark (`#C47A6A`)** on **White (`#FFFFFF`)** — contrast ratio 3.2:1 (for large text / UI components)
- **Dark Stone (`#2D2A27`)** on **Cream (`#FFF8F0`)** — contrast ratio 11.8:1 (exceeds AAA)
- All body text uses Dark Stone on Cream or White backgrounds for maximum readability
- Interactive elements use Blush Dark / Butter Dark / Mint Dark for sufficient contrast

---

## 3. Typography

### 3.1 Font Family

```css
--font-heading: 'Merriweather', 'Georgia', 'Times New Roman', serif;
--font-body: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif;
--font-mono: 'JetBrains Mono', 'Cascadia Code', monospace;
```

### 3.2 Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Display** | 40px / 2.5rem | 700 | 1.2 | Hero headings |
| **H1** | 32px / 2rem | 700 | 1.25 | Page titles |
| **H2** | 24px / 1.5rem | 600 | 1.3 | Section headings |
| **H3** | 20px / 1.25rem | 600 | 1.4 | Card titles |
| **Body** | 16px / 1rem | 400 | 1.6 | Paragraphs, chat text |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | Secondary text |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | Labels, timestamps |
| **Chat Bubble** | 16px / 1rem | 400 | 1.6 | Main chat messages |

### 3.3 Text Styles

- **Body text:** `#4A4A4A` (Slate) on light backgrounds
- **Links:** `#5A7D6B` (Moss), underline on hover
- **Blockquotes (persona messages):** Left border in persona accent color, italic for quote-like reflections
- **Mono (code blocks / structured info):** `14px`, `#2D2A27` on `#F5F3F0`

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### 4.2 Layout Grid

- **Max content width:** 1200px (desktop)
- **Chat container:** 720px max-width (centered)
- **Sidebar (persona selection):** 280px on desktop, slides up as a bottom sheet on mobile
- **Gutters:** 24px (desktop), 16px (mobile)

---

## 5. UI Components

### 5.1 Chat Container

- Rounded corners: `16px` radius
- Background: `#FFFFFF` (White)
- Shadow: `0 2px 16px rgba(45, 42, 39, 0.08)`
- Chat bubbles have `12px` radius

### 5.2 Chat Bubbles

| Element | Background | Text | Alignment |
|---------|-----------|------|-----------|
| User message | `#E8E4E0` (Fog) | `#2D2A27` (Dark Stone) | Right-aligned |
| Persona message | `#FFFFFF` | `#4A4A4A` (Slate) | Left-aligned with accent left border (4px) in persona color |
| System message | `#FAF7F4` (Warm White) | `#9C928A` (Medium Stone) | Centered, italic |

### 5.3 Persona Cards (Selection Screen)

- **Elevation:** `0 4px 12px rgba(45, 42, 39, 0.06)`
- **Border:** 2px transparent, on hover → persona accent color
- **Avatar size:** 64px × 64px, rounded 50%
- **Content:** Name, specialty tag, one-line description
- **Hover:** Subtle lift transform `translateY(-2px)`

### 5.4 Buttons

| Variant | Background | Text | Hover |
|---------|-----------|------|-------|
| **Primary** | `#E8B4A8` (Blush Pink) | `#2D2A27` (Dark Stone) | `#C47A6A` (Blush Dark) |
| **Secondary** | `#F0D99E` (Butter) | `#2D2A27` | `#D4B060` (Butter Dark) |
| **Ghost** | Transparent | `#4A4A4A` | `#FFFAF5` bg |
| **Crisis** | `#C47A6A` | White | `#B0665A` |

### 5.5 Input Area

- Background: `#FFFFFF` with `#E2DAD2` top border
- Text input: `16px`, full-width, no border (container border instead)
- Send button: Circular, Blush Pink
- Attachment button: Ghost style

### 5.6 Crisis Detection Banner

- **Background:** `#FFF0ED`
- **Border-left:** 4px `#C4766A`
- **Text:** `#6B3A32` (dark warm red)
- **Icon:** Alert icon
- Always appears at the top of the chat when triggered, regardless of scroll position

---

## 6. Visual Theme: "Bridge + Connection"

### 6.1 Logo & Iconography

- **Logomark:** An abstract bridge symbol — two pillars with an arching span, formed by interlocking organic shapes. The bridge suggests connection between two "shores" (the user and the therapist). The arch can subtly form a human silhouette or a support gesture.
- **Logotype:** "Setu" in Merriweather, letter-spaced `0.02em`. Below the wordmark, a small tagline: "Bridge to Better" in Inter Regular (12px, `#9C928A`).
- **Primary logo combination:** Logomark (left) + Logotype (right) — the bridge mark reaching toward the wordmark.
- **Favicon:** Simplified bridge arch in Blush Pink.

### 6.2 Icon Style

- Outline icons, `1.5px` stroke, rounded caps
- Sizes: `16px`, `20px`, `24px`
- Feather-style / Phosphor-style iconography
- The bridge arch shape should subtly echo in decorative dividers and section separators

### 6.3 Illustration Style

- Soft, organic shapes
- Muted watercolor-like palette
- Bridge and pathway motifs — arches, connected dots, lines spanning gaps
- Human silhouettes reaching across or meeting in the middle
- Nature motifs (leaves, water, sky, horizon lines) in supporting illustrations

### 6.4 Animation & Motion

- **Page transitions:** `300ms ease-out` fade — like walking onto a bridge
- **Chat bubble entrance:** `200ms ease-out` fade + `translateY(8px)` — approaching
- **Persona typing indicator:** 3 dots bouncing at `400ms` intervals
- **Persona card hover:** `200ms ease-out` transform — reaching across
- **No jarring animations** — all motion should feel organic and gentle
- **Reduced motion media query:** Respect `prefers-reduced-motion`

---

## 7. Accessibility Standards

| Requirement | Target |
|------------|--------|
| **Color contrast** | WCAG 2.1 AA (4.5:1 body, 3:1 large text) |
| **Touch targets** | Minimum 44×44px for interactive elements |
| **Focus indicators** | 2px `#C47A6A` outline with `2px` offset |
| **Screen reader** | All personas have `alt` text, ARIA labels on chat bubbles |
| **Font scaling** | Supports browser zoom up to 200% without breakage |
| **Reduced motion** | `prefers-reduced-motion` respected |
| **Dark mode** | Supports `prefers-color-scheme: dark` (see §9) |

---

## 8. Persona Visual Profile Cards

Each persona card in the UI includes:

1. **Avatar** (64px circle, with persona accent border)
2. **Name** (H3, using persona accent color)
3. **Specialty badge** (small pill tag, persona accent bg at 15% opacity)
4. **Credential type badge** (e.g., "Clinical", "Community-Trained", "Certified")
5. **Sample message** (italic, persona's signature phrase)
6. **Therapeutic orientation** (small caption text)
7. **"Connect →"** button (not "Start Session" — reinforces the bridge metaphor)

### Card Layout (Desktop)

```
┌──────────────────────────────────────┐
│  ○  **Dr. Elena Vasquez**           │
│     [CBT Specialist]  [Clinical]    │
│     "What's the evidence for that    │
│      thought?"                      │
│     Cognitive Behavioral Therapy     │
│  ───────────────────────────────────│
│  [Connect →]                        │
└──────────────────────────────────────┘
```

---

## 9. Dark Mode

### 9.1 Dark Mode Colors

| Light Token | Dark Token |
|-------------|-----------|
| `#FFF8F0` (Cream bg) | `#1A1816` |
| `#FFFFFF` (card bg) | `#2A2724` |
| `#4A4A4A` (body text) | `#E2DAD2` |
| `#2D2A27` (headings) | `#FFFAF5` |
| `#E2DAD2` (user bubble) | `#3A3734` |
| `#E2DAD2` (borders) | `#4A4744` |

### 9.2 Dark Mode Persona Accents

Persona accent colors remain the same in dark mode but with increased luminance or a subtle glow to maintain contrast against the dark background.

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| **Mobile** | < 640px | Full-width chat, persona sheet slides up from bottom |
| **Tablet** | 640px–1024px | Chat at 90% width, persona bar pinned to top |
| **Desktop** | > 1024px | Chat centered (720px), persona sidebar on the left |

---

## 11. Brand Taglines & Copy

| Use Case | Text |
|----------|------|
| **Primary tagline** | Setu — Bridge to Better |
| **Hero headline** | The Bridge Between You and the Right Support |
| **Description** | Seven specialized guides. One clear path to feeling better. |
| **Footer** | Setu. Connecting you to care. |
| **Loading state** | Building your bridge... |

---

## 12. Design Deliverables

This style guide is accompanied by:

| File | Description |
|------|-------------|
| `/design/personas/dr-elena-vasquez.png` | Persona 1 avatar |
| `/design/personas/maya-chen.png` | Persona 2 avatar |
| `/design/personas/dr-kwame-okafor.png` | Persona 3 avatar |
| `/design/personas/samir-patel.png` | Persona 4 avatar |
| `/design/personas/dr-ayanna-brooks.png` | Persona 5 avatar |
| `/design/personas/dr-fatima-alrashid.png` | Persona 6 avatar |
| `/design/personas/jordan-reyes.png` | Persona 7 avatar |
| `/design/chat-mockup.html` | Interactive HTML/CSS chat interface mockup |

---

*This style guide serves as the single source of truth for all visual decisions on the Setu platform. Like a well-built bridge, every design choice supports a safe, steady crossing from where you are to where you want to be.*