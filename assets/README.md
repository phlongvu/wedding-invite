# Assets to drop in

The page looks for two files here. Both are optional: the site degrades
gracefully without them, but the invitation is not finished until they exist.

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

## `qr-phi-long.png`

The VietQR image for the groom's account, shown in the gift dialog.

- Export it from your banking app, square, at least 600x600.
- Upload it the same way you uploaded seal.png and music.mp3.
- It should encode the Techcombank account 98666888 (Vũ Phi Long).
- Without this file the dialog shows a note telling you where to put it.

The bank details in `index.html` are already the real ones:
Techcombank, Vũ Phi Long, 98666888.
