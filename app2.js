"use strict";

const collator = new Intl.Collator(undefined, {
  numeric: true,
});

const data1 = data;
const productsList = document.getElementById("products-list");
const selectSort = document.getElementById("selectSort");
const filterForm = document.getElementById("filterForm");
const filterBrands = document.getElementById("filterBrands");
const filterBtn = document.getElementById("filterBtn");
const filterPrice = document.getElementById("filterPrice");
const wishListButton = document.getElementById(`wish-list`);
const priceArray = [];
let filteredArray = [];
const filterObj = {
  brands: {},
  prices: {
    from: 0,
    to: 0,
  },
};

//Creating local storages

if (!localStorage.wish) {
  localStorage.wish = JSON.stringify({});
}
const wishList = JSON.parse(localStorage.wish);

if (!localStorage.cart) {
  localStorage.cart = JSON.stringify({});
}
const cartList = JSON.parse(localStorage.cart);

const priceForm = document.getElementById("filterPrice");

///////  Calling functions

wishListCounter(wishList, wishListButton);
appendCards(data);
appendBrandList(data);
appendPriceRange(data1, priceArray);

//////  Events

//Wishlist adding/removing items
productsList.addEventListener("click", wishListAddRemove(wishList));

//Rendering wish-list cards
wishListButton.addEventListener("click", renderWishList(wishList, data1));

//Sorting by price or rating
selectSort.addEventListener("change", sortPriceRate(filteredArray));

// Filter by brand
filterBrands.addEventListener("change", addBrandFilter(filterObj));

// Filter by price
priceForm.addEventListener(
  "change",
  fillPriceRange(filterObj.prices, filterPrice, priceArray)
);

//Filtering by button push
filterBtn.addEventListener("click", filterPushButton(filterObj));

//Adding to cart
productsList.addEventListener("click", addToCart);

//Changing quantity in cart
cartBody.addEventListener("input", changeCartQuantity);

/////// Functions

/////// Wish-list

//Rendering wish-list cards, event cb
function renderWishList(object, cards) {
  return function (e) {
    if (!e.target.classList.contains("flag")) {
      const array = cards.filter(function (element) {
        return object[element.id];
      });
      renderCards(array);
      e.target.classList.add("flag");
      event.target.textContent = `Назад `;
    } else {
      e.target.classList.remove("flag");
      event.target.textContent = `Избранное `;
      renderCards(data1);
    }
  };
}

//Wishlist adding/removing items, event cb
function wishListAddRemove(object) {
  return function (e) {
    if (e.target.classList.contains(`wish-btn`)) {
      let id = e.target.dataset.id;
      if (!object[id]) {
        object[id] = true;
        e.target.classList.remove(`btn-primary`);
        e.target.classList.add(`btn-danger`);
      } else {
        delete object[id];
        e.target.classList.add(`btn-primary`);
        e.target.classList.remove(`btn-danger`);
      }
      localStorage.wish = JSON.stringify(object);
    }
    wishListCounter(object, wishListButton);
  };
}

//Wishlist counter
function wishListCounter(object, indicator) {
  let storageLength = Object.keys(object).length;
  indicator.setAttribute(`data-count`, storageLength);
}

///////  Sorting and filtering

//Sorting by price or rating, event cb
function sortPriceRate(object) {
  return function (e) {
    let array = object.length ? filteredArray : data1;
    console.log(array);

    array.sort(sortingWrap(e.target.value));
    renderCards(array);
  };
}

// Filter by brand name, event cb
function addBrandFilter(object) {
  return function (e) {
    if (!e.target.checked) {
      delete object.brands[e.target.value];
    } else {
      object.brands[e.target.value] = true;
    }
  };
}

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

// Filter by price, cb
function fillPriceRange(object, form, array) {
  return function (e) {
    object.from = form.priceFilterFrom.value;
    object.to = form.priceFilterTo.value;
    if (form.priceFilterFrom.value < array[0]) {
      form.priceFilterFrom.value = array[0];
    }
    if (form.priceFilterTo.value > array[array.length - 1]) {
      form.priceFilterTo.value = array[array.length - 1];
    }
  };
}

//Creating price range
function appendPriceRange(cards, array) {
  cards.forEach(function (el) {
    array.push(el.price);
  });
  array.sort(function (a, b) {
    return a - b;
  });
  createPriceRange(priceArray);
}

// Creating price filter's parameters
function createPriceRange(array) {
  filterPrice.priceFilterFrom.value = array[0];
  filterPrice.priceFilterFrom.min = array[0];
  filterPrice.priceFilterFrom.max = array[array.length - 1] - 1;
  filterPrice.priceFilterTo.value = array[array.length - 1];
  filterPrice.priceFilterTo.min = array[0] + 1;
  filterPrice.priceFilterTo.max = array[array.length - 1];
}

//Filtering by button push, event cb
function filterPushButton(object) {
  return function (e) {
    filteredArray = data1.filter(function (el) {
      let answer = false;
      let brands = Object.keys(object.brands).length
        ? object.brands[el.brand]
        : true;
      let prices =
        +el.price >= object.prices.from && +el.price <= object.prices.to;
      if (brands && prices) {
        answer = true;
      }
      return answer;
    });
    renderCards(filteredArray);
  };
}

//////// Creating card-list

//Clear old card-list and generate new
function renderCards(new_data) {
  productsList.innerHTML = "";
  appendCards(new_data);
}

// Appending card list
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
    <div class="card track" data-id="${products.id}">
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
        <a class="card-link" href="${products.href}">View on Rozetka:</a>
        <h6 class="card-title card-status ${sell_status_class}">${sell_status_text}</h6>
        ${
          products.old_price != 0
            ? `<h6 class="card-title card-price-old">Old price ${products.old_price} UAH</h6> `
            : ``
        }
        <h6 class="card-title card-price" data-price="${
          products.price
        }">New price: ${products.price} UAH</h6>
        <h6 class="card-title card-discount">Discount: ${
          products.discount
        }%</h6>
        <h6 class="card-title card-id">Item Number: ${products.id}</h6>
        <h6 class="card-title card-comments">Comments: ${
          products.comments_amount
        }</h6>
        <div class="d-flex align-items-center">
        <button class="btn btn-success buy-btn mr-2 border-0" id="btnCart">Buy</button>
        <button class="btn ${
          wishList[products.id] ? "btn-danger" : "btn-primary"
        } wish-btn border-0 text-center" data-id="${
    products.id
  }">&#10084;</button>
        </div>
      </div>
    </div>
  </div>`;
  return html;
}

/////////// Cart

//Adding to cart, event cb
function addToCart(e) {
  if (e.target.classList.contains("buy-btn")) {
    const btn = e.target;
    btn.classList.add("disabled");
    btn.disabled = true;

    e.target.innerHTML = `<a href="#cart" class="btn btn-primary m-0 border-0">В корзину</a>`;
    e.target.classList.remove(`btn`, `btn-success`, `mr-2`);
    e.target.classList.add(`border-0`, `p-0`, `mr-2`);

    const card = btn.closest(".card");
    const img = card.querySelector(".card-img-top");
    const title = card.querySelector(".card-name");
    const price = card.querySelector(".card-price");

    const product = {};
    product.id = card.dataset.id;
    product.img = img.src;
    product.title = title.textContent;
    product.price = price.dataset.price;

    renderCartRow(cartBody, product);
    refreshCartRowNumber(cartBody);
  }
}

//Changing quantity in cart, event cb
function changeCartQuantity(e) {
  if (e.target.classList.contains("count-input")) {
    const input = e.target;
    if (input.value < 1) {
      input.value = 1;
    } else if (input.value > 99) {
      input.value = 99;
    }
    const parentRow = input.closest(".cart-row");
    let price = parentRow.querySelector(".cart-row-price").dataset.price;
    const sum = parentRow.querySelector(".cart-row-sum");
    sum.textContent = +input.value * +price;
  }
}

//Remove btn, event
cartBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("cart-row-remove-btn")) {
    const parentRow = e.target.closest(".cart-row");
    parentRow.remove();
    refreshCartRowNumber(this);
    let id = parentRow.dataset.id;
    const card = productsList.querySelector(`.card[data-id="${id}"]`);
    const cardBuyBtn = card.querySelector(".buy-btn");
    cardBuyBtn.textContent = "Buy";
    cardBuyBtn.disabled = false;
    cardBuyBtn.classList.remove("disabled");
  }
});

//Cart item rendering
function renderCartRow(id, data) {
  let template = `<div class="row cart-row mb-3" data-id="${data.id}">
    <div class="col-1 cart-row-number">1</div>
    <div class="col-1 cart-row-img">
      <img src="${data.img}" alt="${data.title}" class="img-fluid">
    </div>
    <h6 class="col-4 cart-row-title">${data.title}</h6>
    <div class="col-2 cart-row-price" data-price="${data.price}">${data.price}</div>
    <div class="col-1 cart-row-count">
      <input class="count-input" type="number" value="1" min="1" max="99">
    </div>
    <div class="col-2 cart-row-sum">${data.price}</div>
    <div class="col-1 cart-row-remove">
      <button class="btn btn-danger btn-sm cart-row-remove-btn">&times;</button>
    </div>
  </div>`;
  id.insertAdjacentHTML("beforeend", template);
}

//Cart item's number
function refreshCartRowNumber(id) {
  const rows = id.children;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    element.querySelector(".cart-row-number").textContent = i + 1;
  }
}
