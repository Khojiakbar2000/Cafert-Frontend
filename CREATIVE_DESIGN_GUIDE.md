# Creative Design Guide

Read this before proposing or implementing design work in Cafert. Carry these preferences into the work without waiting for reference screenshots or asking the user to invent the concept.

## What creative means

Invent a distinctive experience whose appearance, behavior, and content belong together. Typography, spacing, rounded corners, gradients, borders, and hover zooms improve execution; they do not constitute a creative concept.

Translate recognizable physical practices, objects, and environments into useful digital interactions. The object must belong to the subject, and its behavior must reveal useful, carefully presented content.

Examples of the standard include an invitation envelope revealing an event invitation, a hinged portrait revealing an artist's work, and a composed newspaper with a considered reading experience. These are examples of quality, not a library of metaphors to repeat. Find objects appropriate to each project.

## Cafert's identity

Source inspection establishes this starting context:

- Cafert is a café experience with coffee and food discovery, product browsing, and basket and order interfaces.
- The existing palette centers on espresso brown (`#534931`), caramel (`#B38E6A`), and cream (`#E5DCD2`), with light, dark, and coffee theme variants.
- Existing assets include drink, bean, food, and café photography in `public/img/coffee`, `public/img/food`, and `public/img/cafe`.
- English and Korean localization are present.
- The stack includes React, TypeScript, MUI, GSAP with ScrollTrigger, and Framer Motion.
- Typography currently varies across components. Inspect the relevant surface and loaded fonts before selecting or consolidating type.

Treat this context as a starting point to verify against current code. Preserve Cafert's welcoming café identity. Do not import another project's Renaissance materials, art-gallery language, or unrelated visual world.

## Cutout illustration art direction

The user likes the tactile paper-cutout character style created for the awards section. Reuse this visual language in future Cafert sections when it fits the content, especially where a small character can make an interaction warmer or easier to understand.

- Build scenes from layered, hand-cut paper and gouache-like printed shapes. Let edges feel slightly irregular, with visible paper or fabric grain, imperfect ink registration, and soft contact shadows that make each layer feel physically placed.
- Use warm Cafert colors: oat, cream, espresso, muted terracotta, and restrained brass. Keep the surrounding page light and let the characters carry richer color.
- Give characters readable expressions, clear silhouettes, and a specific role in the scene. Keep their pose and props connected to the section's task; they should guide, demonstrate, celebrate, or reveal useful content.
- Use real transparent cutouts in the page composition. Place them into the scene with believable scale, overlap, ground contact, and lighting. Do not put the illustration inside a generic card or bake a background into the cutout.
- Keep artwork large enough to read at desktop and mobile sizes. Preserve the source illustration faithfully; animate surrounding props or small character gestures only when the motion has a clear purpose.
- Make new characters for the subject of each section. Bean and Crema from the awards scene are a useful reference for material and expression, not mascots to paste everywhere.
- Avoid glossy 3D, generic emoji faces, flat stock-vector mascots, overly childish proportions, random floating decorations, and fake text or logos generated inside artwork. Put all important copy in the interface as real text.

Current style reference: `public/img/coffee/cafert-cupping-crew.png` and its live composition in `src/mui-coffee/components/AwardsStrip.tsx` / `AwardsStripCupping.css`.

Useful starting files:

- `src/app/App.tsx`: routes, shared navigation, authentication, and basket wiring.
- `src/mui-coffee/screens/CoffeeHomePage.tsx`: homepage sections and product presentation.
- `src/app/components/HeroSection.tsx`: homepage hero.
- `src/mui-coffee/context/ThemeContext.tsx`: themes and color roles.
- `src/app/screens/ordersPage/CheckoutOrdersPage.tsx`: menu and order interface.
- `src/lib/types/product.ts`: available product fields.
- `src/locales/en.json` and `src/locales/ko.json`: translations.

## Understand the task before designing

Inspect relevant components, content, routes, assets, typography, palette, motion tools, responsive behavior, and existing interactions. Read applicable `AGENTS.md` files and design guidance.

Identify who uses the page, what they came to do, and what the section must communicate. State the section's job in one sentence.

Honor scope. If the user likes the current arrangement, preserve its structure and create character within it. A creative redesign does not automatically require rebuilding the entire page.

## Invent the experience before styling

1. Define the section's job in one sentence.
2. Find three different physical practices, objects, or environments connected to that job. Look beyond the most obvious metaphor.
3. Give each direction a different composition and interaction, rather than three skins of one card layout.
4. Choose the strongest by relevance, originality, clarity, and the quality of what the interaction reveals.
5. Describe exactly what the visitor sees, does, and discovers.

Use this concept sentence:

> The visitor [takes a clear action] on [a recognizable object], which [performs a believable behavior] to reveal [specific useful content].

If the final phrase is vague, the interaction is unfinished. An object that opens into empty space, unchanged content, or an ordinary unconsidered modal has not delivered the idea.

## Take creative responsibility

Proactively propose a concrete, art-directed idea. Do not make the user repeatedly request creativity, supply a competitor's work, or solve the central concept.

When asked for ideas, offer a small number of genuinely different directions and recommend one with reasons. Once the user approves a direction or says "do it," implement the complete interaction. Another plan is not the deliverable.

Use judgment for routine choices. Ask only when missing information materially changes the result. If the user rejects a concept, change the underlying idea instead of adding ornament.

Proposed concepts are not approved requirements. Do not treat previous suggestions as authorization to implement them.

## Make the revealed state worth discovering

Design resting, hover, activated, completed, and return states together. Revealed content deserves as much care as the initial visual.

- Make the action discoverable and its outcome understandable.
- Keep essential data, prices, names, and primary actions visible unless the user explicitly approves hiding them.
- Keep like, follow, and other independent controls accessible and functional.
- Give each button a useful consequence and visible feedback.
- Avoid repeated opening and closing animations that slow common tasks.
- Let visitors pause or replay narrative motion and revisit steps directly.
- Never require animation to read or use content.
- Connect ordering interactions to existing product and basket behavior.

## Craft believable materials and motion

Study how the chosen thing works. A hinge rotates at its hinge; paper folds at connected creases; wheels turn as a vehicle travels.

Use consistent perspective, thickness, contact shadows, occlusion, and lighting direction. Different materials should behave differently. Move only the parts that have a reason to move; avoid making every object float, spin, or tilt.

Use restrained timing while keeping interactions noticeable. Long delays and nearly invisible effects can make working features feel broken.

Keep source photography and artwork faithful. Avoid unnecessary distortion, recoloring, or animation of the image itself.

## Composition and usability

Use generous images, readable text, and strong contrast. Avoid tiny images, small labels, and excessive unused space.

Do not default to three-column grids, rounded rectangles, miniature uppercase labels, or one large decorative section replacing liked individual cards. Choose the composition because it suits the experience.

Maintain a coherent background and palette across the site. Sections can have individual character without introducing unrelated identities.

Design mobile deliberately. Adapt interactions to touch and available space rather than shrinking desktop artwork until it becomes unreadable. Provide tap and keyboard alternatives to dragging or hovering.

## Tools serve the idea

Reuse the project's stack and existing animation infrastructure. Choose the lightest technique that achieves the intended result.

- CSS or SVG: folds, surfaces, typography, and modest motion.
- GSAP: sequenced scenes, scroll coordination, and controlled playback.
- Framer Motion: component transitions and interaction states where it fits existing code.
- Anatomy: detailed physical or isometric explanations when the mechanism communicates the concept.
- Rive: reusable authored animation with enough interactive states to justify the workflow.
- Image generation: high-quality raster art or materials, never a substitute for functioning interaction.
- WebGL: only when the visual effect needs it and the performance budget supports it.

A skill is a tool, not an art direction. Installing skills does not replace making a strong concept.

## Content and operational truth

Use real existing content where appropriate. Verify product metadata before presenting ingredients, tasting notes, origin, or dietary information as facts.

Do not invent ratings, purchase counts, testimonials, awards, availability, or business history. Existing fallback or simulated content is not evidence that a claim is true.

Do not claim a reservation, payment, transaction, test, production feature, revenue number, or deployment succeeded without evidence. Illustrations of future services must not imply those services are operational.

Handle unavailable data honestly. Keep sample content clearly distinguishable from live products and confirmed operations.

## Deliver and verify the whole experience

Implement within authorized scope. Keep experimental work easy to reverse without erasing unrelated changes.

Check:

- Desktop and mobile layouts.
- Keyboard, focus, touch, and independent controls.
- Reduced motion and any existing Stop Animations setting.
- Clipping, image fidelity, layout stability, and readable contrast.
- Actual moving states, completed states, return states, and repeated interactions.
- Animation cleanup, listeners, timers, and route changes.
- Loading, empty, and failure states where data is involved.

Verify moving interactions rather than relying only on screenshots of resting states. Report limitations honestly if a verification tool is unavailable.

Respect explicit instructions about builds, server restarts, commits, and deployment. At handoff, state what changed and where the user can see it.

## Before presenting the result

- Can the concept be explained without "premium," "modern," or "elegant"?
- Does it belong specifically to Cafert and its audience?
- Is there a new experience beyond visual polishing?
- Does the action reveal useful, beautifully presented content?
- Is the result understandable before reading an explanation?
- Are images, text, and actions large enough to use comfortably?
- Is motion physically coherent, noticeable, and interruptible?
- Has the creative problem been solved proactively?

If the result fails these questions, revise it before presenting it as finished.
