var modalWindow;
        var closeButton = document.getElementById("closeButton");
        var settingsButtons = document.getElementsByClassName("settingsButton");
        var clickedOnButton = 0;

        //0-location,1-timeline,2-advanced

        settingsButtons[0].onclick = function () {
            modalWindow = document.getElementById("modalWindowLocation");
            modalWindow.style.display = "block";
            clickedOnButton = 1;
        }

        settingsButtons[1].onclick = function () {
            modalWindow = document.getElementById("modalWindowTimeLine");
            modalWindow.style.display = "block";
            clickedOnButton = 1;
        }

        settingsButtons[2].onclick = function () {
            modalWindow = document.getElementById("modalWindowAdvanced");
            modalWindow.style.display = "block";
            clickedOnButton = 1;
        }

        closeButton.onclick = function () {
            modalWindow.style.display = "none";
        }

        window.onclick = function (event) {
            if (modalWindow != null) {
                if (event.target.id !== "settingsContent" && clickedOnButton == 0 && modalWindow.style.display === "block") {
                    modalWindow.style.display = "none";
                }
                else clickedOnButton = 0;
            }
        }