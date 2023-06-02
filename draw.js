// Létrehozom és betöltöm a képet egyszer, majd eltárolom a 'unit'-ben


var unitImages = {};
var unitSizes = {};

unitImages["Clubman"] = new Image();
unitImages["Clubman"].src = "img/zombie.png";

unitImages["Slinger"] = new Image();
unitImages["Slinger"].src = "img/rangedzombie.png";

unitImages["Dino Rider"] = new Image();
unitImages["Dino Rider"].src = "img/bigzombie.png";

unitImages["Creeper Sapper"] = new Image();
unitImages["Creeper Sapper"].src = "img/creeper.png";

unitImages["Ender Knight"] = new Image();
unitImages["Ender Knight"].src = "img/enderman.png";

unitImages["Iron Golem"] = new Image();
unitImages["Iron Golem"].src = "img/irongolem.png";

unitImages["Mario"] = new Image();
unitImages["Mario"].src = "img/mario.png";

unitImages["Yoshi"] = new Image();
unitImages["Yoshi"].src = "img/yoshi.png";

unitImages["Donkey Kong"] = new Image();
unitImages["Donkey Kong"].src = "img/donkeykong.png";

unitImages["Stormtrooper"] = new Image();
unitImages["Stormtrooper"].src = "img/stormTrooper.png";

unitImages["Darth Vader"] = new Image();
unitImages["Darth Vader"].src = "img/darthvader.png";


unitImages["Jedi Knight"] = new Image();
unitImages["Jedi Knight"].src = "img/jedi.png";



function drawHp(unit)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(unit.x, unit.y - 120, unit.width + 3, 5 + 3);
    ctx.fillStyle = (unit==units[0]) ? 'green' : 'red';
    var hpPercentage = unit.hp / unit.maxHp;
    ctx.fillRect(unit.x, unit.y -120, unit.width * hpPercentage, 5);
}

function drawSprite(unit, type="fight") {
    var frameWidth;
    var frameHeight;
    var totalFrames;
    var spriteSheet;
    var shouldFlip = false;
    
 /*   if(!unit.fightSpriteHeight || ! unit.fightSpriteWidth || !unit.attackImage || !unit.image || !unit.fightFrameCount || !unit.walkFrameCount || unit.currentFrame>unit.walkFrameCount)
    {
        unit.fightSpriteHeight = unit.attackImage.height;  
        unit.fightSpriteWidth = unit.attackImage.width; 
        unit.attackImage = unit.image;
        //unit.image ;
        unit.fightFrameCount = 1;
        unit.walkFrameCount = 1;
    }*/
    switch (type) {
        case "fight":
            frameWidth = unit.fightSpriteWidth;
            frameHeight = unit.fightSpriteHeight;
            totalFrames = unit.fightFrameCount;
            spriteSheet = unit.attackImage;
            if(unit==units[0]) {
                shouldFlip = true;
            }
            break;
        case "walk":
            frameWidth = unit.walkSpriteWidth;
            frameHeight = unit.walkSpriteHeight;
            totalFrames = unit.walkFrameCount;
            spriteSheet = unit.image;
            if(units.includes(unit))
            shouldFlip = true;
            break;
        default:
            
            break;
    }

    var currentFrame = unit.currentFrame % 4 == 0 ? unit.currentFrame : unit.currentFrame - unit.currentFrame % 4;

    ctx.save(); // save the current state of the context

    if (shouldFlip) {
        ctx.scale(-1, 1); // flip context horizontally
        ctx.translate(-2 * unit.x - unit.width - 50, 0); // shift context back to its original position
    }

    ctx.drawImage(
        spriteSheet,
        currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        unit.x, unit.y-120,
        unit.width+50, unit.height+100
    );

    ctx.restore();
    }
//eddig

function drawUnit(unit, friend = 0) {
    var plusSize = 10;
    if(unit.width > 100)
    plusSize = 20;
    if(unit.name=="Player Unit" && !unit.image)
    {
        return;
    }
    if(unit.name=="Player Unit")
    {
        ctx.drawImage(unit.image, unit.x, unit.y - unit.height -50, unit.width + 35, unit.height + 80);
            ctx.fillStyle = 'black';
            ctx.fillRect(unit.x, unit.height + 100, unit.width+3, 5+3);
            ctx.fillStyle = 'red';
            var hpPercentage = unit.hp / unit.maxHp;
            ctx.fillRect(unit.x, unit.height + 100, unit.width * hpPercentage, 5);
            return;
    }

    if (unit.isFighting && unit.name == "Clubman") {
        drawHp(unit);
        drawSprite(unit,"fight");
    }
    else if (unitImages[unit.name]) {
        // Kép kirajzolása
        ctx.save();
        if (friend == 1) {
            
            drawSprite(unit,"walk");
            
            
        } else {
            drawSprite(unit,"walk"); 
            
           // ctx.drawImage(unitImages[unit.name], unit.x, unit.y - unit.height -50, unit.width + 35, unit.height + 80);
          //  ctx.fillStyle = 'black';
           // ctx.fillRect(unit.x, unit.height + 100, unit.width+3, 5+3);
          //  ctx.fillStyle = 'red';
          //  var hpPercentage = unit.hp / unit.maxHp;
          //  ctx.fillRect(unit.x, unit.height + 100, unit.width * hpPercentage, 5);
            
        }
        ctx.restore();
    } else {
        // Normál négyszög kirajzolása
        ctx.fillStyle = unit.color;
        ctx.fillRect(unit.x, unit.y, unit.width, unit.height);
    }
}




function drawCastle(castle, age) {
    //ctx.fillStyle = castle.color;
    //ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
    var castleImage = new Image();
    castleImage.src = "img/age"+age+"House.png";  
   // console.log(castleImage.src);
      // itt adjuk meg a kép elérési útját

    ctx.drawImage(castleImage, castle.x, castle.y - 25, castle.width + 50, castle.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(castle.x + 20, castle.y - 40, castle.width, 5);

    ctx.fillStyle = 'green';
    ctx.fillRect(castle.x + 20, castle.y - 40, castle.width * (castle.hp / castle.maxHP), 5);
}

function drawDefender(defender, gotCastle = castle) {
    var spriteSheet = new Image();
spriteSheet.src = "img/allie-plant-attack-sprite.png";
var frameWidth = 644; // A képkockák szélessége
var frameHeight = 616; // A képkockák magassága
var totalFrames = 60; // A képkockák száma

var currentFrame = defender.currentFrame;

    if (defender.isFighting && gotCastle == castle) {
        ctx.drawImage(
            spriteSheet,
            currentFrame * frameWidth, 0, // A képkocka kezdőpontja a sprite sheet-en
            frameWidth, frameHeight, // A képkocka mérete
            defender.x, defender.y, 
            defender.width + 50, defender.height
        );
        // Növeljük a képkocka indexét
        currentFrame = (currentFrame + 1) % totalFrames;
    
    }
    else
    {
    ctx.fillStyle = 'gray';
    var defenderImage = new Image();
    defenderImage.src = "img/plant.png";

    if (gotCastle != castle) {
        ctx.save();  // Mentjük az eredeti állapotot
        ctx.translate(defender.x + defender.width / 2, defender.y + defender.height / 2);  // Áthelyezzük a rajzolási origót a kép közepére
        ctx.scale(-1, 1); // Tükrözzük a képet az x tengely mentén
        ctx.drawImage(defenderImage, -defender.width / 2, -defender.height / 2, defender.width + 50, defender.height + 30);  // A kép rajzolása az új origóból
        ctx.restore();  // Visszaállítjuk az eredeti állapotot
    } else {
        ctx.drawImage(defenderImage, defender.x, defender.y, defender.width + 50, defender.height);
    }
}
}


var arrowImage = new Image();
    arrowImage.src = "img/arrow.png";

function drawBullet(bullet,style=null,castle=null) {
    if(!style && !castle)
    {
    ctx.fillStyle = "green";

    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2, true); // Kirajzol egy kör alakú alakzatot
    ctx.fill(); // Kitölti a kör belsejét a beállított színnel
    }
    else
    {
        let img = Image();
        switch (castle) {
            case enemyCastle:
                switch (style) {
                    case "arrow":
                        image = arrowImage;
                        console.log("arrowot küldök castle enemy");
                        break;
                
                    default:
                        break;
                }
                break;
        
            default:
                switch (style) {
                    case "arrow":
                        image= arrowImage;
                        console.log("player");

                        break;
                
                    default:
                        break;
                }
                break;
        }
        ctx.drawImage(img, bullet.x, bullet.y, bullet.width + 100, bullet.height+100);
    }

}

var meteorImage = new Image();
meteorImage.src = "img/meteor.png";  // itt adjuk meg a fű kép elérési útját



function drawMeteors() {
    meteors.forEach(function (meteor) {
        drawMeteor(meteor);
    });
}

// A meteors rajzolásának függvényében:
function drawMeteor(meteor) {
    ctx.save(); // Mentse el a jelenlegi állapotot

    // Transzformálja a rajzolási origót a meteor középpontjába
    ctx.translate(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2);

    // Tükrözze a képet a meteor iránya alapján
    ctx.scale(meteor.dx > 0 ? -1 : 1, 1);

    // Rajzolja meg a képet úgy, hogy az origó elmozdulását kompenzálja
    ctx.drawImage(meteorImage, -meteor.width / 2, -meteor.height / 2, meteor.width, meteor.height);

    ctx.restore(); // Állítsa vissza az eredeti állapotot

    meteor.x += meteor.dx; // Mozgasd a meteor x pozícióját a dx értéke alapján
}




var grassImage = new Image();
grassImage.src = "https://static.wikia.nocookie.net/plantsvszombies/images/d/d5/Almanac_GroundDay.jpg/";  // itt adjuk meg a fű kép elérési útját

function drawGrass() {
    var pattern = ctx.createPattern(grassImage, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, castle.y + castle.height - 30, canvas.width, canvas.height - castle.y - castle.height + 30);
}

var skyImage = new Image();
skyImage.src = "https://media.contentapi.ea.com/content/dam/eacom/pvz/pvz-bfn/common/pvz-bfn-section-bg-ns-landing-hero-rtue-xl.jpg.adapt.320w.jpg";
function drawSky() {
    var pattern = ctx.createPattern(skyImage, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, +100, canvas.width, castle.y);
}
