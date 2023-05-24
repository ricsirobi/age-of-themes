var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var units = [];
var enemies = [];
var bullets = [];
var defenders = [];
var enemyDefenders = [];
var meteors = [];

var gold = 100;
var experience = 0;
var enemyGold = 350;
var goldPerSecond = 0.1 ;
var currentAge = 1;
var enemyCurrentAge = 1;
var meteorSpawnCooldown = 70;
const maxAge = 5;

var spawnCooldown = 0;
var enemySpawnCooldown = 0;
var maxDefenderTowers = 1;
var enemyMaxDefenderTowers = 1;
const maxDefenderTowerCount = 4;
var defenderTowerSpacing = 60; // spacing between defender towers

const maxPopulation = 10;

var unitQueue = [];
const maxUnitQueueSize = 5;


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
        hp: 600, 
        damage: 140,
        attackspeed: 40, 
        attackCooldown: 20,
        requiredAge: 1,
        name: "Dino Rider", 
        queueTime: 600,
        unitType: "meele",
        width: 100, 
        height: 150,
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
        width: 70, 
        height: 70,
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
        width: 80, 
        height: 80,
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
        width: 90, 
        height: 90,
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
        width: 100, 
        height: 100,
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
        width: 110, 
        height: 110,
    },
    {
        element: document.getElementById('sendDonkeyKongButton'), 
        cost: 500, 
        color: 'brown', 
        speed: 1.4, 
        hp: 500, 
        damage: 150, 
        attackspeed: 10,
        requiredAge: 3, 
        name: "Donkey Kong", 
        unitType: "meele",
        queueTime: 750,
        width: 120, 
        height: 120,
    },
    // Age 4 units
    {
        element: document.getElementById('sendJediKnightButton'), 
        cost: 600, 
        color: 'blue', 
        speed: 1.6, 
        hp: 600, 
        damage: 180, 
        attackspeed: 8,
        requiredAge: 4, 
        name: "Jedi Knight", 
        unitType: "meele",
        queueTime: 200,
        width: 130, 
        height: 130,
    },
    {
        element: document.getElementById('sendStormtrooperButton'), 
        cost: 650, 
        color: 'white', 
        speed: 1.8, 
        hp: 650, 
        damage: 195, 
        attackspeed: 7,
        requiredAge: 4, 
        name: "Stormtrooper", 
        unitType: "meele",
        queueTime: 620,
        width: 140, 
        height: 140,
    },
];

var buildButtons = [
    { element: document.getElementById('buildSmallTowerButton'), cost: 200, width: 30, height: 30, range: 200, damage: 1, attackSpeed: 10, requiredAge: 1 },
    { element: document.getElementById('buildMediumTowerButton'), cost: 300, width: 40, height: 40, range: 300, damage: 2, attackSpeed: 8, requiredAge: 1 },
    { element: document.getElementById('buildBigTowerButton'), cost: 400, width: 50, height: 50, range: 400, damage: 400, attackSpeed: 100, requiredAge: 1 }
];

var ages = [
    { id: 1, name: "plants vs zombies", requiredExperience: 0 },
    { id: 2, name: "minecraft", requiredExperience: 2000 },
    { id: 3, name: "super mario", requiredExperience: 10000 },
    { id: 4, name: "star wars", requiredExperience: 40000 },
];


var upgradeTowerButton = document.getElementById('upgradeTowerButton');
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

            unitQueue.push({
                unit: createUnit(castle.x , 
                    button.name, 
                    button.color, 
                    button.speed,
                     button.hp, 
                     button.damage,
                      button.attackspeed, 
                      button.requiredAge, 
                      button.cost, 
                      button.rangeDamage, 
                      button.rangeAttackspeed, 
                      button.range, button.name, 
                      button.unitType, 
                      button.width, 
                      button.height),
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
            defenders.push(createDefender(castle.x + castle.width + 20, towerYPosition, button.width, button.height, button.range, button.damage, button.attackSpeed));
        }
    });
});

upgradeTowerButton.addEventListener('click', function () {
    if (gold >= 1000 * maxDefenderTowers && maxDefenderTowers < maxDefenderTowerCount) {
        gold -= 1000 * maxDefenderTowers;
        maxDefenderTowers++;
        maxDefenderTowersDisplay.innerText = 'Max Defender Towers: ' + maxDefenderTowers;
        upgradeTowerButton.innerText = "Max Tower fejlesztése (" + 1000 * maxDefenderTowers + " arany)";
    }
    else {
        upgradeTowerButton.disabled = false;
    }
});

resetButton.addEventListener('click', function () {
    location.reload();
});

function changeAge() {
    if(currentAge < maxAge && experience>= ages[currentAge].requiredExperience)
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
        attackCooldown: 0,
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

    };
}

function createDefender(x, y, width, height, range, damage, attackSpeed) {
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
    goldDisplay.innerText = 'Gold: ' + Math.round(gold);
    var xp = ages[currentAge].requiredExperience?ages[currentAge].requiredExperience:"-";
    experienceDisplay.innerText =  experience + " / " + xp;
    maxDefenderTowersDisplay.innerText = 'Max Defender Towers: ' + maxDefenderTowers;
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




function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawGrass();
    drawCastle(castle);
    drawCastle(enemyCastle);

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
        drawDefender(defender);
        updateDefender(defender, enemies, castle);
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
        if (affordableTower && enemyGold >= affordableTower.cost && defenders.length < maxDefenderTowers) {
            enemyGold -= affordableTower.cost;
            var towerYPosition = enemyCastle.y + enemyCastle.height / 2 + (defenders.filter(d => d.isEnemy).length * defenderTowerSpacing);
            defenders.push(createDefender(enemyCastle.x - 20, towerYPosition, affordableTower.width, affordableTower.height, affordableTower.range, affordableTower.damage, affordableTower.attackSpeed, true)); // Assuming the last parameter indicates whether the tower is for the enemy
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

    if(experience > ages[enemyCurrentAge].requiredExperience && enemyCurrentAge < maxAge)
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

gameLoop();
