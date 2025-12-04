"use scrict";

// On ready / When loaded
$(document).ready(function() {

    // Testing load
    console.log("Page has successfully loaded");

    // jQuery Tabs
    $("#tabs").tabs();

    // Slider/Carousel
    $('.carousel-slider').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 3000,
    });

    // Submit handler
    $("#search-form").on("submit", function(e) {
        e.preventDefault();

        const ingredient = $("#ingredientInput").val().trim();

        if (ingredient == "") {
            alert("Please enter an ingredient!");
            console.log("uh-oh!")
            return;
        }

        // Search recipe function
        searchRecipes(ingredient);
    });

    $("#clearSavedBtn").on("click", function() {
        console.log("#clearSavedBtn clicked");

        if (confirm("Are you really really sure you want to clear all saved recipes?")) {
            localStorage.removeItem("savedRecipes");
            displaySaved();
            alert("All recipes cleared! 👯‍♀️");
        }
    })
});

// searchRecipes function to search Recipes
async function searchRecipes(ingredient) {
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

    try {
        let response = await fetch(url);

        console.log("Response");
        console.log(response);

        // Check response first
        if (!response.ok) {
            throw new Error(`Uh oh! Status: ${response.status} ‼️`)
        }

        let data = await response.json();
        console.log("Data");
        console.log(data);

        if (data.meals && data.meals.length > 0) {
            // If meals found, display by function: 
            displayRecipes(data.meals);
        } else {
            alert("No recipes found! Try another one? 🤔");
        }
    } catch (error) {
        console.error(`Error has been fetched: ${error}`)
        alert("Sorry! We failed digging into recipes. Try again. 🥹")
    }
}

// Function to display three random recipes
function displayRecipes(meals) {
    const totalRecipes = meals.length;
    const selectedIndex = [];

    // Get three random indexes using Math.random()
    while (selectedIndex.length < 3 && selectedIndex.length < totalRecipes) {
        const randomIndex = Math.floor(Math.random() * totalRecipes);

        if (!selectedIndex.includes(randomIndex)) {
            selectedIndex.push(randomIndex);
        }
    }

    // Clear/remove previous results to display only three new
    $("#searchResults").empty();

    // FINALLY, THE FUNCTION TO ACTUALLY display three recipes
    selectedIndex.forEach(index => {
        // Get recipe by selected index
        const recipe = meals[index];

        // Recipe card
        // Button: recipe does not exist after this scope, need to add data-* attribute
        const recipeCard = `
            <div id="${recipe.idMeal}">
                <h4>${recipe.strMeal}</h4>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <button type="button" class="saveBtn" data-id="${recipe.idMeal}" data-name="${recipe.strMeal}" data-img="${recipe.strMealThumb}">Save Recipe</button>
            </div>
        `;

        // Append to display in HTML
        $("#searchResults").append(recipeCard);
    })

    // Save recipe - stripping out recipe information
    $("#searchResults").on("click", ".saveBtn", function() {
        // Get id, name, and img from button data-* attribute
        const recipeId = $(this).data("id");
        const recipeName = $(this).data("name");
        const recipeImg = $(this).data("img");

        console.log(recipeId);
        console.log(recipeName);
        console.log(recipeImg);

        // Use saveRecipe function to store in localStorage
        saveRecipe(recipeId, recipeName, recipeImg);

        // localStorage.setItem("recipeId", recipeId);
        // localStorage.setItem("recipeName", recipeName);
        // localStorage.setItem("recipeImg", recipeImg);
    })

}

function saveRecipe(id, name, img) {
    // Call existing recipes, if not, initiazlie with empty arraw
    let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    // See if the given id, name, and img is already Saved
    let alreadySaved = savedRecipes.some(recipe => recipe.id === id);

    if (alreadySaved) {
        alert("Recipe is already saved! 👍")
        return;
    }

    // Add new recipe
    const newRecipe = {
        id,
        name,
        img
    }

    savedRecipes.push(newRecipe);

    // Store in localStorage
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    alert(`${name} is saved! 🥳`);

    // Display saved recipe in tab
    displaySaved();
}

function displaySaved() {
    let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    $("#savedResults").empty();

    if (savedRecipes.length === 0) {
        $("#savedResults").html("<p>No Saved recipes yet! 🍽️</p>");
        return;
    }

    savedRecipes.forEach(recipe => {
        const recipeCard = `
            <div id="${recipe.id}">
                <h4>${recipe.name}</h4>
                <img src="${recipe.img}" alt="${recipe.name}">
            </div>
        `;

        $("#savedResults").append(recipeCard);
    })

}

displaySaved();