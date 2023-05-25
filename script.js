var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

window.onload = function() {
    if (window.innerWidth > 800) { // Vagy bármelyik érték, ami a "számítógépes" képernyő méretet jelenti
        document.body.style.zoom = "150%";
    }
}


var units = [];
var enemies = [];
var bullets = [];
var defenders = [];
var enemyDefenders = [];
var meteors = [];
var isPaused =false;

var gold = 70;
var experience = 0;
var enemyGold = 70;
var goldPerSecond = 0.1 ;
var currentAge = 1;
var enemyCurrentAge = 1;
var meteorSpawnCooldown = 70;
const maxAge = 4;

var spawnCooldown = 0;
var enemySpawnCooldown = 0;
var maxDefenderTowers = 1;
var enemyMaxDefenderTowers = 2;
const maxDefenderTowerCount = 4;
var defenderTowerSpacing = 60; // spacing between defender towers

var sendDrawButton = document.getElementById("sendDrawButton");

const maxPopulation = 10;

var unitQueue = [];
const maxUnitQueueSize = 5;
var pauseButton = document.getElementById("pauseButton");


var castle = {
    x: 0,
    y: 300,
    hp: 4000,
    maxHP:4000,
    width: 50,
    height: 100,
    color: 'blue',
};

var enemyCastle = {
    x: 1150,
    y: 300,
    hp: 4000,
    maxHP:4000,
    width: 50,
    height: 100,
    color: 'red',
};

var sendButtons = [
    // Age 1 units
    {
        element: document.getElementById('sendClubmanButton'), 
        cost: 100, 
        color: 'green',
        speed: 0.5, 
        hp: 140, 
        damage: 46, 
        attackspeed: 30, 
        requiredAge: 1, 
        queueTime: 200, 
        name: "Clubman",
        width: 50, 
        height: 50,
    },
    {
        element: document.getElementById('sendSlingerButton'),
        cost: 125,
        color: 'yellowgreen',
        speed: 0.5,
        hp: 100,
        damage: 30,
        attackspeed: 20,
        attackCooldown: 0,
        requiredAge: 1,
        range: 100,
        rangeDamage: 50,
        rangeAttackspeed: 10,
        rangeAttackCooldown: 0,
        unitType: "ranged",
        queueTime: 300,
        name: "Slinger",
        width: 50, 
        height: 50,
    },
    {
        element: document.getElementById('sendDinoRiderButton'),
        cost: 400,
        color: 'yellow',
        speed: 0.5, 
        hp: 400, 
        damage: 140,
        attackspeed: 40, 
        attackCooldown: 20,
        requiredAge: 1,
        name: "Dino Rider", 
        queueTime: 600,
        unitType: "meele",
        width: 100, 
        height: 130,
    },
    // Age 2 units
    {
        element: document.getElementById('sendCreeperSapperButton'),
        cost: 200, 
        color: 'green',
        speed: 0.7, 
        hp: 220, 
        damage: 60, 
        attackspeed: 30,
        requiredAge: 2,
        name: "Creeper Sapper", 
        unitType: "meele",
        queueTime: 200,
        width: 50, 
        height: 50,
    },
    {
        element: document.getElementById('sendEnderKnightButton'),
        cost: 250, 
        color: 'purple',
        speed: 0.8, 
        hp: 260, 
        damage: 75, 
        attackspeed: 25,
        requiredAge: 2,
        name: "Ender Knight", 
        unitType: "meele",
        queueTime: 350,
        width: 60, 
        height: 60,
    },
    {
        element: document.getElementById('sendIronGolemButton'),
        cost: 300, 
        color: 'gray',
        speed: 0.6, 
        hp: 300, 
        damage: 90, 
        attackspeed: 20,
        requiredAge: 2,
        name: "Iron Golem", 
        unitType: "meele",
        queueTime: 600,
        width: 130, 
        height: 130,
    },
    // Age 3 units
    {
        element: document.getElementById('sendMarioButton'), 
        cost: 400, 
        color: 'red', 
        speed: 1, 
        hp: 400, 
        damage: 120, 
        attackspeed: 15,
        requiredAge: 3, 
        name: "Mario", 
        unitType: "meele",
        queueTime: 200,
        width: 40, 
        height: 40,
    },
    {
        element: document.getElementById('sendYoshiButton'), 
        cost: 450, 
        color: 'green', 
        speed: 1.2, 
        hp: 450, 
        damage: 135, 
        attackspeed: 13,
        requiredAge: 3, 
        name: "Yoshi", 
        unitType: "meele",
        queueTime: 350,
        width: 50, 
        height: 50,
    },
    {
        element: document.getElementById('sendDonkeyKongButton'), 
        cost: 500, 
        color: 'brown', 
        speed: 1.4, 
        hp: 650, 
        damage: 150, 
        attackspeed: 10,
        requiredAge: 3, 
        name: "Donkey Kong", 
        unitType: "meele",
        queueTime: 750,
        width: 100, 
        height: 100,
    },
    // Age 4 units
    {
        element: document.getElementById('sendJediKnightButton'), 
        cost: 600, 
        color: 'blue', 
        speed: 1.6, 
        hp: 600, 
        damage: 180, 
        attackspeed: 14,
        requiredAge: 4, 
        name: "Jedi Knight", 
        unitType: "meele",
        queueTime: 200,
        width: 70, 
        height: 70,
    },
    {
        element: document.getElementById('sendStormtrooperButton'), 
        cost: 650, 
        color: 'white', 
        speed: 1.8, 
        hp: 500, 
        damage: 195, 
        attackspeed: 17,
        requiredAge: 4, 
        name: "Stormtrooper", 
        unitType: "ranged",
        queueTime: 620,
        width: 35, 
        height: 35,
    },
    {
        element: document.getElementById('sendDarthVaderButton'), 
        cost: 650, 
        color: 'white', 
        speed: 1.8, 
        hp: 1000, 
        damage: 195, 
        attackspeed: 7,
        requiredAge: 4, 
        name: "Darth Vader", 
        unitType: "meele",
        queueTime: 620,
        width: 100, 
        height: 100,
    },

];

var buildButtons = [
    { element: document.getElementById('buildBigTowerButton'), cost: 400, width: 50, height: 50, range: 300, damage: 500, attackSpeed: 10, requiredAge: 1 }
];

var ages = [
    { id: 1, name: "plants vs zombies", requiredExperience: 0 },
    { id: 2, name: "minecraft", requiredExperience: 2000 },
    { id: 3, name: "super mario", requiredExperience: 10000 },
    { id: 4, name: "star wars", requiredExperience: 40000 },
];


var upgradeTowerButton = document.getElementById('upgradeTowerButton');
var upgradeTowerPriceDisplay = document.getElementById("upgradeTowerPrice");
var resetButton = document.getElementById('resetButton');
var goldDisplay = document.getElementById('goldDisplay');
var meteorCooldownDisplay = document.getElementById('meteorCooldownDisplay');

var experienceDisplay = document.getElementById('experienceDisplay');
var maxDefenderTowersDisplay = document.getElementById('maxDefenderTowersDisplay');
var gameOverMessage = document.getElementById('gameOverMessage');

var meteorButton = document.getElementById('meteorButton');
meteorButton.addEventListener('click', function () {
    if (meteorSpawnCooldown <= 0) {
        meteorSpawnCooldown = 70;
        meteors = generateMeteors();
    }
});



sendButtons.forEach(function (button) {
    button.element.addEventListener('click', function () {
        if (gold >= button.cost && unitQueue.length < maxUnitQueueSize ) {
            gold -= button.cost;
            console.log("Player queue-ba tette: " + button.name + "hp: " + button.hp + " damage: " + button.damage);
            var modifiedRangedAttackSpeed = button.rangeAttackspeed?button.rangeAttackspeed-1:0;
            unitQueue.push({
                unit: createUnit(castle.x , 
                    button.name, 
                    button.color, 
                    button.speed,
                     button.hp, 
                     button.damage,
                      button.attackspeed-2, 
                      button.requiredAge, 
                      button.cost, 
                      button.rangeDamage, 
                      button.rangeAttackspeed, 
                      button.range, button.name, 
                      button.unitType, 
                      button.width, 
                      button.height,
                      ),
                queueTime: button.queueTime
            });
        }
    });
});




buildButtons.forEach(function (button) {
    button.element.addEventListener('click', function () {
        if (gold >= button.cost && defenders.length < maxDefenderTowers) {
            gold -= button.cost;
            var towerYPosition = castle.y + castle.height / 2 + (defenders.length * defenderTowerSpacing);
            defenders.push(createDefender(castle.x + castle.width + 20, towerYPosition, button.width, button.height, button.range, button.damage, button.attackSpeed,castle));
        }
    });
});

upgradeTowerButton.addEventListener('click', function () {
    if (gold >= 1000 * maxDefenderTowers && maxDefenderTowers < maxDefenderTowerCount) {
        gold -= 1000 * maxDefenderTowers;
        maxDefenderTowers++;
        maxDefenderTowersDisplay.innerText = 'Max Defender Towers: ' + maxDefenderTowers;
        upgradeTowerPriceDisplay.innerText =  1000 * maxDefenderTowers;
    }
    else {
        upgradeTowerButton.disabled = false;
    }
});

resetButton.addEventListener('click', function () {
    location.reload();
});

function changeAge() {
    if(currentAge <= maxAge && experience>= ages[currentAge].requiredExperience)
    {  
        currentAge++;
        castle.maxHP *=4;
        if(castle.hp*6 < castle.maxHP)
        castle.hp  *= 6;
        else
        castle.hp = castle.maxHP;
        
        console.log("Advanced to age " + currentAge);
    }
    return;
}



sendDrawButton.addEventListener("click",openDraw);
var drawingDiv = document.getElementById("drawingDiv");

function openDraw()
{
    pauseGame();
    var drawingCanvas = document.createElement('canvas');
    var computedStyle = window.getComputedStyle(drawingCanvas);
drawingCanvas.width = parseInt(computedStyle.getPropertyValue('width'), 10);
drawingCanvas.height = parseInt(computedStyle.getPropertyValue('height'), 10);

    drawingCanvas.color = "white";
    drawingDiv.style.display = "block";
    drawingCanvas.id = "drawingCanvas";
    drawingCanvas.style.backgroundColor = "white";
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;
    drawingDiv.appendChild(drawingCanvas);

    var ctx = drawingCanvas.getContext('2d');
    var drawing = false;
    
    drawingCanvas.addEventListener('mousedown', function(e) {
        drawing = true;
        ctx.beginPath();
    });
    
    drawingCanvas.addEventListener('mouseup', function() {
        drawing = false;
    });

    drawingCanvas.addEventListener('mousemove', function(e) {
        if (drawing === false) return;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        
        ctx.strokeStyle = colorPicker.value;
    
        // Get the bounding rectangle of the canvas
        var rect = drawingCanvas.getBoundingClientRect();
    
        // Calculate the zoom level
        var zoomLevel = window.devicePixelRatio;
    
        // Calculate the mouse position relative to the canvas, taking into account the zoom level
        var x = (e.clientX - rect.left) / zoomLevel;
        var y = (e.clientY - rect.top) / zoomLevel;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    var colorPicker = document.createElement("input");
    colorPicker.type="color";
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Mentés';
    
    drawingDiv.appendChild(colorPicker);
    drawingDiv.appendChild(saveButton);
    
    saveButton.addEventListener('click', function() {
        var dataUrl = drawingCanvas.toDataURL('image/png');
        
        var playerUnitImage = new Image();
        playerUnitImage.src = dataUrl;
        
        units[units.length] =  playerUnit = createUnit(0, "Player Unit", "blue", 100, calculateArea(drawingCanvas)/1000, 10, 1, currentAge ,0, 0, 0, 0, 0, "melee", 75, 75);

        units[units.length-1].image = playerUnitImage;
        
        drawingDiv.removeChild(colorPicker);
        drawingDiv.removeChild(drawingCanvas);
        drawingDiv.removeChild(saveButton);
        drawingDiv.style.display = "none";
        resumeGame();
    });
}

function calculateArea(canvas) {
    let context = canvas.getContext('2d');
    let pointsInside = 0;
    let totalPoints = 10000; // A pontos szám attól függ, milyen pontosságra van szükség
    let points = [];
    let backgroundColor = [0, 0, 0, 0]; // Feltételezzük, hogy a háttér fehér. Állítsd be a tényleges háttérszínre.
    
    for (let i = 0; i < totalPoints; i++) {
      let x = Math.floor(Math.random() * canvas.width);
      let y = Math.floor(Math.random() * canvas.height);
        
      points.push({x: x, y: y});
    
      let pixelData;
      try {
        pixelData = context.getImageData(x, y, 1, 1).data;
      } catch (err) {
        console.error("Hiba történt a pixel adatok lekérdezésekor: ", err);
        continue;
      }
      
      if (pixelData[0] !== backgroundColor[0] || pixelData[1] !== backgroundColor[1] ||
          pixelData[2] !== backgroundColor[2] || pixelData[3] !== backgroundColor[3]) {
        pointsInside++;
      }
    }
    
    let areaRatio = pointsInside / totalPoints;
    let totalArea = canvas.width * canvas.height;
    let estimatedArea = totalArea * areaRatio;
    points = [];
    console.log("Canvas teljes területe: " + totalArea);
    console.log('Becsült terület: ' + estimatedArea + ' px^2');
    return estimatedArea;
  }
  
  




function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

if (isMobileDevice()) {
    window.addEventListener("orientationchange", function() {
        if (window.orientation === 0 || window.orientation === 180) {
            document.getElementById("checkMobileScreen").style.display="block";
            return;
        } else if (window.orientation === 90 || window.orientation === -90) {
            // Landscape módban vagyunk
            // Itt végrehajthatod az elforgatásra vonatkozó műveleteket
            document.getElementById("checkMobileScreen").style.display="none";
        }
    });
} else {
    // Az eszköz nem mobiltelefon vagy táblagép
}


 
function checkMobileScreen()
{
   
    if (window.orientation === 0 || window.orientation === 180) {
        document.getElementById("checkMobileScreen").style.display="block";
        return;
    } else if (window.orientation === 90 || window.orientation === -90) {
        // Landscape módban vagyunk
        // Itt végrehajthatod az elforgatásra vonatkozó műveleteket
        document.getElementById("checkMobileScreen").style.display="none";
    }

}


function createUnit(x, name, color, speed, hp, damage, attackspeed, requiredAge, cost, rangeDamage = 0, rangeAttackspeed = 0, range = 30, rangeAttackCooldown = 0, unitType = "meele", width, height) {
    if (requiredAge != currentAge) {
        console.log("This unit is not available in the current age.");
        //return;
    }
    return {
        x: x,
        y: 350,
        width: width || 50,
        height: height || 50,
        color: color,
        speed: x<500?0.5:-0.5, //speed
        hp: hp,
        maxHp: hp,
        range: range || 30,
        damage: damage,
        attackCooldown: rangeAttackspeed || attackspeed,
        attackspeed: attackspeed,
        requiredAge: requiredAge,
        cost: cost,
        rangeDamage: rangeDamage || 0,
        rangeAttackspeed: rangeAttackspeed || 0,
        rangeAttackCooldown: rangeAttackCooldown || 0,
        unitType: unitType || "melee",
        name: name,
        target: null,
        inMeele: false,
        image: null,

    };
}

function createDefender(x, y, width, height, range, damage, attackSpeed, castle=castle) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        range: range,
        damage: damage,
        attackSpeed: attackSpeed / 10,
        attackCooldown: 0,
        target: null,
        castle: castle,
    };
}

function createBullet(x, y, target, style= null, castle = null ) {
    return {
        x: x,
        y: y,
        width: 10,
        height: 5,
        color: 'yellow',
        target: target,
        style: style || null,
        castle: castle || null,
    };
}

function findAffordableTowers() {
    // Assume that buildButtons contains the information of towers
    for (let i = 0; i < buildButtons.length; i++) {
        if (enemyGold >= buildButtons[i].cost) {
            return buildButtons[i];
        }
    }
    return null;
}


function checkBulletCollision(bullet) {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < (enemy.y - enemy.height) + enemy.height &&
            bullet.y + bullet.height > (enemy.y - enemy.height)
        ) {
            return enemy;
        }
    }
    return null;
}

function updateButtonVisibility() {
    var ageDivs = ['age1unitButtons', 'age2unitButtons', 'age3unitButtons', 'age4unitButtons'];

    for (var i = 0; i < ageDivs.length; i++) {
        var element = document.getElementById(ageDivs[i]);
        if (element) {
            // Ha az aktuális kor egyenlő a ciklus indexével + 1, akkor a gombokat meg kell jeleníteni, különben elrejtjük őket.
            if (currentAge === i + 1) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    }
}



function refreshDisplay() {
    if(currentAge == maxAge)
    {
        experienceDisplay.innerText =  experience + " / " + "-";

        return;
    }
    goldDisplay.innerText =  Math.round(gold);
    var xp = ages[currentAge].requiredExperience?ages[currentAge].requiredExperience:"-";
    experienceDisplay.innerText =  experience + " / " + xp;
    maxDefenderTowersDisplay.innerText =   defenders.length +"/" + maxDefenderTowers ;
}

function findAffordableUnits() {
    // Create an array of affordable units
    var affordableUnits = sendButtons.filter(unit => enemyGold >= unit.cost && unit.requiredAge==enemyCurrentAge);

    // If there are no affordable units, return null
    if (affordableUnits.length === 0) return null;

    // Choose a random affordable unit
    var randomIndex = Math.floor(Math.random() * affordableUnits.length);
    return affordableUnits[randomIndex];
}

function generateMeteors() {
    var numMeteors = Math.floor(Math.random() * 10) + 10;
    var meteors = [];
    for (var i = 0; i < numMeteors; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height * 0.5;
        var size = Math.random() * 10 + 30;
        var dx = Math.random() * 2 - 1; // Generálj egy random értéket -1 és 1 között
        meteors.push({ x: x, y: y, width: size, height: size, dx: dx });
    }
    return meteors;
}

function checkMeteorCollision(meteor) {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (
            meteor.x < enemy.x + enemy.width &&
            meteor.x + meteor.width > enemy.x &&
            meteor.y < enemy.y + enemy.height &&
            meteor.y + meteor.height > enemy.y
        ) {

            gold += Math.floor(enemy.cost * 1.4);
            experience += Math.floor(enemy.cost * 0.3);
            return enemy;
        }
    }
    return null;
}

function pauseGame() {
    isPaused = true;
    pauseButton.innerHTML = '<img src="img/resumeButton.png" width="30" height="auto" alt="buttonpng" border="0" style="margin-top: 3px;"/>';
    pauseButton.removeEventListener("click",pauseGame);
    pauseButton.addEventListener("click", resumeGame);
    
}

function resumeGame() {
    isPaused = false;
    requestAnimationFrame(gameLoop);
    pauseButton.innerHTML = '<img src="img/pauseButton.png" width="30" height="auto" alt="buttonpng" border="0" style="margin-top: 3px;"/>';
    pauseButton.removeEventListener("click",resumeGame);
    pauseButton.addEventListener("click", pauseGame);
    
}



function gameLoop() {
    if(!isPaused)
    {
        
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawGrass();
    drawCastle(castle,currentAge);
    drawCastle(enemyCastle,enemyCurrentAge);

    gold += goldPerSecond;
    enemyGold += goldPerSecond;

    refreshDisplay();

    units.forEach(function (unit) {
        drawUnit(unit, 1);
        updateUnit(unit, units, enemies, enemyCastle, gold, experience);
    });
    
    enemies.forEach(function (enemy) {
        drawUnit(enemy);
        
        updateUnit(enemy, enemies, units, castle, gold, experience);
    });
    

    defenders.forEach(function (defender) {
        drawDefender(defender, castle);
        updateDefender(defender, enemies, castle);
    });

    enemyDefenders.forEach(function (enemyDefender) {
        drawDefender(enemyDefender, enemyCastle);
        updateDefender(enemyDefender, units, enemyCastle);
    });

    bullets.forEach(function (bullet) {
        drawBullet(bullet);
        updateBullet(bullet);
    });


    if (unitQueue.length > 0 && units.length < maxPopulation) {
        var queuedUnit = unitQueue[0];
        queuedUnit.queueTime -= 1;  // Assuming gameLoop runs every 1 millisecond
        if (queuedUnit.queueTime <= 0) {
            units.push(queuedUnit.unit);
            unitQueue.splice(0, 1);
        }
    }
    

    //

    for (let i = 0; i < 5; i++) {
        document.getElementById('queue' + (i + 1)).textContent = "";
    }
    for (let i = 0; i < unitQueue.length; i++) {
        document.getElementById('queue' + (i + 1)).textContent = unitQueue[i].unit.name;
    }

    if (meteors.length > 0) {
        drawMeteors();
        meteors.forEach(function (meteor) {
            meteor.y += 5;
            if (meteor.y > canvas.height) {
                var index = meteors.indexOf(meteor);
                if (index != -1) {
                    meteors.splice(index, 1);
                }
            }
            var collisionEnemy = checkMeteorCollision(meteor);
            if (collisionEnemy) {
                var index = enemies.indexOf(collisionEnemy);
                if (index != -1) {
                    enemies.splice(index, 1);
                }
            }
        });
    }

    if (Math.random() < 0.01 && enemySpawnCooldown <= 0) {
        var affordableUnit = findAffordableUnits();
        try {
         
        var enoughSpaceForNewUnit = (!enemies[0] || (enemies[enemies.length-1].x+enemies[enemies.length-1].width < 1050-affordableUnit.width));
        
        } catch (error) {
           // console.log(affordableUnit);
                  
        }
        if (affordableUnit&&enoughSpaceForNewUnit &&
            affordableUnit &&
            affordableUnit.requiredAge == enemyCurrentAge &&
            enemies.length < maxPopulation &&
            enoughSpaceForNewUnit)        {
          enemyGold -= affordableUnit.cost;
          enemySpawnCooldown = 2;
          //console.log("Enemy spawn: " + affordableUnit.name + " hp: " + affordableUnit.hp + " damage: " + affordableUnit.damage);
          enemies.push(createUnit(1050+enemies.length,
             affordableUnit.name, 
             affordableUnit.color,
              affordableUnit.speed, 
              affordableUnit.hp, 
              affordableUnit.damage,
               affordableUnit.attackspeed, 
               affordableUnit.requiredAge,
                affordableUnit.cost, 
                affordableUnit.rangeDamage,
                 affordableUnit.rangeAttackspeed, 
                 affordableUnit.range, 
                 affordableUnit.name,                
                 affordableUnit.unitType, 
                 affordableUnit.width, 
                 affordableUnit.height));
        }
      }
      

    if (Math.random() < 0.0001) {
        // Try to create a defender tower for the enemy if possible
        var affordableTower = findAffordableTowers(); // You need to implement this function
        if (affordableTower && enemyGold >= affordableTower.cost && enemyDefenders.length < enemyMaxDefenderTowers) {
            enemyGold -= affordableTower.cost;
            var towerYPosition = enemyCastle.y + enemyCastle.height / 2 + (defenders.filter(d => d.isEnemy).length * defenderTowerSpacing);
            enemyDefenders.push(createDefender(enemyCastle.x - 20, towerYPosition, affordableTower.width, affordableTower.height, affordableTower.range, affordableTower.damage, affordableTower.attackSpeed, enemyCastle)); // Assuming the last parameter indicates whether the tower is for the enemy
        }
    }


    if (spawnCooldown > 0) {
        spawnCooldown -= 0.01;
    }

    if (meteorSpawnCooldown > 0) {
        meteorSpawnCooldown -= 0.01;
    }

    if (enemySpawnCooldown > 0) {
        enemySpawnCooldown -= 0.01;
    }

    if (castle.hp <= 0) {
        goldPerSecond = 0;
    }

    if (gameOverMessage.style.display === 'block') {
        return;
    }
    meteorCooldownDisplay.innerText = Math.floor(meteorSpawnCooldown) < 0 ? " Használható" : " " + Math.floor(meteorSpawnCooldown);

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    units.forEach(function (unit) {
        if (unit.attackCooldown > 0) {
            ctx.fillText(Math.ceil(unit.attackCooldown), unit.x + unit.width / 2, unit.y - 20);
        }
    });

    if(enemyCurrentAge < maxAge && experience > ages[enemyCurrentAge].requiredExperience)
    {
        console.log("Enemy level up to "+ ages[enemyCurrentAge].name);
        enemyCastle.maxHP*=4;
        if(enemyCastle.hp*6 < enemyCastle.maxHP*4)
        enemyCastle.hp  *= 6;
        else
        enemyCastle.hp = enemyCastle.maxHP;

        enemyCurrentAge++;
    }

    try {
        //console.log(enemies[enemies.length-2].x - enemies[enemies.length-1].x);
      } catch (error) {
        
      }
    updateButtonVisibility();
    
    requestAnimationFrame(gameLoop);
    }
    else
    {
        return;
    }
}
if (isMobileDevice()) {
checkMobileScreen();
}
gameLoop();
