"use strict";
const collator = new Intl.Collator(undefined, {
  numeric: true,
});
const data1 = data;
const productsList = document.getElementById("products-list");
const selectSort = document.getElementById("selectSort");
console.log(data);
const filterForm = document.getElementById("filterForm");
const brandsList = document.getElementById("brandList");

appendCards(data);
appendBrandList(data);


//Sorting by price or rating, select change
selectSort.addEventListener("change", function (e) {
  data1.sort(sortingWrap(e.target.value));
  renderCards(data1);
});

brandsList.addEventListener("change", function (e) {
  if (e.target.value == data1.brand) {
    sortByBrand(data1, e.target.value)
    console.log(e.target.value)
    renderCards(data1)
  }
});

//Sort by brand name
function sortByBrand(cards, brandName) {
  const brands = cards.reduce(function (prevValue, currValue) {
    const {
      brand
    } = currValue;
    if (prevValue == brandName) {
      prevValue.push(brand)
    }
    return prevValue
  }, [])
  brands.forEach(function (brand) {
    const template = createBrandBody(brand);
    productsList.insertAdjacentHTML("beforeend", template);
  })
}

//Search by name
filterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let value = e.target.term.value;
  let filteredArray = data1.filter(function (el) {
    return (
      el.brand.includes(value) ||
      el.title.includes(value) ||
      el.docket.includes(value)
    );
  });
  renderCards(filteredArray);
  e.target.term.value = "";
});

//Sorting function by price or rating
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
  const brands = cards.reduce(function (prevValue, currValue) {
    const {
      brand
    } = currValue;
    if (!prevValue.includes(brand)) {
      prevValue.push(brand);
      prevValue.sort();
    }
    return prevValue;
  }, []);
  brands.forEach(function (brand) {
    const template = createBrandBody(brand);
    brandsList.insertAdjacentHTML("beforeend", template);
  });

  // const brands = cards.map(function (card) {
  //   return card.brand;
  // });
  // const brandsSet = new Set(brands);
  // const brandsUniсue = Array.from(brandsSet).sort();
  // brandsUniсue.forEach(function (brand) {
  //   const template = createBrandBody(brand);
  //   brandsList.insertAdjacentHTML("beforeend", template);
  // });
}



//Creating brand-checkbox body
function createBrandBody(brand) {
  let html = `<div class="form-check d-flex flex-column" id="filterBrandCheckbox">
  <input class="form-check-input" type="checkbox" value="${brand}" id="defaultCheck1">
  <label class="form-check-label" for="defaultCheck1">
    ${brand}(${brand.length})
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
      </div>
    </div>
  </div>`;
  return html;
}