$(".alert").hide();

function validateForm() {
  console.log("validateForm");
  // Get form field values
  var firstName = document.getElementById("firstName").value;
  var email = document.getElementById("email").value;
  var age = document.getElementById("age").value;
  var contactNumber = document.getElementById("contactNumber").value;
  var address = document.getElementById("address").value;
  var password = document.getElementById("password").value;
  var nicNumber = document.getElementById("nicNumber").value;

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
    $("#firstNameError").show();
    return false;
  } else {
    $("#firstNameError").hide();
  }

  if (!emailRegex.test(email)) {
    $("#email")
      .next(".error-message")
      .text("Email should be a valid email address.");
    return false;
  } else {
    $("#email").next(".error-message").text("");
  }

  if (!ageRegex.test(age) || age < 18 || age > 80) {
    $("#age")
      .next(".error-message")
      .text("Age should be a positive integer between 18 and 80.");
    return false;
  } else {
    $("#age").next(".error-message").text("");
  }

  if (contactNumber.length > 20 || !contactNumberRegex.test(contactNumber)) {
    $("#contactNumber")
      .next(".error-message")
      .text("Contact number should not exceed 20 characters.");
    return false;
  } else {
    $("#contactNumber").next(".error-message").text("");
  }

  if (address.length > addressMaxLength) {
    $("#address")
      .next(".error-message")
      .text("Address should not exceed " + addressMaxLength + " characters.");
    return false;
  } else {
    $("#address").next(".error-message").text("");
  }

  if (!passwordRegex.test(password)) {
    $("#password")
      .next(".error-message")
      .text(
        "Password should contain at least one letter and one number, with a minimum of eight characters."
      );
    return false;
  } else {
    $("#password").next(".error-message").text("");
  }

  if (nicNumber.length < nicNumberMinLength) {
    $("#nicNumber")
      .next(".error-message")
      .text(
        "NIC number should not be less than " +
          nicNumberMinLength +
          "else " +
          nicNumberMinLength +
          " characters."
      );
  } else {
    $("#nicNumber").next(".error-message").text("");

    return false;
  }

  // If all checks pass, the form will be submitted
  return true;
}

document
  .getElementById("btnSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();

    validateForm();
  });
