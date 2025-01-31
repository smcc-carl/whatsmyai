document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-input");
  const resultsContainer = document.querySelector("#search-results");
  const originalContent = document.querySelector("#original-content");
  
  let aiTools = [];
  
  // Fetch AI tools data from search.json
  fetch("/search.json")
      .then(response => response.json())
      .then(data => {
          aiTools = data;
          console.log("AI Tools loaded:", aiTools.length);
      })
      .catch(error => console.error("Error loading AI tools:", error));
  
  // Debounce function to improve search performance
  function debounce(func, delay) {
      let timer;
      return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => func(...args), delay);
      };
  }
  
  // Handle search input
  searchInput.addEventListener("input", debounce(() => {
      const query = searchInput.value.toLowerCase().trim();
      
      if (query.length === 0) {
          resultsContainer.innerHTML = ""; // Clear results
          originalContent.style.display = "block"; // Show original content
          return;
      }
      
      // Filter tools based on query
      const filteredTools = aiTools.filter(tool =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      
      displayResults(filteredTools);
  }, 300)); // 300ms delay
  
  // Display search results
  function displayResults(results) {
      resultsContainer.innerHTML = ""; // Clear previous results
      
      if (results.length === 0) {
          resultsContainer.innerHTML = `
              <div class="col-span-3 text-center py-8">
                  <p class="text-gray-400">No results found for your search.</p>
              </div>
          `;
          originalContent.style.display = "none"; // Hide original content
          return;
      }
      
      originalContent.style.display = "none"; // Hide original content
      
      results.forEach(tool => {
          const toolItem = document.createElement("div");
          toolItem.className = "border border-gray-700 rounded-3xl p-4 bg-gray-900 hover:bg-gray-800 transition-colors";
          toolItem.innerHTML = `
              <img src="${tool.image}" alt="${tool.title}" class="w-20 h-20 mx-auto object-contain">
              <p class="text-xl font-medium mt-4 text-amber-300">${tool.title}</p>
              <p class="mt-2 text-gray-400 line-clamp-3">${tool.description}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                  ${tool.tags.map(tag => `<span class="bg-gray-700 px-2 py-1 rounded-full text-sm">${tag}</span>`).join("")}
              </div>
              <a href="${tool.url}" class="block mt-4 text-amber-300 hover:underline">View Tool</a>
          `;
          resultsContainer.appendChild(toolItem);
      });
  }
});