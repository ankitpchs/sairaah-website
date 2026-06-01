ASSETS FOLDER — FILE CHECKLIST
===============================

Drop the following files into this folder. All paths are referenced
in the <head> of index.html and will work when the site is served
via a local or live HTTP server (python3 -m http.server 8000).


FAVICONS
--------

favicon.ico
  Format : ICO (multi-size container)
  Sizes  : 16x16, 32x32, 48x48 (all embedded in the one .ico file)
  Used by: Older browsers and browser tab fallback

favicon-32x32.png
  Format : PNG, transparent background
  Size   : 32 x 32 px
  Used by: Modern desktop browsers (tab icon)

favicon-16x16.png
  Format : PNG, transparent background
  Size   : 16 x 16 px
  Used by: Browser tabs on some browsers, bookmarks bar

apple-touch-icon.png
  Format : PNG, no transparency (use a solid background colour)
  Size   : 180 x 180 px
  Used by: iOS/iPadOS "Add to Home Screen" icon


SOCIAL PREVIEW IMAGE
--------------------

social-preview.jpg
  Format    : JPEG (high quality, ~85–90%)
  Size      : 1200 x 630 px
  Used by   : Open Graph (Facebook, WhatsApp, LinkedIn link previews)
              Twitter/X Card (summary_large_image)
  Notes     : Keep important content (name, logo, photo) away from
              the outer 50 px on each edge — some platforms crop.
              Aim for file size under 1 MB.


HOW TO GENERATE FAVICONS
-------------------------

Recommended free tool: https://favicon.io or https://realfavicongenerator.net

  1. Upload a square image of Sairaah's logo or initials (512x512 minimum).
  2. Download the generated pack.
  3. Copy favicon.ico, favicon-32x32.png, favicon-16x16.png, and
     apple-touch-icon.png into this folder.
  4. Discard the site.webmanifest and browserconfig.xml files from the pack
     (not needed for this project).


HOW TO CREATE THE SOCIAL PREVIEW IMAGE
---------------------------------------

  Suggested tools: Canva (free), Figma, Adobe Express
  Canvas size    : 1200 x 630 px

  Suggested layout:
    - Left half : Photo of Sairaah (portrait, warm tones)
    - Right half: Name "Sairaah Luther" in large serif type
                  Subtitle "Youth Founder & Student Ambassador"
                  "May Care Foundation Trust" smaller below
    - Background: Warm cream (#FAF5EF) or saffron gradient
    - Keep text high-contrast and legible at small sizes

  Export as JPEG, quality 85–90%, and name the file: social-preview.jpg
