---
title: Shortcuts Integration
---

Black Highlighter supports integration with Apple's free [Shortcuts](http://workflow.is/) app to support advanced image workflows. It uses the [X-Callback-URL scheme](http://x-callback-url.com) to open Highlighter from a shortcut and to use the resulting image further down the line.

## Example Shortcut

One potential shortcut you may want to create is taking an image from some other app and sending it directly to Black Highlighter. Highlighter doesn't natively support opening images from other app's share sheets, but we can build this ourselves with Workflow.

1. Install Apple’s [Shortcuts app from the App Store](https://itunes.apple.com/us/app/workflow/id915249334?mt=8).
2. Open [this link](https://www.icloud.com/shortcuts/8bd9a31d84704b328f66dbc8ee88a6e3) on the device you installed Shortcut and Highlighter on. It's a link to a shared shortcut called "Open in Highlighter".
3. [Tap “Get Shortcut”](/images/workflow/install.png).
4. Open the app you wish to export from.
5. Use the other app to share the image. On the lowest line of actions, you should see [an action titled “Shortcuts”](/images/workflow/actions.png). If you don't see this, tap the action labeled "More", and [flip the switch next to “Shortcuts”](/images/workflow/more.png) in the list that appears.
6. The Shortcuts interface will appear, offering a list of your shortcuts. Tap "Open in Highlighter".

After a second or so, Highlighter will open and begin editing the image you exported.

## Callback URLs

If you want to create your own shortcuts, you'll need to know how to create your own callback URLs to open Highlighter with Shortcuts. All callback URLs for Highlighter start the same way: `highlighter://x-callback-url/`. From there, you include one of the two possible actions: `open` or `edit` . `open` merely opens Highlighter with the image data passed into it. `edit` also does this, but when you tap "Done" in Highlighter, the final image is returned to Shortcuts to pass along to further steps in your shortcut.

Highlighter passes images as base 64-encoded text in the `imageData` parameter, for both requests and responses. Workflow has a handy "Base64 Encode" action for converting between these and actual image data.

A full callback URL for opening Highlighter should therefore look like this: `highlighter://x-callback-url/open?imageData={data}`, where `{data}` is replaced with base64-encoded image data.