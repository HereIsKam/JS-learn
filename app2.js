'use strict'
const data1 = data;
const trackList = document.getElementById('track-list');
console.log(data);

appendCards(data);

function renderSortedCards(new_data) {
  trackList.innerHTML = '';
  appendCards(new_data);
}


function appendCards(tracks) {
  for (let i = 0; i < tracks.length; i++) {
    const song = tracks[i];
    let template = createCardTemplate(song);
    trackList.insertAdjacentHTML('beforeend',template);
  }
}

function createCardTemplate(track) {
  let stars = ``;

  for (let i = 1; i <= 5; i++) {
    if (i <= +track.comments_mark) {
      stars += '&#9733;'
    } else {
      stars += '&#9734;'
    }
  }

  let sell_status_text = ``;  
  let sell_status_class = ``; 
  if (track.sell_status == 'available') {
    sell_status_text = `В наличии`;  
    sell_status_class = `green`; 
  } else if (track.sell_status == 'limited'){
    sell_status_text = `Заканчивается`;  
    sell_status_class = `yellow`; 
  }
  else {
    sell_status_text = `Нет в наличии`;  
    sell_status_class = `red`; 
  }
  
  let html = `<div class="col mb-3">
    <div class="card track">
      <img src="${track.images.preview}" class="card-img-top" alt="Artwork ${track.title} - ${track.brand}" />
      <div class="card-body">
        <h5 class="card-title card-name">${track.title}</h5>
        <h6 class="card-title card-rating">Rating: ${stars}</h6>
        ${(track.brand) ? `<h6 class="card-title card-brand">Brand: ${track.brand}</h6>` : ``}
        

        ${(track.docket) ? `<p class="card-desc">${track.docket}</p>` : ``}
        
        <h6 class="card-title card-category">Categoty: ${track.category_title || 'Ноутбук'}</h6>
        <a class="card-link" href="${track.href}">View on Rozetka:</a>
        <h6 class="card-title card-status ${sell_status_class}">${sell_status_text}</h6>

        ${(track.old_price != 0) ? `<h6 class="card-title card-price-old">Old price ${track.old_price} UAH</h6> ` : ``}
        
        <h6 class="card-title card-price">New price: ${track.price} UAH</h6>
        <h6 class="card-title card-discount">Discount: ${track.discount}%</h6>
        <h6 class="card-title card-id">Item Number: ${track.id}</h6>
        <h6 class="card-title card-comments">Comments: ${track.comments_amount}</h6>
        <button class="btn btn-success buy-btn">Buy</button>
      </div>
    </div>
  </div>`;

  return html;
}


console.dir(btn);

btn.style.backgroundColor = 'red';
console.log(btn.style.backgroundColor);



trackList.addEventListener('click', function (e) {
  if (e.target.classList.contains('buy-btn')) {
    console.log('YES');
  }
  console.log(e);
});





selectSort.addEventListener('change', function (e) {
  console.log(e.target.value);
  
})











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
