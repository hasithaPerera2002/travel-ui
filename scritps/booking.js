let data;
let noOfDays;

$("#dateRangeError").hide();
$("#adultError").hide();
$("#childrenError").hide();

$("#rangeDate").flatpickr({
  mode: "range",
  dateFormat: "Y-m-d",
  minDate: "today",
  onChange: function (selectedDates, dateStr, instance) {
    if (selectedDates.length === 2) {
      var startDate = selectedDates[0];
      var endDate = selectedDates[1];

      $("#startDate").val(startDate.toLocaleDateString("en-GB"));
      $("#endDate").val(endDate.toLocaleDateString("en-GB"));

      var timeDifference = endDate.getTime() - startDate.getTime();
      var dayDifference = timeDifference / (1000 * 3600 * 24);

      noOfDays = Math.round(dayDifference);

      $("#totalDates").val(noOfDays);
      console.log(noOfDays);
    }
  },
});
$("document").ready(async function () {
  try {
    console.log("hiiiiiiii");

    const currentURL = window.location.href;

    const searchParams = new URLSearchParams(window.location.search);

    let placeName = "Kandy_and_Upcountry";
    let packageType = "LUXURY";

    function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    console.log("placeName:", placeName);
    console.log("packageType:", packageType);

    // fetching data from the server
    let hotelData = await fetch(
      `http://localhost:8082/api/v1/hotels/search/categoryAndPlace?placeName=${placeName}&category=${packageType}`,
      {
        method: "GET",
        mode: "cors",
        headers: {},
      }
    );
    if (hotelData.ok) {
      hotelData = await hotelData.json();
      hotelData = hotelData.data;
      data = hotelData;
    } else {
      throw new Error("Network response was not ok");
    }

    data.forEach((element, index) => {
      let newCard = $("<div>").addClass("carousel-item ");
      if (index === 0) {
        newCard.addClass("active");
      }
      newCard.attr("data-package-id", element.hotelId);

      var innerHTML = ` <div class="row">
                            <div class="col-md-10 offset-md-1  d-flex flex-wrap offset-md-1 card">
                                <div class="col-md-5">
                                    <div class="img-thumbnail ms-1" style="background: url('data:image/jpg;base64,${element.hotelImage}') no-repeat; 
                                        background-size: cover;
                                            margin-top: 2vh;
                                            height: 52vh;">
                                    </div>
                                </div>
                                <div class="vertical-ruler"></div>
                                <div class="col-md-7 ps-2 h-100">
                                    <div class="name mt-3 ms-4 text-dark">${element.hotelName}</div>
                                    <div class=" text-warning star"><i class="fa fa-star"></i>${element.hotelStarRating}</div>
                                    <div class="town ms-4 mt-1">${element.hotelAddress}</div>
                                    <div class="desc ms-4 mt-2"> Well-appointed guest rooms with comfortable beds, clean
                                        linens, and essential furnishings.</div>
                                    <div class="features ms-4 mt-4 col-md-8">
                                        <div class="col-md-12 ms-2"><i class="fa fa-check"></i>
                                            Free Cancellation</div>
                                        <div class="col-md-12 mt-2 ms-2"><i class="fa fa-check"></i> 24/7 Reception
                                        </div>
                                        <div class="col-md-12 mt-2 ms-2"><i class="fa fa-check"></i> Bar and Lounge
                                        </div>
                                        <div class="col-md-12 mt-2 ms-2"><i class="fa fa-check"></i> Laundry Service
                                        </div>
                                    </div>
                                    <div class="icons ms-4 mt-4 col-md-8">
                                        <i class="fas fa-wifi m-2"></i>
                                        <i class="fas fa-swimming-pool m-2"></i>
                                        <i class="fas fa-utensils m-2"></i>
                                        <i class="fas fa-dumbbell m-2"></i>
                                        <i class="fas fa-concierge-bell m-2"></i>
                                        <i class="fas fa-parking m-2"></i>

                                    </div>
                                    <button class="btn btn-primary ms-4 mt-4">See more</button>
                                    <button class="btn btn-success  mt-4 position-relative" style="left: 20rem;" onclick="selectedHotel('${element.hotelId}')">
                                        <i class="fa fa-shopping-cart me-2" aria-hidden="true"></i> Select</button>
                                </div>
                            </div>
                        </div>`;
      newCard.append(innerHTML);
      $("#carouselHotel").append(newCard);
    });

    console.log("hotelData:", hotelData);
  } catch (error) {
    console.log(error);
  }
});

function selectedHotel(hotelId) {
  console.log(hotelId);
  console.log("selected");
}
