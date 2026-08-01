console.log('App shell loaded');

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service worker registered:', reg.scope))
      .catch((err) => console.error('Service worker failed:', err));
  });
}
const products =  [
  {
    category: "Timber",
    size: "4x2",
    treatment: "Treated",
    length: "3.6m",
    stock: 6,
    location: "Warehouse, Shelf 3A",
    lastSync: "12 min ago",
    flagged: true
  },
  {
    category: "Timber",
    size: "4x2",
    treatment: "Treated",
    length: "4.2m",
    stock: 15,
    location: "Warehouse, Shelf 3B",
    lastSync: "3 days ago",
    flagged: false
  },
  {
    category: "Timber",
    size: "4x2",
    treatment: "Treated",
    length: "4.8m",
    stock: 23,
    location: "Warehouse, Shelf 3C",
    lastSync: "1 hour ago",
    flagged: false
  },
  {
    category: "Timber",
    size: "4x2",
    treatment: "Treated",
    length: "5.4m",
    stock: 12,
    location: "Warehouse, Shelf 3D",
    lastSync: "2 min ago",
    flagged: false
  },
  {
    category: "Timber",
    size: "5x2",
    treatment: "Treated",
    length: "3.6m",
    stock: 0,
    location: "Warehouse, Shelf 3E",
    lastSync: "1 day ago",
    flagged: false
  },
  {
    category: "Timber",
    size: "5x2",
    treatment: "Treated",
    length: "4.8m",
    stock: 12,
    location: "Warehouse, Shelf 3F",
    lastSync: "3 days ago",
    flagged: false
  },
  { 
      category: "Timber",
      size: "5x2",
      treatment: "Treated",
      length: "5.4m",
      stock: 0,
      location: "Warehouse, Shelf 3G",
      lastSync: "1 week ago",
      flagged: false
  },
  { 
      category: "Plumbing",
      size: "5x2",
      length: "5.4m",
      stock: 7,
      location: "Warehouse, Shelf 4A",
      lastSync: "5 days ago",
      flagged: false
  }
];

function renderCard(product) {
  const parts = [product.category, product.size, product.treatment, product.length];
  const name = parts.filter((part) => part).join(" - ");
  const flagMarker = product.flagged ? "⚠" : "";
  const flagIcon = product.flagged ? "🚩" : "";
  return `
    <li class="card">
      <div class="card-header">
        <h2>${name}</h2>
        <span>${flagIcon}</span>
      </div>
      <p class="stock-number">${product.stock}</p>
      <p>in stock</p>
      <p>📍 ${product.location} ${flagMarker}</p>
      <p class="sync">Last sync: ${product.lastSync}</p>
      <button type="button" class="update-btn">Update Stock</button>
    </li>
  `;
}


const results = document.getElementById("results");

function showProducts(list) {
  let allCards = "";
  for (const product of list) {
    allCards += renderCard(product);
  }
  results.innerHTML = allCards;
}

showProducts(products);   
const searchBox = document.getElementById("search-box");

searchBox.addEventListener("input", () => {
  activeFilters.search = searchBox.value.toLowerCase();
  applyFilters();
});

const chips = document.querySelectorAll("[data-category]");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("selected"));
    chip.classList.add("selected");

    const category = chip.dataset.category;
    updateFilterVisibility(category);
    activeFilters.category = category;
    applyFilters();
  });
});

const activeFilters = {
  search: "",
  category: "All",
  size: null,
  length: null,
  treatment: null
};

function applyFilters() {
  let matches = products;
  if (activeFilters.category !== "All") {
  matches = matches.filter((p) => p.category === activeFilters.category);
}

  if (activeFilters.size) {
    matches = matches.filter((p) => p.size === activeFilters.size);
  }
  if (activeFilters.length) {
    matches = matches.filter((p) => p.length === activeFilters.length);
  }
  if (activeFilters.treatment) {
    matches = matches.filter((p) => p.treatment === activeFilters.treatment);
  }
   if (activeFilters.search) {
  matches = matches.filter((p) => {
    const name = `${p.category} ${p.size} ${p.treatment || ""} ${p.length}`.toLowerCase();
    return name.includes(activeFilters.search);
  });
}

  showProducts(matches);
}
const sizeChips = document.querySelectorAll("[data-size]");
const lengthChips = document.querySelectorAll("[data-length]");
const treatmentChips = document.querySelectorAll("[data-treatment]");
const treatmentGroup = document.getElementById("treatment-group");

function updateFilterVisibility(category) {
  if (category === "Timber" || category === "All") {
    treatmentGroup.style.display = "block";
  } else {
    treatmentGroup.style.display = "none";
    activeFilters.treatment = null;
    treatmentChips.forEach((c) => c.classList.remove("selected"));
    applyFilters();
  }
}

sizeChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    if (chip.classList.contains("selected")) {
      chip.classList.remove("selected");
      activeFilters.size = null;
    } else {
      sizeChips.forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      activeFilters.size = chip.dataset.size;
    }
    applyFilters();
  });
});

lengthChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    if (chip.classList.contains("selected")) {
      chip.classList.remove("selected");
      activeFilters.length = null;
    } else {
      lengthChips.forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      activeFilters.length = chip.dataset.length;
    }
    applyFilters();
  });
});

treatmentChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    if (chip.classList.contains("selected")) {
      chip.classList.remove("selected");
      activeFilters.treatment = null;
    } else {
      treatmentChips.forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      activeFilters.treatment = chip.dataset.treatment;
    }
    applyFilters();
  });
});
