const functions = require("firebase-functions");
const { db } = require("./utility/admin");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/users");
const FBAuth = require("./utility/fbAuth");

/* Express and Formatting Response */
const express = require("express");
const app = express();

// Add CORS access policies to app
const cors = require("cors");
app.use(cors());

/* Scream routes */
app.get("/screams", getAllScreams); // get all documents in screams collection
app.post("/scream", FBAuth, postOneScream); // create a new document in the scream  collection
app.get("/scream/:screamId", getScream); // get all the information for a scream
app.delete("/scream/:screamId", FBAuth, deleteScream); // delete a scream
app.get("/scream/:screamId/like", FBAuth, likeScream); // like a scream
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream); // unlike a scream
app.post("/scream/:screamId/comment", FBAuth, commentOnScream); //comment on a scream

/* Users routes */
app.post("/signup", signup); // signup
app.post("/login", login); // login
app.post("/user/image", FBAuth, uploadImage); // upload image
app.post("/user", FBAuth, addUserDetails); // add other properties of user
app.get("/user", FBAuth, getAuthenticatedUser); // get own user details
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

// This statement always at the end
exports.api = functions.region("us-central1").https.onRequest(app);

// 'Like' trigger functions
exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("/likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        // cannot like oneself
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.err(err);
        // This is a trigger, don't need a response
      });
  });

// 'Unlike' trigger functions
exports.deleteNotificationOnUnlike = functions
  .region("us-central1")
  .firestore.document(`likes/{id}`)
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  });

// 'Comment' trigger functions
exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document(`comments/{id}`)
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        // cannot comment oneself
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.err(err);
        // This is a trigger, don't need a response
      });
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document(`/users/{userId}`)
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("Image has changed");
      let batch = db.batch();
      return db
        .collection("screams")
        .where(`userHandle`, "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });

          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions
  .region("us-central1")
  .firestore.document(`/screams/{screamId}`)
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });

        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });

        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });

        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
