import * as $ from "jquery";
import {
  signUserUp,
  signUserOut,
  signUserIn,
  changeRoute,
  checkRequired,
  getData,
  getUserDisplayName,
} from "./model";

export let userRecipes = [
  {
    recipeName: "Cake",
    imageUrl: "https://cdn-wp.thesportsrush.com/2023/05/ef52e7b0-screenshot-2023-05-17-141107.jpg",
    description: "An actual cake. I promise.",
    cookTime: "2 hours",
    serveSize: "12",
    ingredients: [
      "2 ⅓ cups all-purpose flour",
      "1 ½ tablespoons all-purpose flour",
      "½ cup cocoa powder",
      "3 tablespoons cocoa powder",
      "1 tablespoon baking powder",
      "½ teaspoon salt",
      "1 cup milk",
      "1 ½ tablespoons milk",
      "1 ⅓ cups white sugar",
      "1 cup unsalted butter, softened",
      "4 eggs",
      "2 teaspoons vanilla extract",
      "¼ cup cherry jam",
      "3 cups chocolate buttercream frosting",
      "14 ounces marzipan",
      "5 drops red food coloring, or as needed",
      "1 tablespoon confectioners' sugar, or as needed",
    ],
    instructions: [
      "Preheat the oven to 350 degrees F (175 degrees C). Grease and flour two 9-inch square cake pans.",
      "Make the cake: Sift 2 1/3 cups plus 1 1/2 tablespoons flour, 1/2 cup plus 3 tablespoons cocoa powder, baking powder, and salt together in a large bowl. Combine 1 cup plus 1/2 tablespoon milk in a liquid measure.",
      "Beat white sugar and butter together in a bowl with an electric mixer until light and fluffy, about 4 minutes. Add eggs, one at a time, beating well after each addition. Beat in vanilla. Add flour mixture alternately with milk, mixing batter gently between after addition. Divide batter evenly between the prepared cake pans.",
      "Bake in the preheated oven until a toothpick inserted into the center comes out clean, 30 to 40 minutes. Cool for 10 minutes in the pan, then invert onto a wire rack to cool completely, about 30 minutes.",
      "Assemble and decorate the cake: Trim tops of cake layers to make sure they are flat. Place one layer onto a serving platter. Spread jam on top, then cover with the second layer. Spread chocolate buttercream frosting over the top and sides of the cake, reserving about 2 tablespoons frosting.",
      "Pinch off a piece of marzipan about the size of a golf ball. Add red food coloring and knead until color is evenly distributed.",
      "Dust a flat work surface with confectioners' sugar and roll out remaining undyed marzipan. Cut out a 9-inch square; carefully transfer to the top of the cake.",
      "Roll trimmings of marzipan and cut into four 9x1 1/2-inch strips. Cut three rectangular notches into one edge of each strip. Press strips onto the sides of the cake, with the notches facing down, then gently press the top and strips of marzipan together to adhere.",
      "Roll out red marzipan and cut into squares of varying sizes. Spread a little of the reserved frosting on the back of each square to act as a glue; arrange in a random Minecraft pattern on top of the cake.",
    ],
  },
];

function initListeners() {
  $(window).on(`hashchange`, changeRoute);
  $("#mobileHamburger").on("click", function () {
    if ($("#hamburgerCallapsible").css("height") == "0px") {
      let height = document.getElementById("hamburgerCallapsible").scrollHeight + "px";

      $("#hamburgerCallapsible").css("height", height);
    } else {
      $("#hamburgerCallapsible").css("height", "0px");
    }
  });
  changeRoute();

  $(".signoutBtn").on("click", (e) => {
    signUserOut();
  });
}

function deleteRecipe(elemIndex) {
  userRecipes.splice(elemIndex, 1);
  console.log(userRecipes);
  changeRoute();
}

function getChildIndex(parent, child) {
  return Array.from(parent.children).indexOf(child);
}

// This function is called by model.changeRoute() and will add listeners to elements on the newly loaded page after the .get event is done.
// [Only called if page is sucessfully loaded]
export function initListenersByPage(pageName) {
  $(".displayName").html(getUserDisplayName());
  // console.log("initListeners for page", pageName);
  switch (pageName) {
    case "home":
      break;
    case "browse":
      getData(function (data) {
        $.each(data, function (i, val) {
          $("#recipeList").append(createRecipeElementLiteral(i, val));
        });
      });

      break;
    case "yourRecipes":
      $.each(userRecipes, function (i, val) {
        $("#recipeList").append(createRecipeElementLiteral(i, val, true));
      });
      $(".deleteBtn").on("click", function () {
        let recipeTargetedIndex = getChildIndex(
          this.closest("#recipeList"),
          this.closest(".recipe")
        );
        deleteRecipe(recipeTargetedIndex);
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
        let recipeName = $("#recipeName").val();
        let recipeImageURL = $("#recipeImage").val();
        if (recipeImageURL.length <= 0)
          recipeImageURL =
            "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
        let description = $("#recipeDescription").val();
        let cookTime = $("#recipeTotalTime").val();
        let serveSize = $("#recipeServingSize").val();
        let ingredients = [];
        let instructions = [];

        $("#ingredients input").each(function () {
          if ($(this).val().length <= 0) return;
          ingredients.push($(this).val());
        });
        $("#instructions input").each(function () {
          if ($(this).val().length <= 0) return;
          instructions.push($(this).val());
        });

        $("form input").each(function () {
          if ($(this).attr("type") != "submit") $(this).val("");
        });

        userRecipes.push({
          recipeName: recipeName,
          imageUrl: recipeImageURL,
          description: description,
          cookTime: cookTime,
          serveSize: serveSize,
          ingredients: ingredients,
          instructions: instructions,
        });

        console.log(userRecipes);

        window.location.hash = `viewRecipe?recipe=${userRecipes.length - 1}`;
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
    case "viewRecipe":
      //Check to make sure the recipe we are trying to edit exists.
      let hashTagLocalView = window.location.hash;
      hashTagLocalView = hashTagLocalView.replace(`#`, ``);
      let pageIDlocalView = hashTagLocalView.split("?")[1];
      let recipeIndexView = new URLSearchParams(pageIDlocalView).get("recipe");
      let recipeDataView = userRecipes[recipeIndexView];

      // Check if the data is valid, if not, redirect to the home page as a fallback.
      if (
        recipeDataView == null ||
        recipeDataView == undefined ||
        recipeDataView == "" ||
        recipeIndexView == -1
      )
        window.location.hash = "";

      console.log(recipeDataView);

      $("#recipeTitle").html(recipeDataView.recipeName);
      $("#recipeDescription").html(recipeDataView.description);
      $("#recipeTotalTime").html(recipeDataView.cookTime);
      $("#recipeServings").html(recipeDataView.serveSize);
      $("#recipeImage").attr("src", recipeDataView.imageUrl);
      $("#recipeIngredientsList").html(recipeDataView.ingredients.join("<br>"));
      $("#recipeInstructionsList").html("");
      recipeDataView.instructions.forEach((element, index) => {
        $("#recipeInstructionsList").append(`<p>${index + 1}. ${element}<br></p>`);
      });
      // $("#recipeInstructionsList").html(recipeDataView.instructions.join("<br>"));
      $("#editBtn").attr("onclick", `location.href='#editRecipe?recipe=${recipeIndexView}'`);

      break;
    case "editRecipe":
      //Check to make sure the recipe we are trying to edit exists.
      let hashTagLocalEdit = window.location.hash;
      hashTagLocalEdit = hashTagLocalEdit.replace(`#`, ``);
      let pageIDlocalEdit = hashTagLocalEdit.split("?")[1];
      let recipeIndexEdit = new URLSearchParams(pageIDlocalEdit).get("recipe");
      let recipeDataEdit = userRecipes[recipeIndexEdit];

      // Check if the data is valid, if not, redirect to the home page as a fallback.
      if (
        recipeDataEdit == null ||
        recipeDataEdit == undefined ||
        recipeDataEdit == "" ||
        recipeIndexEdit == -1
      )
        window.location.hash = "";

      console.log(recipeDataEdit);

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
        let recipeName = $("#recipeName").val();
        let recipeImageURL = $("#recipeImage").val();
        if (recipeImageURL.length <= 0)
          recipeImageURL =
            "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
        let description = $("#recipeDescription").val();
        let cookTime = $("#recipeTotalTime").val();
        let serveSize = $("#recipeServingSize").val();
        let ingredients = [];
        let instructions = [];

        $("#ingredients input").each(function () {
          if ($(this).val().length <= 0) return;
          ingredients.push($(this).val());
        });
        $("#instructions input").each(function () {
          if ($(this).val().length <= 0) return;
          instructions.push($(this).val());
        });

        $("form input").each(function () {
          if ($(this).attr("type") != "submit") $(this).val("");
        });

        // Use the URL
        let hashTagLocalEdit = window.location.hash;
        hashTagLocalEdit = hashTagLocalEdit.replace(`#`, ``);
        let pageIDlocalEdit = hashTagLocalEdit.split("?")[1];
        let recipeIndexEdit = new URLSearchParams(pageIDlocalEdit).get("recipe");

        userRecipes[recipeIndexEdit] = {
          recipeName: recipeName,
          imageUrl: recipeImageURL,
          description: description,
          cookTime: cookTime,
          serveSize: serveSize,
          ingredients: ingredients,
          instructions: instructions,
        };

        console.log(userRecipes);

        window.location.hash = `viewRecipe?recipe=${recipeIndexEdit}`;
      });

      $("#recipeName").val(recipeDataEdit.recipeName);
      $("#recipeDescription").val(recipeDataEdit.description);
      $("#recipeTotalTime").val(recipeDataEdit.cookTime);
      $("#recipeServingSize").val(recipeDataEdit.serveSize);
      $("#recipeImage").val(recipeDataEdit.imageUrl);

      // Create the ingredient input(s)
      for (let index = 0; index < recipeDataEdit.ingredients.length; index++) {
        const element = recipeDataEdit.ingredients[index];
        const html =
          '<div class="input-container">' +
          `<input placeholder="" id="ingredient${index + 1}" value="${element}" type="text" />` +
          `<label for="name">Ingredient #${index + 1}</label>` +
          "</div>";
        $("#ingredients").append(html);
      }
      // Create the instructions input(s)
      for (let index = 0; index < recipeDataEdit.instructions.length; index++) {
        const element = recipeDataEdit.instructions[index];
        const html =
          '<div class="input-container">' +
          `<input placeholder="" id="instruction${index + 1}" value="${element}" type="text" />` +
          `<label for="name">Instruction #${index + 1}</label>` +
          "</div>";
        $("#instructions").append(html);
      }

      $("#recipeIngredientsList").html(recipeDataEdit.ingredients.join("<br>"));
      $("#recipeInstructionsList").html(recipeDataEdit.instructions.join("<br>"));
      $("#editBtn").attr("onclick", `location.href='#editRecipe?recipe=${recipeIndexEdit}'`);

      break;
  }
}

$(function () {
  initListeners();
});

function createRecipeElementLiteral(recipeIndex, recipeJson, includeEditBtns = false) {
  let viewBtnHtml = ``;
  let editBtnsHtml = ``;
  if (includeEditBtns) {
    viewBtnHtml = `<button onclick="location.href='#viewRecipe?recipe=${recipeIndex}';" class="button viewbtn"><span>View</span></button>`;
    editBtnsHtml = `<div class="yourRecipeBtns">
              <div class="button editBtn" onclick="location.href='#editRecipe?recipe=${recipeIndex}';">Edit Recipe</div>
              <div class="button deleteBtn">Delete</div>
            </div>`;
  }
  let recipeHtml = `<div class="recipe">
  ${editBtnsHtml}
            <div class="recipe-coverImg">
              <div class="background" style="background-image: url(${recipeJson.imageUrl})"></div>
              ${viewBtnHtml}
            </div>
            <div class="recipe-content">
              <h1>${recipeJson.recipeName}</h1>
              <p>
                ${recipeJson.description}
              </p>
              <div class="grid-container">
                <div class="grid-item right"><img src="../assets/images/time.svg" alt="" /></div>
                <div class="grid-item"><span>${recipeJson.cookTime}</span></div>
                <div class="grid-item right">
                  <img src="../assets/images/servings.svg" alt="" />
                </div>
                <div class="grid-item"><span>${recipeJson.serveSize} servings</span></div>
              </div>
            </div>
          </div>`;
  return recipeHtml;
}
