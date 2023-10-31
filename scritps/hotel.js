let hotelData;
let place;
let package;
$(".spinner-div").show();
$("document").ready(async function () {
  try {
    const currentURL = window.location.href;

    const searchParams = new URLSearchParams(window.location.search);

    function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    place = getParameterByName("placeName");
    package = getParameterByName("packageType");

    // let place = "Kandy_and_Upcountry";
    // let package = "LUXURY";

    console.log("placeName:", place);
    console.log("packageType:", package);

    let data = await fetch(
      `http://localhost:8082/api/v1/hotels/search/categoryAndPlace?placeName=${place}&category=${package}`,
      {
        method: "GET",
        mode: "cors",
        headers: {},
      }
    );

    if (data.ok) {
      data = await data.json();
      hotelData = data.data;
      console.log(hotelData);
    } else {
      throw new error("Hotel fetching failed");
    }

    hotelData.forEach((element) => {
      var innerHTML = `
    
                <div class="col-md-10 offset-md-1 hotel-div">
                    <div class="row mt-5 hotel-cards">
                        <div class=" d-flex flex-wrap card">
                            <div class="col-md-5">
                                <div class="img-thumbnail ms-1" style="background: url('data:image/jpg;base64,${element.hotelImage}') no-repeat; 
                                                                        background-size: cover;
                                                                            margin-top: 2vh;
                                                                            height: 52vh;">
                                </div>
                            </div>
                            <div class="vertical-ruler"></div>
                            <div class="col-md-7 ps-2 h-50">
                                <div class="name mt-3 ms-4 text-dark">${element.hotelName}</div>
                                <div class=" text-warning star"><i class="fa fa-star"></i>5</div>
                                <div class="town ms-4 mt-1">${element.hotelAddress}</div>
                                <div class="desc ms-4 mt-2"> Well-appointed guest rooms with comfortable beds, clean
                                    linens, and essential furnishings.</div>
                                <div class="features ms-4 mt-4 col-md-8">
                                    <div class="col-md-12 text-success ms-2"><i class="fa fa-check"></i>
                                        Free Cancellation</div>
                                    <div class="col-md-12 mt-2 text-success ms-2"><i class="fa fa-check"></i> 24/7
                                        Reception
                                    </div>
                                    <div class="col-md-12 mt-2 text-success ms-2"><i class="fa fa-check"></i> Bar and
                                        Lounge
                                    </div>
                                    <div class="col-md-12 mt-2 text-success ms-2"><i class="fa fa-check"></i> Laundry
                                        Service
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

                                <button class="btn btn-primary  mt-4 position-relative" style="left: 40rem;"
                                    onclick="selectedHotel('${element.hotelId}')">
                                    Select</button>


                            </div>
                        </div>
                    </div>
                </div>
    `;

      $("#hotel-append").append(innerHTML);
    });

    $(".spinner-div").hide();
  } catch (error) {
    console.log(error);
  }
});
selectedHotel = (hotelId) => {
  const encodedHotelId = encodeURIComponent(hotelId);
  const encodedPackage = encodeURIComponent(package);
  const encodedURL = `http://127.0.0.1:5501/booking.html?hotelId=${encodedHotelId}&packageType=${encodedPackage}`;
  window.open(encodedURL, "_blank");
};
