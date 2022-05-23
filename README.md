# Worker

[Cloudflare Worker](https://developers.cloudflare.com/workers/) template written in TypeScript and compiled to JavaScrip via [esbuild](https://esbuild.github.io). The template is broken into two files:

- `index.ts` - hosts the fetch event listener.
- `handler.ts` - hosts the request handler and error handling.

The worker made for handling POST request with a JSON payload. But can easily be modified to fit any need.

A GitHub Action builds and publishes the worker on every push. Makre sure to include a `CF_API_TOKEN` secret with your Cloudflare API token for the Action to publish your worker.