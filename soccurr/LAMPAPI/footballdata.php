<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football League and Matches</title>
</head>
<body>
    <!-- Navigation (Tabs) -->
    <ul>
        <li><a href="?league=PL">Premier League</a></li>
        <li><a href="?league=SA">Serie A</a></li>
        <li><a href="?league=PD">La Liga</a></li>
        <li><a href="?league=BL1">Bundesliga</a></li>
        <li><a href="?league=L1">Ligue 1</a></li>
    </ul>

    <?php
        // Get the selected league from the URL (default to 'PL' if not provided)
        $league = isset($_GET['league']) ? $_GET['league'] : 'PL';

        // Your API key
        $apiKey = '5263d7829d224fd291d236a47f22d29d';

        // API URL for Standings
        $uriStandings = 'https://api.football-data.org/v4/competitions/' . $league . '/standings';
        
        // API URL for Matches (Recent & Next)
        $uriMatches = 'https://api.football-data.org/v4/competitions/' . $league . '/matches';
        
        // Set up HTTP request headers
        $reqPrefs['http']['method'] = 'GET';
        $reqPrefs['http']['header'] = 'X-Auth-Token: ' . $apiKey;
        $stream_context = stream_context_create($reqPrefs);

        // Fetch the standings data from the API
        $responseStandings = file_get_contents($uriStandings, false, $stream_context);
        $standings = json_decode($responseStandings);

        // Fetch the matches data from the API
        $responseMatches = file_get_contents($uriMatches, false, $stream_context);
        $matches = json_decode($responseMatches);

        // Check if standings data is available
        if (isset($standings->standings)) {
            echo "<h2>Standings for " . $league . "</h2>";
            echo "<table border='1'>
                    <tr>
                        <th>Position</th>
                        <th>Team</th>
                        <th>Points</th>
                    </tr>";

            // Loop through the standings and display each team
            foreach ($standings->standings[0]->table as $team) {
                echo "<tr>
                        <td>" . $team->position . "</td>
                        <td>" . $team->team->name . "</td>
                        <td>" . $team->points . "</td>
                      </tr>";
            }

            echo "</table>";
        } else {
            echo "<p>No standings available for this league.</p>";
        }

        // Check if matches data is available
        if (isset($matches->matches)) {
            echo "<h2>Recent Matches for " . $league . "</h2>";
            echo "<table border='1'>
                    <tr>
                        <th>Date</th>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>Score</th>
                    </tr>";

            // Loop through the matches and display recent ones
            foreach ($matches->matches as $match) {
                if ($match->status == 'FINISHED') {
                    echo "<tr>
                            <td>" . $match->utcDate . "</td>
                            <td>" . $match->homeTeam->name . "</td>
                            <td>" . $match->awayTeam->name . "</td>
                            <td>" . $match->score->fullTime->home . " - " . $match->score->fullTime->away . "</td>
                          </tr>";
                }
            }

            echo "</table>";

            echo "<h2>Upcoming Matches for " . $league . "</h2>";
            echo "<table border='1'>
                    <tr>
                        <th>Date</th>
                        <th>Home Team</th>
                        <th>Away Team</th>
                    </tr>";

            // Loop through the matches and display upcoming ones
            foreach ($matches->matches as $match) {
                if ($match->status == 'SCHEDULED') {
                    echo "<tr>
                            <td>" . $match->utcDate . "</td>
                            <td>" . $match->homeTeam->name . "</td>
                            <td>" . $match->awayTeam->name . "</td>
                          </tr>";
                }
            }

            echo "</table>";
        } else {
            echo "<p>No match data available for this league.</p>";
        }
    ?>

</body>
</html>
