# Video-Lsat

## Watch or upload videos for bitcoin!

This project aims to demonstrate the use of micropayments to allow direct creator-to-consumer marketplaces for video content, as an alternative to ad, subscription, and sponsorship models.

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

### Housekeeping

- [ ] Add [husky]() for pre-commit checks (Typescript, Prettier, ESLint)

### Run Project

Rename .env.example to .env and set the environment variables in both `packages/api` and `packages/ui`. These must be set first for the project to work. You'll need to create an AWS S3 Bucket with s3:PutObject and s3:GetObject permissions and a Postgres DB

Then, run the migration in `packages/api/src/db/migrations/0_videos.pgsql` to setup the table

Finally, start the servers and you should be good to go!

```bash
yarn workspace run api # runs on localhost:8000 by default
yarn workspace run ui # runs on localhost:5173
```
