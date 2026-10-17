#!/usr/bin/env python3
"""Inject a full Open Graph + Twitter Card set into every M3E docs HTML page.

Each page keeps its own <title> as og:title and gets a per-page canonical
og:url. All assets use absolute production URLs (https://matraic.github.io/m3e/).
Idempotent: pages that already carry the injected marker are skipped.
"""
import re
import glob
import pathlib

ROOT = pathlib.Path('docs')
BASE_URL = 'https://matraic.github.io/m3e/'
MARKER = '<!-- M3E OG/Twitter meta -->'

OG_BLOCK_TEMPLATE = """    {marker}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="M3E" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{title}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:image" content="{base}og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="M3E — Material 3 Expressive Web Components" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{title}" />
    <meta name="twitter:image" content="{base}og-image.png" />
"""


def inject(fname: pathlib.Path) -> bool:
    src = fname.read_text(encoding='utf-8')
    if MARKER in src:
        return False
    title_m = re.search(r'<title>(.*?)</title>', src, re.S)
    title = title_m.group(1).strip() if title_m else 'M3E'
    rel = fname.relative_to(ROOT).as_posix()
    if rel == 'index.html':
        url = BASE_URL
    else:
        url = BASE_URL + rel
    anchor_m = re.search(r'<meta name="description"[^>]*/>', src)
    block = OG_BLOCK_TEMPLATE.format(
        marker=MARKER, title=title, url=url, base=BASE_URL
    )
    if anchor_m:
        src = src.replace(anchor_m.group(0), anchor_m.group(0) + '\n' + block, 1)
    else:
        # fallback: right after <head>
        src = src.replace('<head>', '<head>\n' + block, 1)
    fname.write_text(src, encoding='utf-8')
    return True


def main():
    files = sorted(ROOT.rglob('*.html'))
    changed = 0
    for f in files:
        if inject(f):
            changed += 1
    print(f'{len(files)} HTML files scanned; {changed} updated')


if __name__ == '__main__':
    main()