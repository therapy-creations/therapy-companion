# Therapy Pathways Application

## Overview
Therapy Pathways is a comprehensive application designed to assist individuals on their therapeutic journeys. It provides users with personalized pathways based on their specific needs, ensuring a tailored approach to mental health and wellness.

## Features
- **User Profiles**: Users can create and manage their own profiles to track their progress.
- **Personalized Pathways**: The application offers tailored therapeutic pathways based on user inputs.
- **Resource Library**: Access to a curated library of articles, videos, and exercises relevant to various therapeutic modalities.
- **Progress Tracking**: Users can monitor their progress over time with insights and analytics.
- **Community Support**: Integration of forums and community features for users to connect and support one another.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Deployment**: Heroku/AWS
- **Authentication**: JWT (JSON Web Tokens)

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/sarahdenkert01-hue/therapy-companion.git
   cd therapy-companion
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the root directory and add your configurations:
   ```
   DATABASE_URL=<your_database_url>
   JWT_SECRET=<your_jwt_secret>
   ```
4. Run the application:
   ```bash
   npm start
   ```

## Project Structure
```
therapy-companion/
├── client/              # Frontend code
├── server/              # Backend code
├── README.md            # Documentation
└── .env                 # Environment variables
```

## Deployment Guides
- For deployment on Heroku:
  1. Create a new Heroku app:
  ```bash
  heroku create
  ```
  2. Push your code:
  ```bash
  git push heroku main
  ```

- For AWS deployment:
  1. Set up an AWS Elastic Beanstalk application.
  2. Configure it to connect to your MongoDB instance.

## Privacy Information
We take user privacy seriously. All sensitive data is encrypted and stored according to industry standards. User information is never shared with third parties. Please refer to our detailed privacy policy in the settings of your application for more information.