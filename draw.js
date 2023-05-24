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


//eddig

function drawUnit(unit, friend = 0) {
    var plusSize = 10;
    if(unit.width > 100)
    plusSize = 20;



    if (unitImages[unit.name]) {
        // Kép kirajzolása
        ctx.save();
        if (friend == 1) {
            
            ctx.fillStyle = 'black';
            ctx.fillRect(unit.x, unit.height + 100, unit.width+3, 5+3);
            ctx.translate(unit.x + unit.width, unit.y + unit.height);
            ctx.scale(-1, 1); // Tükrözzük a képet az x tengely mentén
            ctx.drawImage(unitImages[unit.name], 0, -unit.height * 2 - 50, unit.width + 35, unit.height + 80);

            ctx.restore();
            ctx.fillStyle = 'green';
            var hpPercentage = unit.hp / unit.maxHp;
            ctx.fillRect(unit.x, unit.height + 100, unit.width * hpPercentage, 5);
            
        } else {
            
            ctx.drawImage(unitImages[unit.name], unit.x, unit.y - unit.height -50, unit.width + 35, unit.height + 80);
            ctx.fillStyle = 'black';
            ctx.fillRect(unit.x, unit.height + 100, unit.width+3, 5+3);
            ctx.fillStyle = 'red';
            var hpPercentage = unit.hp / unit.maxHp;
            ctx.fillRect(unit.x, unit.height + 100, unit.width * hpPercentage, 5);
            
        }
        ctx.restore();
    } else {
        // Normál négyszög kirajzolása
        ctx.fillStyle = unit.color;
        ctx.fillRect(unit.x, unit.y, unit.width, unit.height);
    }
}




function drawCastle(castle) {
    //ctx.fillStyle = castle.color;
    //ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
    var castleImage = new Image();
    castleImage.src = "img/house.png";  // itt adjuk meg a kép elérési útját

    ctx.drawImage(castleImage, castle.x, castle.y - 25, castle.width + 50, castle.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(castle.x + 20, castle.y - 40, castle.width, 5);

    ctx.fillStyle = 'green';
    ctx.fillRect(castle.x + 20, castle.y - 40, castle.width * (castle.hp / castle.maxHP), 5);
}

function drawDefender(defender) {
    ctx.fillStyle = 'gray';
    var defenderImage = new Image();
    defenderImage.src = "img/plant.png";  // itt adjuk meg a kép elérési útját

    ctx.drawImage(defenderImage, defender.x, defender.y, defender.width + 50, defender.height);
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
        ctx.drawImage(img, bullet.x, bullet.y, bullet.width + 50, bullet.height);
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
