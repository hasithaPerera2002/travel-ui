$("#profilePicError").hide();
$("#addressError").hide();
$("#contactError").hide();
$("#firstNameError").hide();
$("#secondNameError").hide();
$("#ageError").hide();

let profileData;

$("document").ready(async function () {
  var innerHtml = `<img src="data:image/jpg;base64,${sessionStorage.getItem(
    "profilePicture"
  )}" style="height: 100%;width: 100%;" class="img img-fluid rounded-circle">`;

  $("#img").append(innerHtml);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${sessionStorage.getItem("jwt")}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  await fetch(
    `http://localhost:8080/api/v1/user/getUser?id=${sessionStorage.getItem(
      "userId"
    )}`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        $("#errorModal").modal("show");
      }
      return response.json();
    })
    .then((data) => {
      profileData = data.data;
      console.log(profileData);
      $("#firstName").val(profileData.firstName);
      $("#secondName").val(profileData.secondName);
      $("#contact").val(profileData.contactNumber);
      $("#age").val(profileData.age);
      $("#address").val(profileData.address);

      var innerHtml = `
       <div>${profileData.firstName} ${profileData.secondName}</div>
      `;
      $("#name").append(innerHtml);
    })
    .catch((error) => console.log("error", error));

  console.log(profileData);
});

function validateForm() {
  const pic = $("#profilePic")[0].files[0];
  const address = $("#address").val();
  const contact = $("#contact").val();
  const first = $("#firstName").val();
  const second = $("#secondName").val();
  const age = $("#age").val();

  var nameRegex = /^[A-Za-z]+$/;
  var ageRegex = /^\d+$/;
  var contactNumberRegex = /^[\d\s\+\-\(\)]{0,20}$/;
  var addressMaxLength = 100;

  if (!pic) {
    $("#profilePicError").show();
    return false;
  } else {
    $("#profilePicError").hide();
  }

  if (!nameRegex.test(first)) {
    $("#firstNameError").show();
    return false;
  } else {
    $("#firstNameError").hide();
  }

  if (!nameRegex.test(second)) {
    $("#secondNameError").show();
    return false;
  } else {
    $("#secondNameError").hide();
  }

  if (!ageRegex.test(age)) {
    $("#ageError").show();
    return false;
  } else {
    $("#ageError").hide();
  }

  if (!contactNumberRegex.test(contact)) {
    $("#contactError").show();
    return false;
  } else {
    $("#contactError").hide();
  }

  if (address.length > addressMaxLength) {
    $("#addressError").show();
    return false;
  } else {
    $("#addressError").hide();
  }

  return true;
}

$("#save").click(async function () {
  if (validateForm()) {
    console.log("validated");

    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${sessionStorage.getItem("jwt")}`
    );

    var formdata = new FormData();
    formdata.append("firstName", $("#firstName").val());
    formdata.append("secondName", $("#secondName").val());
    formdata.append("age", $("#age").val());
    formdata.append("contactNumber", $("#contact").val());
    formdata.append("address", $("#address").val());
    formdata.append("userId", sessionStorage.getItem("userId"));
    formdata.append("profilePicture", $("#profilePic")[0].files[0]);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:8080/api/v1/user/update", requestOptions)
      .then((response) => {
        if (!response.ok) {
          $("#errorModal").modal("show");
        }
        return response.json();
      })
      .then((data) => {
        sessionStorage.setItem("profilePicture", data.data.profilePicture);
        $("#okModal").modal("show");
      })
      .catch((error) => console.log("error", error));
  }
});
