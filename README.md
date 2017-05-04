## Welcome to AroundTown -- A Princeton COS333 Project

Hoot (originally AroundTown) is a mobile app for Princeton students that integrates all live event information, crowdsourced from users who drop “pins," onto a single campus map. Using location services and push notifications, only potentially interested people will get notifications about a certain event, freeing others from annoying emails or alerts and making sure you never miss out.

Project Members:    
* Hrishikesh Khandeparkar         hrk@princeton.edu
* Timothy Lou                     tlou@princeton.edu
* Karen Zhang (leader)            kz7@princeton.edu

Advisor:
* Gautam Sharma                   gsharma@princeton.edu

[Design Document (click me)](DesignDocument.pdf)


### Timeline

Below is the timeline for our project (last updated 3.27.17)

```markdown
March 19 - 25 -- COMPLETED
- Get familiarized with React Native, JavaScript
- Learn the features of the react-native-maps and react-native-push-notifications API.
- Toy around with implementing basic apps created using these packages.

Mar 26 - 31 -- COMPLETED
- Project website		
- App displays a map
- App handles basic map interactions (moving, zooming)

Apr 1 - 8 -- COMPLETED				
- Create a standard API for backend interactions
- Create a standard API for selecting a subset of users for push notifications.
- App can track location of user
- Be able to place/display “pins” on locations on a map
- Start implementing backend (store pin info)

Apr 9 - 15 -- COMPLETED				
- Refine backend API for unforeseen issues
- Finish implementing backend (store pin info)
- App can send information to user (SMS or push notifs)

Apr 16 - 22 -- COMPLETED
- Minimum viable product complete
- Users can place pins and receive notifications
- Start working on location specific notifications for subsets of users

Apr 23 - 30 Alpha test -- COMPLETED
- Add pin categories and filters
- Implement user location updates
- Implement location-specific notifications

May 1 - 7 Beta test -- UPCOMING
- Users can comment/give feedback to existing pins
- Add “home base” notification capabilities
- No more adding features after the end of this week

May 8 - 12 Demo days -- UPCOMING		
- Debug and look for ways to clean up

May 14 Submission

ATown details
- Supports login with info via Firebase
- Adds user to Firebase, with details, and preferences
- Supports dropping pins, with user inputs, and category
- Updates pins on Flask App running on Heroku+Gunicorn
- Backend DB is on PostgreSQL
- Push notifs implemented with OneSignal+Firebase

```

WARNING: The node_modules arent uploaded to the git, so dont forget to npm install. If react-native-maps is being buggy use locally copied react-native-maps package (update messes up rnpm linking).
