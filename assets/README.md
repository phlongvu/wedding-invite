# Assets to drop in

The page looks for a handful of files here. All of them are optional: the site
degrades gracefully without them, but the invitation is not finished until they
exist.

## `music.mp3`

Background music. It starts the moment a guest presses the wax seal, because
that press is the user gesture browsers require before audio may play.

- Any MP3 works. Keep it under about 3 MB so the page stays quick.
- It loops, so pick a track that loops without an obvious seam.
- Make sure you have the right to use the recording on a public page.
- Without this file the music button hides itself.

## `seal.png`

A photograph of the wax stamp, used as the button that opens the invitation.

- Square, transparent background (PNG), around 400x400.
- Without this file the page falls back to the wax seal drawn in CSS.

## `logo-lc.png`

The couple's monogram, shown at the top of the save-the-date card.

- Transparent PNG, dark mark on a clear background. The current file is
  394x589; the page sizes it by height, so any similar proportion works.
- Without this file the page falls back to the mark drawn in `index.html`.

## `countdown-2000.jpg` and `countdown-1200.jpg`

The photograph behind the countdown, full width across the page. Two sizes of
the same picture: `srcset` hands phones and tablets the 1200px file and only
desktops the 2000px one.

- These are generated, not uploaded. Upload the original at any size and it
  gets resized and compressed into this pair. The current one came from a
  2560x1707 original of 1.0 MB, which became 446 KB and 186 KB.
- **Landscape**, roughly 3:2. The band crops to a wide strip, so the top and
  bottom of the original are cut.
- Keep the couple in the upper half. The countdown sits along the bottom of
  the band, under a scrim that is heaviest there, so faces belong above it.
  `object-position: center 28%` in `style.css` is what decides that crop. On a
  desktop that takes the top off a raised arm in the current picture, which a
  wide band does and is not worth chasing; both faces sit well inside it.
- Without these files the countdown stays the plain section it was, with dark
  text on sand. Nothing breaks.

## `album-01-*.jpg` … `album-23-*.jpg`

The twenty-three photographs in the Khoảnh khắc carousel, each in a 900px and
a 500px copy handed out by `srcset`. The originals totalled 17.5 MB and became
5.1 MB.

- Order on the page follows the numbering. Renumber the files to reorder.
- **Portrait.** They are shown at their own proportions with no crop, so a
  landscape one dropped in among these would sit shorter and break the row.
- Every plate is lazy: the carousel is well below the fold, so a guest who
  never scrolls that far pays for none of them.
- The rail is endless. Script clones the run either side of the real one, so
  there is always a photograph on both sides and the carousel never sits with a
  bare margin down one edge. Add or remove plates in `index.html` and the
  clones, the wrap-around and the row of marks under it all follow: the marks
  are built from the rail, not written out, so they cannot fall out of step.
- The marks narrow with the window so the row stays a single line. Watch that
  if the count grows much further: at a fixed 16px, twenty-three of them wanted
  368px and broke onto a ragged second row below 390px, and there is a floor of
  11px below which they stop being marks. Past roughly thirty photographs the
  row is the wrong component, not the wrong size.
- The photographs turn away from the one in front as the rail scrolls, driven
  by the rail's own scroll position through a scroll-driven animation rather
  than by script. Two things about that are load-bearing. The perspective is
  declared on each photograph rather than on the rail, because a scrolling box
  flattens whatever 3D its children declare. And the turn is on the `img`, not
  on the `li` around it: a snap area is the *transformed* border box, so
  turning the plate itself narrowed the very box the browser snaps to, and
  because the turn is driven by the scroll position the two chased each other
  and left the front photograph eight pixels off centre on every desktop width.
- Where the browser has no scroll-driven animations, or the guest asks for
  reduced motion, the photographs simply sit flat in a row. Nothing breaks.

## `hoi-*.jpg` and `bien-*.jpg`

The two sets under Our Engagement Ceremony, three photographs each, in a 1200px
and a 600px copy.
`hoi-01`, `hoi-05`, `hoi-06` for the engagement and `bien-02`, `bien-07`,
`bien-01` for the beach, in that order across the row.

- **The numbers are gaps on purpose.** Fourteen were uploaded and eight are
  gone, because the section shows three a set and nothing else: there is no
  viewer behind it any more. The numbers that survived are the ones chosen, and
  the ones that went are in the git history if any of them is ever wanted back.
  `bien-02` and `bien-07` were brought back out of it exactly that way:
  `git checkout c070aa8~1 -- assets/bien-02-1200.jpg`. Take the derivatives
  from history rather than rebuilding from the original, which is two commits
  further back and would have to go through the same resize again. Both
  originals were re-uploaded by hand at the same time and turned out
  byte-identical to the ones already in the history, so nothing was rebuilt;
  they were then removed again, because no set here keeps its original.
- The three were a real choice, not the first three. `hoi-02` and `hoi-03` were
  strips of several frames with the film border showing, made to be seen whole,
  so an upright plate cut one in half and put a black bar across it. Pick single
  frames, and prefer upright ones: the plates are all portrait by design,
  because a landscape source cropped upright loses whoever was standing in it.
- **The sizes are declared per photograph, not per set**, in the `width` and
  `height` on each plate in `index.html`. The engagement set is 2:3 and the
  beach set is 3:4, and one assumed ratio for both would reserve the wrong box
  and drop the page a step as each picture arrived.
- Replacing one, or reordering the row, means the `width`, the `height` and the
  `sizes` hint travel with the slot rather than with the file: the two small
  beach plates sit in columns of different widths, and the beach files are not
  all the same height to the pixel, so moving a file without redeclaring it
  leaves the box wrong. Measure, do not guess.
- **The 3/4 in the stylesheet is a minimum, not the plate's ratio.** `.plate`
  sets `height: 100%`, which beats `aspect-ratio`, so every plate in a row is as
  tall as the tallest and its real ratio is its own column width over that
  height. In the beach trio the columns are 1.15 / 0.85 / 1.3, so only the lead
  is really 3/4: the first plate renders 0.66 and loses a tenth of the file's
  width, and the narrow middle one renders 0.49, a 1:2 sliver that throws away a
  third of it. Before assuming a photograph is shown whole, read the real ratio
  off the page rather than off the rule: in the browser console,
  `[...document.querySelectorAll('#chapterBien .plate')].map(e => {const r =
  e.getBoundingClientRect(); return [e.currentSrc.split('/').pop(),
  (r.width/r.height).toFixed(2), (e.naturalWidth/e.naturalHeight).toFixed(2)]})`
  prints the box ratio beside the file's own. Where they differ, that much of
  the width or height is being cut.
- **`plate-low` and `plate-subject-left` are on the small beach plates.** On a
  phone these plates crop to a square and both photographs put the couple at the
  very bottom under a whole sky, so a centred crop took their legs off:
  `plate-low` crops from the bottom. On desktop nothing is cut vertically and the
  horizontal half of that same declaration is what acts, which is where
  `plate-subject-left` comes in: `bien-07`'s couple sits at 34-43% of the file
  with a tree at the right edge, and the middle column keeps only 65% of the
  width, so a centred crop pushed them a third of the way in and looked broken.
  17% slides the surviving window left until they land in the middle. Both
  numbers are measured, not chosen. Re-measure whenever the file, the column
  widths or the row height change, and leave both classes off a photograph whose
  subject is already centred, as `bien-02`'s is.
- The section carries one heading and one quote, and the two rows have no labels
  of their own, so the gap between them is the only thing separating a pink
  indoor ceremony from a blue-hour beach. Keep that gap if the compositions are
  ever reworked.
- A set whose lead plate is missing takes its row off the page, and the last row
  takes the heading with it. That only happens once the section scrolls
  into view, because the plates are lazy and a picture that is never fetched
  never fails.

## `intro-1000.jpg` and `intro-600.jpg`

The portrait photograph beside the Lời ngỏ text, in a 1000px and a 600px copy
handed out by `srcset`. Generated from a 1707x2560 upload of 1.0 MB.

- **Portrait.** The slot is 3:4. The current source is 2:3 and was cropped to
  3:4 before resizing, at `(69, 450, 1531, 2400)`, rather than left to the
  browser: the frame it came in is a full-length shot with an orange light leak
  across the top, and letting `object-fit` take equal slices off both ends kept
  the leak and left the couple small in a 360px mount. The crop drops the leak
  and holds their feet. Do the same for a replacement rather than assuming the
  numbers still fit: they are particular to that frame.
- Keep faces away from the very top and bottom edges.
- It sits mounted and centred above the words at every width, inside a sand
  mat and a hairline rule, like a photograph mounted on the invitation.
- Use a different photograph from the three in the gallery, or the same
  picture appears twice on one page.

## `closing-2000.jpg` and `closing-1200.jpg`

The photograph the page closes on, full width across the footer with the names
set over it. Two sizes of the same picture, handed out by `srcset`.

- These are generated, not uploaded. Upload the original at any size and it
  gets resized and compressed into this pair, the same way the countdown
  photograph was.
- **Landscape.** The current pair came from a 2560x1707 original of 0.8 MB,
  which became 355 KB and 142 KB.
- The footer cuts a wide band out of it, between 530 and 660 pixels tall
  depending on the window, which on a desktop throws away much of the height.
  `object-position: center 18%` in `style.css` decides which part survives, and
  it sits in a narrow window: at 32% the band began below the groom's hairline
  and took the top of his head off, while at 10% the two of them sat so low in
  the band that the letter met their faces. On a phone the band is taller than
  the picture is wide, so it crops the sides instead and the number has no
  effect there.
- The band has a floor of 530px, not only a share of the window. The letter's
  height does not shrink with the window but a band measured only in svh does,
  so on a short one the letter climbed into their faces: it began at 26% of the
  band on a 667px-tall phone and 42% on a 1280x800 laptop, where the faces
  reach 32% and 46%. Across eight window sizes the letter now begins at 38-53%
  and the faces end at 32-42%.
- Keep the couple in the upper half, heads well clear of the top edge. The
  names and the thank-you sit along the bottom of the band under a scrim that
  is heaviest there, so faces belong above it. The band's own gradient is not
  what carries the type, though: the letter over it is four blocks long and
  wraps to half as many lines again on a phone, so its opening climbs to where
  a gradient measured in percentages is still light, which read at 2.60:1 over
  the bride's dress. The type sits on its own pool of shade instead, sized to
  the letter and feathered well past it, so the reading holds however the words
  wrap, and it reaches further above the words than below them because the
  greeting is the top line and an even inset left it out at three quarters of
  the ellipse's radius where the shade had gone. Worst measured 6.64:1 across
  four widths, sampling only the runs the glyphs actually occupy: measuring the
  whole paragraph box instead picks up whatever is brightest out in the margin
  either side of a centred line and reports failures that are not there. If the
  photograph is replaced with a much paler one, measure it again before shipping
  rather than assuming it still passes.
- Use a picture that is not already the countdown, the Lời ngỏ portrait or one
  of the twenty-three in the album, or the same photograph appears twice on one page.
- Without these files the footer drops back to the plain one it replaced, dark
  type on sand with a hairline above it. It never shows white type on sand
  while the file is in the air: the band is painted the deep tone underneath
  from the first paint, and the fallback flips the ground and the ink together.

## `og-card.jpg`

The 1200x630 card that Zalo, Messenger and Facebook show when the link is
pasted into a chat. Generated, not uploaded: the intro photograph on the left,
the monogram, names, date and venue set in the site's own typefaces on the
right.

- Regenerated whenever the names, date or venue change, and whenever the intro
  photograph is replaced: it carries that picture, so leaving it alone puts a
  photograph in the link preview that is nowhere on the page. The meta tags in
  `index.html` point at it by absolute URL, which those services require.
- Chat previews are cached hard. After replacing it, re-scrape the link with
  Facebook's Sharing Debugger, or the old card keeps appearing.

## `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`

The browser-tab and home-screen icons, generated from `logo-lc.png` on a sand
square so the mark reads against both a light and a dark browser theme.

- Regenerated from `logo-lc.png`, so replacing the logo means regenerating
  these too. The tab sizes are cropped tight; the Apple icon keeps a wider
  margin because iOS adds none of its own.
- The monogram is a fine-line mark half again as tall as it is wide. At 16 and
  32 pixels the sprig between the letters cannot survive and reads as texture.
  The icon is recognisable, not legible, at tab size. It reads properly on a
  home screen at 180px.

## `qr-phi-long.png` and `qr-kim-chi.png`

The VietQR images shown side by side in the gift dialog, one per account.

- Export each from the banking app itself. Do not have them generated for you:
  a wrong bank code or checksum sends a guest's money to the wrong account.
- Square, at least 600x600.
- Upload them the same way you uploaded seal.png and music.mp3.
- `qr-phi-long.png` should encode Techcombank 98666888 (Vũ Phi Long).
- `qr-kim-chi.png` should encode NCB 109966298838 (Quách Đoàn Kim Chi).
- A missing file hides that side's QR and its save link. The account details
  stay on screen either way, so guests can still transfer by hand.

The bank details in `index.html` are already the real ones:
Techcombank, Vũ Phi Long, 98666888 and NCB, Quách Đoàn Kim Chi,
109966298838.
