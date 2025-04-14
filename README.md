# FSD-Draft
First draft of FSD project


# 14 April 2025


# Custom League Management System

## Overview

A full-stack web application designed to manage a custom sports league. The app allows users to create teams, enter and update scores, and generate reports. Admins have special privileges to manage scores and view detailed statistics. The application uses Google OAuth for authentication and MongoDB for data storage.

## Features

- **User Authentication**:  
  - Google OAuth login/signup for easy authentication.
  - User data (name, email) stored in MongoDB.

- **Team Management**:  
  - Select a sport and create a team.
  - Enter team member names and store them in the database.

- **Score Management**:  
  - Users can enter, update, and store scores for games.
  - When revisiting, users can either edit previous scores or add new scores for a new session.

- **Admin Access**:  
  - Admins have the ability to:
    - Modify, delete, or update scores.
    - View and manage all team data.

- **Reports and Charts**:  
  - Generate reports on league statistics (e.g., total games played, highest/lowest scores).
  - Visualize the reports with interactive charts using Chart.js (or a similar library).

- **Responsive Design**:  
  - The web application is built with a mobile-first, responsive design using HTML, CSS, and JavaScript to ensure usability across devices.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose for schema management)
- **Authentication**: Google OAuth
- **Charts**: Chart.js (or another JavaScript chart library)


## Usage

- **Sign Up / Log In**:  
  Use Google OAuth to sign up or log in to the app.
  
- **Manage Teams**:  
  After logging in, select a sport and create a team by entering team member names.
  
- **Enter and Update Scores**:  
  Users can enter scores for the games, and revisiting the app allows them to update or add new scores.

- **Admin Panel**:  
  Admins can modify scores and generate reports for all games played in the league.


