import * as $ from "jquery";
import { signUserUp, signUserOut, signUserIn, changeRoute } from "./model";

function initListeners() {
  $(window).on(`hashchange`, changeRoute);
  changeRoute();

  $(".signoutBtn").on("click", (e) => {
    signUserOut();
  });
}

// This function is called by model.changeRoute() and will add listeners to elements on the newly loaded page after the .get event is done.
// [Only called if page is sucessfully loaded]
export function initListenersByPage(pageName) {
  // console.log("initListeners for page", pageName);
  switch (pageName) {
    case "login":
      $("#signup-submit").on("click", (e) => {
        e.preventDefault();
        const firstName = $("#signup-firstName").val();
        const lastName = $("#signup-lastName").val();
        const email = $("#signup-email").val();
        const password = $("#signup-password").val();
        signUserUp(firstName, lastName, email, password);
      });

      $("#login-submit").on("click", (e) => {
        e.preventDefault();
        const email = $("#login-email").val();
        const password = $("#login-password").val();
        signUserIn(email, password);
      });
      break;
  }
}

$(function () {
  initListeners();
});
