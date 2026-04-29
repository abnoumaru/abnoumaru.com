# abnoumaru.com

Personal blog built with [Bridgetown](https://www.bridgetownrb.com/) and deployed on Cloudflare Pages.

## Requirements

- Ruby 4.0.3 (see `.ruby-version`)
- Node.js 24.14.0+ (see `package.json` `engines.node`)

## Setup

```sh
bundle install
npm install
```

## Commands

| Command                         | Action                                              |
| :------------------------------ | :-------------------------------------------------- |
| `npm run dev`                   | Start local dev server at `http://localhost:4000`   |
| `bundle exec bridgetown deploy` | Build production site to `./output/`                |
| `bin/bridgetown ...`            | Run other Bridgetown CLI commands                   |
