let vehicleList;

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
  };
  let vehicles = await fetch(
    "http://localhost:8000/api/v1/vehicles/all",
    requestOptions
  );

  if (vehicles.ok) {
    vehicles = await vehicles.json();
    vehicleList = vehicles.data;
    console.log(vehicleList);
  } else {
    console.log("error");
  }

  loadTable();

  $(".spinner-div").hide();
});

async function loadTable() {
  vehicleList.forEach((element) => {
    var innerHTML = `
    <tr>
    <td>${element.vehicleId}</td>
    <td>${element.brand}</td>
    <td>${element.transmissionType}</td>
    <td>${element.category}</td>
    <td>${element.fuelType}</td>
    <td>${element.available}</td>
    <td>${element.seatingCapacity}</td>
    <td>${element.dailyRate}</td>
    <td>${element.vehicleType}</td>
    <td>${element.vehicleNumber}</td>
    <td>${element.remarks}</td>
    <td>${element.priceForKm}</td>
    <td>${element.fuelConsumption}</td>
    <td>${element.hybrid}</td>
    <td ><img src="data:image/jpg;base64,${element.frontView}" alt=""></td>
    <td ><img src="data:image/jpg;base64,${element.backView}" alt=""></td>
    <td ><img src="data:image/jpg;base64,${element.sideView}" alt=""></td>
    <td ><img src="data:image/jpg;base64,${element.frontInteriorView}" alt=""></td>
    <td ><img src="data:image/jpg;base64,${element.backInteriorView}" alt=""></td>
    <td >${element.name}</td>
    <td ><img src="data:image/jpg;base64,${element.license_front}" alt=""></td>
    <td ><img src="data:image/jpg;base64,${element.license_back}" alt=""></td>
    <td>${element.contactNumber}</td>
    
                            <td class="d-flex">
      
                                <button  class="btn btn-warning p-1 m-1" onclick="updateVehicle('${element.vehicleId}');">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                                
                               <button type="button" class="btn btn-danger p-1 m-1" onclick="deleteVehicle('${element.vehicleId}')">
                                       <i class="fa fa-trash-can"></i>
                                </button>
                            </td>
    </tr>
    `;

    $("#tbody").append(innerHTML);
  });
}

$("#addVehicleButton").click(function (event) {
  event.preventDefault();

  if (validateForm()) {
    var formdata = new FormData();
    formdata.append("brand", $('#addVehicleForm input[name="brand"]').val());
    formdata.append("transmissionType", $("#transmission").val());
    formdata.append("category", $("#category").val());
    formdata.append("fuelType", $("#fuelType").val());
    formdata.append(
      "isAvailable",
      $('#addVehicleForm input[name="available"]:checked').length > 0
    );
    formdata.append(
      "seatingCapacity",
      $('#addVehicleForm input[name="seating"]').val()
    );
    formdata.append(
      "dailyRate",
      $('#addVehicleForm input[name="dailyRate"]').val()
    );
    formdata.append("vehicleType", $("#vehicleType").val());
    formdata.append(
      "vehicleNumber",
      $('#addVehicleForm input[name="vehicleNumber"]').val()
    );
    formdata.append(
      "priceForKm",
      $('#addVehicleForm input[name="priceForKm"]').val()
    );
    formdata.append(
      "fuelConsumption",
      $('#addVehicleForm input[name="fuelConsumption"]').val()
    );
    formdata.append(
      "isHybrid",
      $('#addVehicleForm input[name="hybrid"]:checked').length > 0
    );
    formdata.append(
      "name",
      $('#addVehicleForm input[name="driverName"]').val()
    );
    formdata.append(
      "contactNumber",
      $('#addVehicleForm input[name="contactNumber"]').val()
    );
    formdata.append(
      "frontView",
      $('#addVehicleForm input[type="file"][name="frontView"]')[0].files[0]
    );
    formdata.append(
      "backView",
      $('#addVehicleForm input[type="file"][name="backView"]')[0].files[0]
    );
    formdata.append(
      "sideView",
      $('#addVehicleForm input[type="file"][name="sideView"]')[0].files[0]
    );
    formdata.append(
      "frontInteriorView",
      $('#addVehicleForm input[type="file"][name="frontInt"]')[0].files[0]
    );
    formdata.append(
      "backInteriorView",
      $('#addVehicleForm input[type="file"][name="backInt"]')[0].files[0]
    );
    formdata.append(
      "license_front",
      $('#addVehicleForm input[type="file"][name="licenseFront"]')[0].files[0]
    );
    formdata.append(
      "license_back",
      $('input[type="file"][name="licenseBack"]')[0].files[0]
    );

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:8000/api/v1/vehicles/save", requestOptions)
      .then(function (response) {
        if (response.ok) {
          toastr.success("Hotel added successfully");
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
      .finally(function () {
        $("#addVehicleModal").modal("hide");
      });
  }
});

function validateForm() {
  const brand = $('#addVehicleForm input[name="brand"]').val();
  const seating = $('#addVehicleForm input[name="seating"]').val();
  const dailyRate = $('#addVehicleForm input[name="dailyRate"]').val();
  const vehicleNumber = $('#addVehicleForm input[name="vehicleNumber"]').val();
  const priceForKm = $('#addVehicleForm input[name="priceForKm"]').val();
  const fuelConsumption = $(
    '#addVehicleForm input[name="fuelConsumption"]'
  ).val();
  const name = $('#addVehicleForm input[name="driverName"]').val();
  const contactNumber = $('#addVehicleForm input[name="contactNumber"]').val();
  const frontView = $('#addVehicleForm input[type="file"][name="frontView"]')[0]
    .files[0];
  const backView = $('#addVehicleForm input[type="file"][name="backView"]')[0]
    .files[0];
  const sideView = $('#addVehicleForm input[type="file"][name="sideView"]')[0]
    .files[0];
  const frontInt = $('#addVehicleForm input[type="file"][name="frontInt"]')[0]
    .files[0];
  const backInt = $('#addVehicleForm input[type="file"][name="backInt"]')[0]
    .files[0];
  const licenseFront = $(
    '#addVehicleForm input[type="file"][name="licenseFront"]'
  )[0].files[0];
  const licenseBack = $(
    '#addVehicleForm input[type="file"][name="licenseBack"]'
  )[0].files[0];

  if (brand.trim() === "") {
    $('#addVehicleForm input[name="brand"]')
      .next(".error-message")
      .text("Brand cannot be empty");
    $('#addVehicleForm input[name="brand"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="brand"]').next(".error-message").text("");
  }

  if (seating.trim() === "" || isNaN(seating) || parseFloat(seating) < 3) {
    $('#addVehicleForm input[name="seating"]')
      .next(".error-message")
      .text("Seating capacity is not valid | 3<");
    $('#addVehicleForm input[name="seating"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="seating"]').next(".error-message").text("");
  }

  if (
    dailyRate.trim() === "" ||
    isNaN(dailyRate) ||
    parseFloat(dailyRate) < 100
  ) {
    $('#addVehicleForm input[name="dailyRate"]')
      .next(".error-message")
      .text("Daily rate is not valid | 100<");
    $('#addVehicleForm input[name="dailyRate"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="dailyRate"]')
      .next(".error-message")
      .text("");
  }

  if (vehicleNumber.trim() === "") {
    $('#addVehicleForm input[name="vehicleNumber"]')
      .next(".error-message")
      .text("Vehicle number cannot be empty");
    $('#addVehicleForm input[name="vehicleNumber"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="vehicleNumber"]')
      .next(".error-message")
      .text("");
  }

  if (
    priceForKm.trim() === "" ||
    isNaN(priceForKm) ||
    parseFloat(priceForKm) < 100
  ) {
    $('#addVehicleForm input[name="priceForKm"]')
      .next(".error-message")
      .text("Price for km is not valid | 100<");
    $('#addVehicleForm input[name="priceForKm"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="priceForKm"]')
      .next(".error-message")
      .text("");
  }

  if (
    fuelConsumption.trim() === "" ||
    isNaN(fuelConsumption) ||
    parseFloat(fuelConsumption) < 2
  ) {
    $('#addVehicleForm input[name="fuelConsumption"]')
      .next(".error-message")
      .text("Fuel consumption is not valid | 2<");
    $('#addVehicleForm input[name="fuelConsumption"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="fuelConsumption"]')
      .next(".error-message")
      .text("");
  }

  if (name.trim() === "") {
    $('#addVehicleForm input[name="driverName"]')
      .next(".error-message")
      .text("Driver name cannot be empty");
    $('#addVehicleForm input[name="driverName"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="driverName"]')
      .next(".error-message")
      .text("");
  }

  if (contactNumber.trim() === "") {
    $('#addVehicleForm input[name="contactNumber"]')
      .next(".error-message")
      .text("Contact number cannot be empty");
    $('#addVehicleForm input[name="contactNumber"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[name="contactNumber"]')
      .next(".error-message")
      .text("");
  }

  if (!frontView) {
    $('#addVehicleForm input[type="file"][name="frontView"]')
      .next(".error-message")
      .text("Front view image is required");
    $('#addVehicleForm input[type="file"][name="frontView"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="frontView"]')
      .next(".error-message")
      .text("");
  }

  if (!backView) {
    $('#addVehicleForm input[type="file"][name="backView"]')
      .next(".error-message")
      .text("Back view image is required");
    $('#addVehicleForm input[type="file"][name="backView"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="backView"]')
      .next(".error-message")
      .text("");
  }

  if (!sideView) {
    $('#addVehicleForm input[type="file"][name="sideView"]')
      .next(".error-message")
      .text("Side view image is required");
    $('#addVehicleForm input[type="file"][name="sideView"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="sideView"]')
      .next(".error-message")
      .text("");
  }

  if (!frontInt) {
    $('#addVehicleForm input[type="file"][name="frontInt"]')
      .next(".error-message")
      .text("Front interior view image is required");
    $('#addVehicleForm input[type="file"][name="frontInt"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="frontInt"]')
      .next(".error-message")
      .text("");
  }

  if (!backInt) {
    $('#addVehicleForm input[type="file"][name="backInt"]')
      .next(".error-message")
      .text("Back interior view image is required");
    $('#addVehicleForm input[type="file"][name="backInt"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="backInt"]')
      .next(".error-message")
      .text("");
  }

  if (!licenseFront) {
    $('#addVehicleForm input[type="file"][name="licenseFront"]')
      .next(".error-message")
      .text("License front image is required");
    $('#addVehicleForm input[type="file"][name="licenseFront"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="licenseFront"]')
      .next(".error-message")
      .text("");
  }

  if (!licenseBack) {
    $('#addVehicleForm input[type="file"][name="licenseBack"]')
      .next(".error-message")
      .text("License back image is required");
    $('#addVehicleForm input[type="file"][name="licenseBack"]').focus();
    return false;
  } else {
    $('#addVehicleForm input[type="file"][name="licenseBack"]')
      .next(".error-message")
      .text("");
  }

  console.log("meka hari");

  return true;
}

function validateEmail(email) {
  console.log(email);
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

function deleteVehicle(id) {
  console.log(id);

  $("#deleteVehicleModal").modal("show");

  $("#confirmDelete").on("click", function () {
    // Find the index of the item with the matching ID in the data source
    const dataIndex = vehicleList.findIndex((item) => item.vehicleId === id);

    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(
      `http://localhost:8000/api/v1/vehicles/delete?id=${id}`,
      requestOptions
    )
      .then(function (response) {
        if (response.ok) {
          toastr.error("Vehicle deleted successfully");
        } else {
          toastr.info("Error when deleting");
          throw new Error("Network response was not ok");
        }
      })
      .then(function (data) {
        $("#deleteVehicleModal").modal("hide");
        console.log("Data Delete successfully:", data);
      })
      .catch(function (error) {
        toastr.info("Error when deleting");
        console.error("Error:", error);
      })
      .finally(function () {
        $("#deleteVehicleModal").modal("hide");
      });

    if (dataIndex !== -1) {
      // Remove the item from the data source
      guideList.splice(dataIndex, 1);

      // Remove the corresponding row from the table
      $(this).closest("tr").remove();

      // Close the delete confirmation modal
      $("#deleteVehicleModal").modal("hide");
    }
  });
}

const validateUpdateForm = () => {
  const brand = $('#updateVehicleForm input[name="brand"]').val();
  const seating = $('#updateVehicleForm input[name="seating"]').val();
  const dailyRate = $('#updateVehicleForm input[name="dailyRate"]').val();
  const vehicleNumber = $(
    '#updateVehicleForm input[name="vehicleNumber"]'
  ).val();
  const priceForKm = $('#updateVehicleForm input[name="priceForKm"]').val();
  const fuelConsumption = $(
    '#updateVehicleForm input[name="fuelConsumption"]'
  ).val();
  const name = $('#updateVehicleForm input[name="driverName"]').val();
  const contactNumber = $(
    '#updateVehicleForm input[name="contactNumber"]'
  ).val();
  const frontView = $(
    '#updateVehicleForm input[type="file"][name="frontView"]'
  )[0].files[0];
  const backView = $(
    '#updateVehicleForm input[type="file"][name="backView"]'
  )[0].files[0];
  const sideView = $(
    '#updateVehicleForm input[type="file"][name="sideView"]'
  )[0].files[0];
  const frontInt = $(
    '#updateVehicleForm input[type="file"][name="frontInt"]'
  )[0].files[0];
  const backInt = $('#updateVehicleForm input[type="file"][name="backInt"]')[0]
    .files[0];
  const licenseFront = $(
    '#updateVehicleForm input[type="file"][name="licenseFront"]'
  )[0].files[0];
  const licenseBack = $(
    '#updateVehicleForm input[type="file"][name="licenseBack"]'
  )[0].files[0];

  if (brand.trim() === "") {
    $('#updateVehicleForm input[name="brand"]')
      .next(".error-message")
      .text("Brand cannot be empty");
    $('#updateVehicleForm input[name="brand"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="brand"]').next(".error-message").text("");
  }

  if (seating.trim() === "" || isNaN(seating) || parseFloat(seating) < 3) {
    $('#updateVehicleForm input[name="seating"]')
      .next(".error-message")
      .text("Seating capacity is not valid | 3<");
    $('#updateVehicleForm input[name="seating"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="seating"]')
      .next(".error-message")
      .text("");
  }

  if (
    dailyRate.trim() === "" ||
    isNaN(dailyRate) ||
    parseFloat(dailyRate) < 0
  ) {
    $('#updateVehicleForm input[name="dailyRate"]')
      .next(".error-message")
      .text("Daily rate is not valid");
    $('#updateVehicleForm input[name="dailyRate"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="dailyRate"]')
      .next(".error-message")
      .text("");
  }

  if (vehicleNumber.trim() === "") {
    $('#updateVehicleForm input[name="vehicleNumber"]')
      .next(".error-message")
      .text("Vehicle number cannot be empty");
    $('#updateVehicleForm input[name="vehicleNumber"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="vehicleNumber"]')
      .next(".error-message")
      .text("");
  }

  if (
    priceForKm.trim() === "" ||
    isNaN(priceForKm) ||
    parseFloat(priceForKm) < 100
  ) {
    $('#updateVehicleForm input[name="priceForKm"]')
      .next(".error-message")
      .text("Price for km is not valid | 100<");
    $('#updateVehicleForm input[name="priceForKm"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="priceForKm"]')
      .next(".error-message")
      .text("");
  }

  if (
    fuelConsumption.trim() === "" ||
    isNaN(fuelConsumption) ||
    parseFloat(fuelConsumption) < 2
  ) {
    $('#updateVehicleForm input[name="fuelConsumption"]')
      .next(".error-message")
      .text("Fuel consumption is not valid | 2<");
    $('#updateVehicleForm input[name="fuelConsumption"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="fuelConsumption"]')
      .next(".error-message")
      .text("");
  }

  if (name.trim() === "") {
    $('#updateVehicleForm input[name="driverName"]')
      .next(".error-message")
      .text("Driver name cannot be empty");
    $('#updateVehicleForm input[name="driverName"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="driverName"]')
      .next(".error-message")
      .text("");
  }

  if (contactNumber.trim() === "") {
    $('#updateVehicleForm input[name="contactNumber"]')
      .next(".error-message")
      .text("Contact number cannot be empty");
    $('#updateVehicleForm input[name="contactNumber"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[name="contactNumber"]')
      .next(".error-message")
      .text("");
  }

  if (!frontView) {
    $('#updateVehicleForm input[type="file"][name="frontView"]')
      .next(".error-message")
      .text("Front view image is required");
    $('#updateVehicleForm input[type="file"][name="frontView"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="frontView"]')
      .next(".error-message")
      .text("");
  }

  if (!backView) {
    $('#updateVehicleForm input[type="file"][name="backView"]')
      .next(".error-message")
      .text("Back view image is required");
    $('#updateVehicleForm input[type="file"][name="backView"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="backView"]')
      .next(".error-message")
      .text("");
  }

  if (!sideView) {
    $('#updateVehicleForm input[type="file"][name="sideView"]')
      .next(".error-message")
      .text("Side view image is required");
    $('#updateVehicleForm input[type="file"][name="sideView"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="sideView"]')
      .next(".error-message")
      .text("");
  }

  if (!frontInt) {
    $('#updateVehicleForm input[type="file"][name="frontInt"]')
      .next(".error-message")
      .text("Front interior view image is required");
    $('#updateVehicleForm input[type="file"][name="frontInt"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="frontInt"]')
      .next(".error-message")
      .text("");
  }

  if (!backInt) {
    $('#updateVehicleForm input[type="file"][name="backInt"]')
      .next(".error-message")
      .text("Back interior view image is required");
    $('#updateVehicleForm input[type="file"][name="backInt"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="backInt"]')
      .next(".error-message")
      .text("");
  }

  if (!licenseFront) {
    $('#updateVehicleForm input[type="file"][name="licenseFront"]')
      .next(".error-message")
      .text("License front image is required");
    $('#updateVehicleForm input[type="file"][name="licenseFront"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="licenseFront"]')
      .next(".error-message")
      .text("");
  }

  if (!licenseBack) {
    $('#updateVehicleForm input[type="file"][name="licenseBack"]')
      .next(".error-message")
      .text("License back image is required");
    $('#updateVehicleForm input[type="file"][name="licenseBack"]').focus();
    return false;
  } else {
    $('#updateVehicleForm input[type="file"][name="licenseBack"]')
      .next(".error-message")
      .text("");
  }

  console.log("meka hari");

  return true;
};

function setData(id) {
  vehicleList.forEach((data) => {
    if (data.vehicleId === id) {
      $('#updateVehicleForm input[name="brand"]').val(data.brand);
      $('#updateVehicleForm input[name="seating"]').val(data.seatingCapacity);
      $('#updateVehicleForm input[name="dailyRate"]').val(data.dailyRate);
      $('#updateVehicleForm input[name="vehicleNumber"]').val(
        data.vehicleNumber
      );
      $('#updateVehicleForm input[name="priceForKm"]').val(data.priceForKm);
      $('#updateVehicleForm input[name="fuelConsumption"]').val(
        data.fuelConsumption
      );
      $('#updateVehicleForm input[name="driverName"]').val(data.name);
      $('#updateVehicleForm input[name="contactNumber"]').val(
        data.contactNumber
      );
      $('#updateVehicleForm input[name="hybrid"]').prop("checked", data.hybrid);
      $('#updateVehicleForm input[name="available"]').prop(
        "checked",
        data.available
      );
      $('#updateVehicleForm input[name="remarks"]').val(data.remarks);
    }
  });
}

function updateVehicle(id) {
  console.log(id);
  $("#updateVehicleModal").modal("show");
  setData(id);
  $("#updateVehicle").click(function (event) {
    console.log("update");
    if (validateUpdateForm()) {
      var formdata = new FormData();
      formdata.append(
        "brand",
        $('#updateVehicleForm input[name="brand"]').val()
      );
      formdata.append("transmissionType", $("#updateTransmission").val());
      formdata.append("category", $("#updateCategory").val());
      formdata.append("fuelType", $("#updateFuelType").val());
      formdata.append(
        "isAvailable",
        $('#updateVehicleForm input[name="available"]:checked').length > 0
      );
      formdata.append(
        "seatingCapacity",
        $('#updateVehicleForm input[name="seating"]').val()
      );
      formdata.append(
        "dailyRate",
        $('#updateVehicleForm input[name="dailyRate"]').val()
      );
      formdata.append("vehicleType", $("#updateVehicleType").val());
      formdata.append(
        "vehicleNumber",
        $('#updateVehicleForm input[name="vehicleNumber"]').val()
      );
      formdata.append(
        "priceForKm",
        $('#updateVehicleForm input[name="priceForKm"]').val()
      );
      formdata.append(
        "fuelConsumption",
        $('#updateVehicleForm input[name="fuelConsumption"]').val()
      );
      formdata.append(
        "isHybrid",
        $('#updateVehicleForm input[name="hybrid"]:checked').length > 0
      );
      formdata.append(
        "name",
        $('#updateVehicleForm input[name="driverName"]').val()
      );
      formdata.append(
        "contactNumber",
        $('#updateVehicleForm input[name="contactNumber"]').val()
      );
      formdata.append(
        "frontView",
        $('#updateVehicleForm input[type="file"][name="frontView"]')[0].files[0]
      );
      formdata.append(
        "backView",
        $('#updateVehicleForm input[type="file"][name="backView"]')[0].files[0]
      );
      formdata.append(
        "sideView",
        $('#updateVehicleForm input[type="file"][name="sideView"]')[0].files[0]
      );
      formdata.append(
        "frontInteriorView",
        $('#updateVehicleForm input[type="file"][name="frontInt"]')[0].files[0]
      );
      formdata.append(
        "backInteriorView",
        $('#updateVehicleForm input[type="file"][name="backInt"]')[0].files[0]
      );
      formdata.append(
        "license_front",
        $('#updateVehicleForm input[type="file"][name="licenseFront"]')[0]
          .files[0]
      );
      formdata.append(
        "license_back",
        $('#updateVehicleForm input[type="file"][name="licenseBack"]')[0]
          .files[0]
      );

      var requestOptions = {
        method: "PUT",
        body: formdata,
        redirect: "follow",
      };

      fetch(
        `http://localhost:8000/api/v1/vehicles/update?id=${id}`,
        requestOptions
      )
        .then(function (response) {
          if (response.ok) {
            toastr.success("Vehicle updated successfully");
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then(function (data) {
          console.log("Data sent successfully:", data);
        })
        .catch(function (error) {
          toastr.info("Error when updating");
          console.error("Error:", error);
        })
        .finally(function () {});
    }
  });
}
