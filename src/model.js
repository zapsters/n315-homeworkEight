import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { initListenersByPage } from "./index";
import * as $ from "jquery";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    $("#status").html("signed in");
    $(".signoutBtn").show();
    $(".loginBtn").hide();
    $(".yourRecipes").show();
    $(".createRecipe").hide();
  } else {
    $("#status").html("not signed in");
    $(".signoutBtn").hide();
    $(".loginBtn").show();
    $(".yourRecipes").hide();
    $(".createRecipe").show();
  }
});

export function signUserUp(firstName, lastName, email, password) {
  // console.log(`${firstName}, ${lastName}, ${email}, ${password}`);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user, "userCreated");
      window.location.hash = "";
    })
    .catch((error) => {
      console.log(error);
    });
}

export function signUserOut() {
  signOut(auth)
    .then(() => {
      console.log("signout!");
      changeRoute("home");
    })
    .catch((error) => {
      console.log("Error" + error);
    });
}

export function signUserIn(siEmail, siPassword) {
  signInWithEmailAndPassword(auth, siEmail, siPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("signed in!", user);
      window.location.hash = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

export function changeRoute(e) {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace(`#`, ``);

  if (pageID == ``) {
    pageID = `home`;
  }
  $.get(`pages/${pageID}.html`, function (data) {
    // console.log(`data ` + data);
    $(`#app`).html(data);
  })
    .done(function () {
      initListenersByPage(pageID);
    })
    .fail(function (error) {
      $.get(`pages/404.html`, function (data) {
        $(`#app`).html(data);
      }).done(function () {
        $(`#errorDetails`).html(`The page you are looking for '${pageID}' can not be found.`);
        $(`#errorCode`).html(`${error.status}: ${error.statusText}`);
      });
    })
    .always(function () {
      $(`a`).each(function () {
        let aHref = $(this).attr(`href`).replace(`#`, ``);
        if (aHref == pageID) {
          $(this).addClass(`active`);
        } else {
          $(this).removeClass(`active`);
        }
      });
    });
}
