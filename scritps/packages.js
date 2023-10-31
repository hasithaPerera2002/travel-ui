let data = null;
let packageType = "all";
let placeName = "all";

$(document).ready(async function fetchData() {
  $("#spinner").show();
  try {
    var headers = {};
    const response = await fetch("http://localhost:8081/api/v1/package/all", {
      method: "GET",
      mode: "cors",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    data = await response.json();
    console.log(data.data);

    data.data.forEach((element) => {
      console.log(element.placeName);
      var newCard = $("<div>").addClass(
        "col-md-6 package-cards align-center  justify-content-center"
      );
      newCard.attr("data-package-id", element.placeId);

      var innerHTML = `
        <div class="col-md-10 card h-100"
          style="background: url('data:image/jpg;base64,${element.placeImage}') no-repeat; background-size: cover;">
          <div class="col-md-12 text-white z-2 text-lg">${element.placeName}</div>
          <div class="col-md-12 text-white z-2 text-sm">${element.packageType}</div>
          <i class="fa-regular fa-user fa z-2 text-danger ps-2 pe-2 pt-2">  ${element.noOfPeople}</i>
          <i class="fa-solid fa fa-star z-2 text-warning ps-2 pe-2 pt-3">  ${element.stars}</i>
          <button class="btn button z-2" onclick="handleCard('${element.placeName}', '${element.packageType}')">Book</button>
    <div class="video z-2 ">
            <a href="${element.videoUrl}" target="_blank" class="fa-solid fa fa-play-circle ps-2 pe-2 pt-3"></a>
          </div>
        </div>
      `;

      newCard.append(innerHTML);

      $("#card").append(newCard);
    });

    $("#spinner").hide();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    $("#spinner").hide();
  }
});

function handleCard(placeName, packageType) {
  const encodedPlaceName = encodeURIComponent(placeName);
  const encodedPackageType = encodeURIComponent(packageType);
  const encodedURL = `http://127.0.0.1:5501/${encodeURIComponent(
    "hotel.html"
  )}?placeName=${encodedPlaceName}&packageType=${encodedPackageType}`;

  // Open the URL in a new window
  window.open(encodedURL, "_blank");
}
function filterPackages(package) {
  packageType = package;
  console.log(package);

  $(".package-cards").hide();
  const luxuryPackages = data.data.filter(
    (element) => element.packageType === package
  );

  luxuryPackages.forEach((element) => {
    $(`[data-package-id="${element.placeId}"]`).show();
  });
}

function filterPlaces(place) {
  placeName = place;
  console.log(place);
  $(".package-cards").hide();
  const luxuryPackages = data.data.filter(
    (element) => element.placeName === place
  );

  luxuryPackages.forEach((element) => {
    $(`[data-package-id="${element.placeId}"]`).show();
  });
}
