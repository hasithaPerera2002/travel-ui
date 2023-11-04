let userList;
let myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("jwt")}`);

$(".spinner-div").show();

$(document).ready(async function () {
  // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Select/Deselect checkboxes
  var checkbox = $('table tbody input[type="checkbox"]');
  $("#selectAll").click(function () {
    if (this.checked) {
      checkbox.each(function () {
        this.checked = true;
      });
    } else {
      checkbox.each(function () {
        this.checked = false;
      });
    }
  });
  checkbox.click(function () {
    if (!this.checked) {
      $("#selectAll").prop("checked", false);
    }
  });

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };
  let users = await fetch(
    "http://localhost:8000/api/v1/user/all",
    requestOptions
  );

  if (users.ok) {
    users = await users.json();
    userList = users.data;
    console.log(userList);
  } else {
    console.log("error");
  }

  loadTable();

  $(".spinner-div").hide();
});

async function loadTable() {
  userList.forEach((element) => {
    var innerHTML = `
    <tr>
    <td>${element.userID}</td>
    <td>${element.firstName}</td>
    <td>${element.secondName}</td>
    <td>${element.email}</td>
    <td>${element.age}</td>
    <td>${element.contactNumber}</td>
    <td>${element.address}</td>
    <td ><img src="data:image/jpg;base64,${element.profilePicture}" alt=""></td>
    <td>${element.gender}</td>
    <td>${element.remark}</td>
    <td ><img src="data:image/jpg;base64,${element.frontImageOfNIC}" alt=""></td>
    <td ><img src="data:image/jpg;base64,${element.backImageOfNIC}" alt=""></td>
    <td>${element.nicNumber}</td>
 
                            <td class="d-flex">
                               <button type="button" class="btn btn-danger p-1 m-1" onclick="deleteUser('${element.userID}')">
                                       <i class="fa fa-trash-can"></i>
                                </button>
                            </td>
    </tr>
    `;

    $("#tbody").append(innerHTML);
  });
}

$("#addUserButton").click(function (event) {
  event.preventDefault();

  if (validateForm()) {
    var formdata = new FormData();
    formdata.append(
      "firstName",
      $('#addUserForm input[name="firstName"]').val()
    );
    formdata.append(
      "secondName",
      $('#addUserForm input[name="secondName"]').val()
    );
    formdata.append("password", "kamal1234");
    formdata.append("email", $('#addUserForm input[type="email"]').val());
    formdata.append("age", $('#addUserForm input[name="age"]').val());
    formdata.append("contactNumber", $('#addUserForm input[type="tel"]').val());
    formdata.append("address", $("#addAddress").val());
    formdata.append("role", "USER");
    formdata.append(
      "profilePicture",
      $('#addUserForm input[name="profilePicture"]')[0].files[0]
    );
    formdata.append(
      "nicNumber",
      $('#addUserForm input[name="nicNumber"]').val()
    );
    formdata.append(
      "backImageOfNIC",
      $('input[name="nicBackImage"]')[0].files[0]
    );
    formdata.append(
      "frontImageOfNIC",
      $('input[name="nicFrontImage"]')[0].files[0]
    );
    formdata.append("gender", $("#addGender").val());
    formdata.append("remark", $('#addUserForm input[name="remarks"]').val());

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
      headers: myHeaders,
    };

    fetch("http://localhost:8000/api/v1/user/register", requestOptions)
      .then(function (response) {
        if (response.ok) {
          console.log(response.text());
          toastr.success("User added successfully");
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

function validateForm() {
  var firstName = $('#addUserForm input[name="firstName"]').val();
  var secondName = $('#addUserForm input[name="secondName"]').val();
  var email = $('#addUserForm input[type="email"]').val();
  var age = $('#addUserForm input[name="age"]').val();
  var contactNumber = $('#addUserForm input[type="tel"]').val();
  var address = $("#addAddress").val();
  var profilePic = $('#addUserForm input[name="profilePicture"]')[0].files[0];
  var nicFrontImage = $('#addUserForm input[name="nicFrontImage"]')[0].files[0];
  var nicBackImage = $('#addUserForm input[name="nicBackImage"]')[0].files[0];
  var nicNumber = $('#addUserForm input[name="nicNumber"]').val();

  if (
    firstName === null ||
    firstName === undefined ||
    firstName === "" ||
    !/^[a-zA-Z0-9_-]{3,16}$/.test(firstName)
  ) {
    $('#addUserForm input[name="firstName"]')
      .next(".error-message")
      .text("first name  invalid");
    $('#addUserForm input[name="firstName"]').focus();
    return false;
  } else {
    $('#addUserForm input[name="firstName"]').next(".error-message").text("");
  }

  if (
    secondName === null ||
    secondName === undefined ||
    secondName === "" ||
    !/^[a-zA-Z0-9_-]{3,16}$/.test(secondName)
  ) {
    $('#addUserForm input[name="secondName"]')
      .next(".error-message")
      .text("second name  invalid");
    return false;
  } else {
    $('#addUserForm input[name="secondName"]').next(".error-message").text("");
  }

  if (!validateEmail(email)) {
    $('#addUserForm input[type="email"]')
      .next(".error-message")
      .text("email is invalid");
    $('#addUserForm input[type="email"]').focus();
    return false;
  } else {
    $('#addUserForm input[type="email"]').next(".error-message").text("");
  }

  if (isNaN(age) || age < 18 || age > 80 || age.trim() === "") {
    $('#addUserForm input[name="age"]').next(".error-message").text("age >18");
    $('#addUserForm input[name="age"]').focus();
    return false;
  } else {
    $('#addUserForm input[name="age"]').next(".error-message").text("");
  }

  if (contactNumber.length > 20) {
    $('#addUserForm input[type="tel"]')
      .next(".error-message")
      .text("contact number  cannot be empty");
    $('#addUserForm input[type="tel"]').focus();
    return false;
  } else {
    $('#addUserForm input[type="tel"]').next(".error-message").text("");
  }

  if (address === null || address === undefined || address === "") {
    $("#addAddress").next(".error-message").text("address  cannot be empty");
    $("#addAddress").focus();
    return false;
  } else {
    $("#addAddress").next(".error-message").text("");
  }

  if (!profilePic) {
    $('#addUserForm input[name="profilePicture"]')
      .next(".error-message")
      .text("profile picture is required");
    $('#addUserForm input[name="profilePicture"]').focus();
    return false;
  } else {
    $('#addUserForm input[name="profilePicture"]')
      .next(".error-message")
      .text("");
  }

  if (!nicFrontImage) {
    $('#addUserForm input[name="nicFrontImage"]')
      .next(".error-message")
      .text("nic front image is required");
    $('#addUserForm input[name="nicFrontImage"]').focus();
    return false;
  } else {
    $('#addUserForm input[name="nicFrontImage"]')
      .next(".error-message")
      .text("");
  }

  if (!nicBackImage) {
    $('#addUserForm input[name="nicBackImage"]')
      .next(".error-message")
      .text("nic back image is required");
    $('#addUserForm input[name="nicBackImage"]').focus();
    return false;
  } else {
    $('#addUserForm input[name="nicBackImage"]')
      .next(".error-message")
      .text("");
  }

  if (
    nicNumber === null ||
    nicNumber === undefined ||
    nicNumber === "" ||
    nicNumber.length < 10
  ) {
    $('#addUserForm input[name="nicNumber"]')
      .next(".error-message")
      .text("nic number  cannot be empty and >10");
    $('#addUserForm input[name="nicNumber"]').focus();
    return false;
  } else {
    $('#addUserForm input[name="nicNumber"]').next(".error-message").text("");
  }

  console.log("meka hari");

  return true;
}

function validateEmail(email) {
  console.log(email);
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

function deleteUser(id) {
  console.log(id);

  $("#deleteUserModal").modal("show");

  $("#confirmDelete").on("click", function () {
    // Find the index of the item with the matching ID in the data source
    const dataIndex = userList.findIndex((item) => item.userId === id);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8000/api/v1/user/delete?id=${id}`, requestOptions)
      .then(function (response) {
        if (response.ok) {
          toastr.error("Package deleted successfully");
        } else {
          toastr.info("Error when deleting");
          throw new Error("Network response was not ok");
        }
      })
      .then(function (data) {
        $("#deletePackageModal").modal("hide");
        console.log("Data Delete successfully:", data);
      })
      .catch(function (error) {
        toastr.info("Error when deleting");
        console.error("Error:", error);
      })
      .finally(function () {
        $("#deletePackageModal").modal("hide");
      });

    if (dataIndex !== -1) {
      // Remove the item from the data source
      userList.splice(dataIndex, 1);

      // Remove the corresponding row from the table
      $(this).closest("tr").remove();

      // Close the delete confirmation modal
      $("#deleteUserModal").modal("hide");
    }
  });
}
