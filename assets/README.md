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
  5410x3606 original of 13.3 MB, which became 512 KB and 225 KB.
- **Landscape**, roughly 3:2. The band crops to a wide strip, so the top and
  bottom of the original are cut.
- Keep the couple in the upper half. The countdown sits along the bottom of
  the band, under a scrim that is heaviest there, so faces belong above it.
  `object-position: center 28%` in `style.css` is what decides that crop.
- Without these files the countdown stays the plain section it was, with dark
  text on sand. Nothing breaks.

## `album-01-*.jpg` … `album-12-*.jpg`

The twelve photographs in the Khoảnh khắc rail, each in a 900px and a 500px
copy handed out by `srcset`. Twelve originals totalling 13.3 MB became 2.7 MB.

- Order on the page follows the numbering. Renumber the files to reorder.
- Only the first plate loads eagerly; the rest wait until the guest swipes, so
  a guest who never opens the album pays for one photograph.
- The rail keeps each photograph's own proportions, so a landscape can be
  dropped in among these portraits without either being cropped.
- The rail is endless. Script clones the run either side of the real one, so
  there is always a photograph on both sides and the album never sits with a
  bare margin down one edge. Add or remove plates in `index.html` and the
  clones, the count and the wrap-around all follow.

## `intro-1000.jpg` and `intro-600.jpg`

The portrait photograph beside the Lời ngỏ text, in a 1000px and a 600px copy
handed out by `srcset`. Generated from a 10.2 MB upload.

- **Portrait.** The slot is 3:4 and the source is 2:3, so a little comes off
  the top and bottom. Keep faces away from the very top and bottom edges.
- It sits mounted and centred above the words at every width, inside a sand
  mat and a hairline rule, like a photograph mounted on the invitation.
- Use a different photograph from the three in the gallery, or the same
  picture appears twice on one page.

## `og-card.jpg`

The 1200x630 card that Zalo, Messenger and Facebook show when the link is
pasted into a chat. Generated, not uploaded: the intro photograph on the left,
the monogram, names, date and venue set in the site's own typefaces on the
right.

- Regenerated whenever the names, date or venue change. The meta tags in
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
