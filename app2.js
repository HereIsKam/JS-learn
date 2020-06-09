"use strict";

const collator = new Intl.Collator(undefined, {
  numeric: true,
});

const data1 = data;
const productsList = document.getElementById("products-list");
const selectSort = document.getElementById("selectSort");
console.log(data);
const filterForm = document.getElementById("filterForm");
const filterBrands = document.getElementById("filterBrands");
const filterBtn = document.getElementById("filterBtn");
const filterPrice = document.getElementById("filterPrice");
const filterObj = {
  brands: {},
  prices: { from: 0, to: 0 },
};
//creating local storage
if (!localStorage.wish) {
  localStorage.wish = JSON.stringify({});
}
const LSwish = JSON.parse(localStorage.wish);

appendCards(data);
appendBrandList(data);

//Adding item to wish-list
productsList.addEventListener("click", function (e) {
  if (e.target.classList.contains("wish-btn")) {
    let id = e.target.dataset.id;
    if (LSwish[id]) {
      delete LSwish[id];
    } else {
      LSwish[id] = true;
    }
    localStorage.wish = JSON.stringify(LSwish);
  }
});

//Sorting by price or rating, event
selectSort.addEventListener("change", function (e) {
  data1.sort(sortingWrap(e.target.value));
  renderCards(data1);
});

// Filter by brand name, event
filterBrands.addEventListener("change", function (e) {
  if (!e.target.checked) {
    delete filterObj.brands[e.target.value];
  } else {
    filterObj.brands[e.target.value] = true;
  }
});

//Filter by brand name, button push
filterBtn.addEventListener("click", function (e) {
  let filteredArray = data1.filter(function (el) {
    let answer = false;
    let brands = Object.keys(filterObj.brands).length
      ? Object.keys(filterObj.brands).includes(el.brand)
      : true;
    if (brands) {
      answer = true;
    }
    return answer;
  });
  renderCards(filteredArray);
});

//Sorting by price or rating
function sortingWrap(value) {
  let divider = value.indexOf("-");
  let key = value.slice(0, divider);
  let type = value.slice(divider + 1);
  return function (a, b) {
    if (type == "inc") {
      return collator.compare(a[key], b[key]);
    } else {
      return collator.compare(b[key], a[key]);
    }
  };
}

//Clear old card-list and generate new
function renderCards(new_data) {
  productsList.innerHTML = "";
  appendCards(new_data);
}

// Creating brand-checkbox list
function appendBrandList(cards) {
  const brandsMap = new Map();
  cards.forEach(function (card) {
    let brand = card.brand;
    if (!brandsMap.has(brand)) {
      brandsMap.set(brand, 1);
    } else {
      brandsMap.set(brand, brandsMap.get(brand) + 1);
    }
  });
  const brandsUnique = Array.from(brandsMap).sort();
  brandsUnique.forEach(function (brand) {
    const template = createBrandBody(brand);
    filterBrands.insertAdjacentHTML("beforeend", template);
  });
}
appendPriceRange(data1);

function appendPriceRange(cards) {
  const priceMap = new Map();
  cards.forEach(function (card) {
    let price = card.price;
    if (!priceMap.has(price)) {
      priceMap.set(price, 1);
    } else {
      priceMap.set(price, priceMap.get(price) + 1);
    }
  });
  const priceArray = Array.from(priceMap);
  const prices = [];
  priceArray.forEach(function (el) {
    prices.push(el[0]);
  });
  console.log(prices.sort());

  const template = createPriceRange(prices);
  filterPrice.insertAdjacentHTML("beforeend", template);
}

//Creating price filter's range
function createPriceRange(price) {
  let html = `<label class="fiter-price">Цена от</label>
  <input class="filter-prece-from" placeholder="${price.min()}"></input>
  <label class="fiter-price">до</label>
  <input class="filter-prece-to" placeholder="${price.max()}"></input>`;
  return html;
}

//Creating brand-checkbox body
function createBrandBody(brand) {
  let html = `<div class="form-check d-flex flex-column" id="filterBrandCheckbox">
  <input class="form-check-input" type="checkbox" name="${brand[0]}" value="${brand[0]}" id="filter-${brand[0]}">
  <label class="form-check-label" for="filter-${brand[0]}">
    ${brand[0]}(${brand[1]})
  </label>
</div>`;
  return html;
}

// Creating card list
function appendCards(products) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    let template = createCardTemplate(product);
    productsList.insertAdjacentHTML("beforeend", template);
  }
}

// Creating card body
function createCardTemplate(products) {
  //Star rating
  let stars = ``;
  for (let i = 1; i <= 5; i++) {
    if (i <= +products.comments_mark) {
      stars += "&#9733;";
    } else {
      stars += "&#9734;";
    }
  }

  // Status color
  let sell_status_text = ``;
  let sell_status_class = ``;
  if (products.sell_status == "available") {
    sell_status_text = `В наличии`;
    sell_status_class = `green`;
  } else if (products.sell_status == "limited") {
    sell_status_text = `Заканчивается`;
    sell_status_class = `yellow`;
  } else {
    sell_status_text = `Нет в наличии`;
    sell_status_class = `red`;
  }

  // Card body
  let html = `<div class="col mb-3">
    <div class="card track">
      <img src="${products.images.preview}" class="card-img-top" alt="Artwork ${
    products.title
  } - ${products.brand}" />
      <div class="card-body">
        <h5 class="card-title card-name">${products.title}</h5>
        <h6 class="card-title card-rating">Rating: ${stars}</h6>
        ${
          products.brand
            ? `<h6 class="card-title card-brand">Brand: ${products.brand}</h6>`
            : ``
        }
        ${products.docket ? `<p class="card-desc">${products.docket}</p>` : ``}
        <h6 class="card-title card-category">Categoty: ${
          products.category_title || "Ноутбук"
        }</h6>
        <a class="card-link" href="${products.href}">View on Rozetka:</a>
        <h6 class="card-title card-status ${sell_status_class}">${sell_status_text}</h6>
        ${
          products.old_price != 0
            ? `<h6 class="card-title card-price-old">Old price ${products.old_price} UAH</h6> `
            : ``
        }
        <h6 class="card-title card-price">New price: ${products.price} UAH</h6>
        <h6 class="card-title card-discount">Discount: ${
          products.discount
        }%</h6>
        <h6 class="card-title card-id">Item Number: ${products.id}</h6>
        <h6 class="card-title card-comments">Comments: ${
          products.comments_amount
        }</h6>
        <button class="btn btn-success buy-btn">Buy</button>
        <button class="btn btn-primary wish-btn" data-id="${
          products.id
        }">&#10084;</button>
      </div>
    </div>
  </div>`;
  return html;
}

let str111 =
  'Экран 15.6" IPS (1920x1080) Full HD, матовый / Intel Core i5-9300H (2.4 - 4.1 ГГц) / RAM 8 ГБ / SSD 256 ГБ / nVidia GeForce GTX 1650, 4 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / веб-камера / DOS / 2.32 кг / черный';
