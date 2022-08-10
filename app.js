// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listen for a slash command invocation
app.command("/pear", async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Pair Summary Report",
        },
        blocks: [
          {
            type: "input",
            block_id: "users_selected",
            element: {
              type: "multi_users_select",
              placeholder: {
                type: "plain_text",
                text: "Select users",
                emoji: true,
              },
              max_selected_items: 2,
              action_id: "multi_users_select-action",
            },
            label: {
              type: "plain_text",
              text: "Who paired?",
            },
          },
          {
            type: "input",
            block_id: "wins",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "plain_text_input-action",
              placeholder: {
                type: "plain_text",
                text: "What went well?",
                emoji: true,
              },
            },
            label: {
              type: "plain_text",
              text: "Wins 🎉 ",
              emoji: true,
            },
          },
          {
            type: "input",
            block_id: "challenges",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "plain_text_input-action",
              placeholder: {
                type: "plain_text",
                text: "What were some obstacles?",
                emoji: true,
              },
            },
            label: {
              type: "plain_text",
              text: "Challenges 😕",
            },
          },
          {
            type: "input",
            block_id: "goals",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action",
              placeholder: {
                type: "plain_text",
                text: "What still needs to be done?",
                emoji: true,
              },
            },
            label: {
              type: "plain_text",
              text: "Goal(s) for next session ⚡️",
            },
          },
          {
            block_id: "target_channel",
            type: "input",
            optional: false,
            label: {
              type: "plain_text",
              text: "Select a channel to post the summary in",
            },
            element: {
              action_id: "target_select",
              type: "conversations_select",
              response_url_enabled: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});


app.view("view_1", async ({ ack, body, view, client, logger }) => {
    await ack();
  
    const providedValues = view.state.values;
    const channelID =
      providedValues.target_channel.target_select.selected_conversation;
  
    console.log(providedValues);
    console.log(channelID);
  
    // const user = body.user.id;
    const wins = providedValues.wins["plain_text_input-action"].value;
    const challenges =
    providedValues.challenges["plain_text_input-action"].value;
    const goals = providedValues.goals["plain_text_input-action"].value;
    const users_selected =
    providedValues.users_selected["multi_users_select-action"]
        .selected_users;
  
    console.log(users_selected);
  
    try {
      await client.chat.postMessage({
        channel: channelID,
        attachments: [
          {
            color: "#92BC3D",
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: "✨ Pairing Summary Report ✨",
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Who paired?*: <@${users_selected[0]}> and <@${users_selected[1]}>`,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Wins* 🎉: " + wins,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Challenges* 😕: " + challenges,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Goal(s) for next session* ⚡️: " + goals,
                },
              },
            ],
          },
        ],
      });
    } catch (error) {
      logger.error(error);
    }
  });

  app.event("app_home_opened", async ({ event, client, context }) => {
    try {
      /* view.publish is the method that your app uses to push a view to the Home tab */
      const result = await client.views.publish({
        /* the user that opened your app's app home */
        user_id: event.user,
  
        /* the view object that appears in the app home*/
        view: {
          type: "home",
          callback_id: "home_view",
  
          /* body of the view */
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "This is Pear 🍐",
              },
            },
            {
              type: "divider",
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "Ever had a great pair programming session and wanted to share it with your team? Meet _Pear_, an automated Slackbot that allows you to share your wins, goals, and challenges for your daily or weekly pairings.",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*How to interact:*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "Run the following command from any public channel or invite *@Pear* to your private one to get started. \n \n *`/pear [report]`* \n \n Your team can't wait to see your 'pear-fect' summaries!",
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  });



(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

