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

## `countdown.jpg`

The photograph behind the countdown, full width across the page.

- **Landscape**, roughly 3:2. It is cropped to a wide band, so anything near
  the top or bottom edge of the original will be cut.
- Leave the middle reasonably clear: the heading and the four numbers sit
  across the centre of the band.
- Upload the file straight from the camera or phone. It will be resized to
  about 1600px wide and compressed before being committed, so guests on mobile
  data are not waiting on an 8 MB download.
- Faces are assumed to sit a little above centre (`object-position: center
  35%` in `style.css`). If the crop cuts heads off, that is the number to move.
- Without this file the countdown stays the plain section it was, with dark
  text on sand. Nothing breaks.

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
