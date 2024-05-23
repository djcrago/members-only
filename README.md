# Members Only

This repository houses an example messaging board website where users are given different abilities and permissions based on the status of their account.
The live website can be found here: https://tech-talk-members-only.fly.dev/users

Screenshot of Live Website:
![Screenshot of website this repository houses](./website-screenshot.png?raw=true 'Website Screenshot')

## Permissions

Below are the lists of permissions/abilities users have based on the associated status.

First-time visitors:

- Able to see a list of all messages, with the author’s name and date of message hidden.
- Able to sign-up and login.

Logged-in users:

- Able to see a list of all messages, with the author’s name and date of message hidden.
- Able to create messages.

Members:

- Able to see a list of all messages, with all information visible.
- Able to create messages.

Admins:

- Able to see a list of all messages, with all information visible.
- Able to create messages.
- Able to delete messages.

## Features

- Using a Model-View-Controller architecture to separate concerns
- Using MongoDB for a database and Mongoose for accessing data
- Using Passportjs to authenticate users
- Using bcryptjs to secure passwords stored in the database
- Working with the view template-engine pug
- Using luxon to format dates
- Deploy using fly.io

## License

The project is licensed under the ISC license.
