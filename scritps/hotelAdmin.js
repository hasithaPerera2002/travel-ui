let hotelList;
let hotelId;


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
        method: 'GET',
        redirect: 'follow'
    };
    let hotels = await fetch("http://localhost:8082/api/v1/hotels/getAll", requestOptions);

    if (hotels.ok) {
        hotels = await hotels.json();
        hotelList = hotels.data;
        console.log(hotelList);
    } else {
        console.log("error");
    }

    loadTable();

    $(".spinner-div").hide();
});

async function loadTable() {


    hotelList.forEach((element) => {
        var innerHTML = `
    <tr>
    <td>${element.hotelId}</td>
    <td>${element.hotelName}</td>
    <td>${element.hotelEmail}</td>
    <td>${element.hotelAddress}</td>
    <td>${element.hotelContact1}</td>
    <td>${element.hotelContact2}</td>
    <td>${element.petAllowed}</td>
    <td>${element.cancelAllowed}</td>
    <td ><img src="data:image/jpg;base64,${element.hotelImage}" alt=""></td>
    <td>${element.category}</td>
    <td>${element.hotelStarRating}</td>
    <td>${element.doubleFullBoardPrice}</td>
    <td>${element.doubleHalfBoardPrice}</td>
    <td>${element.tripleFullBoardPrice}</td>
    <td>${element.tripleHalfBoardPrice}</td>
    <td>${element.longitude}</td>
    <td>${element.latitude}</td>
    <td>${element.placeName}</td>
                            <td class="d-flex">
      
                                <button  class="btn btn-warning p-1 m-1" onclick="updateHotel('${element.hotelId}');">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                                
                               <button type="button" class="btn btn-danger p-1 m-1" onclick="deleteHotel('${element.hotelId}')">
                                       <i class="fa fa-trash-can"></i>
                                </button>
                            </td>
    </tr>
    `;

        $("#tbody").append(innerHTML);
    });
}


$('#addHotelButton').click(function (event) {

    event.preventDefault();

    if (validateForm()) {

        var formdata = new FormData();
        formdata.append("hotelName", $('#hotelForm input[name="name"]').val());
        formdata.append("hotelAddress", $('#hotelForm input[name="address"]').val());
        formdata.append("hotelStarRating", $('#hotelForm input[name="rating"]').val());
        formdata.append("doubleFullBoardPrice", $('#hotelForm input[name="doubleFull"]').val());
        formdata.append("doubleHalfBoardPrice", $('#hotelForm input[name="doubleHalf"]').val());
        formdata.append("tripleFullBoardPrice", $('#hotelForm input[name="tripleFull"]').val());
        formdata.append("tripleHalfBoardPrice", $('#hotelForm input[name="tripleHalf"]').val());
        formdata.append("longitude", $('#hotelForm input[name="longitude"]').val());
        formdata.append("latitude", $('#hotelForm input[name="latitude"]').val());
        formdata.append("placeName", $('#places').val());
        formdata.append("cancelAllowed", $('input[name="cancelAllowed"]:checked').length > 0);
        formdata.append("petAllowed", $('input[name="petAllowed"]:checked').length > 0);
        formdata.append("hotelContact1", $('#hotelForm input[name="contact"]').val());
        formdata.append("hotelContact2", $('#hotelForm input[name="contact2"]').val());
        formdata.append("category", $('#category').val());
        formdata.append("hotelEmail", $('#hotelForm input[type="email"]').val());
        formdata.append("hotelImage", $('#hotelImage')[0].files[0]);

        for (var pair of formdata.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:8082/api/v1/hotels/save", requestOptions)
            .then(function (response) {
                if (response.ok) {
                    loadTable()
                    toastr.success('Hotel added successfully')
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(function (data) {


                console.log('Data sent successfully:', data);
            })
            .catch(function (error) {
                toastr.info('Error when adding')
                console.error('Error:', error);
            }).finally(function () {
            $('#addHotelModal').modal('hide');
        });
    }
});


function validateForm() {
    const val = $('#hotelForm input[name="rating"]').val();
    const email = $('#hotelForm  input[name="email"]').val();
    const name = $('#hotelForm input[name="name"]').val();
    const address = $('#address').val();
    const contact = $('#hotelForm input[name="contact"]').val();
    const contact2 = $('#hotelForm input[name="contact2"]').val();
    const doubleFull = $('#hotelForm input[name="doubleFull"]').val();
    const doubleHalf = $('#hotelForm input[name="doubleHalf"]').val();
    const tripleFull = $('#hotelForm input[name="tripleFull"]').val();
    const tripleHalf = $('#hotelForm input[name="tripleHalf"]').val();
    const longitude = $('#hotelForm input[name="longitude"]').val();
    const latitude = $('#hotelForm input[name="latitude"]').val();
    const places = $('#hotelForm input[name="places"]').val();
    const hotelImage = $('#hotelForm input[type="file"][name="hotelImage"]').val();
    const category = $('#category').val();

    console.log(val)

    if (name.trim() === '') {
        $('#hotelForm input[name="name"]').next('.error-message').text('Name cannot be empty');
        $('#hotelForm input[name="name"]').focus();
        return false;
    } else {
        $('#hotelForm input[name="name"]').next('.error-message').text('');
    }

    if (address.trim() === '') {
        $('#address').next('.error-message').text('Address cannot be empty');
        $('#address').focus();
        return false;
    } else {
        $('#address').next('.error-message').text('');
    }

    if (contact.trim() === '') {
        $('#hotelForm input[name="contact"]').next('.error-message').text('Contact cannot be empty');
        $('#hotelForm input[name="contact"]').focus();
        return false;
    } else {
        $('#hotelForm input[name="contact"]').next('.error-message').text('');
    }

    if (contact2.trim() === '') {
        $('#hotelForm input[name="contact2"]').next('.error-message').text('Contact cannot be empty');
        $('#hotelForm input[name="contact2"]').focus();
        return false;
    } else {
        $('#hotelForm input[name="contact2"]').next('.error-message').text('');
    }

    if (parseFloat(doubleFull) <= 0 || isNaN(doubleFull) || doubleFull.trim() === '') {
        $('#hotelForm input[name="doubleFull"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#hotelForm input[name="doubleFull"]').next('.error-message').text('');
    }

    if (parseFloat(doubleHalf) <= 0 || isNaN(doubleHalf) || doubleHalf.trim() === '') {
        $('#hotelForm input[name="doubleHalf"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#hotelForm input[name="doubleHalf"]').next('.error-message').text('');
    }

    if (parseFloat(tripleFull) < 0 || isNaN(tripleFull) || tripleFull.trim() === '') {
        $('#hotelForm input[name="tripleFull"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#hotelForm input[name="tripleFull"]').next('.error-message').text('');
    }

    if (parseFloat(tripleHalf) < 0 || isNaN(tripleHalf) || tripleHalf.trim() === '') {
        $('#hotelForm input[name="tripleHalf"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#hotelForm input[name="tripleHalf"]').next('.error-message').text('');
    }

    if (parseFloat(longitude) < 0 || isNaN(longitude) || longitude.trim() === '') {
        $('#hotelForm input[name="longitude"]').next('.error-message').text('Longitude is not valid');
        return false;
    } else {
        $('#hotelForm input[name="longitude"]').next('.error-message').text('');
    }

    if (parseFloat(latitude) < 0 || isNaN(latitude) || latitude.trim() === '') {
        $('#hotelForm input[name="latitude"]').next('.error-message').text('Latitude is not valid');
        return false;
    } else {
        $('#hotelForm input[name="latitude"]').next('.error-message').text('');
    }

    if (val.trim() === '' || isNaN(val) || parseFloat(val) < 0 || parseFloat(val) > 5) {
        $('#hotelForm input[name="rating"]').next('.error-message').text('Rating is not valid between 5 and 1');
        $('#hotelForm input[name="rating"]').focus();
        return false;
    } else {
        $('#hotelForm input[name="rating"]').next('.error-message').text('');
    }


    if (!hotelImage) {
        $('#hotelImage').next('.error-message').text('Hotel image is required');
        $('#hotelImage').focus();
        return false;
    } else {
        $('#hotelImage').next('.error-message').text('');
    }

    if (!validateEmail(email)) {
        console.log('email')
        $('#hotelForm input[type="email"]').next('.error-message').text('not a valid email');
        $('#hotelForm input[type="email"]').focus();
        return false;
    } else {
        console.log('email')
        $('#hotelForm input[type="email"]').next('.error-message').text('');
    }


    return true;
}

function validateEmail(email) {
    console.log(email)
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}


function deleteHotel(id) {
    console.log(id)

    $('#deleteHotelModal').modal('show');

    $('#confirmDelete').on('click', function () {
        // Find the index of the item with the matching ID in the data source
        const dataIndex = hotelList.findIndex(item => item.hotelId === id);

        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };

        fetch(`http://localhost:8082/api/v1/hotels/delete?id=${id}`, requestOptions)
            .then(function (response) {
                if (response.ok) {

                    toastr.error('Guide deleted successfully')
                } else {
                    toastr.info('Error when deleting')
                    throw new Error('Network response was not ok');
                }
            })
            .then(function (data) {
                $('#deleteHotelModal').modal('hide');
                console.log('Data Delete successfully:', data);
            })
            .catch(function (error) {
                toastr.info('Error when deleting')
                console.error('Error:', error);
            }).finally(function () {
            $('#deleteHoteleModal').modal('hide');
        });


        if (dataIndex !== -1) {
            // Remove the item from the data source
            guideList.splice(dataIndex, 1);

            // Remove the corresponding row from the table
            $(this).closest('tr').remove();

            // Close the delete confirmation modal
            $('#deleteHotelModal').modal('hide');
        }
    });
}

const validateUpdateForm = () => {

    const val = $('#updateHotelForm input[name="rating"]').val();
    const email = $('#updateHotelForm  input[type="email"]').val();
    const name = $('#updateHotelForm input[name="name"]').val();
    const address = $('#updateAddress').val();
    const contact = $('#updateHotelForm input[name="contact"]').val();
    const contact2 = $('#updateHotelForm input[name="contact2"]').val();
    const doubleFull = $('#updateHotelForm input[name="doubleFull"]').val();
    const doubleHalf = $('#updateHotelForm input[name="doubleHalf"]').val();
    const tripleFull = $('#updateHotelForm input[name="tripleFull"]').val();
    const tripleHalf = $('#updateHotelForm input[name="tripleHalf"]').val();
    const longitude = $('#updateHotelForm input[name="longitude"]').val();
    const latitude = $('#updateHotelForm input[name="latitude"]').val();
    const hotelImage = $('#updateHotelForm input[name="updateHotelImage"]')[0].files[0];



    if (name.trim() === '') {
        $('#updateHotelForm input[name="name"]').next('.error-message').text('Name cannot be empty');
        $('#updateHotelForm input[name="name"]').focus();
        return false;
    } else {
        $('#updateHotelForm input[name="name"]').next('.error-message').text('');
    }

    if (address.trim() === '') {
        $('#updateAddress').next('.error-message').text('Address cannot be empty');
        $('#updateAddress').focus();
        return false;
    } else {
        $('#updateAddress').next('.error-message').text('');
    }

    if (contact.trim() === '') {
        $('#updateHotelForm input[name="contact"]').next('.error-message').text('Contact cannot be empty');
        $('#updateHotelForm input[name="contact"]').focus();
        return false;
    } else {
        $('#updateHotelForm input[name="contact"]').next('.error-message').text('');
    }


    if (parseFloat(doubleFull) <= 0 || isNaN(doubleFull) || doubleFull.trim() === '') {
        $('#updateHotelForm input[name="doubleFull"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#updateHotelForm input[name="doubleFull"]').next('.error-message').text('');
    }


    if (parseFloat(doubleHalf) <= 0 || isNaN(doubleHalf) || doubleHalf.trim() === '') {
        $('#updateHotelForm input[name="doubleHalf"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#updateHotelForm input[name="doubleHalf"]').next('.error-message').text('');
    }

    if (parseFloat(tripleFull) < 0 || isNaN(tripleFull) || tripleFull.trim() === '') {
        $('#updateHotelForm input[name="tripleFull"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#updateHotelForm input[name="tripleFull"]').next('.error-message').text('');
    }



    if (parseFloat(tripleHalf) < 0 || isNaN(tripleHalf) || tripleHalf.trim() === '') {
        $('#updateHotelForm input[name="tripleHalf"]').next('.error-message').text('Price is not valid');
        return false;
    } else {
        $('#updateHotelForm input[name="tripleHalf"]').next('.error-message').text('');
    }

    if (parseFloat(longitude) < 0 || isNaN(longitude) || longitude.trim() === '') {
        $('#updateHotelForm input[name="longitude"]').next('.error-message').text('Longitude is not valid');
        return false;
    } else {
        $('#updateHotelForm input[name="longitude"]').next('.error-message').text('');
    }

    if (parseFloat(latitude) < 0 || isNaN(latitude) || latitude.trim() === '') {
        $('#updateHotelForm input[name="latitude"]').next('.error-message').text('Latitude is not valid');
        return false;
    } else {
        $('#updateHotelForm input[name="latitude"]').next('.error-message').text('');
    }

    if (val.trim() === '' || isNaN(val) || parseFloat(val) < 0 || parseFloat(val) > 5) {
        $('#updateHotelForm input[name="rating"]').next('.error-message').text('Rating is not valid between 5 and 1');
        $('#updateHotelForm input[name="rating"]').focus();
        return false;
    } else {
        $('#updateHotelForm input[name="rating"]').next('.error-message').text('');
    }
    console.log("fuck")

    if (!hotelImage) {
        $('#updateHotelForm input[name="updateHotelImage"]').next('.error-message').text('Hotel image is required');
        $('#updateHotelForm input[name="updateHotelImage"]').focus();
        return false;
    } else {
        $('#updateHotelForm input[name="updateHotelImage"]').next('.error-message').text('');
    }
    console.log("fuck")

    if (!validateEmail(email)) {
        console.log('email')
        $('#updateHotelForm input[type="email"]').next('.error-message').text('not a valid email');
        $('#updateHotelForm input[type="email"]').focus();
        return false;
    } else {
        console.log('email')
        $('#updateHotelForm input[type="email"]').next('.error-message').text('');
    }


    return true;


};

function setData(id) {


    hotelList.forEach((data) => {
        if (data.hotelId === id) {
            $('#updateHotelForm input[name="name"]').val(data.hotelName);
            $('#updateAddress').val(data.hotelAddress);
            $('#updateHotelForm input[name="rating"]').val(data.hotelStarRating);
            $('#updateHotelForm input[name="doubleFull"]').val(data.doubleFullBoardPrice);
            $('#updateHotelForm input[name="doubleHalf"]').val(data.doubleHalfBoardPrice);
            $('#updateHotelForm input[name="tripleFull"]').val(data.tripleFullBoardPrice);
            $('#updateHotelForm input[name="tripleHalf"]').val(data.tripleHalfBoardPrice);
            $('#updateHotelForm input[name="longitude"]').val(data.longitude);
            $('#updateHotelForm input[name="latitude"]').val(data.latitude);
            $('#updatePlaces').val(data.placeName);
            $('#updateHotelForm input[name="cancelAllowed"]').prop('checked', data.cancelAllowed);
            $('#updateHotelForm input[name="petAllowed"]').prop('checked', data.petAllowed);
            $('#updateHotelForm input[name="contact"]').val(data.hotelContact1);
            $('#updateHotelForm input[name="contact2"]').val(data.hotelContact2);
            $('#updateCategory').val(data.category);
            $('#updateHotelForm input[type="email"]').val(data.hotelEmail);
        }
    })

}

function updateHotel(id) {
    console.log(id)
    $('#updateHotelModal').modal('show');
    setData(id)
    $('#updateHotel').click(function (event) {
        console.log('update')
        if (validateUpdateForm()) {

            console.log('came here')

            var formdata = new FormData();
            formdata.append("hotelName", $('#updateHotelForm input[name="name"]').val());
            formdata.append("hotelAddress", $('#updateAddress').val());
            formdata.append("hotelStarRating", $('#updateHotelForm input[name="rating"]').val());
            formdata.append("doubleFullBoardPrice", $('#updateHotelForm input[name="doubleFull"]').val());
            formdata.append("doubleHalfBoardPrice", $('#updateHotelForm input[name="doubleHalf"]').val());
            formdata.append("tripleFullBoardPrice", $('#updateHotelForm input[name="tripleFull"]').val());
            formdata.append("tripleHalfBoardPrice", $('#updateHotelForm input[name="tripleHalf"]').val());
            formdata.append("longitude", $('#updateHotelForm input[name="longitude"]').val());
            formdata.append("latitude", $('#updateHotelForm input[name="latitude"]').val());
            formdata.append("placeName", $('#updatePlaces').val());
            formdata.append("cancelAllowed", $('input[name="cancelAllowed"]:checked').length > 0);
            formdata.append("petAllowed", $('input[name="petAllowed"]:checked').length > 0);
            formdata.append("hotelContact1", $('#updateHotelForm input[name="contact"]').val());
            formdata.append("hotelContact2", $('#updateHotelForm input[name="contact2"]').val());
            formdata.append("category", $('#updateCategory').val());
            formdata.append("hotelEmail", $('#updateHotelForm input[type="email"]').val());
            formdata.append("hotelImage", $('#updateHotelForm input[name="updateHotelImage"]')[0].files[0]);

            var requestOptions = {
                method: 'PUT',
                body: formdata,
                redirect: 'follow'
            };

            fetch(`http://localhost:8082/api/v1/hotels/update?id=${id}`, requestOptions)
                .then(function (response) {
                    if (response.ok) {
                        toastr.success('Guide updated successfully')
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then(function (data) {

                    console.log('Data sent successfully:', data);
                })
                .catch(function (error) {
                    toastr.info('Error when updating')
                    console.error('Error:', error);
                }).finally(function () {

            });
        }
    });
}
