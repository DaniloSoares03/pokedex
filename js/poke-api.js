const pokeApi = {};

function convertPokeApiDetailsToPokemon(pokeDetail, searchModel) {
   const pokemon = new Pokemon();
   const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
   const [type] = types;

   // generate my pokemon model
   pokemon.number = pokeDetail.id;
   pokemon.name = pokeDetail.name;
   pokemon.types = types;
   pokemon.type = type;
   pokemon.photo = pokeDetail.sprites.other["official-artwork"].front_default;

   if (searchModel) {
      pokemon.base_experience = pokeDetail.base_experience;
      pokemon.weight = pokeDetail.weight;
      pokemon.ability = pokeDetail.abilities.map(
         (abilitySlot) => abilitySlot.ability.name
      );
      pokemon.stats = pokeDetail.stats.map((statsSlot) => ({
         [statsSlot.stat.name]: statsSlot.base_stat,
      }));
   }
   return pokemon;
}

pokeApi.getPokemonsDetails = (pokemonUrl, search) => {
   return fetch(pokemonUrl)
      .then((response) => response.json())
      .then((response) => convertPokeApiDetailsToPokemon(response, search)); // converte para nosso modelo de pokemon
};

pokeApi.getPokemons = (offset, limit) => {
   const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
   return fetch(url)
      .then((response) => response.json()) // converte lista pokemon para json
      .then((jsonBody) => jsonBody.results) // pegamos a lista dentro do json
      .then((pokemons) =>
         pokemons.map((pokeId) => {
            return pokeApi.getPokemonsDetails(pokeId.url);
         })
      ) // transformamos a lista para uma lisa de promises
      .then((detailsRequests) => Promise.all(detailsRequests))
      .then((pokemonDetails) => pokemonDetails)
      .catch((error) => 1);
};

pokeApi.searchPokemon = (name) => {
   const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`.trim();
   return pokeApi.getPokemonsDetails(url, 1);
};

