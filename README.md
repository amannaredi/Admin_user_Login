# iLERNO-task

This repository contains all codes for CRUD operations in Mongodb using nodejs express and mongoose.

Following are the operations:-
    Create
    Question 1:
    Create an api for users to sign up (with name, email, phone number, password fields).
    Passwords must be hashed.
    Validate email field before save, email field should be unique.
    It should return a JWT token with expiration.

    Question 2:
    Create an api for admin to sign up (with name, email, password fields).
    Passwords  must be hashed.
    Validate email field before save, email field should be unique.
    Use a separate admin collection to create admin user records.
    It should return a JWT token with expiration.

    Read
    Question 3:
    Create an api for users to login using email and password.
    It should return a JWT token with expiration.

    Question 4:
    Create an api for admin to login using email and password.
    It should return a JWT token with expiration.

    Update
    Question 5:
    Create an api for users password update.
    User current password must be matched before updating the new password.
    Api must be protected by a valid token.
    It should return the success or failure message.

    Question 6:
    Create an api for admin password update.
    User current password must be matched before updating the new password.
    Api must be protected by a valid token.
    It should return the success or failure message.

    Delete
    Question 7:
    Create an api for users to delete their own created account.
    Api must be protected by a valid token.
    It should return the success or failure message.

    Question 8:
    Create an api for admin to delete any user's account.
    Api must be protected by a valid token.
    It should return the success or failure message.

