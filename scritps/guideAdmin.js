let guideList;
let guidId;


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

    let guides = await fetch(`http://localhost:8085/api/v1/guide/all`, {
        method: "GET",
        headers: {},
        cors: "no-cors",
    });

    if (guides.ok) {
        guides = await guides.json();
        guideList = guides.data;
        console.log(guideList);
    } else {
        console.log("error");
    }

    loadTable();

    $(".spinner-div").hide();
});

async function loadTable() {


    guideList.forEach((element) => {
        var innerHTML = `
    <tr>
    <td>${element.guideId}</td>
    <td>${element.guideName}</td>
    <td>${element.guideEmail}</td>
    <td>${element.guideAddress}</td>
    <td>${element.guideAge}</td>
    <td>${element.guideContact}</td>
    <td ><img src="data:image/jpg;base64,${element.guideImage}" alt=""></td>
    <td><img src="data:image/jpg;base64,${element.guide_id_front_image}" alt=""></td> 
    <td><img src="data:image/jpg;base64,${element.guide_id_back_image}" alt=""></td>
    <td><img src="data:image/jpg;base64,${element.nic_front_image}" alt=""></td>
    <td><img src="data:image/jpg;base64,${element.nic_back_image}" alt=""></td>
    <td>${element.guideGender}</td>
    <td>${element.val_per_day}</td>
    <td>${element.available}</td>
    <td>${element.experience}</td>
                            <td class="d-flex">
      
                                <button type="button" class="btn btn-warning p-1 m-1" onclick="updateGuide('${element.guideId}');">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                                
                               <button type="button" class="btn btn-danger p-1 m-1" onclick="deleteGuide('${element.guideId}')">
                                       <i class="fa fa-trash-can"></i>
                                </button>
                            </td>
    </tr>
    `;

        $("#tbody").append(innerHTML);
    });
}

function setGuideId(id) {
    console.log(id)
    console.log('j')
    guidId = id;
}

$('#addGuideButton').click(function (event) {


    if (validateForm()) {

        var formdata = new FormData();
        formdata.append("guideName", $('#guideForm input[name="name"]').val());
        formdata.append("guideAddress", $('#addAddress').val());
        formdata.append("guideContact", $('#guideForm input[name="contact"]').val());
        formdata.append("guideEmail", $('#guideForm input[type="email"]').val());
        formdata.append("guideAge", $('input[name="age"]').val());
        formdata.append("guideGender", $('#genderSelect').val());
        formdata.append("val_per_day", $('#guideForm input[name="ValuePerDay"]').val());
        formdata.append("isAvailable", $('#availabilitySelect').val());
        formdata.append("experience", $('#guideForm input[name="exp"]').val());
        formdata.append("guideImage", $('#addGuideImage')[0].files[0]);
        formdata.append("nic_front_image", $('#addGuideNicFront')[0].files[0]);
        formdata.append("nic_back_image", $('#addGuideNicBack')[0].files[0]);
        formdata.append("guide_id_front_image", $('#addGuideIdFront')[0].files[0]);
        formdata.append("guide_id_back_image", $('#addGuideIdBack')[0].files[0]);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:8085/api/v1/guide/save", requestOptions)


            .then(function (response) {
                if (response.ok) {
                    loadTable()
                    toastr.success('Guide added successfully')
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(function (data) {
                $('#addGuideModal').modal('hide');

                console.log('Data sent successfully:', data);
            })
            .catch(function (error) {
                toastr.info('Error when adding')
                console.error('Error:', error);
            }).finally(function () {
            $('#addGuideModal').modal('hide');
        });
    }
});


function validateForm() {
    var name = $('#guideForm input[name="name"]').val();
    var age = $('#guideForm input[name="age"]').val();
    var email = $('#guideForm input[type="email"]').val();
    var address = $('#guideForm textarea').val();
    var contact = $('#guideForm input[type="tel"]').val();
    var guideImage = $('#guideForm input[type="file"][name="GuideImage"]').val();
    var guideIdFront = $('#guideForm input[type="file"][name="GuideIdFront"]').val();
    var guideIdBack = $('#guideForm input[type="file"][name="GuideIdBack"]').val();
    var guideNicFront = $('#guideForm input[type="file"][name="GuideNicFront"]').val();
    var guideNicBack = $('#guideForm input[type="file"][name="GuideNicBack"]').val();
    var valuePerDay = $('#guideForm input[type="number"][name="ValuePerDay"]').val();

    console.log(name, email, address, contact, guideImage, guideIdFront, guideIdBack, guideNicFront, guideNicBack, valuePerDay)

    if (name.trim() === '') {
        $('#addName').next('.error-message').text('Name cannot be empty');
        $('#addName').focus();
        return false;
    } else {
        $('#addName').next('.error-message').text('');
    }

    if (address.trim() === '') {
        $('#addAddress').next('.error-message').text('Address cannot be empty');
        $('#addAddress').focus();
        return false;
    } else {
        $('#addAddress').next('.error-message').text('');
    }

    if (contact.trim() === '') {
        $('#addTel').next('.error-message').text('Contact cannot be empty');
        $('#addTel').focus();
        return false;
    } else {
        $('#addTel').next('.error-message').text('');
    }

    if (parseFloat(age) <= 0 || isNaN(age)) {
        $('#addAge').next('.error-message').text('Age is not valid');
        return false;
    } else {
        $('#addAge').next('.error-message').text('');
    }
    if (!validateEmail(email)) {
        $('#addEmail').next('.error-message').text('Email is not valid');
        $('#addEmail').focus();
        return false;
    } else {
        $('#addEmail').next('.error-message').text('');
    }


    if (!guideImage) {
        $('#addGuideImage').next('.error-message').text('Guide image is required');
        $('#addGuideImage').focus();
        return false;
    } else {
        $('#addGuideImage').next('.error-message').text('');
    }

    if (isNaN(valuePerDay) || parseFloat(valuePerDay) <= 0) {
        $('#addValuePerDay').next('.error-message').text('Value per day is not valid');
        $('#addValuePerDay').focus();
        return false;
    } else {
        $('#addValuePerDay').next('.error-message').text('');
    }

    if (!guideIdFront) {
        $('#addGuideIdFront').next('.error-message').text('Guide ID front image is required');
        $('#addGuideIdFront').focus();
        return false;
    } else {
        $('#addGuideIdFront').next('.error-message').text('');
    }

    if (!guideIdBack) {
        $('#addGuideIdBack').next('.error-message').text('Guide ID back image is required');
        $('#addGuideIdBack').focus();
        return false;
    }
    {
        $('#addGuideIdBack').next('.error-message').text('');
    }

    if (!guideNicFront) {
        $('#addGuideNicFront').next('.error-message').text('Guide NIC front image is required');
        $('#addGuideNicFront').focus();
        return false;
    } else {
        $('#addGuideNicFront').next('.error-message').text('');
    }

    if (!guideNicBack) {
        $('#addGuideNicBack').next('.error-message').text('Guide NIC back image is required');
        $('#addGuideNicBack').focus();
        return false;
    } else {
        $('#addGuideNicBack').next('.error-message').text('');
    }

    return true;
}

function validateEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}


function deleteGuide(id) {
    console.log(id)

    $('#deleteGuideModal').modal('show');

    $('#confirmDelete').on('click', function () {
        // Find the index of the item with the matching ID in the data source
        const dataIndex = guideList.findIndex(item => item.guidId === id);

        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };

        fetch(`http://localhost:8085/api/v1/guide/delete?id=${id}`, requestOptions)
            .then(function (response) {
                if (response.ok) {

                    toastr.error('Guide deleted successfully')
                } else {
                    toastr.info('Error when deleting')
                    throw new Error('Network response was not ok');
                }
            })
            .then(function (data) {
                $('#deleteGuideModal').modal('hide');
                console.log('Data Delete successfully:', data);
            })
            .catch(function (error) {
                toastr.info('Error when deleting')
                console.error('Error:', error);
            }).finally(function () {
            $('#deleteGuideModal').modal('hide');
        });


        if (dataIndex !== -1) {
            // Remove the item from the data source
            guideList.splice(dataIndex, 1);

            // Remove the corresponding row from the table
            $(this).closest('tr').remove();

            // Close the delete confirmation modal
            $('#deleteGuideModal').modal('hide');
        }
    });
}

const validateUpdateForm = () => {
    var name = $('#updateGuideForm input[name="name"]').val();
    var age = $('#updateGuideForm input[name="age"]').val();
    var email = $('#updateGuideForm input[type="email"]').val();
    var address = $('#updateGuideForm textarea').val();
    var contact = $('#updateGuideForm input[type="tel"]').val();
    var guideImage = $('#updateGuideForm input[type="file"][name="GuideImage"]').val();
    var guideIdFront = $('#updateGuideForm input[type="file"][name="GuideIdFront"]').val();
    var guideIdBack = $('#updateGuideForm input[type="file"][name="GuideIdBack"]').val();
    var guideNicFront = $('#updateGuideForm input[type="file"][name="GuideNicFront"]').val();
    var guideNicBack = $('#updateGuideForm input[type="file"][name="GuideNicBack"]').val();
    var valuePerDay = $('#updateGuideForm input[type="number"][name="ValuePerDay"]').val();


    console.log(name, email, address, contact, guideImage, guideIdFront, guideIdBack, guideNicFront, guideNicBack, valuePerDay)

    if (name.trim() === '') {
        $('#updateGuideForm input[name="name"]').next('.error-message').text('Name cannot be empty');
        $('#updateGuideForm input[name="name"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[name="name"]').next('.error-message').text('');
    }

    if (address.trim() === '') {
        $('#updateGuideForm textarea').next('.error-message').text('Address cannot be empty');
        $('#updateGuideForm textarea').focus();
        return false;
    } else {
        $('#updateGuideForm textarea').next('.error-message').text('');
    }

    if (contact.trim() === '') {
        $('#updateGuideForm input[type="tel"]').next('.error-message').text('Contact cannot be empty');
        $('#updateGuideForm input[type="tel"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="tel"]').next('.error-message').text('');
    }

    if (parseFloat(age) <= 0 || isNaN(age)) {
        $('#updateGuideForm input[name="age"]').next('.error-message').text('Age is not valid');
        return false;
    } else {
        $('#updateGuideForm input[name="age"]').next('.error-message').text('');
    }
    if (!validateEmail(email)) {
        $('#updateGuideForm input[type="email"]').next('.error-message').text('Email is not valid');
        $('#updateGuideForm input[type="email"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="email"]').next('.error-message').text('');
    }


    if (!guideImage) {
        $('#updateGuideForm input[type="file"][name="GuideImage"]').next('.error-message').text('Guide image is required');
        $('#updateGuideForm input[type="file"][name="GuideImage"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="file"][name="GuideImage"]').next('.error-message').text('');
    }

    if (isNaN(valuePerDay) || parseFloat(valuePerDay) <= 0) {
        $('#updateGuideForm input[type="number"][name="ValuePerDay"]').next('.error-message').text('Value per day is not valid');
        $('#updateGuideForm input[type="number"][name="ValuePerDay"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="number"][name="ValuePerDay"]').next('.error-message').text('');
    }

    if (!guideIdFront) {
        $('#updateGuideForm input[type="file"][name="GuideIdFront"]').next('.error-message').text('Guide ID front image is required');
        $('#updateGuideForm input[type="file"][name="GuideIdFront"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="file"][name="GuideIdFront"]').next('.error-message').text('');
    }

    if (!guideIdBack) {
        $('#updateGuideForm input[type="file"][name="GuideIdBack"]').next('.error-message').text('Guide ID back image is required');
        $('#updateGuideForm input[type="file"][name="GuideIdBack"]').focus();
        return false;
    }
    {
        $('#updateGuideForm input[type="file"][name="GuideIdBack"]').next('.error-message').text('');
    }

    if (!guideNicFront) {
        $('#updateGuideForm input[type="file"][name="GuideNicFront"]').next('.error-message').text('Guide NIC front image is required');
        $('#updateGuideForm input[type="file"][name="GuideNicFront"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="file"][name="GuideNicFront"]').next('.error-message').text('');
    }

    if (!guideNicBack) {
        $('#updateGuideForm input[type="file"][name="GuideNicBack"]').next('.error-message').text('Guide NIC back image is required');
        $('#updateGuideForm input[type="file"][name="GuideNicBack"]').focus();
        return false;
    } else {
        $('#updateGuideForm input[type="file"][name="GuideNicBack"]').next('.error-message').text('');
    }

    return true;

};

function setData(id) {


    guideList.forEach((element) => {
        if (element.guideId === id) {
            $('#updateGuideForm input[name="name"]').val(element.guideName);
            $('#updateAddress').val(element.guideAddress);
            $('#updateGuideForm input[name="contact"]').val(element.guideContact);
            $('#updateGuideForm input[type="email"]').val(element.guideEmail);
            $('#updateGuideForm input[name="age"]').val(element.guideAge);
            $('#updateGuideForm input[name="ValuePerDay"]').val(element.val_per_day);
            $('#updateGuideForm input[name="available"]').val(element.isAvailable);
            $('#updateGuideForm input[name="exp"]').val(element.experience);
            $('#updateGuideForm input[name="gender"]').val(element.guideGender);

        }
    })

}

function updateGuide(id) {
    console.log(id)
    $('#updateGuideModal').modal('show');
    setData(id)
    $('#updateGuide').click(function (event) {
        if (validateUpdateForm()) {


            var formdata = new FormData();
            formdata.append("guideName", $('#updateGuideForm input[name="name"]').val());
            formdata.append("guideAddress", $('#updateAddress').val());
            formdata.append("guideContact", $('#updateGuideForm input[name="contact"]').val());
            formdata.append("guideEmail", $('#updateGuideForm input[type="email"]').val());
            formdata.append("guideAge", $('#updateGuideForm input[name="age"]').val());
            formdata.append("guideGender", "MALE");
            formdata.append("val_per_day", $('#updateGuideForm input[name="ValuePerDay"]').val());
            formdata.append("isAvailable", $('#updateGuideForm input[name="available"]').val());
            formdata.append("experience", $('#updateGuideForm input[name="exp"]').val());
            formdata.append("guideImage", $('#updateGuideForm input[name="GuideImage"]')[0].files[0]);
            formdata.append("nic_front_image", $('#updateGuideForm input[name="GuideNicFront"]')[0].files[0]);
            formdata.append("nic_back_image", $('#updateGuideForm input[name="GuideNicBack"]')[0].files[0]);
            formdata.append("guide_id_front_image", $('#updateGuideForm input[name="GuideIdFront"]')[0].files[0]);
            formdata.append("guide_id_back_image", $('#updateGuideForm input[name="GuideIdBack"]')[0].files[0]);

            var requestOptions = {
                method: 'PUT',
                body: formdata,
                redirect: 'follow'
            };

            fetch(`http://localhost:8085/api/v1/guide/update?id=${id}`, requestOptions)
                .then(function (response) {
                    if (response.ok) {
                        toastr.success('Guide updated successfully')
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then(function (data) {
                    $('#updateGuideModal').modal('hide');
                    console.log('Data sent successfully:', data);
                })
                .catch(function (error) {
                    toastr.info('Error when updating')
                    console.error('Error:', error);
                }).finally(function () {
                $('#updateGuideModal').modal('hide');
            });
        }
    });
}
