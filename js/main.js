const pokemonContent = document.querySelector(".pokemons-content");
const pokemonList = document.querySelector("#pokemonList");
const loadMoreButton = document.querySelector("#loadMoreButton");
const profilePokemon = document.querySelector(".pokemon-profile");
const input = document.querySelector("#search-pokemon");
const searchImg = document.querySelector(".search-bar img");
const maxRecords = 251;
let offset = 0;
const limit = adjustNumberOfPokemonOnScreen();

function adjustNumberOfPokemonOnScreen() {
   const screenSizeLimit = [
      { screenSize: 370, limit: 4 },
      { screenSize: 576, limit: 8 },
      { screenSize: 992, limit: 9 },
   ];
   const widthScreen = window.screen.width;
   if (widthScreen > 992) {
      return 12;
   }
   return screenSizeLimit.find(
      (sizeLimit) => widthScreen < sizeLimit.screenSize
   ).limit;
}

function convertPokemonToLi(pokemon) {
   loadMoreButton.innerHTML = "Load More...";
   const singleTypePokemon = pokemon.types.length === 1 ? "singleType" : "";
   profilePokemon.innerHTML = "";
   return `
         <li class="pokemonId ${pokemon.type}" >
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="details">
                  <ol class="types ${singleTypePokemon}">
                     ${pokemon.types
                        .map((type) => `<li class="${type}">${type}</li>`)
                        .join("")}
                  </ol>
                  <a class="pokemon-link" ">
                     <img class="pokemon-photo" 
                           src="${pokemon.photo}" 
                           data-name="${pokemon.name}"
                           alt="${pokemon.name}">
                  </a>
            </div>
        </li>`;
}

function ajustWidthPowerbar() {
   const maxWidthPowerBar = document.querySelector(
      ".stats-power .power-bar"
   ).clientWidth;
   const maxAttributeValue = [255, 181, 230, 154, 230, 200];
   const valuesAttribute = [];
   const widthAttribute = [];

   document.querySelectorAll(".attribute-value").forEach((value) => {
      valuesAttribute.push(Number(value.innerHTML));
   });

   for (let i = 0; i < maxAttributeValue.length; i++) {
      widthAttribute.push(
         Math.floor(
            (valuesAttribute[i] / maxAttributeValue[i]) * maxWidthPowerBar
         )
      );
   }

   const statNameDivs = document.querySelectorAll(".power-bar div");
   statNameDivs.forEach((divAttribute, index) => {
      divAttribute.style.width = `${widthAttribute[index]}px`;
   });



}

function sendToSearch(nameOrId) {
   pokeApi
      .searchPokemon(nameOrId)
      .then(convertPokemonToCard)
      .then((pokemonCard) => {
         profilePokemon.innerHTML = pokemonCard;
         if(profilePokemon.classList.length > 2){
            profilePokemon.classList.remove(profilePokemon.classList[1])
         }
         ajustWidthPowerbar();
      })
      .catch((error) => {
         console.log("Erro ao tentar achar o Pokemón: " + error);
         return (pokemonList.innerHTML = loadPokemonItems(0, limit));
      });
   input.value = "";
}

function convertPokemonToCard(pokemon) {
   loadMoreButton.innerHTML = "Next Pokemón";
   pokemonList.innerHTML = "";
   profilePokemon.classList.add(`${pokemon.type}`)
   return `
      <div class="top-stats ${pokemon.type}">
         <span class="name">${pokemon.name}</span>
         <span class="number" data-number="${pokemon.number}">#${pokemon.number}</span>

         <img
            src="${pokemon.photo}"
            alt="${pokemon.name}"
            width="100%"
            class="pokemon-photo"
         />
      </div>
      <div class="bottom-stats">
         <ol class="types">
            ${pokemon.types
               .map((type) => `<li class="${type}">${type}</li>`)
               .join("")}
         </ol>
         <ul class="list-powers">
              ${(() => {
                 return pokemon.stats
                    .map((statsObject) => {
                       for (const statName in statsObject) {
                          return `
                           <li class="stats-power"> 
                              <span>${(() => {
                                 if (statName === "special-attack") {
                                    return "sp. atk";
                                 } else if (statName === "special-defense") {
                                    return "sp. def";
                                 } else {
                                    return statName;
                                 }
                              })()}</span>
                              <span class="attribute-value">${
                                 statsObject[statName]
                              }</span>
                              <div class="power-bar">
                                 <div class="${statName}">
                                 </div>
                              </div>
                           </li>
                        `;
                       }
                    })
                    .join("");
              })()}
         </ul>
         <div class="final-details">
               <div class="left-side">
                  <ul>
                     <li>base experience ${pokemon.base_experience}</li>
                     <li>weight ${(pokemon.weight / 10)
                        .toFixed(1)
                        .replace(".", ",")} kg</li>
                  </ul>
               </div>
               <div class="right-side">
                  <ul class="list-abilitys">
                     <h2>${
                        pokemon.ability.length > 1 ? "abilitys" : "ability"
                     }</h3>
                     ${pokemon.ability
                        .map((ability) => {
                           return `
                           <li class="${pokemon.type}">${ability}</li>
                        `;
                        })
                        .join("")}
                  </ul>
               </div>
         </div>
      </div>
   `;
}

function loadPokemonItems(init, max) {
   pokeApi.getPokemons(init, max).then((pokemons = []) => {
      const myHtml = pokemons.map(convertPokemonToLi).join("");
      // debugger;
      if (pokemonList.innerhtml === "") {
      }
      if (pokemonList.innerHTML.includes("undefined")) {
         pokemonList.innerHTML = "";
      }
      pokemonList.innerHTML += myHtml;
   });
}

function handlePokemonClick(event) {
   if (event.target.classList.contains("pokemon-photo")) {
      const pokemonName = event.target.getAttribute("data-name");
      sendToSearch(pokemonName);
   }
}

pokemonContent.addEventListener("click", handlePokemonClick);
searchImg.addEventListener("click", () => sendToSearch(input.value));

input.onkeydown = function (event) {
   if (event.key === "Enter" || event.key === "NumpadEnter") {
      sendToSearch(input.value);
   }
};

loadMoreButton.addEventListener("click", (event) => {
   if (profilePokemon.innerHTML === "") {
      offset += limit;
      const numberOfRecord = offset + limit;
      if (numberOfRecord >= maxRecords) {
         const newLimit = maxRecords - offset;
         loadPokemonItems(offset, newLimit);
         loadMoreButton.parentElement.removeChild(loadMoreButton);
      } else {
         loadPokemonItems(offset, limit);
      }
   } else {
      let currentPokemon = document
         .querySelector(".top-stats .number")
         .getAttribute("data-number");

      currentPokemon = (Number(currentPokemon) + 1).toString();
      sendToSearch(currentPokemon);
   }
});

loadPokemonItems(offset, limit);
