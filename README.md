# LNBook
LNBook allows Lapp admins to query users by Twitter @screen_name, returning a list of services and LNURLs for that user (provided by the user) & optionally a fresh, Tippin.me invoice!

# How to use
If you are a user, simply log in with Twitter, navigate to your dashboard, and enter LNURLs from your lapps.

If you are a lapp admin, try our API! Query `/api/screen_name` for a list of LNURLs associated with that screen_name, or query `/api/getinvoice/screen_name` if you also want to receive a fresh Tippin.me invoice for that user (if the user has a Tippin account).

# How to run locally
Clone, npm install. Create a creds.js file in the project directory and add Twitter API credentials (use creds.example.js as a guide).

You will likely need to use 127.0.0.1:3000 for local development if using the Twitter API.
