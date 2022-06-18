const cardsContainer = document.querySelector('.cards');

function createCard() {
  // Create a new card element
  let card_item = document.createElement('li');
  card_item.classList.add('cards_item');

  let card = document.createElement('div');
  card.classList.add('card');

  let card_image = document.createElement('div');
  card_image.classList.add('card_image');
  let card_image_img = document.createElement('img');
  card_image_img.src = 'https://picsum.photos/500/300/?image=10';
  card_image.appendChild(card_image_img);

  let card_content = document.createElement('div');
  card_content.classList.add('card_content');

  let card_title = document.createElement('h2');
  card_title.classList.add('card_title');
  card_title.innerHTML = 'Card Grid Layout';

  let card_text = document.createElement('p');
  card_text.classList.add('card_text');
  card_text.innerHTML =
    'Demo of pixel perfect pure CSS simple responsive card grid layout';

  let actions = document.createElement('div');
  actions.classList.add('actions');

  let card_btn_accept = document.createElement('button');
  card_btn_accept.classList.add('btn');
  card_btn_accept.classList.add('card_btn');
  card_btn_accept.classList.add('btn-accept');
  card_btn_accept.innerHTML = 'Accept';

  let card_btn_decline = document.createElement('button');
  card_btn_decline.classList.add('btn');
  card_btn_decline.classList.add('card_btn');
  card_btn_decline.classList.add('btn-decline');
  card_btn_decline.innerHTML = 'Decline';

  let card_btn_end = document.createElement('button');
  card_btn_end.classList.add('btn');
  card_btn_end.classList.add('card_btn');
  card_btn_end.classList.add('btn-end');
  card_btn_end.innerHTML = 'End';

  // Append the the elements to the card
  actions.appendChild(card_btn_accept);
  actions.appendChild(card_btn_decline);
  actions.appendChild(card_btn_end);

  card_content.appendChild(card_title);
  card_content.appendChild(card_text);
  card_content.appendChild(actions);

  card.appendChild(card_image);
  card.appendChild(card_content);

  card_item.appendChild(card);

  return card_item;
}

for (let i = 0; i < 10; i++) {
  cardsContainer.appendChild(createCard());
}
