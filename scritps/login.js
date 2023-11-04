$("#emailError").hide();
$("#passwordError").hide();

//login

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
        const { userId, profilePicture, jwt } = data.data;

        if (userId && profilePicture && jwt) {
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("profilePicture", profilePicture);
          sessionStorage.setItem("jwt", jwt);

          console.log("Data saved in sessionStorage");
          $("#bookingModal").modal("show");
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
    $("#email").focus();
    $("#emailError").show();
    return false;
  } else {
    $("#emailError").hide();
  }

  if (!passwordRegex.test(password)) {
    $("#password").focus();
    $("#passwordError").show();
    return false;
  } else {
    $("#passwordError").hide();
  }

  return true;
}
$("#showPassword").click(function () {
  var passwordInput = $("#password");
  if ($(this).prop("checked")) {
    passwordInput.attr("type", "text"); // Show the password
  } else {
    passwordInput.attr("type", "password"); // Hide the password
  }
});

$("#ok").click(function () {
  $("#errorModal").modal("hide");
});
