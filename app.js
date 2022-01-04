const key = "2492b3bfe30a4930884366a6970bb18b";
const nutrientsBox = document.querySelector(".nutrients-box");
const mealBox = document.querySelector(".meal-box");
const selectedCalories = document.querySelector(".calories-input > input");
const selectedDiet = document.querySelector("#diet");
const generateBtn = document.querySelector(".submit-btn > button");

class GenerateMealPlan {
  async getMeals(diet, calories) {
    const response = await fetch(
      `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&diet=${diet}&targetCalories=${calories}&apiKey=${key}`
    );
    const result = await response.json();

    if (response.ok) {
      return result;
    }
    const error = new Error();
    error.info = result;
    throw error;
  }

  getRecipeImages(recipes) {
    const images = [...recipes].map(async (recipe) => {
      const responce = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${key}`
      );
      const result = await responce.json();
      return result.image;
    });
    return images;
  }
}

class UI {
  displayNutrients(nutrients) {
    nutrientsBox.innerHTML = `
    <div class="calories">total calories: ${nutrients.calories}</div>
    <div class="nutrition-profile">
      <p>carbohydrates: ${nutrients.carbohydrates}</p>
      <p>protein: ${nutrients.protein}</p>
      <p>fat: ${nutrients.fat}</p>
    </div>
    `;
  }

  displayMeals(meals) {
    let content = ``;
    [...meals].forEach((meal) => {
      content += `
      <article class="meal">
        <div class="meal-description">
          <img src="" class = "recipe-image-box" alt="recipe image"/>
          <p class="title">${meal.title}</p>
          <div>
            <p>prepration time: ${meal.readyInMinutes}</p>
            <p>number of servings: ${meal.servings}</p>
          </div>
          <a href="${meal.sourceUrl}" class="recipe-btn">go to recipe</a>
        </div>
      </article>
      `;
    });
    mealBox.innerHTML = content;
  }
}

const food = new GenerateMealPlan();
const ui = new UI();

generateBtn.onclick = function () {
  if (selectedCalories.value < 300 || selectedCalories.value > 3000) {
    alert("Please enter between 300 and 3000 calories.");
  } else if (selectedDiet.value === "") {
    alert("Please enter your diet.");
  } else {
    food
      .getMeals(selectedDiet.value, selectedCalories.value)
      .then((data) => {
        ui.displayNutrients(data.nutrients);
        ui.displayMeals(data.meals);
        return food.getRecipeImages(data.meals);
      })
      .then((images) => {
        const recipeImgBox =
          document.getElementsByClassName("recipe-image-box");
        [...images].forEach(async (image, index) => {
          const img = await image;
          recipeImgBox[index].src = img;
        });
      })
      .catch((err) => {
        console.log(err.info);
      });
  }
};
