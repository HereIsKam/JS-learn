"use strict";

const data1 = data;
const goodsList = document.getElementById("goods-list");
console.log(data);

appendCards(data1);

function sortedPriceIncrease(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

function renderSortedCards(new_data) {
  goodsList.innerHTML = "";
  appendCards(new_data);
}

// Creating card list
function appendCards(goods) {
  for (let i = 0; i < goods.length; i++) {
    const product = goods[i];
    let template = createCardTemplate(product);
    goodsList.insertAdjacentHTML("beforeend", template);
  }
}
//Sort by increasing price
function sortIncreasePrice(goods) {
  return goods.price;
}
// Star rating
function createCardTemplate(goods) {
  let stars = ``;

  for (let i = 1; i <= 5; i++) {
    if (i <= +goods.comments_mark) {
      stars += "&#9733;";
    } else {
      stars += "&#9734;";
    }
  }

  // Status color
  let sell_status_text = ``;
  let sell_status_class = ``;
  if (goods.sell_status == "available") {
    sell_status_text = `В наличии`;
    sell_status_class = `green`;
  } else if (goods.sell_status == "limited") {
    sell_status_text = `Заканчивается`;
    sell_status_class = `yellow`;
  } else {
    sell_status_text = `Нет в наличии`;
    sell_status_class = `red`;
  }
  // Card body
  let html = `<div class="col mb-3">
    <div class="card track">
      <img src="${goods.images.preview}" class="card-img-top" alt="Artwork ${
    goods.title
  } - ${goods.brand}" />
      <div class="card-body">
        <h5 class="card-title card-name">${goods.title}</h5>
        <h6 class="card-title card-rating">Rating: ${stars}</h6>
        ${
          goods.brand
            ? `<h6 class="card-title card-brand">Brand: ${goods.brand}</h6>`
            : ``
        }
        

        ${goods.docket ? `<p class="card-desc">${goods.docket}</p>` : ``}
        
        <h6 class="card-title card-category">Categoty: ${
          goods.category_title || "Ноутбук"
        }</h6>
        <a class="card-link" href="${goods.href}">View on Rozetka:</a>
        <h6 class="card-title card-status ${sell_status_class}">${sell_status_text}</h6>

        ${
          goods.old_price != 0
            ? `<h6 class="card-title card-price-old">Old price ${goods.old_price} UAH</h6> `
            : ``
        }
        
        <h6 class="card-title card-price">New price: ${goods.price} UAH</h6>
        <h6 class="card-title card-discount">Discount: ${goods.discount}%</h6>
        <h6 class="card-title card-id">Item Number: ${goods.id}</h6>
        <h6 class="card-title card-comments">Comments: ${
          goods.comments_amount
        }</h6>
        <button class="btn btn-success buy-btn">Buy</button>
      </div>
    </div>
  </div>`;

  return html;
}

/* console.dir(btn);

btn.style.backgroundColor = 'red';
console.log(btn.style.backgroundColor);



goodsList.addEventListener('click', function (e) {
  if (e.target.classList.contains('buy-btn')) {
    console.log('YES');
  }
  console.log(e);
});





selectSort.addEventListener('change', function (e) {
  console.log(e.target.value);

})

 */

// function f(name,cb) {
//   setTimeout(() => {
//     if (name == 'click') {
//       cb('Done click')
//     } else {
//       cb('Done not-click')
//     }
//   }, 1000);
// }

// f('click',function (bla) {
//   console.log(bla);

// });
