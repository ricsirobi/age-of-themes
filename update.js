function updateUnit(unit, targets, castle) {
    // Frissíti az egységet a játék folyamán
    var nearestEnemy = targets.reduce(function (nearest, enemy) {
        // Megkeresi a legközelebbi ellenséget az egységhez képest
        var distance = Math.abs(unit.x - enemy.x);
        if (distance < nearest.distance) {
            return { enemy: enemy, distance: distance };
        } else {
            //console.log(nearest);
            return nearest; 
        }
    }, { enemy: null, distance: Infinity });

    unit.target = nearestEnemy.enemy;

    if (nearestEnemy.distance < unit.range && unit.rangeDamage > 0 && unit.unitType === "ranged") {
        
        // Ha a legközelebbi ellenség a lőtávolságon belül van és az egység támadó képességgel rendelkezik (ranged típusú)
        if (unit.rangeAttackCooldown <= 0) {
            // Ha a támadási cooldown lejárt
            nearestEnemy.enemy.hp -= unit.rangeDamage;
            // Csökkenti az ellenség életerejét
            unit.rangeAttackCooldown = unit.rangeAttackspeed;
            // Újra beállítja a támadási cooldown-t
            if (nearestEnemy.enemy.hp <= 0) {
                // Ha az ellenségnek elfogyott az életereje
                var enemyIndex = targets.indexOf(nearestEnemy.enemy);
                targets.splice(enemyIndex, 1);
                // Eltávolítja az ellenséget a célpontok közül
                gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                // Növeli az arany mennyiségét a legyőzött ellenség költségének egy részével
                experience += Math.floor(nearestEnemy.enemy.cost * 1.4);
                // Növeli az tapasztalat mennyiségét a legyőzött ellenség költségének egy részével
            }
        } else {
            unit.rangeAttackCooldown -= 0.1;
            // Csökkenti a támadási cooldown-t
        }
        if(nearestEnemy.range < nearestEnemy.distance)
        {
            unit.x += unit.speed;
            // Mozgatja az egységet a sebessége szerint

        }
    } else if (nearestEnemy.distance < unit.width) {
        // Ha a legközelebbi ellenség a támadótávolságon belül van (melee támadás)
        if (unit.attackCooldown <= 0) {
            // Ha a támadási cooldown lejárt
            if (unit.unitType === "ranged") {
                // Ha ranged típusú egységről van szó
                nearestEnemy.enemy.hp -= unit.damage;
                // Csökkenti az ellenség életerejét
                unit.attackCooldown = unit.attackspeed;
                // Újra beállítja a támadási cooldown-t
                if (nearestEnemy.enemy.hp <= 0) {
                    // Ha az ellenségnek elfogyott az életereje
                    var enemyIndex = targets.indexOf(nearestEnemy.enemy);
                    targets.splice(enemyIndex, 1);
                    // Eltávolítja az ellenséget a célpontok közül
                    gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                    // Növeli az arany mennyiségét a legyőzött ellenség költségének egy részével
                }
            } else {
                //támad a meele
                // Ha melee típusú egységről van szó
                nearestEnemy.enemy.hp -= unit.damage;
                // Csökkenti az ellenség életerejét
                unit.attackCooldown = unit.attackspeed;
                // Újra beállítja a támadási cooldown-t
                if (nearestEnemy.enemy.hp <= 0) {
                    // Ha az ellenségnek elfogyott az életereje
                    var enemyIndex = targets.indexOf(nearestEnemy.enemy);
                    targets.splice(enemyIndex, 1);
                    // Eltávolítja az ellenséget a célpontok közül
                    gold += Math.floor(nearestEnemy.enemy.cost * 1.33);
                    // Növeli az arany mennyiségét a legyőzött ellenség költségének egy részével
                }
            }
        } else {
            unit.attackCooldown -= 0.1;
            // Csökkenti a támadási cooldown-t
        }
    } else if (Math.abs(unit.x - castle.x) < unit.range + unit.width / 3) {
        // Ha a támadó a várhoz közel van (melee támadás)
        if (unit.attackCooldown <= 0) {
            // Ha a támadási cooldown lejárt
            castle.hp -= unit.damage;
            // Csökkenti a vár életerejét
            unit.attackCooldown = unit.attackspeed;
            // Újra beállítja a támadási cooldown-t
            if (castle.hp <= 0) {
                // Ha a vár életereje elfogyott
                gameOverMessage.style.display = 'block';
                // Megjeleníti a játék vége üzenetet
            }
        } else {
            unit.attackCooldown -= 0.1;
            // Csökkenti a támadási cooldown-t
        }
    } else {
        // Ha nincs közvetlenül előtte egység vagy támadható ellenség
        var allies;
        if (castle.color === "blue") {
            allies = enemies;
            // Az egység ellenséges egységekkel rendelkezik
        } else {
            allies = units;
            // Az egység saját egységekkel rendelkezik
        }

        var unitIndex = allies.findIndex(function (otherUnit) {
            return otherUnit === unit;
        });
        // Az egység indexe az egységek között

        var distanceRequired = 0;
        for (var i = 0; i < unitIndex; i++) {
            distanceRequired += allies[i].width;
        }
        // Számolja az előtte lévő egységek összességes szélességét

        var unitInFront = allies.find(function (otherUnit) {
            return (
                otherUnit !== unit &&
                (otherUnit.attackCooldown > 0 || otherUnit.x >= unit.x) &&
                Math.abs(unit.x - otherUnit.x) <= distanceRequired
            );
        });
        //console.log(unit.name +" előtt áll " + unitInFront.length?unitInFront.length:0 + " barát ")
        // Megkeresi az előtte lévő egységet

        var canAttack = unitInFront && unitInFront.unitType === 'ranged' && nearestEnemy.distance <= unit.range;
        // Megállapítja, hogy az előtte lévő egység támadható és támadó típusú-e, valamint van-e ellenség a lőtávolságon belül

        if (!unitInFront && !canAttack) {
            unit.x += unit.speed;
            // Ha nincs előtte egység és nem tud támadni, mozgatja az egységet a sebessége szerint
        }
        else if(unitInFront && unitInFront.length) {
            console.log("Az egység megállt mert " + unitInFront.length + "egység előtte van");
        }
        else if (canAttack) {
            console.log("Az egység megállt mert támad, range-je: " + unit.range);
        }
        
    }
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
            defender.attackCooldown = 60 / defender.attackSpeed;
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