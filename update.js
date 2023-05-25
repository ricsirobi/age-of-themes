function updateUnit(unit, allies, enemies, castle, ggold, exp) {
    // Update the unit during the game
    var nearestEnemy = enemies.reduce(function (nearest, enemy) {
        // Find the nearest enemy to the unit
        var distance = Math.abs(unit.x - enemy.x);
        if (distance < nearest.distance) {
            return { enemy: enemy, distance: distance };
        } else {
            return nearest;
        }
    }, { enemy: null, distance: Infinity });

    unit.target = nearestEnemy.enemy;

    if (nearestEnemy.distance < unit.range && unit.rangeDamage > 0 && unit.unitType === "ranged") {
        // If the nearest enemy is within shooting range and the unit has attacking capability (of type "ranged")
        if (unit.rangeAttackCooldown <= 0) {
            nearestEnemy.enemy.hp -= unit.rangeDamage;
            unit.rangeAttackCooldown = unit.rangeAttackspeed;
            if (nearestEnemy.enemy.hp <= 0) {
                var enemyIndex = enemies.indexOf(nearestEnemy.enemy);
                enemies.splice(enemyIndex, 1);
                gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                enemyGold += Math.floor(nearestEnemy.enemy.cost * 1.33);

                experience += Math.floor(nearestEnemy.enemy.cost * 1.2);
            }
        } else {
            unit.rangeAttackCooldown -= 0.1;
        }
    } else if (nearestEnemy.distance < unit.width) {
        // If the nearest enemy is within attacking range (melee attack)
        if (unit.attackCooldown <= 0) {
            nearestEnemy.enemy.hp -= unit.damage;
            unit.attackCooldown = unit.attackspeed;
            if (nearestEnemy.enemy.hp <= 0) {
                var enemyIndex = enemies.indexOf(nearestEnemy.enemy);
                enemies.splice(enemyIndex, 1);
                experience += Math.floor(nearestEnemy.enemy.cost*1.2);
                enemyGold += Math.floor(nearestEnemy.enemy.cost * 1.33);

                 console.log(nearestEnemy.enemy.cost*1.2+" xp");
                gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
            }
        } else {
            unit.attackCooldown -= 0.1;
        }
    } else if (Math.abs(unit.x - castle.x) < unit.range + unit.width / 3) {
        // If the attacker is near the castle (melee attack)
        if (unit.attackCooldown <= 0) {
            castle.hp -= unit.damage;
            unit.attackCooldown = unit.attackspeed;
            if (castle.hp <= 0) {
                gameOverMessage.style.display = 'block';
            }
        } else {
            unit.attackCooldown -= 0.1;
        }
    } else {
        // If there's no unit or attackable enemy directly in front of it
        let allyInFront = false;
        if(castle===enemyCastle)
        allyInFront = allies.find(ally => ally.x > unit.x && Math.abs(ally.x - unit.x) < unit.width);
        else
        allyInFront = allies.find(ally => ally.x < unit.x && Math.abs(ally.x - unit.x) < unit.width);
        
        let enemyInFront = enemies.find(enemy => enemy.x > unit.x && Math.abs(enemy.x - unit.x) < unit.width);

        // Check if there is room to move forward
        if (!allyInFront && !enemyInFront) {
            unit.x += unit.speed;
        }
    }
    if(unit.unitType == "ranged" && nearestEnemy.enemy && nearestEnemy.distance < unit.range)
    {
        if(nearestEnemy.enemy.unitType != "ranged" && nearestEnemy.enemy.range < nearestEnemy.distance)
        {//ranged sebzés
            if (nearestEnemy.enemy.hp <= 0) {
                // ellenség megölve
                enemies.splice(0, 1);
                gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                experience += Math.floor(nearestEnemy.enemy.cost*1.2);
                enemyGold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                 console.log(nearestEnemy.enemy.cost*1.4+" xp");
            }
            else
            if (unit.attackCooldown <= 0) {
            nearestEnemy.enemy.hp -= unit.damage;
            unit.attackCooldown = unit.rangeAttackspeed;
            console.log("ranged unit meele sebzést okoz");
            }
            else
            {
                unit.attackCooldown -= 0.1;
            }

        }
        else
        {
            if (nearestEnemy.enemy.hp <= 0) {
                // ellenség megölve
                gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                experience += Math.floor(nearestEnemy.enemy.cost*1.2);
                enemyGold += Math.floor(nearestEnemy.enemy.cost * 1.33);

                 console.log(nearestEnemy.enemy.cost*1.4+" xp");
                enemies.splice(0, 1);
                
            }
            else
            if (unit.attackCooldown <= 0) {
            nearestEnemy.enemy.hp -= unit.damage;
            unit.attackCooldown = unit.attackspeed;
            bullets.push(createBullet(unit.x + unit.width-10, unit.y-50 + unit.height / 2, nearestEnemy.enemy, "arrow", castle));
            console.log("kell bullet?");
            }
            else
            {
                unit.attackCooldown -= 0.1;
            }

        }

     if (Math.abs(unit.x - castle.x) < unit.range + unit.width / 3) 
     {
        if (unit.attackCooldown <= 0) {
            castle -= unit.rangeDamage;
            unit.attackCooldown = unit.attackspeed;
            bullets.push(createBullet(unit.x + unit.width-10, unit.y-50 + unit.height / 2, nearestEnemy.enemy, "arrow", castle));
            
            }
            else
            {
                unit.attackCooldown -= 0.1;
            }
    }


    }
}




function findNearestEnemy(unit, targets) {
    var nearest = { enemy: null, distance: Infinity };
    for (var i = 0; i < targets.length; i++) {
        var enemy = targets[i];
        var distance = Math.abs(unit.x - enemy.x);
        if (distance < nearest.distance) {
            nearest = { enemy: enemy, distance: distance };
        }
    }
    return nearest;
}

function findNearestAlly(unit, units) {
    var nearest = { ally: null, distance: Infinity };
    for (var i = 0; i < units.length; i++) {
        var ally = units[i];
        if (ally !== unit) {
            var distance = Math.abs(unit.x - ally.x);
            if (distance < nearest.distance) {
                nearest = { ally: ally, distance: distance };
            }
        }
    }
    return nearest;
}

function attackEnemy(unit, nearestEnemy, targets, gold, experience) {
    if (nearestEnemy.enemy) {
        nearestEnemy.enemy.hp -= (unit.rangeDamage || unit.damage);
        unit.attackCooldown = unit.attackspeed;
        if (nearestEnemy.enemy.hp <= 0) {
            // ellenség megölve
            var enemyIndex = targets.indexOf(nearestEnemy.enemy);
            targets.splice(enemyIndex, 1);
            gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
            enemyGold += Math.floor(nearestEnemy.enemy.cost * 1.33);

            experience += Math.floor(nearestEnemy.enemy.cost*1.4);
                
                 console.log(nearestEnemy.enemy.cost*1.4+" xp");
        }
    }
    return gold;
}






function updateDefender(defender, enemies) {
    if (defender.attackCooldown <= 0) {
        var nearestEnemy = null;
        var nearestDistance = Infinity;
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            var distance = Math.abs(defender.x - enemy.x);
            if (distance < nearestDistance && distance <= defender.range) {
                nearestEnemy = enemy;
                nearestDistance = distance;
            }
        }
        if (nearestEnemy) {
            bullets.push(createBullet(defender.x + defender.width+10, defender.y-8 + defender.height / 2, nearestEnemy));
            console.log("Bulletet küld a defender");
            // Ensure the attackSpeed is greater than 0 to avoid division by zero.
            defender.attackCooldown = (defender.attackSpeed > 0) ? (60 / defender.attackSpeed) : 0;
        }
    } else {
        defender.attackCooldown--;
    }
}


function updateBullet(bullet) {
    // Ellenőrzi, hogy a célpont még létezik-e
    if (enemies.includes(bullet.target)) {
        var dx = bullet.target.x - bullet.x;
        var dy = bullet.target.y - bullet.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            bullet.x += dx / distance * 3;
            bullet.y += dy / distance * 3;
        }
        if (Math.abs(bullet.x - bullet.target.x) < 1 && Math.abs(bullet.y - bullet.target.y) < 1) {
            bullet.target.hp -= 10;
            if (bullet.target.hp <= 0) {
                var index = enemies.indexOf(bullet.target);
                gold+=Math.floor(bullet.target.cost*1.3);
                experience+=Math.floor(bullet.target.cost*0.7);
                enemyGold+=Math.floor(bullet.target.cost*1.3);
                if (index != -1) {
                    enemies.splice(index, 1);
                }
            }
            var index = bullets.indexOf(bullet);
            if (index != -1) {
                bullets.splice(index, 1);
                console.log("bullet megszűnik");
            }
        }
    } else {
        // Ha a célpont már nem létezik, törli a bullet-et
        var index = bullets.indexOf(bullet);
        if (index != -1) {
            bullets.splice(index, 1);
        }
    }
}