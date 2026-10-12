# Sachivalayam Complaint Management System (Firebase)

## One-time Firebase setup
1. console.firebase.google.com > Add project > add a **Web app** > copy its config into `js/firebase-config.js`.
2. Build > Authentication > Sign-in method > enable **Email/Password**.
3. Build > Firestore Database > Create database (production mode) > Rules tab > paste `firestore.rules` > Publish.
4. Authentication > Settings > Authorized domains > add `rahul21-art.github.io`.

## Make an admin
1. Register on the live site with the admin email.
2. Authentication > Users > copy that user's UID.
3. Firestore > Start collection `admins` > Document ID = that UID > add any field (for example `role: "admin"`).

## Hero video (made with the Motion connector)
Download the finished video from the Motion widget and save it as `assets/hero.mp4`. The page works without it.

## Deploy
Replace the old files in the repo with this folder, then delete `js/script.js`, `js/language.js` and `water.html`. Commit and push; GitHub Pages redeploys.
