<?php
// Eksempel på hardkodet brukerinformasjon
$gyldig_epost = "test@eksempel.no";
$gyldig_passord = "hemmelig";

// Hent input fra skjema
$epost = $_POST['epost'] ?? '';
$passord = $_POST['passord'] ?? '';

// Sjekk om brukerinformasjon stemmer
if ($epost === $gyldig_epost && $passord === $gyldig_passord) {
    // Gå videre til brukersiden
    header("Location: Brukerside.html");
    exit();
} else {
    // Feil innlogging – vis feilmelding
    echo "<h2>Feil e-post eller passord!</h2>";
    echo "<a href='logginn.html'>← Prøv igjen</a>";
}
?>
