# Video-Lsat

## Watch or upload videos for bitcoin!

This project aims to demonstrate the use of micropayments to allow direct creator-to-consumer marketplaces for video content, as an alternative to ad, subscription, and sponsorship models.

### Architecture

It uses Bitcoin's [Lightning Network](https://lightning.network/) for micropayments and [LSATs](https://lsat.tech/) for proof of payment. All payments currently use [Bolt-11]() invoices.

Uploaders require a lightning node that can receive payments and a macaroon with only `invoice` permissions to make requests. This app does not control your funds or save any information about you other than your invoice macaroon (if you are an uploader), the video itself, and information about the video.

### Roadmap

- [x] Bolt-11 invoices generated from uploader invoice macaroons
- [ ] Create demo site
- [ ] Video download button
- [ ] Save LSATs to localStorage to remember payments on subsequent visits
- [ ] Download/upload LSATs ability
- [ ] About page with tutorial
- [ ] Optional creator/user accounts using [LNURL-Auth](https://lightninglogin.live/learn)
- [ ] [LNURL-Pay](https://github.com/lnurl/luds/blob/luds/06.md)/[Lightning Address](https://lightningaddress.com/) support
- [ ] Stream video instead of sending as one request
- [ ] Pay to stream option (instead of pay per video)
- [ ] Thumbnail upload option (with default if none uploaded)
- [ ] Tip/like button
- [ ] Pay to comment

### Run Project

There is a `client` and a `server` repo.
Run `yarn run dev` on either; the client opens `localhost:5173` and the server on `localhost:8000`.

Change the `.env.sample` file to `.env` and replace the variables as necessary. You'll need an AWS S3 bucket setup to run the project.
