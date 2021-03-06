/* *****************************************************************
Description:

Methods:
    displayStats:
    plot:
    generateChart:

Dependencies:
    resources.js
    RestCaller.js
    utils.js
    charts/bubble.js
    charts/default.js

***************************************************************** */

/*
Description:
    Plots the rollup function on the team analytics page
Args:
    json:
    nullValues:
Returns:
*/
function plotRollup(json, nullValues) {
    chartType = document.getElementById("chartType").value;
    console.log(chartType)
    var mainCanvas = document.getElementById("mainChart").getContext('2d');
    var secondCanvas = document.getElementById("secondChart").getContext('2d');

    switch (chartType){
        case "bubble": 
            window.chart1 = plotBubble(json, mainCanvas);
            window.chart2 = plotBubble(nullValues, secondCanvas);
            break;
        case "scatter": 
            window.chart1 = plotScatter(json, mainCanvas);
            window.chart2 = plotScatter(nullValues, secondCanvas);
            break;
        case "line": 
            window.chart1 = plotLineChart(json, mainCanvas);
            window.chart2 = plotLineChart(nullValues, secondCanvas);
            break; // create plotLine(json) function
        default:
            break;
    }
}


/*
Description:
    Plots cube data on team analytics page
Args:
    json:
    nullValues:
    nullValues1:
Returns:
*/
function plotCube(json, nullValues, nullValues1) {
    chartType = document.getElementById("chartType").value;
    // console.log(chartType)

    var mainCanvas = document.getElementById("mainChart").getContext('2d');
    var secondCanvas = document.getElementById("secondChart").getContext('2d');
    var thirdCanvas = document.getElementById("thirdChart").getContext('2d');

    console.log('Null Values:');
    console.log(nullValues);
    console.log('Null Values 1:');
    console.log(nullValues1);

    switch (chartType){
        case "bubble": 
            window.chart1 = plotBubble(json, mainCanvas);
            window.chart2 = plotBubble(nullValues, secondCanvas);
            window.chart3 = plotBubble(nullValues1, thirdCanvas);
            break;

        case "scatter": 
            window.chart1 = plotScatter(json, mainCanvas);
            window.chart2 = plotScatter(nullValues, secondCanvas);
            window.chart3 = plotScatter(nullValues1, thirdCanvas);
            break;

        case "line": 
            window.chart1 = plotLineChart(json, mainCanvas);
            window.chart2 = plotLineChart(nullValues, secondCanvas);
            window.chart3 = plotLineChart(nullValues1, thirdCanvas);
            break; // create plotLine(json) function

        default:
            break;
    }
}

/* 
Description:
   This function will plot the chart on the player analytics page
Args:
Returns:
*/
function plotChart() {
    document.getElementById('mainChart').style.display="none";

    var sport = document.getElementById("sport").value;
    var league = document.getElementById("league").value;
    var team = document.getElementById("team").value;
    var season = document.getElementById("season").value;
    var match  = document.getElementById("game").value;
    var factatt = $("#factAttribute").val();
    
    var temp = match.split(' (')[0];
    var teamNames = temp.split(' vs ');
    
    // Only have aggregration style for team analytics
    if (window.location.pathname =="/CubeRollupMock.html") {
        var aggregstyle = document.getElementById("aggregationStyle").value;
    }

    var parameters = [["sports", sport], ["league", league], ["team", team], ["season", season], ["match", match],["aggregstyle", aggregstyle], ["factatt", factatt]];
    console.log(parameters);

    var token = getRestResource("TokenResource", parameters);
    var data = null;
    
    if(window.chart != null) { 
    window.chart.forEach(function(item)
    {
        item.destroy();
    });
    window.chart=new Array();
    }
    else
    {
        window.chart=new Array();
    }

    
    for (var it in factatt)
    {
        var canvasID = "mainChart".concat(String(it));
        var canvas = document.getElementById(canvasID);
        canvas.style.display="block";
        // Error checking for invalid combinations
        if (sport == "null" || league == "null" || team == "null" || season == "null" || match == "null" || factatt == "null" || aggregstyle == "null") {
            // Print error message and destroy chart
            document.getElementById("errorMessage").innerHTML = "Invalid Combination";
            //window.chart.destroy();
            //document.getElementById('mainChart').destroy();

        } else {
            document.getElementById("errorMessage").innerHTML = "";
        }


        // Get the data for the specific attribute selected
        if (sport == "Soccer"){
            data = getSoccerAttributeData(factatt[it], token);
            console.log("Got soccer attributes");
            console.log(data);

        } else if (sport == "Basketball"){
            data = getBasketballAttributeData(factatt[it], token);
            console.log("Got basketball attributes");
            console.log(data);

        } else {
            console.log("Invalid sport selection");
            return;
        }

        var label = factatt[it];

        // Plot a specific chart based on the one selected in the
        chartType = document.getElementById("chartType").value;

        switch (chartType) {
            case ("bubble"):
                // plotBubble(data);
                break;

            case ("line"):
                //plotLineChart(data);
                console.log(data);
                window.chart.push(plotDefault('line', teamNames[0], teamNames[1], Array(data[0]), Array(data[1]), label, canvas));
                break;

            case ("scatter"):
                // plotScatter(data);
                break;

            case ("bar"):
                // plotBarChart(data);
                console.log(data);
                if (data == null){
                    window.chart.push(plotDefault('bar', teamNames[0], teamNames[1], Array(0), Array(0), label, canvas));
                } else {
                    window.chart.push(plotDefault('bar', teamNames[0], teamNames[1], Array(data[0]), Array(data[1]), label, canvas));
                }
                break;
        case ("radar"):
            // plotRadar(data);
            console.log(data);
            window.chart.push(plotDefault('radar', teamNames[0], teamNames[1], Array(data[0]), Array(data[1]), label), canvas);
            break;

        case ("pie"):
            console.log(data);
            window.chart.push(plotPie(teamNames[0], teamNames[1], Array(data[0]), Array(data[1]), label, canvas, chartType));
            break;
        case ("doughnut"):
            console.log(data);
            window.chart.push(plotPie(teamNames[0], teamNames[1], Array(data[0]), Array(data[1]), label, canvas, chartType));
            break;

            default:
                break;
        }
        
    }
}

/*
  Description:
    This function should take all the selected attributes and return an array with all the data formatted
  Args:
  Returns:
  Raises:
  Notes:
*/
function getSoccerAttributeData(attribute, token){
  console.log("Attribute: " + attribute);

  switch (attribute){
    case ("goals"):
        var score = getRestResource("ScoreRestResource", [["token", token["token"]], ]);
        return score["score"]; // add index

   case ("corners"):
        var corners = getRestResource("CornerStatRestResource", [["token", token["token"]], ]);
        return corners["corners"]; // add index
   
    case ("ballPossession"):
        var ballPossession = getRestResource("BallPossessionStatResource", [["token", token["token"]], ]);
        return ballPossession["possession"];

    case ("yellowCards"):
        var yellowCards = getRestResource("YellowCardsStatResource", [["token", token["token"]], ]);
        return yellowCards["yellowCards"]; // add index

    case ("redCards"):
        var redCards = getRestResource("RedCardsStatResource", [["token", token["token"]], ]);
        return redCards["redCards"]; // add index

    case ("cornerStats"):
        var cornerStats = getRestResource("CornerStatRestResource", [["token", token["token"]], ]);
        return cornerStats["corners"]; // add index

    case ("fouls"):
        var fouls = getRestResource("FoulsStatResource", [["token", token["token"]], ]);
        return fouls["fouls"]; // add index

    case ("attendance"):
        var attendance = getRestResource("AttendanceRestResource", [["token", token["token"]], ]);
        return attendance["attendance"]; // add index

    default:
        return null;
  }
}

/*
  Description:
    This function should take all the selected attributes and return an array with all the data formatted
  Args:
  Returns:
  Raises:
  Notes:
    Remove breaks from in front of some case statements once attribute has been added
*/
function getBasketballAttributeData(attribute, token){
    switch (attribute){
        case ("points"):
            var score = getRestResource("ScoreRestResource", [["token", token["token"]], ]);
            return score["score"]; // add index

        case ("assists"): break;
            var assists = getRestResource("AssistRestResource", [["token", token["token"]], ]);
            return assists["assists"]; // add index

        case ("rebounds"): break;
            var rebounds = getRestResource("ReboundsRestResource", [["token", token["token"]], ]);
            return rebounds["rebounds"]; // add index

        case ("steals"): break;
            var steals = getRestResource("StealsRestResource", [["token", token["token"]], ]);
            return steals["steals"];

        default: 
            break;
    }
}


/*
  Description
    Displays all relevant statistics within the html page.
    Need to figure out which stats need to be displayed

  Args:
    None

  Returns:

  Raises:

*/

function displayPlayerStats(){
    var sport = document.getElementById("sport").value;
    var league = document.getElementById("league").value;
    var team = document.getElementById("team").value;
    var season = document.getElementById("season").value;
    var match = document.getElementById("game").value;
    // var name = document.getElementById('name').innerHTML = document.getElementById("player").options[document.getElementById('player').selectedIndex].text;
	
	$('#STATS').addClass('spinner');
	
    console.log(sport);
    console.log(league);
    



    
    if (sport == "null" || league == "null" || team == "null" || season == "null" || match == "null" ){
        console.log("Invalid Combination");
        $('#STATS').removeClass('spinner');
        return;
    }

    var parameters = [["sports", sport], ["league", league], ["team", team], ["season", season], ["match", match], ["name", name]];
    console.log(parameters);

    var token = getRestResource("TokenResource", parameters);
    console.log("Token: " + token["token"]);

    playerData = getPlayerData(token, sport);
    createPlayerTable(playerData, sport);
    
    $('#STATS').removeClass('spinner');


    playerID = document.getElementById("players").value;
    if (playerID == "null"){
        console.log("No player selected.");
        $('#STATS').removeClass('spinner');

        return;
    }

    var player = getRestResource("PlayerResource", [["token", token["token"]], ["playerID", playerID]]);
    player = Object.values(player);

    if(sport == "Soccer") {
        var soccerplayerstatistics = getRestResource("SoccerPlayerResource", [["token", token["token"]], ["playerID", playerID]]);
        soccerplayerstatistics = Object.values(soccerplayerstatistics);


        if (window.chart1 != null) {
            window.chart1.destroy();
            window.chart1 = null;
        }
        window.chart1 = plotRadar(player[1], soccerplayerstatistics[0], soccerplayerstatistics[1], soccerplayerstatistics[2]);

    }
	   

}


/*
Description:
  Returns an array of player data given a token. This data is used to populate the player table.
Args:
    token: token generated for sport, league, team, season, game combination
Returns:
    json that contains player data
Raises:
Notes:
  Format:
  [ [a, b, c, d, e], [f, g, h, i, k], [l, m, n, o, p]]
*/
function getPlayerData(token, sport){
    // Get the list of players with
    var playerList = getRestResource("PlayerListResource", [["token", token["token"]], ]);

    // Create list of IDs to get stats for each player
    var ids = playerList.homePlayersID;

    for (var i = 0; i < playerList.guestPlayersID.length; ++i){
        ids.push(playerList.guestPlayersID[i]);
    }

    // Build header for playerdata table. Two element array to append individual players
    var playerData = [["Player ID", "Birthday", "Name", "Weight", "Height", "Rating", "Strength", "Shot Power", "Preferred Foot"], ];

    // Let the first element of the array be the player's id
    var statsList, playerstatistics, soccerplayerstatistics, basketballplayerstatistics;

    for(var it in ids){
        if(ids[it]==0 || ids[it] == null)
        {
            ids.splice(it, 1);
        }
    };

    // Populate playerData for all found players
    for (var i = 0; i < ids.length; ++i){
        statsList = [ids[i]];

        // Get general player stats and append
        playerstatistics = getRestResource("PlayerResource", [["token", token["token"]], ["playerID", ids[i]]]);
        playerstatistics = Object.values(playerstatistics);

        for (var j = 0; j < playerstatistics.length; ++j){
            statsList.push(playerstatistics[j]);
        }

        if(sport == "Soccer")
        {
            // Get soccer player stats and append
            soccerplayerstatistics = getRestResource("SoccerPlayerResource", [["token", token["token"]], ["playerID", ids[i]]]);
            soccerplayerstatistics = Object.values(soccerplayerstatistics);

            for (var j = 0; j < soccerplayerstatistics.length; ++j){
                statsList.push(soccerplayerstatistics[j]);
            }
        }
        else
        {
            basketballplayerstatistics = getRestResource("BasketballPlayerResource", [["token", token["token"]], ["playerID", ids[i]]]);


            if (basketballplayerstatistics = !null) {
                basketballplayerstatistics = Object.values(basketballplayerstatistics);

                for (var j = 0; j < basketballplayerstatistics.length; ++j) {
                    statsList.push(basketballplayerstatistics[j]);
                }
            }
        }


        // Push the stats list for the specific player onto the playerData array
        playerData.push(statsList);
    }

    return playerData;
}
