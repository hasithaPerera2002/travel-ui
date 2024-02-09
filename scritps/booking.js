let hotelData;
let vehicleData;
let vehicle;
let guide;
let guideData;
let noOfDays;
let packageType;
let bookingData;
let hotelIdBooked;
let vehicleIdBooked;

let myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("jwt")}`);

$("#dateRangeError").hide();
$("#adultError").hide();
$("#childrenError").hide();
$("#vehicleBrandError").hide();
$("#vehicleNumberError").hide();
$("#paymentProofError").hide();
$("#packageError").hide();
$(".spinner-div").show();

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
  if (sessionStorage.getItem("userId")) {
    try {
      if (sessionStorage.getItem("hasBooked") !== "true") {
        const currentURL = window.location.href;

        const searchParams = new URLSearchParams(window.location.search);

        // placeName = "Kandy_and_Upcountry";
        // let packageType = "LUXURY";

        function getParameterByName(name) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
          var results = regex.exec(location.search);
          return results === null
            ? ""
            : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        let id = getParameterByName("hotelId");
        packageType = getParameterByName("packageType");

        console.log("id:", id);
        console.log("packageType:", packageType);

        // fetching data from the server
        let hotel = await fetch(
          `http://localhost:8000/api/v1/hotels/search?id=${id}`,
          {
            method: "GET",
            cors: "no-cors",
            headers: myHeaders,
          }
        );
        if (hotel.ok) {
          hotelData = await hotel.json();
          hotelData = hotelData.data;
          console.log(hotelData);
        } else {
          throw new Error("Network response was not ok in hotel data");
        }
      } else {
        // -------------------------------------------------  booking data here------------------------------------------------------------------------
        let booking = await fetch(
          `http://localhost:8081/api/v1/booking/getBookingByUser?id=${sessionStorage.getItem(
            "userId"
          )}`,
          {
            method: "GET",
            cors: "no-cors",
            headers: myHeaders,
          }
        );

        if (booking.ok) {
          bookingData = await booking.json();
          bookingData = bookingData.data;
          console.log(bookingData);

          $("#startDate").val(bookingData.bookingDate);
          $("#endDate").val(bookingData.bookingEndDate);
          $("#adultCount").val(bookingData.noOfAdults);
          $("#childCount").val(bookingData.noOfChildren);
          $("#remark").val(bookingData.remark);
          $("#packagePrice").val(bookingData.packageValue);
          $("#packageName").val(bookingData.packageName);
          $("#packageType").val(bookingData.packageType);
          $("#totalDates").val(bookingData.noOfDays);

          vehicleIdBooked = bookingData.vehicleId;
          hotelIdBooked = bookingData.hotelId;
          packageType = bookingData.packageType;
        } else {
          throw new Error("Network response was not ok in booking data");
        }
      }

      let vehicle = await fetch(
        `http://localhost:8000/api/v1/vehicles/search/available?category=${packageType}`,
        {
          method: "GET",
          cors: "no-cors",
          headers: myHeaders,
        }
      );
      if (vehicle.ok) {
        vehicleData = await vehicle.json();
        vehicleData = vehicleData.data;
      } else {
        throw new Error("Network response was not ok in vehicle data");
      }

      let guide = await fetch(
        `http://localhost:8000/api/v1/guide/all/available`,
        {
          method: "GET",
          mode: "cors",
          headers: myHeaders,
        }
      );
      if (guide.ok) {
        guideData = await guide.json();
        guideData = guideData.data;
        console.log(guideData);
      } else {
        throw new Error("Network response was not ok in Guide data");
      }

      vehicleData.forEach((element, index) => {
        var newCard = $("<div>").addClass("carousel-item ");

        if (index === 0) {
          newCard.addClass("active");
        }

        newCard.attr("data-package-id", element.vehicleId);

        var innerHtml = ` <div class="carsoul-item ">
                        <div class="row">
                            <div class="col-md-10 offset-md-1  d-flex flex-wrap offset-md-1 card">
                                <div class="col-md-7">
                                    <div class="img-thumbnail ms-1" style="background: url('data:image/jpg;base64,${element.frontView}') no-repeat; 
                                                                                    background-size: cover;
                                                                                        margin-top: 2vh;
                                                                                        height: 52vh;">
                                    </div>
                                </div>

                                <div class="col-md-4 ps-2 h-75">
                                    <div class="name mt-3 ms-4 text-dark"> ${element.brand}</div>
                                    <div class="mt-5">
                                        <div class="row ">
                                            <div class="town ms-4 col mt-1"><i class="fa-solid fa-car"></i> Vehicle
                                                type
                                                :</div>
                                            <div class="town ms-4 col mt-1">${element.vehicleType}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town ms-4 col mt-1"><i class="fa-solid fa-users-line"></i>
                                                Capacity :</div>
                                            <div class="town ms-4 col mt-1">${element.seatingCapacity}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town ms-4 col mt-1"><i class="fa-solid fa-gas-pump"></i> Fuel
                                                Type :</div>
                                            <div class="town ms-4 col mt-1">${element.fuelType}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town col ms-4 mt-1"><i class="fa-solid fa-leaf"></i> Is hybrid :
                                            </div>
                                            <div class="town ms-4 col mt-1">${element.hybrid}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town ms-4 col mt-1"><i class="fa-solid fa-gear"></i>
                                                Transmission :</div>
                                            <div class="town ms-4 col mt-1">${element.transmissionType}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town ms-4 col mt-1"><i class="fa-regular fa-money-bill-1"></i>
                                                Daily Rate :</div>
                                            <div class="town ms-4 col mt-1">RS ${element.dailyRate}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town ms-4 col mt-1"><i class="fa-regular fa-money-bill-1"></i>
                                                Price per KM :</div>
                                            <div class="town ms-4 col mt-1">RS ${element.priceForKm}</div>
                                        </div>
                                        <div class="row">
                                            <div class="town ms-4 col mt-1">
                                                <i class="fa-solid fa-gas-pump"></i> Fuel
                                                Consumption :
                                            </div>
                                            <div class="town ms-4 col mt-1">${element.fuelConsumption} Per Litre</div>
                                        </div>


                                    </div>

                                    <button class="btn btn-primary ms-4 mt-4">See more Images</button>
                                    <button class="btn btn-success  mt-4 position-relative" style="left: 5rem;"
                                        onclick="selectedVehicle('${element.vehicleId}')">
                                        <i class="fa fa-shopping-cart me-2" aria-hidden="true"></i> Select</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        newCard.append(innerHtml);
        $("#carouselVehicle").append(newCard);
      });

      console.log("hotelData:", hotelData);
      console.log("vehicleData:", vehicleData);

      guideData.forEach((element, index) => {
        const newCard = $("<div>").addClass("carousel-item ");
        if (index === 0) {
          newCard.addClass("active");
        }
        var innerHTML = `
   
                        <div class="row">
                            <div class="col-md-10 offset-md-1  d-flex flex-wrap offset-md-1 card">
                                <div class="col-md-7">
                                    <div class="img-thumbnail ms-1" style="background: url('data:image/jpg;base64,${element.guideImage}') no-repeat; 
                                                                    background-size: cover;
                                                                    margin-top: 2vh;
                                                                    padding: 2rem;
                                                                        height: 52vh;">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="name mt-3 text-center text-dark">Guide Details</div>

                                    <div style="margin-top: 5rem;">
                                        <div class="row mt-2">
                                            <div class="col">Name :</div>
                                            <div class="col">${element.guideName}</div>
                                        </div>
                                        <div class="row mt-2">
                                            <div class="col">Age :</div>
                                            <div class="col">${element.guideAge}</div>
                                        </div>
                                        <div class="row mt-2">
                                            <div class="col">Email :</div>
                                            <div class="col">${element.guideEmail}</div>
                                        </div>
                                        <div class="row mt-2">
                                            <div class="col">Gender :</div>
                                            <div class="col">${element.guideGender}</div>
                                        </div>
                                    </div>
                                </div>
                            <div>
                              <button class="btn btn-success position-absolute" style="top:20rem;left:53rem" onclick="(guideSelected('${element.guideId}'))">
                                Select
                              </button>
                            </div>
                            </div>
                            
                        </div>

                    </div>
                    
                    `;
        if (index === 0) {
        }

        $("#carouselGuide").append(innerHTML);
      });
    } catch (error) {
      console.log(error);
    }
    $(".spinner-div").hide();
  } else {
    $("#warningModal").on("hidden.bs.modal", function (e) {
      window.location.href = "http://localhost:63343/ui/login.html";
    });

    $("#warningModal").modal("show");
  }
});

function initMap() {
  var location = { lat: 47.6062095, lng: -122.3320708 };
  var map = new google.maps.Map($("#map"), {
    zoom: 15,
    center: location,
  });
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });
}

$(".progress .progress-bar").css("width", function () {
  return $(this).attr("aria-valuenow") + "%";
});

function selectedHotel(hotelId) {
  console.log(hotelId);
  console.log("selected");
}

function guideSelected(guide) {
  console.log(guide);
  console.log("selected");
  guideData.forEach((element) => {
    if (element.guideId === guide) {
      $("#guideName").val(element.guideName);
      $("#guideEmail").val(element.guideEmail);
      $("#guideAge").val(element.guideAge);
      guide = element;
      console.log(guide);
    }
  });
}

function selectedVehicle(vehicleId) {
  console.log(vehicleId);
  console.log("selected");
  vehicleData.forEach((element) => {
    if (element.vehicleId === vehicleId) {
      $("#vehicleBrand").val(element.brand);
      $("#vehicleNumber").val(element.vehicleNumber);
      $("#seatingCapacity").val(element.seatingCapacity);
      $("#driverName").val(element.name);
      vehicle = element;
    }
  });
}

function handleDropdownPackage(package) {
  console.log(package);

  switch (package) {
    case "doubleFullBoardPrice":
      $("#packageName").val("Double Full Board Package");
      $("#packagePrice").val(hotelData.doubleFullBoardPrice);
      $("#packaeDiscount").val("0");
      break;
    case "doubleHalfBoardPrice":
      $("#packageName").val("Double Half Board Package");
      $("#packagePrice").val(hotelData.doubleHalfBoardPrice);
      $("#packaeDiscount").val("0");
      break;
    case "tripleHalfBoardPrice":
      $("#packageName").val("Triple Half Board Package");
      $("#packagePrice").val(hotelData.tripleHalfBoardPrice);
      $("#packaeDiscount").val("0");
      break;
    case "tripleFullBoardPrice":
      $("#packageName").val("Triple Full Board Package");
      $("#packagePrice").val(hotelData.tripleFullBoardPrice);
      $("#packaeDiscount").val("0");
      break;
  }
}
$("#booking-btn").click(function () {
  console.log("clicked");
  console.log(vehicle);
  if (validateData()) {
    console.log("called");
    var formdata = new FormData();
    formdata.append("customerId", sessionStorage.getItem("userId"));
    formdata.append("packageValue", $("#packagePrice").val());
    formdata.append("guideId", "c3777572-420a-4422-9963-79885c70875c");
    formdata.append("vehicleId", vehicle.vehicleId);
    formdata.append("isPaid", true);
    formdata.append("bookingDate", $("#startDate").val());
    formdata.append("bookingEndDate", $("#endDate").val());
    formdata.append("paymentProof", $("#paymentProof")[0].files[0]);
    formdata.append("noOfAdults", $("#adultCount").val());
    formdata.append("noOfChildren", $("#childCount").val());
    formdata.append("remark", $("#remark").val());
    formdata.append("packageType", hotelData.category);
    formdata.append("hotelId", hotelData.hotelId);
    formdata.append("hotelName", hotelData.hotelName);
    formdata.append("placeName", hotelData.placeName);
    formdata.append("packageName", $("#packageName").val());

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
      headers: myHeaders,
      cors: "no-cors",
    };

    fetch("http://localhost:8000/api/v1/booking/save", requestOptions)
      .then(function (response) {
        sessionStorage.setItem("hasBooked", true);
        $("#bookingModal").modal("show");
        if (response.ok) {
          toastr.success("Package added successfully");
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then(function (data) {
        console.log("Data sent successfully:", data);
      })
      .catch(function (error) {
        toastr.info("Error when adding");
        console.error("Error:", error);
      })
      .finally(function () {});
  }
});
$("#confirm").click(function () {
  const encodedURL = `http://localhost:63343/index.html`;
  window.open(encodedURL);
});

const validateData = () => {
  if (!$("#paymentProof")[0].files[0]) {
    $("#paymentProofError").show();
    $("#paymentProof").focus();
    return false;
  } else {
    $("#paymentProofError").hide();
  }

  if (!$("#startDate").val()) {
    $("#dateRangeError").show();
    $("#rangeDate").focus();
    return false;
  } else {
    $("#dateRangeError").hide();
  }

  if (!$("#packageName").val()) {
    $("#packageError").show();
    $("#packageName").focus();
    return false;
  } else {
    $("#packageError").hide();
  }

  if ($("#adultCount").val() < 0) {
    $("#adultError").show();
    $("#adultCount").focus();
    return false;
  } else {
    $("#adultError").hide();
  }

  if (!$("#vehicleBrand").val()) {
    $("#vehicleBrandError").show();
    $("#vehicleBrand").focus();
    return false;
  } else {
    $("#vehicleBrandError").hide();
  }

  return true;
};
