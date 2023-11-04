$("#btnLogin").click(function (event) {
  event.preventDefault();

  if (validateForm()) {
    console.log("Form is valid, submitting to server");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: $("#email").val(),
      password: $("#password").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8000/api/v1/user/login", requestOptions)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          $("#errorModal").modal("show");
          return;
        }
      })
      .then((data) => {
        const { userId, profilePicture, jwt, role } = data.data;

        if (userId && profilePicture && jwt && role) {
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("profilePicture", profilePicture);
          sessionStorage.setItem("jwt", jwt);
          sessionStorage.setItem("role", role);

          console.log("Data saved in sessionStorage");
          switch (role) {
            case "ADMIN_USER_SERVICE":
              window.open("http://127.0.0.1:5501/userAdminDashBoard.html");
              break;
            case "ADMIN_TRAVEL_SERVICE":
              window.open("http://127.0.0.1:5501/packageAdmin.html");
              break;
            case "ADMIN_HOTEL_SERVICE":
              window.open("http://127.0.0.1:5501/hotelAdmin.html");
              break;
            case "ADMIN_VEHICLE_SERVICE":
              window.open("http://127.0.0.1:5501/vehicleAdmin.html");
              break;
            case "ADMIN_GUIDE_SERVICE":
              window.open("http://127.0.0.1:5501/guideAdmin.html");
              break;
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
});

function validateForm() {
  var email = $("#email").val();
  var password = $("#password").val();

  var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!emailRegex.test(email)) {
    alert("Invalid email");
    return false;
  } else {
    $("#emailError").hide();
  }

  if (!passwordRegex.test(password)) {
    alert("Invalid password");
    return false;
  } else {
    $("#passwordError").hide();
  }

  return true;
}
$("#login").click(function () {
  $("#errorModal").modal("hide");
});
