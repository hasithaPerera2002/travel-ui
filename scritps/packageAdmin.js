let packageList;

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
    let packages = await fetch("http://localhost:8081/api/v1/package/all", requestOptions);

    if (packages.ok) {
        packages = await packages.json();
        packageList = packages.data;
        console.log(packageList);
    } else {
        console.log("error");
    }

    loadTable();

    $(".spinner-div").hide();
});

async function loadTable() {


    packageList.forEach((element) => {

        var innerHTML = `
    <tr>
    <td>${element.placeId}</td>
    <td>${element.videoUrl}</td>
    <td>${element.stars}</td>
    <td>${element.noOfPeople}</td>
    <td>${element.placeName}</td>
    <td ><img src="data:image/jpg;base64,${element.placeImage}" alt=""></td>
    <td>${element.packageType}</td>
   
    
                            <td class="d-flex">
      
                                <button  class="btn btn-warning p-1 m-1" onclick="updatePackage('${element.placeId}');">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                                
                               <button type="button" class="btn btn-danger p-1 m-1" onclick="deletePackage('${element.placeId}')">
                                       <i class="fa fa-trash-can"></i>
                                </button>
                            </td>
    </tr>
    `;

        $("#tbody").append(innerHTML);
    });
}


$('#addPackageButton').click(function (event) {

    event.preventDefault();

    if (validateForm()) {

        var formdata = new FormData();
        formdata.append("videoUrl", $('#addPackageForm input[name="videoUrl"]').val());
        formdata.append("placeName", $('#places').val());
        formdata.append("packageType", $('#category').val());
        formdata.append("noOfPeople", $('#addPackageForm input[name="votedCount"]').val());
        formdata.append("stars", $('#addPackageForm input[name="stars"]').val());
        formdata.append("placeImage", $('#addPackageForm input[type="file"][name="image"]')[0].files[0]);




        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:8081/api/v1/package/save", requestOptions)
            .then(function (response) {
                if (response.ok) {
                    toastr.success('Package added successfully')
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

        });
    }
});


function validateForm() {
    const url = $('#addPackageForm input[name="videoUrl"]').val();
    const voted = $('#addPackageForm input[name="votedCount"]').val();
    const stars = $('#addPackageForm input[name="stars"]').val();
    const file = $('#addPackageForm input[type="file"][name="image"]')[0].files[0];

    if (url.trim() === '') {
        $('#addPackageForm input[name="videoUrl"]').next('.error-message').text('Video url cannot be empty');
        $('#addPackageForm input[name="videoUrl"]').focus();
        return false;
    } else {
        $('#addPackageForm input[name="videoUrl"]').next('.error-message').text('');
    }

    if (voted.trim() === '' || isNaN(voted) || parseFloat(voted) < 0) {
        $('#addPackageForm input[name="votedCount"]').next('.error-message').text('Voted count is not valid');
        $('#addPackageForm input[name="votedCount"]').focus();
        return false;
    } else {
        $('#addPackageForm input[name="votedCount"]').next('.error-message').text('');
    }

    if (stars.trim() === '' || isNaN(stars) || parseFloat(stars) < 1 || parseFloat(stars) >= 6) {
        $('#addPackageForm input[name="stars"]').next('.error-message').text('Stars is not valid');
        $('#addPackageForm input[name="stars"]').focus();
        return false;
    } else {
        $('#addPackageForm input[name="stars"]').next('.error-message').text('');
    }

    if (!file) {
        $('#addPackageForm input[type="file"][name="image"]').next('.error-message').text('Image is required');
        $('#addPackageForm input[type="file"][name="image"]').focus();
        return false;
    }else {
        $('#addPackageForm input[type="file"][name="image"]').next('.error-message').text('');
    }


    console.log('meka hari')


    return true;
}

function validateEmail(email) {
    console.log(email)
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}


function deletePackage(id) {
    console.log(id)

    $('#deletePackageModal').modal('show');

    $('#confirmDelete').on('click', function () {
        // Find the index of the item with the matching ID in the data source
        const dataIndex = packageList.findIndex(item => item.placeId === id);

        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };

        fetch(`http://localhost:8081/api/v1/package/delete?id=${id}`, requestOptions)
            .then(function (response) {
                if (response.ok) {

                    toastr.error('Package deleted successfully')
                } else {
                    toastr.info('Error when deleting')
                    throw new Error('Network response was not ok');
                }
            })
            .then(function (data) {
                $('#deletePackageModal').modal('hide');
                console.log('Data Delete successfully:', data);
            })
            .catch(function (error) {
                toastr.info('Error when deleting')
                console.error('Error:', error);
            }).finally(function () {
            $('#deletePackageModal').modal('hide');
        });


        if (dataIndex !== -1) {
            // Remove the item from the data source
            guideList.splice(dataIndex, 1);

            // Remove the corresponding row from the table
            $(this).closest('tr').remove();

            // Close the delete confirmation modal
            $('#deletePackageModal').modal('hide');
        }
    });
}

const validateUpdateForm = () => {

    const url = $('#updatePackageForm input[name="videoUrl"]').val();
    const voted = $('#updatePackageForm input[name="votedCount"]').val();
    const stars = $('#updatePackageForm input[name="stars"]').val();
    const file = $('#updatePackageForm input[type="file"][name="image"]')[0].files[0];

    if (url.trim() === '') {
        $('#updatePackageForm input[name="videoUrl"]').next('.error-message').text('Video url cannot be empty');
        $('#updatePackageForm input[name="videoUrl"]').focus();
        return false;
    } else {
        $('#updatePackageForm input[name="videoUrl"]').next('.error-message').text('');
    }

    if (voted.trim() === '' || isNaN(voted) || parseFloat(voted) < 0) {
        $('#updatePackageForm input[name="votedCount"]').next('.error-message').text('Voted count is not valid');
        $('#updatePackageForm input[name="votedCount"]').focus();
        return false;
    } else {
        $('#updatePackageForm input[name="votedCount"]').next('.error-message').text('');
    }

    if (stars.trim() === '' || isNaN(stars) || parseFloat(stars) < 1 || parseFloat(stars) >= 6) {
        $('#updatePackageForm input[name="stars"]').next('.error-message').text('Stars is not valid');
        $('#updatePackageForm input[name="stars"]').focus();
        return false;
    } else {
        $('#updatePackageForm input[name="stars"]').next('.error-message').text('');
    }

    if (!file) {
        $('#updatePackageForm input[type="file"][name="image"]').next('.error-message').text('Image is required');
        $('#updatePackageForm input[type="file"][name="image"]').focus();
        return false;
    }else {
        $('#updatePackageForm input[type="file"][name="image"]').next('.error-message').text('');
    }

    console.log('meka hari')


    return true;

};

function setData(id) {


    packageList.forEach((data) => {
        if (data.placeId === id) {
            $('#updatePackageForm input[name="videoUrl"]').val(data.videoUrl);
            $('#updatePlaces').val(data.placeName);
            $('#updateCategory').val(data.packageType);
            $('#updatePackageForm input[name="votedCount"]').val(data.noOfPeople);
            $('#updatePackageForm input[name="stars"]').val(data.stars);
        }
    })

}

function updatePackage(id) {
    console.log(id)
    $('#updatePackageModal').modal('show');
    setData(id)
    $('#updatePackage').click(function (event) {
        console.log('update')
        if (validateUpdateForm()) {


            var formdata = new FormData();
            formdata.append("videoUrl", $('#updatePackageForm input[name="videoUrl"]').val());
            formdata.append("placeName", $('#updatePlaces').val());
            formdata.append("packageType", $('#updateCategory').val());
            formdata.append("noOfPeople", $('#updatePackageForm input[name="votedCount"]').val());
            formdata.append("stars", $('#updatePackageForm input[name="stars"]').val());
            formdata.append("placeImage", $('#updatePackageForm input[type="file"][name="image"]')[0].files[0]);

            var requestOptions = {
                method: 'PUT',
                body: formdata,
                redirect: 'follow'
            };

            fetch(`http://localhost:8081/api/v1/package/update?id=${id}`, requestOptions)
                .then(function (response) {
                    if (response.ok) {
                        toastr.success('Package updated successfully')
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
