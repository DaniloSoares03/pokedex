const pokemonList = document.querySelector('#pokemonList')
const loadMoreButton = document.querySelector('#loadMoreButton')
const limit = adjustNumberOfPokemonOnScreen()
let offset = 0
const maxRecords = 251


function adjustNumberOfPokemonOnScreen(){
    const screenSizeLimit = [
        {screenSize: 300, limit: 4},
        {screenSize: 576, limit: 8},
        {screenSize: 992, limit: 10}
    ]   
    const widthScreen = window.screen.width
    if(widthScreen > 992){
        return 12
    }
    return screenSizeLimit.find(sizeLimit => widthScreen < sizeLimit.screenSize).limit
}

function convertPokemonToLi(pokemon) {
    const singleTypePokemon = pokemon.types.length === 1 ? 'singleType' : ''
    return `
        <li class="pokemonId ${pokemon.type}" >
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <!-- image and move set -->
            <div class="details">
                <ol class="types ${singleTypePokemon}">
                    ${pokemon.types.map(type => `<li class="${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </li>`
}

function loadPokemonItems(init, max) {
    console.log(`valor init: ${init}, valor max: ${max}`)
    pokeApi.getPokemons(init, max).then((pokemons = []) => { 
        const myHtml = pokemons.map(convertPokemonToLi).join('') 
        pokemonList.innerHTML += myHtml
    })
}

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const numberOfRecord = offset + limit
    if(numberOfRecord >= maxRecords) {
        // debugger
        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItems(offset, limit)
    }

    
})

loadPokemonItems(offset, limit)


// console.log(fetch)


