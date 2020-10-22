# RCApps.RapidPro-Channel

## About
Rapidpro-Channel is a [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat) app to enable the integration between [RapidPro](https://github.com/rapidpro/rapidpro) channels service and Rocket.Chat.

## Installation

### Prerequisites

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node](https://nodejs.org/en/download/)
- [RC-Apps](https://docs.rocket.chat/apps-development/getting-started#rocket-chat-app-engine-cli)

1. Clone the repository and change directory:

```bash
    git clone https://github.com/Ilhasoft/RCApps.RapidPro-Channel.git
    cd RCApps.RapidPro-Channel
```

2. Install the required packages:

```bash
    npm install
```

3. Give your branding to the Application:

```bash
    npm run build
```

- Then the CLI will prompt you to insert some info about your App's branding settings

4. Deploy the App to an specific Rocket.Chat instance:

```bash
    rc-apps deploy --url <your-rocket-url> --username <your-admin-username> --password <your-admin-password>
```
- If deploying to an specific Rocket.Chat instance, make sure to enable `Development Mode` on `Administration > General > Apps > Enable Development Mode`.

5. To publish the App on the Rocket.Chat Marketplace, run the following command:

```bash
    npm run publish
```
- Answer the questions requested to publish the App on the Rocket.Chat marketplace.

Refer to this [guide](https://docs.rocket.chat/apps-development/getting-started) if you need more info.

## Integration Setup

1. With the app installed, and with the `secret` provided on the Rocket.Chat claim page in RapidPro, go to `Administration > Apps > this app`, and paste the `secret` on the `App's Secret` field, then click `Save Changes`.

2. Return to RapidPro, and proceed with the integration setup after setting the `App's Secret` field. This will automatically validate the integration between the app and RapidPro.

3. Create a bot on Rocket.Chat and give it the `livechat-agent` role, so insert the bot username on the channel setup on RapidPro.

4. To get the required `Auth Token` and `User Id` go to `Profile` > `My account` > `Personal Access Tokens` > `Generate a token without 2FA`, save the tokens as it will not be displayed again once the pop-up is closed.

## API Reference

The following headers are required in for all incoming requests to ensure the requests being made from the intended RapidPro integration.

```
Content-Type:  application/json
Authorization: Token LHHKXX8ZMJTVUFAHSW2J5P6FSF4SCQRK
```

Error responses body returned in this pattern:

```json
{
    "error": "error details message"
}
```

### GET /secret.check

- Description:
    - Match the given secret from `Authorization` header with the App's `App Secret` field.
- Success result:
    - Status: `204 No-Content`

### PUT /settings

- Description: 
    - Sets the given settings on app.
- Payload:
    ```json
    {
        "webhook": {
            "url": "https://<host>/c/rc/<UUID>/receive"
        },
        "bot": {
            "username": "rocket.cat",
        }
    }
    ```

- Success result:
    - Status: `204 No Content`

### POST /message

- Description:
    - Send a message to the specified user
- Payload:
    ```json
    {
        "userURN":     "direct:john.doe",
        "botUsername": "rocket.cat",
        "text":        "Hi! How are you?",
        "attachments": [
            {
                "type": "image/png",  
                "url":  "https://link.to/attachment1.png",
            },
            {
                "type": "application/pdf",            
                "url":  "https://link.to/attachment1.pdf",
            }
        ]
    }
    ```
- Success result:
    - Status: `201 Created`
    - Body:
    ```json
    {
        "id": "onrMgdKbpX9Qqtvoi"
    }
    ```

### Webhooks

There are currently 1 configured webhook on the app.

The following headers are required in for all webhooks to ensure the requests are being made from the intended RapidPro integration.

```
Content-Type:  application/json
Authorization: Token LHHKXX8ZMJTVUFAHSW2J5P6FSF4SCQRK
```

**POST <callback_url>**

- User Message:
    - Description:
        - Triggered when the user/visitor sends a message to the bot.
    - Payload:
        ```json
        {
            "user": {
                "urn": "livechat:onrMgdKbpX9Qqtvoi",
                "username": "john.doe",
                "full_name": "John Doe"
            },
            "text": "Hi!",
            "attachments": [
                {
                    "type": "image",            
                    "url":  "https://link.to/attachment1.png",
                }
            ]
        }
        ```
