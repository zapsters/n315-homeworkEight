import * as $ from "jquery";
import { signUserUp, signUserOut, signUserIn, changeRoute, checkRequired, getData } from "./model";

const userRecipes = {
  "User made": {
    imageUrl:
      "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg",
    description: "this was ",
    cookTime: "1min",
    serveSize: "1",
  },
};

function initListeners() {
  $(window).on(`hashchange`, changeRoute);
  $("#mobileHamburger").on("click", function () {
    if ($("#hamburgerCallapsible").css("height") == "0px") {
      $("#hamburgerCallapsible").css("height", "302px");
    } else {
      $("#hamburgerCallapsible").css("height", "0px");
    }
  });
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
    case "home":
      break;
    case "browse":
      getData(function (data) {
        $.each(data, function (i, val) {
          console.log(i, val);
          $("#recipeList").append(createRecipeElementLiteral(i, val));
        });
      });

      break;
    case "yourRecipes":
      $.each(userRecipes, function (i, val) {
        console.log(i, val);
        $("#recipeList").append(createRecipeElementLiteral(i, val, true));
      });

      break;
    case "createRecipe":
      $("#ingredientAdd").on("click", (e) => {
        const parent = e.currentTarget.parentElement.children[1];
        const count = parent.children.length + 1;
        const html =
          '<div class="input-container">' +
          `<input placeholder="" id="ingredient${count}" type="text" />` +
          `<label for="name">Ingredient #${count}</label>` +
          "</div>";
        $(parent).append(html);
      });
      $("#ingredientMinus").on("click", (e) => {
        const parent = e.currentTarget.parentElement.children[1];

        const count = parent.children.length;
        parent.children[count - 1].remove();
      });
      $("#instructionAdd").on("click", (e) => {
        const parent = e.currentTarget.parentElement.children[1];
        const count = parent.children.length + 1;
        const html =
          '<div class="input-container">' +
          `<input placeholder="" id="instruction${count}" type="text" />` +
          `<label for="name">Instruction #${count}</label>` +
          "</div>";
        $(parent).append(html);
      });
      $("#instructionMinus").on("click", (e) => {
        const parent = e.currentTarget.parentElement.children[1];

        const count = parent.children.length;
        parent.children[count - 1].remove();
      });
      $("#submitBtn").on("click", (e) => {
        if (!checkRequired("createRecipeForm")) return;

        e.preventDefault();
        let recipe = {
          recipeName: $("#recipeName").val(),
          recipeImageURL: $("#recipeImage").val(),
          ingredients: [],
          instructions: [],
        };

        $("#ingredients input").each(function () {
          recipe.ingredients.push($(this).val());
        });
        $("#instructions input").each(function () {
          recipe.instructions.push($(this).val());
        });

        $("form input").each(function () {
          if ($(this).attr("type") != "submit") $(this).val("");
        });

        userRecipes.push(recipe);
        console.log(userRecipes);
      });
      break;
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

function createRecipeElementLiteral(recipeName, recipeJson, includeEditBtns = false) {
  let viewBtnHtml = ``;
  let editBtnsHtml = ``;
  if (includeEditBtns) {
    viewBtnHtml = `<button class="button viewbtn"><span>View</span></button>`;
    editBtnsHtml = `<div class="yourRecipeBtns">
              <div class="button">Edit Recipe</div>
              <div class="button">Delete</div>
            </div>`;
  }
  let recipeHtml = `<div class="recipe">
  ${editBtnsHtml}
            <div class="recipe-coverImg">
              <div class="background" style="background-image: url(${recipeJson.imageUrl})"></div>
              ${viewBtnHtml}
            </div>
            <div class="recipe-content">
              <h1>${recipeName}</h1>
              <p>
                ${recipeJson.description}
              </p>
              <div class="grid-container">
                <div class="grid-item right"><img src="../assets/images/time.svg" alt="" /></div>
                <div class="grid-item"><p>${recipeJson.cookTime}</p></div>
                <div class="grid-item right">
                  <img src="../assets/images/servings.svg" alt="" />
                </div>
                <div class="grid-item"><p>${recipeJson.serveSize} servings</p></div>
              </div>
            </div>
          </div>`;
  return recipeHtml;
}
