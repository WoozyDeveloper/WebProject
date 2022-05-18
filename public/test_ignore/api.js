function showEvents() {
    var events = document.getElementById("events")
    fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
        .then((response) => response.json())
        .then((data) => {
            
            for(let i=0;i<5;i++)
            {
                let lat = data.items[i].lat
                let long = data.items[i].long
                let event = document.createElement("div")
                event.innerHTML = `<p>Event ${i}: lat = ${lat}, long = ${long}`
                events.append(event)
            }
            
        }


        );
}