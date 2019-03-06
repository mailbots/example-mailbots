# Big MailBot Boilerplate

Boilerplate for a MailBot with a lot of moving parts.

## Separation of Concerns

Within the `lib` directory are modules. Each is a self-contained unit of functionality that
can be tested and exist in isolation. Separation by functional concern is different than
MVC, for example, which separates based on types of files.

One advantage of this separation is that a module can be completely isolated and published as
a private or public npm repository, allowing it to be shared between projects.

Another advantage is that a module can be refactored (for example, TypeScript) without
changing its API to the rest of the system.

A module, in this case, is separated into these parts:

```
hello-world
    - handlers                              # Handle emails, webhooks, action emails
        - hello-on-command.js
    - index.js                              # Internal "API" other modules can `require`
    - lib                                   # Logic that should be kept private
        - lib1.js
        - lib2.js
    - test                                  # tests
        - fixtures
            - on hello-tas.created.json     # copied from sandbox (redact secrets!)
        - hello-integration.test.js
        - hello.test.js

```

## Setup Locally

For larger projects you'll want to be working locally. To do so:

1. Go to [app.mailbots.com/mailbots](https://app.mailbots.com/mailbots) click "Create MailBot", then **create locally**.
1. Copy the example env file example into `.env.local`
1. Run `npm i` then `npm run dev` in the big-bot project.
1. Run [ngrok](https://ngrok.com/) to expose a public facing URL.
1. Go back to your mailbot on app.mailbots.com and click "edit bot settings" add your new base URL.
1. Copy the updated `env` example again into `.env.local`
1. Restart your server to refresh the environment values
1. Go to the Sandbox for your new bot and test it out.

## Environments

Environments are loaded via packages.json. `.env.example` is provide, but `.env.local`, `.env.test` are loaded
for the dev and test environments respectively. `.env` would be used by whatever production host you're using.

## Testing and Debugging

Within package.json are npm scripts for testing. Running tests or the dev environment with
`inspect-brk` will enable the Node Debugger. Within VS Code (or whatever IDE) turn on "auto-attach" and
you will have a working debugger. See the `npm run test:inspect` and `npm run dev:inspect` in package.json.

Generate test fixtures by firing events in the sandbox, then copy, pasting (and sanitizing) them.

## Code Standards

- Use [prettier](https://prettier.io/). Comment `//prettier-ignore` above lines that is scrambles
- Minimal callbacks. Wrap anything that is async into its own named function that returns a promise. You can then `await` the function.
- JSDoc comment everything. Enables IDEs like VS Code to hint for how a certain function is used
