# TODO Application

This project is a TODO application built exclusively using React for the frontend, and Node.js with Express for the backend, powered by MongoDB as the database. The application provides comprehensive functionality for managing TODO items efficiently.

## Features

- **User Authentication**: Users can sign up, log in, and log out.
- **Create TODO**: Users can create a TODO item with the following details:
  - Title
  - Description
  - Type (Official, Personal, Hobby, etc.)
  - Due date
- **Edit TODO**: Users can edit and update any details of a TODO item.
- **Mark as Done**: Users can mark the status of a TODO item as DONE.
- **Revert Status**: Users can revert the status of a TODO item from DONE back to the original status (To Do).
- **Delete TODO**: Users can delete a TODO item.
- **Filter TODOs**: Users can filter the list of TODO items by:
  - Overdue (due date < Today's date)
  - Status (To Do and Done)

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB