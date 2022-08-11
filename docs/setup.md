# Setup Pear App

## Installing

**Create Slack App**
1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.json](../manifest.json) into the text box that says `*Paste your manifest code here*` and click *Next*
4. The app will need to be hosted on [Glitch](https://glitch.com/) as seen in this project, [Ngrok](https://ngrok.com/), or another hosting service. With that in mind, you'll need to update your OAuth redirect URLs before moving to the next step. 
5. Review the configuration and click *Create*
6. Now click *Install to Workspace* and *Allow* on the screen that follows. You'll be redirected to the App Configuration dashboard.

**Environment variables**
Before you can run the app, you'll need to store some environment variables.

1. Copy `.env.sample` to `.env`
2. Open your apps configuration page from [this list](https://api.slack.com/apps), click *OAuth & Permissions* in the left hand menu, then copy the *Bot User OAuth Token* into your `.env` file under `SLACK_BOT_TOKEN`
3. Click *Basic Information* from the left hand menu and follow the steps in the *App-Level Tokens* section to create an app-level token with the `connections:write` scope. Copy that token into your `.env` as `SLACK_APP_TOKEN`.
4. Grab your Slack Signing Secret, available in the app admin panel under Basic Info. Copy that token into your `.env` as `SLACK_SIGNING_SECRET`.

**Install dependencies**

`npm install`

**Run Bolt Server**

`node app.js`
