function showSearch()
{
    var type = document.getElementById("type-select").value
    var startTime = document.getElementById("startTime-select").value
    var endtime = document.getElementById("endTime-select").value
    var location = document.getElementById("location-select").value
    var searchArea = document.getElementById("searchArea-select").value
    var latitude = document.getElementById("latitude-select").value
    var longitude = document.getElementById("longitude-select").value

    var result = document.getElementById("search")
    result.innerHTML = "Looking for " + type + " start time " + startTime + " etc."
}