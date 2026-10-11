# Network artwork

This folder contains the final PNGs. **Every image is 360 px wide.**

| Files                                                                                | Image dimensions |
| ------------------------------------------------------------------------------------ | ---------------- |
| Engineering, maintenance, operations, procurement, sales and service (both variants) | 360 × 160 px     |
| `comq-team-transparent.png`                                                          | 360 × 180 px     |

Artwork has minimum clear edge guards of **9 px left/right and 4 px top/bottom**,
included within these dimensions. These are padding, not crop lines.

Each scene has a background PNG and a matching `*-transparent.png` with the same
artwork size and placement. The transparent variant removes the surrounding
background, including the guards, while retaining opaque fills inside people
and equipment. The COMQ team has only a transparent version.

**`MiningNetwork.tsx` uses all seven transparent variants directly from this
folder.**
