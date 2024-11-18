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
    $(".createRecipe").show();
  } else {
    $("#status").html("not signed in");
    $(".signoutBtn").hide();
    $(".loginBtn").show();
    $(".yourRecipes").hide();
    $(".createRecipe").show();
  }
});

export function getData(callback) {
  $.getJSON("data/data.json", function (data) {
    callback(data);
  })
    .done(function () {
      console.log("second success");
    })
    .fail(function () {
      console.log("error");
    })
    .always(function () {
      console.log("complete");
    });
}

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
      $("#signup-statusText").html(error.code);
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
      $("#login-statusText").html(errorCode);
    });
}

export function changeRoute(e) {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace(`#`, ``);

  if (pageID == ``) {
    pageID = `home`;
  }
  $.get(`pages/${pageID}.html`, function (data) {
    $(`#app`).html(data);
  })
    .done(function () {
      initListenersByPage(pageID);
    })
    .fail(function (error) {
      $.get(`pages/404.html`, function (data) {
        $(`#app`).html(
          `<!DOCTYPE html><style>.error{font-family:monospace;margin-top:200px;padding:0 50px}.error .box{margin:0 auto;background-color:rgba(128,128,128,.356);width:fit-content;padding:30px 30px;width:100%;max-width:500px}.error .box span{font-family:sans-serif;font-size:15px}.error .box span{font-size:15px}</style><div class='error'><div class='box'><h1>Error</h1><p id='errorDetails'></p><p id='errorCode'></p></div></div>`
        );
      }).done(function () {
        $(`#errorDetails`).html(`The page you are looking for '${pageID}' can not be found.`);
        $(`#errorCode`).html(`${error.status}: ${error.statusText}`);
      });
    })
    .always(function () {
      //Add the active class to anchor tags with the same pageID as an href
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

export function checkRequired(id) {
  let allAreFilled = true;
  document
    .getElementById(id)
    .querySelectorAll("[required]")
    .forEach(function (i) {
      if (!allAreFilled) return;
      if (i.type === "radio") {
        let radioValueCheck = false;
        document
          .getElementById("myForm")
          .querySelectorAll(`[name=${i.name}]`)
          .forEach(function (r) {
            if (r.checked) radioValueCheck = true;
          });
        allAreFilled = radioValueCheck;
        return;
      }
      if (!i.value) {
        allAreFilled = false;
        return;
      }
    });
  return allAreFilled;
}
