---
title: "Supporting PDFs Using Shortcuts"
date: "2019-09-08"
summary: "I recently got a support request from someone looking to edit PDFs with Black Highlighter. Black Highlighter unfortunately doesn't currently support redacting PDFs. However, that doesn't mean that all hope is lost if you want to black out the information in PDFs… as long as you're willing to export it as a different file format."
---

I recently got a support request from someone looking to edit PDFs with Black Highlighter. Black Highlighter unfortunately doesn't currently support redacting PDFs. PDFs are much more difficult to redact correctly than simple images; there have been [several high-profile cases](https://slate.com/technology/2016/06/house-democrats-improperly-redacted-documents-wrong-but-they-re-not-alone.html) where incorrectly-redacted PDFs have led to leaked secrets. However, that doesn't mean that all hope is lost if you want to black out the information in PDFs… as long as you're willing to export it as a different file format.

Black Highlighter has had support for Apple's [Shortcuts](https://apps.apple.com/us/app/shortcuts/id915249334) longer than either word in that description has been accurate. It's this support that will allow us to edit a PDF in Black Highlighter. If you want to just skip to the final result, you can [download the final shortcut](https://www.icloud.com/shortcuts/c9b7e21b66c84d77be323b40cb45ea28) now. Otherwise, let's check out how we can build this from scratch.

## Getting Images from a PDF

Starting from a new, empty shortcut, we need to get our PDF into a format Black Highlighter understands. Fortunately, Shortcuts has a built-in action to do this: Convert Image. While it sounds like it might only convert between different image formats, PDFs are listed in the input types for this action; we can pass it a PDF and get back an image. Add Convert Image to the shortcut and select PNG for the format; this lossless format will give us a good quality image to edit in Black Highlighter.

If your PDF has multiple pages, Convert Image will give you multiple images (one for each page). There's a few ways to deal with this. The "Get Item from List" action will allow us to select a single page and get just that image. If you need all the pages and are okay with a slightly-ridiculous-looking image, there's also a "Combine Images" action which will allow you to get a single image with all the pages arranged in a row (or column). I'm going to use the single-page action for the rest of this post, selecting "First Item" to get just the first page of the input PDF.

## Opening Images in Black Highlighter

The next few steps are a bit tricky; if you want to skip the technical details, download [this "Open in Highlighter" shortcut](https://www.icloud.com/shortcuts/5936df5ef02747f8b7952c6a3b1d1393) and run it with the "Run Shortcut" action. Black Highlighter's Shortcuts support is based on the [X-Callback-URL](http://x-callback-url.com/) standard, and this shortcut handles creating and opening one of these URLs with passed-in image data.

If you'd rather do it manually, here's a quick overview: use the "Base64 Encode" action to get a text representation of the data in the converted PDF-as-PNG. Be sure to set "Line Breaks" to "None" or the final URL will be invalid. Before using this in a URL, we need to URL-encode it to make the Base 64-encoded text only contains characters allowed in URLs; the URL Encode action in Encode mode does this pretty simply. Next, use the "URL" action to create our callback URL. It begins with this: `highlighter://x-callback-url/open?imageData=`. Next, use the Variables button above the keyboard to select URL Encoded Text; this is the result of the previous action. Finally, use the Open X-Callback URL action to actually run our encoded URL; this is the action that will actually open Black Highlighter.

## Using Your New Shortcut

That's it for the shortcut itself! But how can we use this with an actual PDF? The easiest way is using the Shortcuts action in the iOS share sheet. To enable this, open the shortcut settings page (it's a button in the top right that looks like two switches). Turn on the switch labeled "Show in Share Sheet". Tap the Accepted Types row and deselect everything except for PDFs; this prevents the shortcut for showing up when it isn't useful.

That's it! Now you can open a PDF from an app such as Mail or Files and use the share sheet to open it in Black Highlighter, and from there export it to your photo library, another app, wherever! Hopefully this post has showed some of the powerful things you can do with Shortcuts; there's lots of additional functionality you can add to this shortcut from here.

