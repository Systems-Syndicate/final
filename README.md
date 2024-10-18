# Welcome to Day 'n Knight
Day 'n Knight is a chessboard scheduling device, created by [Systems Syndicate](https://github.com/Systems-Syndicate) for DECO3801, Semester 2 2024. The project consists of two key parts, the chessboard device and the companion mobile application. The hardware uses NFC tags to distinguish between different users and display the corresponding users schedule on the chessboard. Overall, the aim of the project was to improve social connectedness and promote social spontaneity, whilst disgusing the device in an ambient way within the home.

## Running Day 'n Knight
To run Day 'n Knight, you will need the following devices:
- 1 tablet device (e.g. iPad, Android Galaxy Fold) for the chessboard with Expo Go application downloaded
- 1 computer to host the back-end and chessboard front-end
- 1 smartphone (to simulate a household member) with Expo Go application downloaded
- 1 NFC chip, attached to a chess piece

To begin, ensure all devices are connected to the same network (e.g. connect to a hotspot) - this allows all devices to connect to the IP address hosted on the computer.

The computer will be running multiple terminal sessions to run the back-end and front-end operations (chessboard and mobile phone).

### Starting the Back-End Server
On the computer, open a new terminal and run the following commands:

`cd app-back-end/api`

`poetry run flask --app app run -p 3801 --debug --host=0.0.0.0`

This will run locally on: `localhost:{number:4 digit}` and on your local WiFi.

> Please ensure you are running the server on your device, not a VM or a container.
> i.e. windows should use powershell.


To test if the server is running try: `localhost{number: digit}/health`

### Starting the Front-End Chessboard
On the computer, open another terminal and run the following commands:

`cd frontend/chessboard`

`npx expo start` 

On the tablet device, scan the QR code generated in the terminal to open the app in Expo Go.

### Starting the Front-End Mobile App
On the computer, open another terminal and run the following commands:

`cd frontend/phone`

`npx expo start` 

If this is taking too long to run, try: `npx expo start --tunnel`

On the tablet device, scan the QR code generated in the terminal to open the app in Expo Go.

The system is now ready to be run.

If you have issues running the front-end, run `npm install`.

## Code Structure
### Back-End
The back-end code consists of the API and the endpoints to write to the iCalendar files, which is backed up on an SQLAlchemy database. The code is organised into two sub-directories, `models` (containing the setup code for the database) and `views` (containing the endpoints to write to the iCalendar files).

Links to these files can be found here:
- [init.py](backend//api//app//__init__.py): initialises the database tables
- [views/routes.py](backend//api//app//views//routes.py): contains the code to create/edit/delete calendar events, save to the iCalendar file, and retrieve users based on their NFC id
- [models/tables.py](backend//api//app//models//tables.py): creates the columns for the database

### Front-End Chessboard
The front-end chessboard contains multilple different interfaces, one for the actual chessboard display and one for the calendar display. The chessboard is best viewed when run on a tablet or an Android Galaxy Fold and then can be connected to an external monitor via a HDMI cable.

Links to the important files can be found here:
- [components/chessboard.tsx](frontend//chessboard//components//Chessboard.tsx): displays the basic chessboard grid on the device
- [components/lock.tsx](frontend//chessboard//components//Lock.tsx): creates the personalised locking code
- [components/calendar.tsx](frontend//chessboard//components//Calendar.tsx): displays the calendar as a monthly, weekly or daily view with the users corresponding to the placed NFC tags
- [components/apicontext.tsx](frontend//chessboard//components//ApiContext.tsx): refreshes the calendar data from the database every second

### Front-End Phone
Finally, the front-end mobile application also consists of a main screen, which shows a schedule of the current user's events and has a button to add new events. Users can click on an existing event and edit the details, or delete it entirely.

Links to the important files can be found here:
- [hamburger/create_event.tsx](frontend/phone/app/(hamburger)/create_event.tsx): fetches the current user's events from the database, and includes an 'Add Event' button
- [hamburger/create_event_android.js](frontend/phone/app/(hamburger)/create_event_android.js): same as above, but works for Android devices

## Attributes

## Working Repositories
Links to the working repositories, where the front-end and back-end were kept separate can be found below:
- [Front-End Chessboard and Phone](https://github.com/Systems-Syndicate/frontend)
- [Back-End Repository](https://github.com/Systems-Syndicate/app-backend)
