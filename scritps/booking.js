$("document").ready(async function () {
  try {
    console.log("hiiiiiiii");

    const currentURL = window.location.href;

    const searchParams = new URLSearchParams(window.location.search);

    // let placeName = decodeURIComponent(getParameterByName("placeName"));

    // let packageType = decodeURIComponent(getParameterByName("packageType"));

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
    } else {
      throw new Error("Network response was not ok");
    }

    console.log("hotelData:", hotelData);
  } catch (error) {
    console.log(error);
  }
});
