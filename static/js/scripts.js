function getUserName(id) {

    let url = "/api/user/" + id;


    $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function (data) {
            let d = new Date();
            d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
            document.cookie = "UserName=" + data["name"] + " " + data["lastName"] + "; expires=" + d + "; path=/";
        }
    });
}

function getUserNameAndId(id) {
    let url = "/api/user/" + id;


    $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function (data) {
            if (data) {
                let d = new Date();
                d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
                document.cookie = "UserName=" + data.name + " " + data.lastName + "; expires=" + d + "; path=/";
                document.cookie = "UserId=" + id + "; expires=" + d + "; path=/";


                let odmik = document.cookie.indexOf("LocationId") + 11;
                // odmik je 10, ker zgornja funkcije vrne -1 in na koncu dodamo 11
                if (odmik == 10) window.location.href = "/";
                else {
                    let locationId = document.cookie.substring(odmik);
                    odmik = locationId.indexOf(";");
                    if (odmik != -1) locationId = locationId.substring(0, odmik);

                    window.location.href = "/dodaj/" + locationId;
                }
            } else {
                alert("ID ne obstatja!");
            }
        }
    });
}



function odhod(idRazlog) {
    let odmik = document.cookie.indexOf("UserId") + 7;
    let userId = document.cookie.substring(odmik);
    odmik = userId.indexOf(";");
    if(odmik != -1) userId = userId.substring(0, odmik);


    odmik = document.cookie.indexOf("LocationId") + 11;
    let locationId = document.cookie.substring(odmik);
    odmik = locationId.indexOf(";");
    if (odmik != -1) locationId = locationId.substring(0, odmik);


    let obj = {
        "idUsers": userId,
        "idLocations": locationId,
        "idLogType": idRazlog
    }

    let url = "/api/log";

    $.ajax({
        type: "POST",
        url: url,
        data: obj,
        success: function (data) {
            window.location.href = '/uspeh'
        },
        error: function(err) {
            alert("Prislo je do napake, poskusite ponovno!");
            console.log(err);
        }
    });
}

$(document).ready(function() {


    $("#registracija-cta").click(function () {
        let name = $("#prijava-ime").val();
        let lastName = $("#prijava-priimek").val();
    
        if (name.length == 0 || lastName.length == 0) {
            alert("Vpisite ime in priimek!");
        } else {

            let obj = {
                name: name,
                lastName: lastName
            }


            let url = "/api/user/generate";
    
            let id;
    
            $.ajax({
                type: "POST",
                url: url,
                data: obj,
                success: function (data) {
                    let d = new Date();
                    d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
                    document.cookie = "UserId=" + data["idUsers"] + "; expires=" + d + "; path=/";
                    document.cookie = "UserName=" + data["name"] + " " + data["lastName"] + "; expires=" + d + "; path=/";
    
                    let odmik = document.cookie.indexOf("LocationId") + 11;
                    // odmik je 10, ker zgornja funkcije vrne -1 in na koncu dodamo 11
                    if (odmik == 10) window.location.href = "/";
                    else {
                        let locationId = document.cookie.substring(odmik);
                        odmik = locationId.indexOf(";");
                        if (odmik != -1) locationId = locationId.substring(0, odmik);
    
                        window.location.href = "/logiranje/dodaj/" + locationId;
                    }
                },
                error: function (err) {
                    alert("Prislo je do napake, poskusite ponovno!");
                    console.log(err)
                }
            });
        }
    })
    
    
    $("#odhod-konec").click(function () {
        odhod(1);
    })
    $("#odhod-malica").click(function () {
        odhod(2);
    })
    $("#odhod-sluzbeni").click(function () {
        odhod(3);
    })
    
    
    $("#prijava-cta").click(function () {
        let id = $("#prijava-id").val();
    
        if (id.match(/\d{6}/)) {
            getUserNameAndId(id);
        } else {
            alert("ID je sestavljen iz 6 številk!");
        }
    })
    
    $("#odjava-cta").click(function () {
        document.cookie = "UserName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
        window.location.href = "/";
    })
    
    
    
    
    
    $("#user-pic").click(function () {
        let odmik = document.cookie.indexOf("UserId") + 7;
        if (odmik > 6) {
            let userId = document.cookie.substring(odmik);
            odmik = userId.indexOf(";");
            if (odmik != -1) userId = userId.substring(0, odmik);
    
            let userName;
            odmik = document.cookie.indexOf("UserName") + 9;
            if (odmik == 8) {
                getUserName(userId);
                odmik = document.cookie.indexOf("UserName") + 9;
            }
            userName = document.cookie.substring(odmik);
            odmik = userName.indexOf(";");
            if (odmik != -1) userName = userName.substring(0, odmik);
    
            $('#menu-id').text(userId);
            $('#menu-user').text(userName);
    
            $("#user-info-signed").removeClass("hidden");
        } else {
            $("#user-info-unsigned").removeClass("hidden");
        }
    
    
        $("#arrow-right").removeClass("hidden");
        $("#arrow-left").removeClass("hidden");
    });
    $("body").click(function (e) {
        if (!e.target.classList.contains("no-close")) {
            $("#user-info-signed").addClass("hidden");
            $("#user-info-unsigned").addClass("hidden");
            $("#arrow-right").addClass("hidden");
            $("#arrow-left").addClass("hidden");
        }
    });
    

});

