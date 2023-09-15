
const pokeApi = {}
console.log(pokeApi)

function convertPokeApiDetailsToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    const types = pokeDetail.types.map(typeSlot => typeSlot.type.name)
    const [type] = types
    
    // convertendo o modelo do pokeApi para o nosso modelo
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonsDetails = (pokemon) => {
    return fetch(pokemon.url)
                .then(response => response.json())
                .then(convertPokeApiDetailsToPokemon)
}

pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then(response => response.json()) // converte lista pokemon para json
        .then(jsonBody => jsonBody.results) // pegamos a lista dentro do json
        .then(pokemons => pokemons.map(pokeApi.getPokemonsDetails)) // transformamos a lista para uma lisa de promises
        .then(detailsRequests => Promise.all(detailsRequests))
        .then(pokemonDetails => pokemonDetails)
        .catch(error => console.log(error))
}

// Promise.all([
//     fetch('https://pokeapi.co/api/v2/pokemon/1'),
//     fetch('https://pokeapi.co/api/v2/pokemon/2'),
//     fetch('https://pokeapi.co/api/v2/pokemon/3'),
// ]).then(results => {
//     console.log(results)
// })