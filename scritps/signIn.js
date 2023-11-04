$(".alert").hide();

function validateForm() {
  console.log("validateForm");
  // Get form field values
  var firstName = document.getElementById("firstName").value;
  var secondName = document.getElementById("secondName").value;
  var email = document.getElementById("email").value;
  var age = document.getElementById("age").value;
  var contactNumber = document.getElementById("contactNumber").value;
  var address = document.getElementById("address").value;
  var password = document.getElementById("password").value;
  var nicNumber = document.getElementById("nicNumber").value;
  var backImg = $("#backImageOfNIC")[0].files[0];
  var frontImg = $("#frontImageOfNIC")[0].files[0];
  var profilePic = $("#profilePicture")[0].files[0];
  var maleRadio = document.getElementById("male");
  var femaleRadio = document.getElementById("female");
  var genderError = document.getElementById("genderError");

  // Define regular expressions for validation
  var nameRegex = /^[A-Za-z]+$/;
  var emailRegex = /^\S+@\S+\.\S+$/;
  var ageRegex = /^\d+$/;
  var contactNumberRegex = /^[\d\s\+\-\(\)]{0,20}$/;
  var addressMaxLength = 100;
  var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  var nicNumberMinLength = 10;

  // Validation checks
  if (!nameRegex.test(firstName)) {
    $("#firstName").focus();
    $("#firstNameError").show();
    return false;
  } else {
    $("#firstNameError").hide();
  }
  if (!nameRegex.test(secondName)) {
    $("#secondName").focus();
    $("#secondNameError").show();
    return false;
  } else {
    $("#secondNameError").hide();
  }

  if (!emailRegex.test(email)) {
    $("#email").focus();
    $("#emailError").show();
    return false;
  } else {
    $("#emailError").hide();
  }

  if (!ageRegex.test(age) || age < 18 || age > 80) {
    $("#age").focus();
    $("#ageError").show();
    return false;
  } else {
    $("#ageError").hide();
  }

  if (
    contactNumber.length > 20 ||
    !contactNumberRegex.test(contactNumber) ||
    contactNumber.length == 0
  ) {
    $("#contactNumber").focus();
    $("#contactError").show();
    return false;
  } else {
    $("#contactError").hide();
  }

  if (address.length > addressMaxLength || address.length == 0) {
    $("#address").focus();
    $("#addressError").show();
    return false;
  } else {
    $("#addressError").hide();
  }

  if (!passwordRegex.test(password)) {
    $("#password").focus();
    $("#passwordError").show();
    return false;
  } else {
    $("#passwordError").hide();
  }

  if (nicNumber.length < nicNumberMinLength) {
    $("#nicNumber").focus();
    $("#nicNumberError").show();
    return false;
  } else {
    $("#nicNumberError").hide();
  }

  if (!backImg) {
    $("#backImageOfNIC").focus();
    $("#backError").show();
    return false;
  } else {
    $("#backError").hide();
  }

  if (!frontImg) {
    $("#frontImageOfNIC").focus();
    $("#frontError").show();
    return false;
  } else {
    $("#frontError").hide();
  }

  if (!profilePic) {
    $("#profilePicture").focus();
    $("#profilePictureError").show();
    return false;
  } else {
    $("#profilePictureError").hide();
  }
  if (!maleRadio.checked && !femaleRadio.checked) {
    genderError.style.display = "block";
    return false;
  } else {
    genderError.style.display = "none";
  }

  return true;
}

document
  .getElementById("btnSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (validateForm()) {
      var formdata = new FormData();
      formdata.append("firstName", $("#firstName").val());
      formdata.append("secondName", $("#secondName").val());
      formdata.append("password", $("#password").val());
      formdata.append("email", $("#email").val());
      formdata.append("age", $("#age").val());
      formdata.append("contactNumber", $("#contactNumber").val());
      formdata.append("address", $("#address").val());
      formdata.append("role", "USER");
      formdata.append("nicNumber", $("#nicNumber").val());
      formdata.append("gender", $("#male").is(":checked") ? "MALE" : "FEMALE");
      formdata.append("profilePicture", $("#profilePicture")[0].files[0]);
      formdata.append("backImageOfNIC", $("#backImageOfNIC")[0].files[0]);
      formdata.append("frontImageOfNIC", $("#frontImageOfNIC")[0].files[0]);

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch("http://localhost:8000/api/v1/user/register", requestOptions)
        .then((response) => {
          response.text();
          $("#bookingModal").modal("show");
          window.location.href = "http://localhost:8000/login.html";
        })
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  });
