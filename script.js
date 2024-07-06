document.addEventListener("DOMContentLoaded", () => {
  // Select DOM elements
  const pokemonContainer = document.getElementById("pokemon-container");
  const loadMoreButton = document.getElementById("load-more");
  const modal = document.getElementById("pokemon-modal");
  const closeModal = document.getElementsByClassName("close")[0];
  const pokemonName = document.getElementById("pokemon-name");
  const pokemonImage = document.getElementById("pokemon-image");
  const pokemonHeight = document.getElementById("pokemon-height");
  const pokemonDescription = document.getElementById("pokemon-description");

  let offset = 0;
  const limit = 10;

  // Function to fetch Pokémon data from API
  const fetchPokemon = async (offset, limit) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();
    data.results.forEach(async (pokemon) => {
      const pokemonData = await fetch(pokemon.url);
      const pokemonDetails = await pokemonData.json();
      displayPokemon(pokemonDetails);
    });
  };

  // Function to display a Pokémon card
  const displayPokemon = (pokemon) => {
    const pokemonDiv = document.createElement("div");
    pokemonDiv.classList.add("pokemon");
    pokemonDiv.innerHTML = `
              <h3>${pokemon.name}</h3>
              <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          `;
    pokemonDiv.addEventListener("click", () => showPokemonDetails(pokemon));
    pokemonContainer.appendChild(pokemonDiv);
  };

  // Function to show detailed Pokémon information in a modal
  const showPokemonDetails = async (pokemon) => {
    pokemonName.textContent = pokemon.name;
    pokemonImage.src = pokemon.sprites.front_default;
    pokemonHeight.textContent = `Height: ${pokemon.height}`;

    // Fetch additional details like description
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();
    const description = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    pokemonDescription.textContent = description
      ? description.flavor_text
      : "No description available";

    modal.style.display = "block";
  };

  // Load more Pokémon when the button is clicked
  loadMoreButton.addEventListener("click", () => {
    offset += limit;
    fetchPokemon(offset, limit);
  });

  // Close modal when the close button is clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside of the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Initial fetch of Pokémon data
  fetchPokemon(offset, limit);
});
