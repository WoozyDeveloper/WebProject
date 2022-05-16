function showSearch() {
    var type = document.getElementById("type-select").value
    var startTime = document.getElementById("startTime-select").value
    var endTime = document.getElementById("endTime-select").value
    var coords = document.getElementById("coords").textContent
    var searchArea = document.getElementById("searchArea-select").value
    var latitude = document.getElementById("latInput").value
    var longitude = document.getElementById("longInput").value

    var result = document.getElementById("search")
    result.innerHTML = type + "," + startTime + "," + endTime + "," + coords + "," + searchArea + "," + latitude + "," + longitude
}

function showLongLat() {
    if (document.getElementById("latitudeSetting").style.display == "none") {
        document.getElementById("latitudeSetting").style.display = "block"
        document.getElementById("longitudeSetting").style.display = "block"
        document.getElementById("locationSetting").style.display = "none"
        document.getElementById("showLongLatSetting").textContent = "Click to use map"
    }
    else
    {
        document.getElementById("latitudeSetting").style.display = "none"
        document.getElementById("longitudeSetting").style.display = "none"
        document.getElementById("locationSetting").style.display = "block"
        document.getElementById("showLongLatSetting").textContent = "Click to input coordinates manually"
    }
    document.getElementById("latInput").value = null
    document.getElementById("longInput").value = null
    document.getElementById("coords").textContent = ""
}
