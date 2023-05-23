function refreshDisplay()
{
    if (gold >= 15) {
        sendClubmanButton.disabled = false;
    }
    else
    {
        sendClubmanButton.disabled = true;
    }

    if (gold >= 100) {
        sendDinoRiderButton.disabled = false;
    }
    else
    {
        sendDinoRiderButton.disabled = true;
    }

    if (gold >= 200) {
        sendSoldierButton.disabled = false;
    }
    else
    {
        sendSoldierButton.disabled = true;
    }

    if (gold >= 500) {
        sendTankButton.disabled = false;
    }
    else
    {
        sendTankButton.disabled = true;

    }

   // if (gold >= 300 && defenders.length < maxDefenderTowers) {
   //     buildDefenderButton.disabled = false;
    //}
    if (gold >= 200 && defenders.length < maxDefenderTowers) {
        buildSmallTowerButton.disabled = false;
    }
    else
    {
        buildSmallTowerButton.disabled = true;
    }
    if (gold >= 300 && defenders.length < maxDefenderTowers) {
        buildMediumTowerButton.disabled = false;
    }
    else
    {
        buildMediumTowerButton.disabled=true;
    }
    if (gold >= 400 && defenders.length < maxDefenderTowers) {
        buildBigTowerButton.disabled = false;
    }
    else
    {
        buildBigTowerButton.disabled = true;
    }

    



    if (gold >= 500 && maxDefenderTowers < maxDefenderTowerCount) {
        upgradeTowerButton.disabled = false;
    }

    goldDisplay.innerText = 'Arany: ' + Math.floor(gold);
    

}