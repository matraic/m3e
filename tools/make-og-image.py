#!/usr/bin/env python3
"""Generate the 1200x630 Open Graph image for the M3E docs site.

Pillow-only. Brand tokens taken from the live site (docs/index.css +
favicon): light lavender-grey ground #e6e1e6, near-black text #1c1b1e,
muted #938f94, and the favicon's deep blue #14213d accent.
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (230, 225, 230)      # #e6e1e6
TEXT = (28, 27, 30)       # #1c1b1e
MUTED = (147, 143, 148)   # #938f94
ACCENT = (20, 33, 61)     # #14213d deep blue from favicon
WHITE = (255, 255, 255)

_FONT_CANDIDATES = [
    "DejaVuSans-Bold.ttf",
    "DejaVuSans.ttf",
    "NotoSans-Bold.ttf",
    "NotoSans-Regular.ttf",
    "LiberationSans-Bold.ttf",
    "LiberationSans-Regular.ttf",
]


def load_font(size, bold=False):
    roots = [
        "/usr/share/fonts/truetype/dejavu",
        "/usr/share/fonts/truetype/liberation",
        "/usr/share/fonts/TTF",
        "/Library/Fonts",
        "C:/Windows/Fonts",
    ]
    env_dir = os.environ.get("FONT_DIR")
    if env_dir:
        roots.insert(0, env_dir)
    for root in roots:
        for name in _FONT_CANDIDATES:
            if bold and "Bold" not in name:
                continue
            if not bold and "Bold" in name:
                continue
            p = os.path.join(root, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    raise FileNotFoundError("No usable TTF font found; set FONT_DIR=/path/to/fonts")


def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # diagonal accent band (Material 3-ish dynamic color block)
    d.rectangle([0, 0, W, 10], fill=ACCENT)

    # card body: two rounded "component card" panels evoking a component library
    card_h = 250
    for x, y, w, h in [
        (110, 160, 300, card_h),
        (445, 160, 300, card_h),
        (780, 160, 320, card_h),
    ]:
        d.rounded_rectangle([x, y, x + w, y + h], radius=28, fill=WHITE)
    # accent sliders inside cards (Material 3 switch/checkbox vibe)
    for x, y in [(150, 230), (485, 230), (820, 230)]:
        d.rounded_rectangle([x, y, x + 130, y + 34], radius=17, fill=ACCENT)
    for x, y in [(150, 300), (485, 300), (820, 300)]:
        d.rounded_rectangle([x, y, x + 100, y + 16], radius=8, fill=(200, 195, 200))

    # headline
    d.text((110, 420), "M3E", font=load_font(96, bold=True), fill=TEXT)
    d.text((110, 520), "Material 3 Expressive Web Components",
           font=load_font(34, bold=False), fill=MUTED)
    d.text((110, 566), "matraic.github.io/m3e",
           font=load_font(26, bold=False), fill=ACCENT)

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs", "og-image.png")
    img.save(out)
    print(f"wrote {os.path.abspath(out)}")


if __name__ == "__main__":
    main()