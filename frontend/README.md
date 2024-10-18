# frontend

To begin run npm start in `chessboard/` or `phone/`

## Mobile App

To run the app on Expo Go you will need to run both the back-end API and the front-end React Native.

In the back-end code, in the api directory, run using poetry (following the Readme there).

In another terminal, in the phone directory, run the front-end React Native using `npx expo run`.

If there are issues, you may need to check the API URL being run in the back-end and check it corresponds to the one expected in the front-end.

## Chessboard

Similarly to the Mobile app, you will need to run both the backend API and frontend React Native.

For the frontend to function, you will need to add an .env file with your respective IP address

In the `chessboard` directory, run `npx expo run`.

The ideal situation is for the chessboard to be run on a large screen Android/iOS that allows for touchscreen capabilities. We may not have these capabilities, so we have relied on web view.

Once the npx expo server is running, press `w` for a version of the application to run on your chosen web browser.
