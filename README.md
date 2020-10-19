# RCApps.RapidPro-Channel

## About
Rapidpro-Channel is a [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat) app to enable the integration between [RapidPro](https://github.com/rapidpro/rapidpro) channels service and Rocket.Chat.

## Installation

### Prerequisites

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node](https://nodejs.org/en/download/)
- [RC-Apps](https://docs.rocket.chat/apps-development/getting-started#rocket-chat-app-engine-cli)

To install manually on your Rocket.Chat instance you first need to enable the installation of apps in development mode at `Administration > General > Apps > Enable development mode`.

1. Clone the repository and change directory:

```bash
    git clone https://github.com/Ilhasoft/RCApps.RapidPro-Channel.git
    cd Rocket.Chat.App-Tickets
```

2. Install the required packages:

```bash
    npm install
```

3. Deploy the App:

```bash
    npm run publish
```

- Then the CLI will prompt you to insert:
    - `Info about your App's branding settings`
    - `Server's URL`: Is your Rocket.Chat instance URL (if running Rocket.Chat locally,  insert `localhost:<PORT>`)
    - `username`: Is the username of the Rocket.Chat admin
    - `password`: Is the password of the Rocket.Chat admin

Refer to this [guide](https://docs.rocket.chat/apps-development/getting-started) if you need more info.

## App Setup

1. With the app installed, and with the `secret` provided on the Rocket.Chat channel service integration on RapidPro, go to `Administration > Apps > this app`, and paste the `secret` on the `App's Secret` field, then click `Save Changes`.

3. Return to RapidPro, and proceed with the integration setup after setting the `App's Secret` field. This will automatically validate the integration between the app and RapidPro.

## API Reference

The following headers are required in for all incoming requests to ensure the requests being made from the intended rapidpro integration.

```json
Content-Type:  application/json
Authorization: Token LHHKXX8ZMJTVUFAHSW2J5P6FSF4SCQRK
```

Error responses are returned in this pattern:

```json
{
    "error": "error details message"
}
```

### GET /secret.check

- Description:
    - Match the given secret from `Authorization` header with the App's `App Secret` field.
- Result:
    - Status: `204 No-Content`

### PUT /settings

- Description: 
    - Sets the given settings on app.
- Payload:
    ```json
    {
    "webhook": {
        "url": "https://<host>/mr/tickets/types/rocketchat/event_callback/<UUID>"
    },
    "bot": {
        "username": "bot.username",
    }
}
    ```
- Result:
    - Status: `204 No Content`

### POST /message

- Description:
    - Send a massage to the specified user
- Payload:
    ```json
    {
        "userURN":     "direct:john.doe" | "livechat:token123xyz",
        "botUsername": "bot.username",
        "text":        "Hi! How are you?",
        "attachments": [
            {
                "type": "image",            
                "url":  "https://link.to/attachment1.png",
            },
            {
                "type": "audio",            
                "url":  "https://link.to/attachment2.mp3",
            },
            {
                "type": "video",            
                "url":  "https://link.to/attachment3.mp4",
            },
            {
                "type": "document",            
                "url":  "https://link.to/attachment1.pdf",
            },
        ]
    }
    ```
- Result:
    - Status: `201 CREATED`
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
Authorization: Token <SECRET GENERATED ON RAPIDPRO>
```

**POST <callback_url>**

- User Message:
    - Description:
        - Triggered when the user/visitor sends a message to the bot.
    - Payload:
        ```json
        {
            "user": {
                "urn": "direct:user.username" | "livechat:visitor.token",
                "username": "john.doe",
                "full_name": "John Doe"
            },
            "text": "Hi!",
            "attachments": [
                {
                    "type": "image",            
                    "url":  "https://link.to/attachment1.png",
                },
                {
                    "type": "audio",            
                    "url":  "https://link.to/attachment2.mp3",
                },
                {
                    "type": "video",            
                    "url":  "https://link.to/attachment3.mp4",
                },
                {
                    "type": "document",            
                    "url":  "https://link.to/attachment1.pdf",
                },
            ]
        }
        ```
