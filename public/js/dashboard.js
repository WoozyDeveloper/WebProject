const cardsContainer = document.querySelector(".cards");

function createCard(identifier, headline, description, eventImage) {
  // Create a new card element
  let card_item = document.createElement("li");
  card_item.classList.add("cards_item");

  let card = document.createElement("div");
  card.classList.add("card");

  let card_image = document.createElement("div");
  card_image.classList.add("card_image");
  let card_image_img = document.createElement("img");
  card_image_img.src = eventImage;
  card_image.appendChild(card_image_img);

  let card_content = document.createElement("div");
  card_content.classList.add("card_content");

  let card_title = document.createElement("h2");
  card_title.classList.add("card_title");
  card_title.innerHTML = headline;

  let card_text = document.createElement("p");
  card_text.classList.add("card_text");
  card_text.innerHTML = description;

  let actions = document.createElement("div");
  actions.classList.add("actions");

  let card_btn_end = document.createElement("button");
  card_btn_end.classList.add("btn");
  card_btn_end.classList.add("card_btn");
  card_btn_end.classList.add("btn-end");
  card_btn_end.innerHTML = "End";
  card_btn_end.onclick = async function () {
    let json = {
      identifier: identifier,
    };
    const settings = {
      method: "DELETE",
      body: JSON.stringify(json),
    };
    try {
      const fetchResponse = await fetch("http://localhost:4003", settings);
      const response = await fetchResponse.json();
      if (response.status === "success") {
        console.log("S-a sters");
        window.location.reload();
      } else {
        console.log("problema");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Append the the elements to the card
  actions.appendChild(card_btn_end);

  card_content.appendChild(card_title);
  card_content.appendChild(card_text);
  card_content.appendChild(actions);

  card.appendChild(card_image);
  card.appendChild(card_content);

  card_item.appendChild(card);

  return card_item;
}

const geoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        stroke: "#555555",
        "stroke-width": 2,
        "stroke-opacity": 1,
        fill: "#b33737",
        "fill-opacity": 0.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [27.575297355651855, 47.16436280131059],
            [27.57795810699463, 47.16197014838819],
            [27.582077980041504, 47.163108130899104],
            [27.578086853027344, 47.16564661942949],
            [27.575297355651855, 47.16436280131059],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        "marker-color": "#16d436",
        "marker-size": "medium",
        "marker-symbol": "campsite",
      },
      geometry: {
        type: "Point",
        coordinates: [27.57568359375, 47.16094886127813],
      },
    },
  ],
};

fetch(`http://localhost:4003`)
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    console.log(json);
    for (let i = 0; i < json.length; i++) {
      // console.log(json[i]);
      let { headline, description, polygon, shelterlocation, identifier } =
        json[i];

      // $$$$$$$$$$$$$$$$$$$$
      // Parse the polygon to array of points
      let polyPoints = polygon.split(" ");
      let polygonPoints = [];
      for (let i = 0; i < polyPoints.length; i += 1) {
        let point = polyPoints[i].split(",");
        polygonPoints.push([parseFloat(point[1]), parseFloat(point[0])]);
      }
      // console.log(polygonPoints);

      // Parse the shelter to array of points
      let shelterPoint = [];
      let shelterArray = shelterlocation.split(",");
      for (let i = 0; i < shelterArray.length; i += 2) {
        shelterPoint.push(parseFloat(shelterArray[i + 1]));
        shelterPoint.push(parseFloat(shelterArray[i]));
      }

      // Modify geoJson to include the polygon and shelter
      geoJson.features[0].geometry.coordinates[0] = polygonPoints;
      geoJson.features[1].geometry.coordinates = shelterPoint;

      let eventImage = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${encodeURIComponent(
        JSON.stringify(geoJson)
      )})/auto/600x300@2x?access_token=pk.eyJ1IjoiYXhlbGxiZW4iLCJhIjoiY2pneHc0a2o2MGlkcTJ3bGxtdHB1cXoycSJ9.BRtJfvAR2e_5nA3irA2KSg&attribution=false&logo=false`;

      //$$$$$$$$$$$$$$$$$
      cardsContainer.appendChild(
        createCard(identifier, headline, description, eventImage)
      );
    }
  })
  .catch((err) => {
    console.log(err);
  });
