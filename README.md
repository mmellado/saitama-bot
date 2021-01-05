# Saitama Bot

Discord bot for OnePunch Man - Road to Hero. 2.0 support

## Commands

# Admin Only

`s!setup`: Prompts to configure the bot. Allows configuring the moderator roles, prefix, announcement channel, codes channel and requests channel
`s!settings`: Shows the current server settings.

### Admin/Mod commands

`s!announce [announcement]`: Posts an announcement as an embed on the `#announcements` channel
`s!code [code]`: Interactive command to publish a code to the `#codes` channel
`s!set-nickname [member] [new nickname]`: Set the nickname for a user. If no nickname is passed, the nickname is reset.

### General commands

`s!help`: Shows the bot's available commands
`s!ping`: Basic command to test the bot
`s!nickname [new nickname]`: Command to easily change your own nickname. If no nickname is passed, the nickname is reset.

## TODO

- Add `s!request [user] [hero]` command
- Add `s!adventure` command
- Make bot language configurable per user
