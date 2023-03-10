# Video Lsat

## Watch or upload videos for bitcoin!

This project aims to demonstrate the use of [Bitcoin Lightning](https://lightning.network/) micropayments to allow direct creator-to-consumer marketplaces for video content, as an alternative to ad, subscription, and sponsorship models. No KYC required.

There are three actors involved:
- An _uploader_
- A _viewer_
- A _host_

All an _uploader_ needs is an invoice [macaroon](https://docs.lightning.engineering/lightning-network-tools/lnd/macaroons) and a video file. They then choose a price to view the video and hit "upload". The video and invoice macaroon are then uploaded to the _host_'s site. When the _viewer_ attempts to watch the video, the _host_ uses the _uploader_'s invoice macaroon to generate an invoice. When they do, an [LSAT](https://docs.lightning.engineering/the-lightning-network/lsat) is saved to their browser as proof of payment so that they don't have to pay for the video on subsequent visits (note that, for now, clearing `localStorage` will mean you have to pay for the video again to get a new LSAT). The _host_ does NOT have access to the _uploader_ or _viewers_ funds at any point, nor is it ever necessary for either party to reveal [personally identifiable information](https://www.investopedia.com/terms/p/personally-identifiable-information-pii.asp). Your funds and your identity are in your control. And, with the rise of [nostr](https://github.com/nostr-protocol/nostr), it may soon be possible to [decentralize the video hosting process](https://github.com/nostr-protocol/nostr#:~:text=Video%20and%20other%20heavy%20content) as well.

### Architecture

It uses Bitcoin's [Lightning Network](https://lightning.network/) for micropayments and [LSATs](https://lsat.tech/) for proof of payment. All payments currently use [Bolt-11]() invoices.

Uploaders require a lightning node that can receive payments and a macaroon with only `invoice` permissions to make requests. This app does not control your funds or save any information about you other than your invoice macaroon (if you are an uploader), the video itself, and information about the video.

### Roadmap

- [x] Bolt-11 invoices generated from uploader invoice macaroons
- [ ] Create demo site
- [x] Save LSATs to localStorage to remember payments on subsequent visits
- [ ] Download/upload LSATs ability
- [ ] About page with tutorial
- [ ] Optional creator/user accounts using [LNURL-Auth](https://lightninglogin.live/learn)
- [ ] [LNURL-Pay](https://github.com/lnurl/luds/blob/luds/06.md)/[Lightning Address](https://lightningaddress.com/) support
- [ ] Thumbnail upload option (with default if none uploaded)
- [ ] Tip/like button
- [ ] Pay to comment
- [ ] Dockerize the project for easy running
- [ ] Give content creators choice between accepting keysend (value 4 value) or invoices as payment

### Housekeeping

- [x] Add [husky]() for pre-commit checks (Typescript, Prettier, ESLint)

### Run Project

Rename .env.example to .env and set the environment variables in both `packages/api` and `packages/ui`. These must be set first for the project to work. You'll need to create an AWS S3 Bucket with s3:PutObject and s3:GetObject permissions and a Postgres DB

Then, run the migration in `packages/api/src/db/migrations/0_videos.pgsql` to setup the table

Finally, start the servers and you should be good to go!

```bash
# runs api on localhost:8000 by default
# runs ui on localhost:5173
yarn dev
```
