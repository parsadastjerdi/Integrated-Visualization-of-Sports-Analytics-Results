function showData() {
        document.getElementById('hiddenText').style.display="block";

        document.getElementById('chosenSport').innerHTML = document.getElementById("sport").value;
        document.getElementById('chosenLeague').innerHTML = document.getElementById("league").value;
        document.getElementById('chosenTeam').innerHTML = document.getElementById("team").value;
        document.getElementById('chosenSeason').innerHTML = document.getElementById("season").value;
        document.getElementById('chosenGame').innerHTML = document.getElementById("game").value;
        document.getElementById('chosenChart').innerHTML = document.getElementById("chart").value;
        document.getElementById('chosenAxes').innerHTML = document.getElementById("axes").value;
}