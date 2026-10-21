# Swimming movement revision

## Reference observations

Both the supplied coral Craft clip and blue-and-white butterfly koi clip were sampled at 250–300 ms intervals. The coral clip is the primary movement reference.

| Coral clip time | Visible behavior | Rig behavior used here |
| --- | --- | --- |
| 0.10–0.85 s | Head and tail face different directions; the torso stays curled while fins move. | The pose is built from individual spine directions, rather than rotating the entire image. |
| 1.10–1.60 s | The head turns upward while the belly forms a pronounced arc and the tail trails to the left. | Heading history reaches the belly and tail base with increasing delay; forward motion slows through tight corners. |
| 1.85–2.35 s | The head turns left before the tail finishes the previous turn. | A turn propagates through the articulated chain; the caudal membrane follows its own root. |
| 2.60–2.85 s | The torso begins to straighten while the fin tips remain curved. | Fins combine root rotation with a separate tip ripple. |

These are visual observations of the supplied animation, not measurements of biological swimming mechanics. No exact frame-for-frame or volumetric reconstruction is claimed.

## Changes

The previous version applied a small vertical displacement to a straight image, then rotated that image as one object. Its fallback repeated the same limitation. The new rig integrates 40 spine directions into a curve with fixed segment lengths. Head, shoulders, belly and tail base therefore point in different directions through a turn.

The turn delay reaches its full value at the anatomical tail base, before the long tail fin begins. This matters because bending only the transparent tip region leaves the visible torso looking rigid. Normal turn propagation is approximately 0.8–0.9 seconds from head to tail base, with a shorter delay under reduced-motion preferences. These are artistic timing choices based on the reference sequences.

The fish steers before translating. Its velocity remains aligned with the head, speed eases down near the target, and angular speed is bounded. It does not jump sideways or flip instantly when the pointer reverses direction.

Cursor pursuit uses a `0.995` speed multiplier: a 0.5% reduction requested after the swimming revision. The multiplier applies to cruising and arrival speed limits after pointer input. Ambient swimming, turn controls, spine delay and fin parameters retain their previous settings.

The automatic startup skeleton has been removed. Once its texture loads, the fish appears directly with a short fade-in. Skeleton rendering is available only through the explicit Services control.

The pectoral and pelvic fins pivot around separate roots. The long tail uses a delayed stroke and flexible membrane. Both WebGL and Canvas render the same rig; Canvas uses triangular texture mapping so the fish can curve horizontally and vertically without the old strip-shear constraint.

Reduced-motion preferences suppress autonomous swimming at rest while retaining body articulation during direct cursor interaction. Open dialogs temporarily freeze the scene.

## Stars and background

The reference's stars fade between bright and barely visible states. The earlier implementation used fixed opacity and only moved the constellation during scrolling. Each star now has an independent 2.4–5.45 second opacity/scale cycle and a negative start offset, so the field twinkles immediately without synchronized flashing. A nested star field drifts over 14-second passes, independently of its scroll transform. Broad background gradients drift over 18- and 25-second passes. These timings are visual tuning, not frame-exact measurements of the reference.

Open dialogs pause all ambient effects; reduced-motion preferences disable them. Seven palettes are available, including blue/silver/white and pearl white/soft gold, alongside: red, blue, black and white, golden and white, and orange and white. Golden/orange filters preserve neutral whites and alpha while changing the red markings. Palette switching changes colour only and keeps the current swimming pose and cursor target.

## Review material

The water pass adds gently drifting caustic light below the lettering and fish. A small seamless texture is generated once, then reused in two slow-moving layers. Wake arcs originate from the actual articulated tail and pectoral-fin positions, expand and fade over 1.35–2.1 seconds, and stop emitting when the fish settles. At most 30 arcs are retained. The water canvas is capped at 1200 × 900 pixels and updates at up to 30 Hz using the fish's existing clock. Pausing freezes it; reduced-motion preferences replace the motion with faint static light. A missing Canvas context omits the decorative pass without disabling the fish.

This is a stylized shallow-water treatment, not a fluid simulation. It does not change the approved swimming rig, cursor speed or the existing palettes.

The historical offline motion study used the production fish and water Canvas renderers. No recorded or reference video is included in this edition.

The website still uses a textured 2.5D surface. It cannot reproduce the source video's changing 3D viewpoint and lighting exactly. Full browser and GPU visual QA was unavailable in this environment.


## Homepage scene and depth compositing
One persistent articulated fish feeds a single Three.js offscreen render target. The same deformed mesh supplies the visible fish body and the underwater trace. Depth changes the mesh Z position and apparent scale. A screen-space fragment shader clips the body against section masks; a separate channel removes the blurred, refracted trace around text, cards, timeline entries and controls. The canvas layer stays above navbar surfaces while navbar labels are masked out. CSS stacking alone does not hide the body.

`depthCoordinator.js` owns geometry-relative state transitions and RGB content masks. `depthComposite.js` owns the WebGL body/trace composite. The previous section-jump controller has been removed in favour of the new reversible under-page specification. Scroll direction affects emergence state, while depth is a continuous function of position. Touch, reduced motion and the original cursor-following rig remain supported.

The Canvas fallback composites the same articulated fish through body and trace masks. A browser with neither WebGL nor Canvas cannot produce a reflection: its final DOM fallback hides the fish during content scrolling to protect readability.

The trace is a screen-space underwater silhouette/light approximation, not ray-traced reflection. The original asset remains a textured 2.5D mesh, not a volumetric fish model. Browser visual and GPU verification is still required; see VERIFICATION.md.

## Fine Craft edition

The approved steering, articulated body, tail delay and independent fin motion are preserved. No video or personal-profile assets are shipped. Full-depth fish visibility remains at 46% opacity with 2.4px softening under the content layer.
