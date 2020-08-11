const {db, admin} = require("./admin");

// Middleware function of checking authorization for a user who wants to access the database
module.exports = (request, response, next) => {
  let idToken;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return response.status(403).json({error: "Unauthorized"});
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // decodedToken === current user
      request.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", request.user.uid)
        .limit(1) // only need 1 document
        .get();
    })
    .then((data) => {
      // get current user's information when request
      request.user.handle = data.docs[0].data().handle;
      request.user.imageUrl = data.docs[0].data().imageUrl;
      next();
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return response.status(403).json(err);
    });
};
