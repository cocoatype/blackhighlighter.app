---
layout: page
title: Workflow Integration
permalink: /workflow/
---

Black Highlighter supports integration with Apple's free [Workflow](http://workflow.is/) app to support advanced image workflows. It uses the [X-Callback-URL scheme](http://x-callback-url.com) to open Highlighter from a workflow and to use the resulting image further down the line.

## Example Workflow

One potential workflow you may want to create is taking an image from some other app and sending it directly to Black Highlighter. Highlighter doesn't natively support opening images from other app's share sheets, but we can build this ourselves with Workflow.

1. Install Apple’s [Workflow app from the App Store](https://itunes.apple.com/us/app/workflow/id915249334?mt=8).
2. Open [this link](https://workflow.is/workflows/2390c5eff58c457a95f22f67466b9b6e) on the device you installed Workflow and Highlighter on. It's a link to a shared workflow called "Open in Highlighter".
3. [Tap “Get Workflow”](/images/workflow/install.png).
4. Open the app you wish to export from.
5. Use the other app to share the image. On the lowest line of actions, you should see [an action titled "Run Workflow"](/images/workflow/actions.png). If you don't see this, tap the action labeled "More", and [flip the switch next to "Run Workflow"](/images/workflow/more.png) in the list that appears.
6. The Workflow interface will appear, offering a list of your workflows. Tap "Open in Highlighter".

After a second or so, Highlighter will open and begin editing the image you exported.

## Callback URLs

If you want to create your own workflows, you'll need to know how to create your own callback URLs to open Workflow with. All callback URLs for Black Highlighter start the same way: `highlighter://x-callback-url/`. From there, you include one of the two possible actions: `open` or `edit` . `open` merely opens Highlighter with the image data passed into it. `edit` also does this, but when you tap "Done" in Highlighter, the final image is returned to Workflow to pass along to further steps in your workflow.

Highlighter passes images as base 64-encoded text in the `imageData` parameter, for both requests and responses. Workflow has a handy "Base64 Encode" action for converting between these and actual image data.

A full callback URL for opening Highlighter should therefore look like this: `highlighter://x-callback-url/open?imageData={data}`, where `{data}` is replaced with base64-encoded image data.