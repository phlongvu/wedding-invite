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

## `album-01-*.jpg` … `album-17-*.jpg`

The seventeen photographs in the Khoảnh khắc carousel, each in a 900px and a
500px copy handed out by `srcset`. Seventeen originals totalling 15.1 MB became
4.2 MB.

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
- The footer cuts a wide band out of it, between 340 and 520 pixels tall
  depending on the window, which on a desktop throws away more than half the
  height. `object-position: center 10%` in `style.css` decides which part
  survives. That number is low for a reason: at 32% the band began below the
  groom's hairline and took the top of his head off. On a phone the band is
  taller than the picture is wide, so it crops the sides instead and the number
  has no effect there.
- Keep the couple in the upper half, heads well clear of the top edge. The
  names and the thank-you sit along the bottom of the band under a scrim that
  is heaviest there, so faces belong above it. The band's own gradient is not
  what carries the type, though: the letter over it is four blocks long and
  wraps to half as many lines again on a phone, so its opening climbs to where
  a gradient measured in percentages is still light, which read at 2.60:1 over
  the bride's dress. The type sits on its own pool of shade instead, sized to
  the letter and feathered well past it, so the reading holds however the words
  wrap. Worst measured 5.00:1 across four widths; if the photograph is replaced
  with a much paler one, measure it again before shipping rather than assuming
  it still passes.
- Use a picture that is not already the countdown, the Lời ngỏ portrait or one
  of the twelve in the album, or the same photograph appears twice on one page.
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
