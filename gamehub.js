javascript:(function(){

// ============================================================
// GAME HUB
// WAVE PRO + TOWER DEFENSE + RAGDOLL ARCHERS + SNAKE + RUNNER
// FIXED RAGDOLL PHYSICS / STANDING JOINTS
// 100% CODE DRAWN — NO EXTERNAL IMAGES
// NOTE: if your gonna copy this code, please give credit to the original authors (me and github copiliot) and don't remove the credits from the source code. thanks!
// ============================================================

let currentCleanup = null;

const SITE_ANNOUNCEMENT={
    title:"Current Version: v3.8",
    text:"uh you know. we added minecraft and stuff",
    accent:"#67e8f9"
};


// ============================================================
// GLOBAL CLEANUP
// ============================================================

function cleanupCurrentGame(){

    if(currentCleanup){
        try{
            currentCleanup();
        }catch(e){}
        currentCleanup=null;
    }

    document.querySelectorAll(
        ".game-hub-menu,"+
        ".wave-pro-canvas,"+
        ".wave-pro-back,"+
        ".wave-pro-pause,"+
        ".td-overlay-canvas,"+
        ".td-shop-ui,"+
        ".td-back,"+
        ".td-pause,"+
        ".ra-canvas,"+
        ".ra-ui,"+
        ".ra-back,"+
        ".ra-pause,"+
        ".sn-canvas,"+
        ".sn-ui,"+
        ".sn-back,"+
        ".sn-pause,"+
        ".sn-dpad,"+
        ".er-canvas,"+
        ".er-ui,"+
        ".er-back,"+
        ".er-pause,"+
        ".bo-canvas,"+
        ".bo-ui,"+
        ".bo-back,"+
        ".bo-pause,"+
        ".pg-canvas,"+
        ".pg-ui,"+
        ".pg-back,"+
        ".pg-pause,"+
        ".tt-canvas,"+
        ".tt-ui,"+
        ".tt-back,"+
        ".mm-canvas,"+
        ".mm-ui,"+
        ".mm-back,"+
        ".as-canvas,"+
        ".as-ui,"+
        ".as-back,"+
        ".as-pause,"+
        ".as-controls,"+
        ".tx-canvas,"+
        ".tx-ui,"+
        ".tx-back,"+
        ".tx-pause,"+
        ".tx-controls,"+
        ".si-canvas,"+
        ".si-ui,"+
        ".si-back,"+
        ".si-pause,"+
        ".si-controls,"+
        ".fb-canvas,"+
        ".fb-ui,"+
        ".fb-back,"+
        ".st-canvas,"+
        ".st-ui,"+
        ".st-back,"+
        ".bs-canvas,"+
        ".bs-ui,"+
        ".bs-back,"+
        ".bs-pause,"+
        ".fs-canvas,"+
        ".fs-ui,"+
        ".fs-back,"+
        ".fs-pause,"+
        ".js-canvas,"+
        ".js-ui,"+
        ".js-back,"+
        ".mc3d-canvas,"+
        ".mc3d-back,"+
        ".mc3d-pause,"+
        ".mc3d-ui"
    ).forEach(e=>e.remove());

    document.body.style.userSelect="";
    document.body.style.webkitUserSelect="";
    document.body.style.touchAction="";
}


// ============================================================
// SHARED UI HELPERS (used by every mini-game)
// ============================================================

function makeBackButton(className){

    const b=document.createElement("button");

    b.className=className;
    b.textContent="☰ MENU";

    Object.assign(b.style,{
        position:"fixed",
        bottom:"15px",
        right:"15px",
        zIndex:"100003",
        background:
            "linear-gradient(135deg,rgba(20,20,25,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"14px",
        boxShadow:
            "0 0 15px rgba(255,255,255,.15),"+
            "0 5px 18px rgba(0,0,0,.45)"
    });

    document.body.appendChild(b);

    return b;
}


function makePauseButton(className){

    const b=document.createElement("button");

    b.className=className;
    b.textContent="⏸";

    Object.assign(b.style,{
        position:"fixed",
        top:"12px",
        right:"12px",
        zIndex:"100003",
        background:
            "linear-gradient(135deg,rgba(20,20,25,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"16px",
        boxShadow:
            "0 0 15px rgba(255,255,255,.15),"+
            "0 5px 18px rgba(0,0,0,.45)"
    });

    document.body.appendChild(b);

    return b;
}

function makeArcadePauseButton(className,onChange){

    const b=makePauseButton(className);
    let paused=false;

    b.onclick=function(){
        paused=!paused;
        b.textContent=paused?"▶":"⏸";
        onChange(paused);
    };

    return b;
}


function roundRectHub(c,x,y,w,h,r){

    if(w<=0)w=0.01;
    if(h<=0)h=0.01;

    c.beginPath();
    c.moveTo(x+r,y);
    c.arcTo(x+w,y,x+w,y+h,r);
    c.arcTo(x+w,y+h,x,y+h,r);
    c.arcTo(x,y+h,x,y,r);
    c.arcTo(x,y,x+w,y,r);
    c.closePath();
}

function drawGameAtmosphere(ctx,canvas,accent,phase){

    const bg=ctx.createRadialGradient(canvas.width*.5,canvas.height*.18,10,canvas.width*.5,canvas.height*.55,canvas.width*.8);
    bg.addColorStop(0,"#172b48");
    bg.addColorStop(.55,"#091321");
    bg.addColorStop(1,"#03060b");
    ctx.fillStyle=bg;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const glow=ctx.createRadialGradient(canvas.width*.18,canvas.height*.16,0,canvas.width*.18,canvas.height*.16,canvas.width*.42);
    glow.addColorStop(0,accent+"99");
    glow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.globalAlpha=.28;
    ctx.fillStyle=glow;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha=1;

    ctx.strokeStyle="rgba(180,220,255,.045)";
    ctx.lineWidth=1;
    const drift=(phase||0)%50;
    for(let x=-50+drift;x<canvas.width+50;x+=50){
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
    }
    for(let y=-50+drift;y<canvas.height+50;y+=50){
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
    }

    for(let i=0;i<48;i++){
        const x=(i*173)%canvas.width;
        const y=(i*281)%canvas.height;
        ctx.fillStyle=i%2?"rgba(255,255,255,.7)":accent;
        ctx.globalAlpha=.35+(i%4)*.12;
        ctx.fillRect(x,y,1+(i%3)*.6,1+(i%3)*.6);
    }
    ctx.globalAlpha=1;
}


// ============================================================
// SHARED "JUICE" HELPERS — floating score text + screen shake,
// reused by multiple games for punchier feedback.
// ============================================================

function makeFloatingTextPool(){

    const texts=[];

    return {

        spawn(x,y,label,color,size){
            texts.push({
                x,y,label,
                color:color||"#fff",
                size:size||18,
                life:1,
                vy:-46
            });
        },

        update(dt){
            for(let i=texts.length-1;i>=0;i--){
                const t=texts[i];
                t.y+=t.vy*dt;
                t.vy*=0.94;
                t.life-=dt*1.15;
                if(t.life<=0)texts.splice(i,1);
            }
        },

        hasActive(){
            return texts.length>0;
        },

        draw(ctx){
            for(const t of texts){
                ctx.save();
                ctx.globalAlpha=Math.max(0,Math.min(1,t.life));
                ctx.textAlign="center";
                ctx.fillStyle=t.color;
                ctx.shadowColor=t.color;
                ctx.shadowBlur=8;
                ctx.font="900 "+t.size+"px Arial";
                ctx.fillText(t.label,t.x,t.y);
                ctx.restore();
            }
        }
    };
}

function makeShaker(){

    let time=0;

    return {

        kick(amount){
            time=Math.max(time,amount||10);
        },

        apply(ctx){
            if(time<=0)return;
            time--;
            const mag=time*0.55;
            ctx.translate(
                (Math.random()-.5)*mag,
                (Math.random()-.5)*mag
            );
        }
    };
}


// ============================================================
// MAIN MENU
// ============================================================

function showMainMenu(){

    cleanupCurrentGame();

    const menu=document.createElement("div");

    menu.className="game-hub-menu";

    const glowA=document.createElement("div");
    const glowB=document.createElement("div");
    const glowC=document.createElement("div");

    [glowA,glowB,glowC].forEach((glow,i)=>{
        Object.assign(glow.style,{
            position:"absolute",
            borderRadius:"50%",
            filter:"blur(50px)",
            opacity:"0.38",
            pointerEvents:"none",
            animation: i===0 ? "menuFloat 12s ease-in-out infinite" : i===1 ? "menuFloat 16s ease-in-out infinite reverse" : "menuFloat 18s ease-in-out infinite"
        });
        menu.appendChild(glow);
    });

    glowA.style.width="320px"; glowA.style.height="320px"; glowA.style.left="7%"; glowA.style.top="10%"; glowA.style.background="rgba(31,165,255,0.35)";
    glowB.style.width="320px"; glowB.style.height="320px"; glowB.style.right="8%"; glowB.style.top="18%"; glowB.style.background="rgba(167,95,255,0.3)";
    glowC.style.width="420px"; glowC.style.height="420px"; glowC.style.left="50%"; glowC.style.bottom="0"; glowC.style.transform="translateX(-50%)"; glowC.style.background="rgba(34,197,94,0.18)";

    Object.assign(menu.style,{
        position:"fixed",
        inset:"0",
        zIndex:"999999",
        background:
            "radial-gradient(circle at 50% 15%,#203b58 0%,#0c1422 35%,#03050a 78%)",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"flex-start",
        fontFamily:"Arial,sans-serif",
        color:"#fff",
        userSelect:"none",
        WebkitUserSelect:"none",
        overflowY:"auto",
        overflowX:"hidden",
        padding:"28px 0 30px",
        position:"relative",
        overscrollBehavior:"contain"
    });

    document.body.style.overflow="auto";
    document.documentElement.style.overflow="auto";

    const menuStyle=document.createElement("style");
    menuStyle.textContent=`@keyframes menuFloat { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(0,-12px,0) scale(1.08); } }`;
    menu.appendChild(menuStyle);

    const content=document.createElement("div");
    Object.assign(content.style,{
        position:"relative",
        zIndex:"1",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        width:"100%"
    });

    menu.appendChild(content);

    const title=document.createElement("div");

    title.textContent="GAME HUB";

    Object.assign(title.style,{
        fontSize:"52px",
        fontWeight:"900",
        letterSpacing:"5px",
        marginBottom:"10px",
        marginTop:"8px",
        color:"#e9fbff",
        textShadow:
            "0 0 8px rgba(0,229,255,.9),"+
            "0 0 20px rgba(0,229,255,.7),"+
            "0 0 45px rgba(0,229,255,.45)"
    });

    content.appendChild(title);

    const subtitle=document.createElement("div");

    subtitle.textContent="CHOOSE YOUR GAME";

    Object.assign(subtitle.style,{
        color:"#9fb4c7",
        fontSize:"14px",
        letterSpacing:"4px",
        marginBottom:"18px",
        textShadow:"0 1px 8px #000"
    });

    content.appendChild(subtitle);

    const announcement=document.createElement("div");
    announcement.className="game-hub-announcement";

    Object.assign(announcement.style,{
        width:"min(900px, calc(100% - 28px))",
        marginBottom:"20px",
        borderRadius:"18px",
        background:"linear-gradient(135deg,rgba(15,25,44,.96),rgba(10,17,26,.9))",
        border:"1px solid rgba(255,255,255,.18)",
        padding:"16px 18px",
        boxShadow:"0 18px 40px rgba(0,0,0,.38)",
        color:"#edf7ff",
        backdropFilter:"blur(8px)"
    });

    const announcementTitle=document.createElement("div");
    announcementTitle.textContent=SITE_ANNOUNCEMENT.title;
    Object.assign(announcementTitle.style,{
        fontSize:"15px",
        fontWeight:"900",
        letterSpacing:"2px",
        color:SITE_ANNOUNCEMENT.accent,
        marginBottom:"8px"
    });

    const announcementText=document.createElement("div");
    announcementText.textContent=SITE_ANNOUNCEMENT.text;
    Object.assign(announcementText.style,{
        fontSize:"13px",
        lineHeight:"1.5",
        color:"#dfeaf7",
        opacity:"0.95"
    });

    announcement.appendChild(announcementTitle);
    announcement.appendChild(announcementText);
    content.appendChild(announcement);

    const grid=document.createElement("div");

    Object.assign(grid.style,{
        display:"grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,260px))",
        gap:"10px",
        justifyContent:"center",
        maxWidth:"960px",
        width:"100%",
        padding:"0 16px 24px 16px",
        boxSizing:"border-box"
    });

    content.appendChild(grid);

    function makeSection(titleText){
        const section=document.createElement("div");
        Object.assign(section.style,{
            width:"min(960px, calc(100% - 32px))",
            margin:"8px 0 6px",
            display:"flex",
            flexDirection:"column",
            gap:"10px"
        });

        const label=document.createElement("div");
        label.textContent=titleText;
        Object.assign(label.style,{
            color:"#dbeafe",
            fontSize:"12px",
            fontWeight:"900",
            letterSpacing:"4px",
            textTransform:"uppercase",
            opacity:"0.9",
            margin:"8px 0 2px 8px"
        });

        const sectionGrid=document.createElement("div");
        Object.assign(sectionGrid.style,{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(220px,260px))",
            gap:"10px",
            justifyContent:"center",
            width:"100%"
        });

        section.appendChild(label);
        section.appendChild(sectionGrid);
        content.appendChild(section);

        return sectionGrid;
    }


    function makeButton(label,color,callback,container=grid,description=""){

        const b=document.createElement("button");
        b.type="button";
        b.style.position="relative";

        const shine=document.createElement("div");
        Object.assign(shine.style,{
            position:"absolute",
            inset:"0",
            background:"radial-gradient(circle at top left, rgba(255,255,255,.28), transparent 32%)",
            pointerEvents:"none"
        });
        b.appendChild(shine);

        const tag=document.createElement("div");
        tag.textContent=label.split(" ")[0];
        Object.assign(tag.style,{
            position:"absolute",
            top:"12px",
            right:"12px",
            minWidth:"38px",
            height:"26px",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            borderRadius:"999px",
            padding:"0 10px",
            fontSize:"11px",
            fontWeight:"900",
            letterSpacing:"1px",
            background:"rgba(8,12,20,.34)",
            border:"1px solid rgba(255,255,255,.25)",
            color:"#f8fbff",
            boxShadow:"inset 0 1px 0 rgba(255,255,255,.18)"
        });
        b.appendChild(tag);

        const titleRow=document.createElement("div");
        titleRow.textContent=label;
        Object.assign(titleRow.style,{
            fontSize:"19px",
            fontWeight:"900",
            letterSpacing:"0.7px",
            textAlign:"left",
            width:"100%",
            lineHeight:"1.15",
            paddingRight:"62px"
        });

        const desc=document.createElement("div");
        desc.textContent=description;
        Object.assign(desc.style,{
            marginTop:"8px",
            fontSize:"12px",
            lineHeight:"1.35",
            color:"rgba(255,255,255,.82)",
            textAlign:"left",
            width:"100%",
            fontWeight:"600",
            maxWidth:"180px"
        });

        const inner=document.createElement("div");
        Object.assign(inner.style,{
            position:"relative",
            zIndex:"1",
            display:"flex",
            flexDirection:"column",
            alignItems:"flex-start",
            justifyContent:"center",
            width:"100%",
            height:"100%"
        });
        inner.appendChild(titleRow);
        inner.appendChild(desc);
        b.appendChild(inner);

        Object.assign(b.style,{
            width:"100%",
            minHeight:"132px",
            border:"1px solid rgba(255,255,255,.24)",
            borderRadius:"20px",
            padding:"18px 18px 16px",
            background:
                "linear-gradient(135deg, "+
                color+
                " 0%, rgba(22,26,36,.94) 46%, rgba(7,9,14,.96) 100%)",
            color:"#fff",
            fontSize:"17px",
            fontWeight:"bold",
            cursor:"pointer",
            boxShadow:
                "0 0 0 1px rgba(255,255,255,.08), 0 16px 34px rgba(0,0,0,.45), 0 0 26px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.22)",
            transition:"transform .12s ease, filter .12s ease, box-shadow .12s ease, border-color .12s ease",
            touchAction:"manipulation",
            letterSpacing:"0.4px",
            textAlign:"left",
            display:"flex",
            alignItems:"stretch",
            justifyContent:"center",
            overflow:"hidden",
            isolation:"isolate",
            outline:"none"
        });

        b.onpointerdown=function(){
            b.style.transform="scale(.985)";
            b.style.filter="brightness(1.18) saturate(1.15)";
            b.style.boxShadow="0 0 0 1px rgba(255,255,255,.12), 0 12px 26px rgba(0,0,0,.35), 0 0 30px rgba(255,255,255,.12), inset 0 1px 0 rgba(255,255,255,.3)";
            b.style.borderColor="rgba(255,255,255,.42)";
        };

        b.onpointerup=function(){
            b.style.transform="scale(1)";
            b.style.filter="brightness(1) saturate(1)";
            b.style.boxShadow="0 0 0 1px rgba(255,255,255,.08), 0 16px 34px rgba(0,0,0,.45), 0 0 26px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.22)";
            b.style.borderColor="rgba(255,255,255,.24)";
        };

        b.onpointercancel=function(){
            b.style.transform="scale(1)";
            b.style.filter="brightness(1) saturate(1)";
            b.style.boxShadow="0 0 0 1px rgba(255,255,255,.08), 0 16px 34px rgba(0,0,0,.45), 0 0 26px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.22)";
            b.style.borderColor="rgba(255,255,255,.24)";
        };

        b.onmouseenter=function(){
            b.style.transform="translateY(-3px)";
            b.style.filter="brightness(1.06) saturate(1.08)";
            b.style.boxShadow="0 0 0 1px rgba(255,255,255,.12), 0 20px 42px rgba(0,0,0,.55), 0 0 34px rgba(162,203,255,.15), inset 0 1px 0 rgba(255,255,255,.25)";
        };

        b.onmouseleave=function(){
            b.style.transform="translateY(0)";
            b.style.filter="brightness(1) saturate(1)";
            b.style.boxShadow="0 0 0 1px rgba(255,255,255,.08), 0 16px 34px rgba(0,0,0,.45), 0 0 26px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.22)";
        };

        b.onclick=callback;

        container.appendChild(b);
    }

    const GAME_DETAILS={
        "🌊  WAVE PRO":"Defend the base and survive the incoming wave rush.",
        "🏰  TOWER DEFENSE":"Build towers and stop the enemy path before it reaches your core.",
        "🏹  RAGDOLL ARCHERS":"Fire archers and chase ragdoll chaos in a battlefield full of motion.",
        "🐍  SNAKE":"Eat, grow, and avoid crashing into your own tail.",
        "🏃  ENDLESS RUNNER":"Keep dodging and distance yourself from the endless obstacles.",
        "🧱  BREAKOUT":"Bounce the ball and smash every brick before your lives run out.",
        "🔢  2048":"Merge matching tiles until you reach the biggest number possible.",
        "🧠  MEMORY MATCH":"Flip pairs and match every image before your turns run out.",
        "☄️  ASTEROIDS":"Blast incoming rocks and survive the meteor field.",
        "🧩  TETRIS":"Drop blocks, fill lines, and keep the board from overflowing.",
        "👾  SPACE INVADERS":"Blast the alien swarm and protect Earth from invasion.",
        "🐤  FLAPPY BIRD":"Thread through the pipes and keep the little bird flying.",
        "🗼  STACK TOWER":"Balance and stack blocks higher without losing the tower.",
        "🎯  BUBBLE SHOOTER":"Aim carefully, pop groups, and clear the board.",
        "🍉  FRUIT SLICE":"Slice every fruit in sight while avoiding the hazards.",
        "💎  JEWEL SWAP":"Match colorful gems to create combos and clear the board.",
        "🏓  PONG":"Outplay your rival in a fast one-on-one rally duel.",
        "❌  TIC TAC TOE":"Claim three in a row and beat the other player on the grid.",
        "🕹️  2P DUEL":"Battle head-to-head in a speed test of movement and timing.",
        "⚔️  BRAWL BOX":"Fight for control in a close-up arena duel to five points.",
        "🎯  TARGET BATTLE":"Hit the right targets, switch turns, and beat the other player first.",
        "🛡️  SHIELD RACE":"Race across the lane and outlast your opponent in the sprint.",
        "🏒  NEON HOCKEY":"Control your paddle, bank the puck, and score five goals before your rival.",
        "🎨  COLOR CLASH":"Capture glowing zones around the arena and own the most territory.",
        "🚀  ROCKET TAG":"Dash around the arena, tag your rival, and reach five hits first.",
        "⚡  PULSE TAP":"Tap the glowing target as fast as you can and keep the streak alive.",
        "🛰️  ORBIT DODGE":"Weave through moving obstacles while staying in the safe path.",
        "🎲  GRID FLIP":"Flip the board and chain your moves to outscore your rival.",
        "🌠  STAR DASH":"Move through space and keep your ship alive while collecting momentum.",
        "🎵  BEAT POP":"Pop the rhythm targets while the pace keeps climbing.",
        "🔥  FLARE RUN":"Stay moving, dodge the flames, and keep your score climbing.",
        "🏎️  NEON DRIFT":"Thread through traffic, collect boosts, and finish the neon circuit.",
        "💠  CRYSTAL HUNT":"Collect every crystal while hostile drones close in around the arena.",
        "🎯  TARGET RUSH":"Hit moving targets before the timer expires and clear the range.",
        "🧱  MINECRAFT 3D":"Mine blocks, keep moving, and survive the block world.",
        "🌌  SKY SURFER":"Ride the air lanes, collect stars, and dodge incoming hazard drones.",
        "🪐  AETHER DASH":"Sprint through the void, grab energy cores, and stay clear of the rift.",
        "🔷  PRISM SHIFT":"Flip between lanes and survive the neon pattern until the board clears.",
        "💣  BLAST LOOP":"Bounce through the loop, collect sparks, and avoid exploding walls.",
    };

    const GAME_LIST=[
        ["🌊  WAVE PRO","#00a8cc",startWavePro],
        ["🏰  TOWER DEFENSE","#e67e22",startTowerDefense],
        ["🏹  RAGDOLL ARCHERS","#8e44ad",startRagdollArchers],
        ["🐍  SNAKE","#27ae60",startSnake],
        ["🏃  ENDLESS RUNNER","#d35400",startEndlessRunner],
        ["🧱  BREAKOUT","#c0392b",startBreakout],
        ["🔢  2048","#f39c12",start2048],
        ["🧠  MEMORY MATCH","#2980b9",startMemoryMatch],
        ["☄️  ASTEROIDS","#34495e",startAsteroids],
        ["🧩  TETRIS","#6c3fc0",startTetris],
        ["👾  SPACE INVADERS","#1a936f",startSpaceInvaders],
        ["🐤  FLAPPY BIRD","#3aa8b8",startFlappyBird],
        ["🗼  STACK TOWER","#a23fc0",startStackTower],
        ["🎯  BUBBLE SHOOTER","#2266cc",startBubbleShooter],
        ["🍉  FRUIT SLICE","#e0447a",startFruitSlice],
        ["💎  JEWEL SWAP","#7a3fd6",startJewelSwap]
    ];

    const MULTIPLAYER_GAMES=[
        ["🏓  PONG","#16a085",startPong],
        ["❌  TIC TAC TOE","#45b5ff",startTicTacToe],
        ["🕹️  2P DUEL","#ff5aa0",startTwoPlayerDuel],
        ["⚔️  BRAWL BOX","#6d28d9",startBrawlBox],
        ["🎯  TARGET BATTLE","#f59e0b",startTargetBattle],
        ["🛡️  SHIELD RACE","#10b981",startShieldRace],
        ["🏒  NEON HOCKEY","#06b6d4",startNeonHockey],
        ["🎨  COLOR CLASH","#f97316",startColorClash],
        ["🚀  ROCKET TAG","#ec4899",startRocketTag]
    ];

    const QUICK_EXTRA_GAMES=[
        ["⚡  PULSE TAP","#38bdf8",startPulseTap],
        ["🛰️  ORBIT DODGE","#a78bfa",startOrbitDodge],
        ["🎲  GRID FLIP","#f59e0b",startGridFlip],
        ["🌠  STAR DASH","#f472b6",startStarDash],
        ["🎵  BEAT POP","#34d399",startBeatPop],
        ["🔥  FLARE RUN","#fb7185",startFlareRun],
        ["🏎️  NEON DRIFT","#22d3ee",startNeonDrift],
        ["💠  CRYSTAL HUNT","#a3e635",startCrystalHunt],
        ["🎯  TARGET RUSH","#facc15",startTargetRush],
        ["🧱  MINECRAFT 3D","#7dd3fc",startMinecraft3D],
        ["🌌  SKY SURFER","#38bdf8",startSkySurfer],
        ["🪐  AETHER DASH","#a78bfa",startAetherDash],
        ["🔷  PRISM SHIFT","#67e8f9",startPrismShift],
        ["💣  BLAST LOOP","#f97316",startBlastLoop]
    ];

    const singlePlayerGrid=makeSection("SINGLE PLAYER");
    const multiplayerGrid=makeSection("2 PLAYER");

    for(const [label,color,fn] of GAME_LIST){
        makeButton(label,color,function(){
            menu.remove();
            fn();
        },singlePlayerGrid,GAME_DETAILS[label]);
    }

    for(const [label,color,fn] of MULTIPLAYER_GAMES){
        makeButton(label,color,function(){
            menu.remove();
            fn();
        },multiplayerGrid,GAME_DETAILS[label]);
    }

    for(const [label,color,fn] of QUICK_EXTRA_GAMES){
        makeButton(label,color,function(){
            menu.remove();
            fn();
        },singlePlayerGrid,GAME_DETAILS[label]);
    }

    document.body.appendChild(menu);
}


// ============================================================
// WAVE PRO
// ============================================================

function startWavePro(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="wave-pro-canvas";

    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }

    resize();

    Object.assign(canvas.style,{
        position:"fixed",
        top:"0",
        left:"0",
        width:"100%",
        height:"100%",
        zIndex:"100000",
        background:"#000",
        touchAction:"none",
        userSelect:"none",
        WebkitUserSelect:"none",
        WebkitTouchCallout:"none",
        WebkitTapHighlightColor:"transparent"
    });

    document.body.appendChild(canvas);


    const back=document.createElement("button");

    back.className="wave-pro-back";
    back.textContent="☰ MENU";

    Object.assign(back.style,{
        position:"fixed",
        bottom:"15px",
        right:"15px",
        zIndex:"100001",
        background:
            "linear-gradient(135deg,rgba(15,25,35,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"14px",
        boxShadow:
            "0 0 15px rgba(0,220,255,.25),"+
            "0 5px 18px rgba(0,0,0,.45),"+
            "inset 0 1px 0 rgba(255,255,255,.2)"
    });

    document.body.appendChild(back);


    const pauseBtn=document.createElement("button");
    pauseBtn.className="wave-pro-pause";
    pauseBtn.textContent="⏸";

    Object.assign(pauseBtn.style,{
        position:"fixed",
        bottom:"15px",
        left:"15px",
        zIndex:"100001",
        background:
            "linear-gradient(135deg,rgba(15,25,35,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"16px",
        boxShadow:
            "0 0 15px rgba(0,220,255,.25),"+
            "0 5px 18px rgba(0,0,0,.45),"+
            "inset 0 1px 0 rgba(255,255,255,.2)"
    });

    document.body.appendChild(pauseBtn);


    let wave=null;
    let wave2=null;
    let obstacles=[];
    let frame=0;
    let score=0;
    let highScore=0;
    let paused=false;
    let gameRunning=false;
    let gameMode="MENU";
    let isHolding=false;
    const shaker=makeShaker();
    let pointerCount=0;
    let ufoTap=false;
    let trail=[];
    let trail2=[];
    let worldX=0;
    let lastTime=performance.now();
    let curRot=0;
    let curRot2=0;
    let animationId;
    let difficulty="NORMAL";
    let corridorGap=285;
    let corridorStep=105;


    function reset(mode){

        gameMode=mode;

        const settings={
            EASY:{speedX:360,speedY:360,gap:345,step:55},
            NORMAL:{speedX:450,speedY:450,gap:285,step:105},
            HARD:{speedX:540,speedY:540,gap:235,step:145}
        };
        const selected=mode==="DUAL"?settings.EASY:settings[difficulty];
        corridorGap=selected.gap;
        corridorStep=selected.step;

        const cy=canvas.height/2;

        wave={
            x:canvas.width*.25,
            y:cy,
            speedY:selected.speedY,
            speedX:selected.speedX
        };

        trail=[];

        curRot=Math.atan2(
            wave.speedY,
            wave.speedX
        );

        if(mode==="DUAL"){

            wave2={
                x:canvas.width*.25,
                y:cy,
                speedY:settings.EASY.speedY,
                speedX:settings.EASY.speedX
            };

            trail2=[];
            curRot2=-curRot;

        }else{

            wave2=null;
            trail2=[];
        }

        obstacles=[];
        worldX=0;
        frame=0;
        score=0;
        gameRunning=true;
        isHolding=false;
        pointerCount=0;
        ufoTap=false;
        lastTime=performance.now();
    }


    function pointerDown(e){

        e.preventDefault();

        if(paused)return;

        pointerCount++;
        isHolding=true;

        if(gameMode==="UFO"){
            ufoTap=true;
        }

        const rect=canvas.getBoundingClientRect();
        const y=e.clientY-rect.top;

        if(gameMode==="MENU"){

            const cy=canvas.height/2;

            if(y>cy-174 && y<cy-144){
                if(e.clientX<canvas.width/2-42){
                    difficulty="EASY";
                }else if(e.clientX>canvas.width/2+42){
                    difficulty="HARD";
                }else{
                    difficulty="NORMAL";
                }
            }else if(y>cy-80 && y<cy-30){
                reset("REGULAR");
            }else if(y>cy && y<cy+50){
                reset("DUAL");
            }else if(y>cy+80 && y<cy+130){
                reset("SHIP");
            }else if(y>cy+160 && y<cy+210){
                reset("UFO");
            }

        }else if(!gameRunning){

            gameMode="MENU";
            gameRunning=false;
        }
    }


    function pointerUp(e){

        e.preventDefault();

        pointerCount=Math.max(
            0,
            pointerCount-1
        );

        if(pointerCount===0){
            isHolding=false;
        }
    }


    function pointerCancel(){

        pointerCount=0;
        isHolding=false;
    }


    canvas.addEventListener(
        "pointerdown",
        pointerDown,
        {passive:false}
    );

    canvas.addEventListener(
        "pointerup",
        pointerUp,
        {passive:false}
    );

    canvas.addEventListener(
        "pointercancel",
        pointerCancel
    );

    canvas.addEventListener(
        "contextmenu",
        e=>e.preventDefault()
    );


    function drawTri(x,y,r,c){

        ctx.save();

        ctx.translate(x,y);
        ctx.rotate(r);

        ctx.shadowColor=c;
        ctx.shadowBlur=18;

        ctx.fillStyle=c;
        ctx.strokeStyle="#fff";
        ctx.lineWidth=2;

        ctx.beginPath();
        ctx.moveTo(18,0);
        ctx.lineTo(-14,-14);
        ctx.lineTo(-14,14);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur=0;

        ctx.fillStyle="rgba(255,255,255,.45)";
        ctx.beginPath();
        ctx.moveTo(9,0);
        ctx.lineTo(-7,-7);
        ctx.lineTo(-7,7);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }


    function draw(t){

        animationId=requestAnimationFrame(draw);

        let dt=Math.min(
            (t-lastTime)/1000,
            .1
        );

        lastTime=t;


        if(gameMode==="MENU"){

            const bg=ctx.createLinearGradient(
                0,0,0,canvas.height
            );

            bg.addColorStop(0,"#07111d");
            bg.addColorStop(.55,"#03070d");
            bg.addColorStop(1,"#000");

            ctx.fillStyle=bg;
            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.textAlign="center";

            ctx.shadowColor="cyan";
            ctx.shadowBlur=25;
            ctx.fillStyle="#e9ffff";
            ctx.font="900 40px Arial";

            ctx.fillText(
                "WAVE PRO",
                canvas.width/2,
                canvas.height/2-120
            );

            ctx.shadowBlur=0;
            ctx.fillStyle="#9fe8ff";
            ctx.font="bold 14px Arial";
            ctx.fillText("DIFFICULTY",canvas.width/2,canvas.height/2-188);

            const difficultyButtons=[
                ["EASY","#54e38e",-90],
                ["NORMAL","#62d9ff",0],
                ["HARD","#ff6685",90]
            ];

            for(const [text,color,offset] of difficultyButtons){
                const bx=canvas.width/2-42+offset;
                const by=canvas.height/2-174;
                ctx.fillStyle=difficulty===text?color:"rgba(255,255,255,.14)";
                ctx.fillRect(bx,by,84,30);
                ctx.strokeStyle=difficulty===text?"#fff":"rgba(255,255,255,.25)";
                ctx.lineWidth=2;
                ctx.strokeRect(bx,by,84,30);
                ctx.fillStyle=difficulty===text?"#00151c":"#c7e9f5";
                ctx.font="bold 12px Arial";
                ctx.fillText(text,bx+42,by+20);
            }

            ctx.shadowBlur=0;

            const buttons=[
                ["cyan","REGULAR",-80],
                ["orange","DUAL MODE",0],
                ["lime","SHIP MODE",80],
                ["magenta","UFO MODE",160]
            ];

            for(const [color,text,offset] of buttons){

                const bx=canvas.width/2-100;
                const by=canvas.height/2+offset;

                ctx.shadowColor=color;
                ctx.shadowBlur=18;

                ctx.fillStyle=color;

                ctx.fillRect(
                    bx,
                    by,
                    200,
                    50
                );

                ctx.shadowBlur=0;

                ctx.fillStyle="rgba(255,255,255,.18)";
                ctx.fillRect(
                    bx,
                    by,
                    200,
                    5
                );

                ctx.fillStyle="#000";
                ctx.font="bold 18px Arial";

                ctx.fillText(
                    text,
                    canvas.width/2,
                    by+33
                );
            }

            return;
        }


        if(!gameRunning){

            highScore=Math.max(
                highScore,
                score
            );

            ctx.fillStyle="rgba(0,0,0,.8)";
            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.textAlign="center";

            ctx.shadowColor="#ff3355";
            ctx.shadowBlur=22;
            ctx.fillStyle="#fff";
            ctx.font="900 30px Arial";

            ctx.fillText(
                "CRASHED",
                canvas.width/2,
                canvas.height/2-40
            );

            ctx.shadowBlur=0;

            ctx.fillText(
                "Score: "+score,
                canvas.width/2,
                canvas.height/2
            );

            ctx.fillText(
                "High Score: "+highScore,
                canvas.width/2,
                canvas.height/2+40
            );

            ctx.fillStyle="#6eeaff";

            ctx.fillText(
                "TAP TO MENU",
                canvas.width/2,
                canvas.height/2+100
            );

            return;
        }


        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(
            0,0,0,canvas.height
        );

        bg.addColorStop(0,"#030a14");
        bg.addColorStop(.5,"#06131b");
        bg.addColorStop(1,"#020407");

        ctx.fillStyle=bg;
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Atmospheric grid

        ctx.strokeStyle="rgba(0,220,255,.045)";
        ctx.lineWidth=1;

        const grid=50;

        for(let x=0;x<canvas.width;x+=grid){

            ctx.beginPath();
            ctx.moveTo(x,0);
            ctx.lineTo(x,canvas.height);
            ctx.stroke();
        }

        for(let y=0;y<canvas.height;y+=grid){

            ctx.beginPath();
            ctx.moveTo(0,y);
            ctx.lineTo(canvas.width,y);
            ctx.stroke();
        }

        worldX+=wave.speedX*dt;


        if(gameMode==="SHIP"){

            const gravity=1800;
            const thrust=-3700;

            wave.speedY+=gravity*dt;

            if(isHolding){
                wave.speedY+=thrust*dt;
            }

            wave.speedY-=wave.speedY*1.5*dt;

            wave.speedY=Math.max(
                -950,
                Math.min(950,wave.speedY)
            );

            wave.y+=wave.speedY*dt;

        }else if(gameMode==="UFO"){

            wave.speedY+=2600*dt;

            if(ufoTap){
                wave.speedY=-650;
                ufoTap=false;
            }

            wave.speedY*=1-.4*dt;

            wave.speedY=Math.max(
                -1200,
                Math.min(1200,wave.speedY)
            );

            wave.y+=wave.speedY*dt;

        }else{

            wave.y+=
                isHolding
                ? -wave.speedY*dt
                : wave.speedY*dt;
        }


        trail.push({
            x:worldX,
            y:wave.y
        });

        if(trail.length>60){
            trail.shift();
        }


        if(wave2){

            wave2.y+=
                isHolding
                ? wave2.speedY*dt
                : -wave2.speedY*dt;

            trail2.push({
                x:worldX,
                y:wave2.y
            });

            if(trail2.length>60){
                trail2.shift();
            }
        }


        function drawTrail(tr,col){

            if(tr.length<2)return;

            ctx.save();

            ctx.shadowColor=col;
            ctx.shadowBlur=20;

            ctx.beginPath();
            ctx.strokeStyle=col;
            ctx.lineWidth=10;
            ctx.lineCap="round";
            ctx.lineJoin="round";

            for(let i=tr.length-1;i>=0;i--){

                const px=
                    wave.x-
                    (worldX-tr[i].x);

                if(i===tr.length-1){
                    ctx.moveTo(px,tr[i].y);
                }else{
                    ctx.lineTo(px,tr[i].y);
                }
            }

            ctx.stroke();

            ctx.shadowBlur=0;

            ctx.strokeStyle="rgba(255,255,255,.3)";
            ctx.lineWidth=2;

            ctx.beginPath();

            for(let i=tr.length-1;i>=0;i--){

                const px=
                    wave.x-
                    (worldX-tr[i].x);

                if(i===tr.length-1){
                    ctx.moveTo(px,tr[i].y);
                }else{
                    ctx.lineTo(px,tr[i].y);
                }
            }

            ctx.stroke();

            ctx.restore();
        }


        drawTrail(trail,"cyan");

        if(wave2){
            drawTrail(trail2,"orange");
        }


        curRot+=(
            Math.atan2(
                isHolding
                ? -wave.speedY
                : wave.speedY,
                wave.speedX
            )-curRot
        )*.4;

        drawTri(
            wave.x,
            wave.y,
            curRot,
            "cyan"
        );


        if(wave2){

            curRot2+=(
                Math.atan2(
                    isHolding
                    ? wave2.speedY
                    : -wave2.speedY,
                    wave2.speedX
                )-curRot2
            )*.4;

            drawTri(
                wave2.x,
                wave2.y,
                curRot2,
                "orange"
            );
        }


        const segmentWidth=70;
        const minCenter=gameMode==="DUAL"?150:110;
        const maxCenter=gameMode==="DUAL"?canvas.height-150:canvas.height-110;

        while(obstacles.length<18){
            const previous=obstacles[obstacles.length-1];
            const previousCenter=previous?previous.center:canvas.height/2;
            const center=Math.max(
                minCenter,
                Math.min(
                    maxCenter,
                    previousCenter+(Math.random()-.5)*(gameMode==="DUAL"?55:corridorStep)
                )
            );
            obstacles.push({
                x:previous?previous.x+segmentWidth:canvas.width,
                center:center,
                gap:corridorGap,
                passed:false
            });
        }

        for(let i=obstacles.length-1;i>=0;i--){
            const o=obstacles[i];
            o.x-=wave.speedX*dt;
            const next=obstacles[i+1]||o;
            const centerAt=x=>o.center+(next.center-o.center)*Math.max(0,Math.min(1,(x-o.x)/segmentWidth));

            function collide(p){
                if(p.x+10>o.x&&p.x-10<o.x+segmentWidth){
                    const center=centerAt(p.x);
                    if(p.y<center-o.gap/2||p.y>center+o.gap/2){
                        gameRunning=false;
                        shaker.kick(14);
                    }
                }
            }

            collide(wave);
            if(wave2)collide(wave2);

            if(!o.passed&&wave.x>o.x+segmentWidth){
                score++;
                o.passed=true;
            }

            if(o.x<-segmentWidth*2)obstacles.splice(i,1);
        }

        ctx.save();
        ctx.shadowColor="rgba(0,230,255,.55)";
        ctx.shadowBlur=14;
        const topRail=[];
        const bottomRail=[];
        for(const o of obstacles){
            topRail.push({x:o.x,y:o.center-o.gap/2});
            bottomRail.push({x:o.x,y:o.center+o.gap/2});
        }

        function drawRail(points,top){
            if(points.length<2)return;
            ctx.beginPath();
            ctx.moveTo(points[0].x,top?0:canvas.height);
            ctx.lineTo(points[0].x,points[0].y);
            for(let i=0;i<points.length-1;i++){
                const a=points[i];
                const b=points[i+1];
                const midX=(a.x+b.x)/2;
                ctx.lineTo(midX,a.y);
                ctx.lineTo(b.x,b.y);
            }
            ctx.lineTo(points[points.length-1].x,top?0:canvas.height);
            ctx.closePath();
            ctx.fillStyle="rgba(0,180,230,.78)";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(points[0].x,points[0].y);
            for(const point of points)ctx.lineTo(point.x,point.y);
            ctx.fillStyle="#8ff7ff";
            for(let i=0;i<points.length-1;i++){
                const a=points[i];
                const b=points[i+1];
                const midX=(a.x+b.x)/2;
                const midY=(a.y+b.y)/2;
                ctx.beginPath();
                ctx.moveTo(midX-12,midY);
                ctx.lineTo(midX+12,midY);
                ctx.lineTo(midX,midY+(top?18:-18));
                ctx.closePath();
                ctx.fill();
            }
        }

        drawRail(topRail,true);
        drawRail(bottomRail,false);
        ctx.restore();


        if(
            wave.y<-20 ||
            wave.y>canvas.height+20
        ){
            gameRunning=false;
        }

        if(
            wave2 &&
            (
                wave2.y<-20 ||
                wave2.y>canvas.height+20
            )
        ){
            gameRunning=false;
        }


        ctx.save();

        ctx.shadowColor="rgba(0,220,255,.45)";
        ctx.shadowBlur=12;

        ctx.fillStyle="#eaffff";
        ctx.textAlign="left";
        ctx.font="900 24px Arial";

        ctx.fillText(
            "Score: "+score,
            25,
            45
        );

        ctx.restore();

        ctx.restore();

        frame++;
    }


    function drawPauseOverlay(){

        ctx.save();

        ctx.fillStyle="rgba(0,0,0,.6)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.textAlign="center";

        ctx.shadowColor="cyan";
        ctx.shadowBlur=22;
        ctx.fillStyle="#eaffff";
        ctx.font="900 42px Arial";

        ctx.fillText(
            "PAUSED",
            canvas.width/2,
            canvas.height/2-10
        );

        ctx.shadowBlur=0;
        ctx.fillStyle="#9fe8ff";
        ctx.font="16px Arial";

        ctx.fillText(
            "Tap ▶ to resume",
            canvas.width/2,
            canvas.height/2+30
        );

        ctx.restore();
    }


    pauseBtn.onclick=function(){

        paused=!paused;

        if(paused){

            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();

        }else{

            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(draw);
        }
    };


    back.onclick=function(){

        cancelAnimationFrame(animationId);
        showMainMenu();

    };


    function resizeHandler(){
        resize();
        if(paused){
            drawPauseOverlay();
        }
    }

    window.addEventListener(
        "resize",
        resizeHandler
    );


    currentCleanup=function(){

        cancelAnimationFrame(animationId);

        window.removeEventListener(
            "resize",
            resizeHandler
        );

        canvas.removeEventListener(
            "pointerdown",
            pointerDown
        );

        canvas.removeEventListener(
            "pointerup",
            pointerUp
        );

        canvas.removeEventListener(
            "pointercancel",
            pointerCancel
        );

        canvas.remove();
        back.remove();
        pauseBtn.remove();
    };


    lastTime=performance.now();

    animationId=
        requestAnimationFrame(draw);
}


// ============================================================
// TOWER DEFENSE
// ============================================================

function startTowerDefense(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";


    const canvas=document.createElement("canvas");
    canvas.className="td-overlay-canvas";

    const ctx=canvas.getContext("2d");
    let gameSpeedMultiplier=1;


    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        generatePath();
    }


    Object.assign(canvas.style,{
        position:"fixed",
        top:"0",
        left:"0",
        width:"100%",
        height:"100%",
        zIndex:"100000",
        pointerEvents:"auto",
        touchAction:"none",
        userSelect:"none"
    });

    document.body.appendChild(canvas);


    const back=document.createElement("button");

    back.className="td-back";
    back.textContent="☰ MENU";

    Object.assign(back.style,{
        position:"fixed",
        bottom:"15px",
        left:"15px",
        zIndex:"100002",
        background:"linear-gradient(135deg,rgba(20,25,25,.96),rgba(0,0,0,.92))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.55)",
        padding:"10px 18px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"bold",
        fontSize:"14px",
        boxShadow:
            "0 0 16px rgba(255,255,255,.12),"+
            "0 6px 20px rgba(0,0,0,.5)"
    });

    document.body.appendChild(back);


    const pauseBtn=document.createElement("button");
    pauseBtn.className="td-pause";
    pauseBtn.textContent="⏸";

    Object.assign(pauseBtn.style,{
        position:"fixed",
        bottom:"15px",
        right:"165px",
        zIndex:"100002",
        background:"linear-gradient(135deg,rgba(20,25,25,.96),rgba(0,0,0,.92))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.55)",
        padding:"10px 18px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"bold",
        fontSize:"16px",
        boxShadow:
            "0 0 16px rgba(255,255,255,.12),"+
            "0 6px 20px rgba(0,0,0,.5)"
    });

    document.body.appendChild(pauseBtn);

    const speedBtn=document.createElement("button");
    speedBtn.className="td-speed";
    speedBtn.textContent="1x Speed";

    Object.assign(speedBtn.style,{
        position:"fixed",
        bottom:"15px",
        right:"260px",
        zIndex:"100002",
        background:"linear-gradient(135deg,rgba(20,40,30,.96),rgba(0,0,0,.92))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.55)",
        padding:"10px 16px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"bold",
        fontSize:"14px",
        boxShadow:
            "0 0 16px rgba(80,255,150,.12),"+
            "0 6px 20px rgba(0,0,0,.5)"
    });

    speedBtn.onclick=function(){
        gameSpeedMultiplier=gameSpeedMultiplier===1?2:1;
        speedBtn.textContent=gameSpeedMultiplier+"x Speed";
    };

    document.body.appendChild(speedBtn);


    const shop=document.createElement("div");

    shop.className="td-shop-ui";

    Object.assign(shop.style,{
        position:"fixed",
        right:"10px",
        top:"10px",
        zIndex:"100001",
        background:
            "linear-gradient(145deg,rgba(10,15,18,.96),rgba(0,0,0,.9))",
        padding:"10px",
        border:"1px solid rgba(255,255,255,.18)",
        borderRadius:"12px",
        display:"flex",
        flexDirection:"column",
        gap:"6px",
        fontFamily:"Arial,sans-serif",
        maxHeight:"90vh",
        overflowY:"auto",
        minWidth:"150px",
        boxShadow:
            "0 10px 30px rgba(0,0,0,.55),"+
            "inset 0 1px 0 rgba(255,255,255,.1)"
    });

    document.body.appendChild(shop);


    const BULLET_SPEED=7;

    const DIFFICULTY_SETTINGS={
        EASY:{
            label:"EASY",
            enemyScale:.9,
            spawnScale:1,
            startCoins:220,
            startHealth:1200,
            coinCap:500,
            bossWaveInterval:5
        },
        NORMAL:{
            label:"NORMAL",
            enemyScale:1,
            spawnScale:1.15,
            startCoins:180,
            startHealth:1000,
            coinCap:320,
            bossWaveInterval:3
        },
        HARD:{
            label:"HARD",
            enemyScale:1.3,
            spawnScale:1.4,
            startCoins:140,
            startHealth:900,
            coinCap:220,
            bossWaveInterval:2
        }
    };

    let difficulty="NORMAL";

    function getDifficultySettings(){
        return DIFFICULTY_SETTINGS[difficulty];
    }

    function addCoins(amount){
        const gain=Math.min(
            amount,
            Math.max(0, moneyCap-coins)
        );

        coins+=gain;
        return gain;
    }

    const ENEMY_TYPES={

        grunt:{
            hp:100,
            speed:1,
            reward:15,
            color:"#e74c3c"
        },

        fast:{
            hp:60,
            speed:2.2,
            reward:10,
            color:"#f39c12"
        },

        tank:{
            hp:260,
            speed:.6,
            reward:35,
            color:"#8e44ad"
        },

        regen:{
            hp:140,
            speed:1,
            reward:20,
            color:"#2ecc71"
        },

        boss:{
            hp:900,
            speed:.7,
            reward:120,
            color:"#2c3e50"
        }
    };


    const TOWER_DATA={

        basic:{
            range:140,
            dmg:20,
            rate:40,
            cost:20,
            color:"#3498db"
        },

        sniper:{
            range:320,
            dmg:80,
            rate:90,
            cost:70,
            color:"#9b59b6"
        },

        rapid:{
            range:120,
            dmg:8,
            rate:10,
            cost:35,
            color:"#1abc9c"
        },

        cannon:{
            range:180,
            dmg:50,
            rate:70,
            cost:80,
            color:"#e67e22"
        },

        ice:{
            range:160,
            dmg:5,
            rate:40,
            cost:60,
            color:"#74b9ff"
        },

        laser:{
            range:220,
            dmg:35,
            rate:25,
            cost:90,
            color:"#ff00ff"
        },

        burn:{
            range:170,
            dmg:10,
            rate:30,
            cost:60,
            color:"#ff6b00",
            dot:5
        },

        poison:{
            range:180,
            dmg:6,
            rate:20,
            cost:65,
            color:"#2ecc71",
            dot:3
        },

        lightning:{
            range:210,
            dmg:25,
            rate:50,
            cost:85,
            color:"#f1c40f",
            chain:2
        },

        money:{
            range:0,
            dmg:0,
            rate:120,
            cost:50,
            color:"#f39c12",
            income:10
        },

        marksman:{
            range:400,
            dmg:120,
            rate:120,
            cost:120,
            color:"#ffffff"
        }
    };


    let selectedTower="basic";
    let enemies=[];
    let towers=[];
    let bullets=[];
    let moneyCap=DIFFICULTY_SETTINGS[difficulty].coinCap;
    let coins=DIFFICULTY_SETTINGS[difficulty].startCoins;
    let health=DIFFICULTY_SETTINGS[difficulty].startHealth;
    let spawnTimer=0;
    let difficultyTime=0;
    let waveNumber=1;
    let enemiesThisWave=0;
    let waveTarget=10;
    let path=[];
    let animationId;
    let gameOver=false;
    let paused=true;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();


    function generatePath(){

        path=[

            {x:0,y:canvas.height*.5},

            {
                x:canvas.width*.25,
                y:canvas.height*.5
            },

            {
                x:canvas.width*.25,
                y:canvas.height*.2
            },

            {
                x:canvas.width*.75,
                y:canvas.height*.2
            },

            {
                x:canvas.width*.75,
                y:canvas.height*.8
            },

            {
                x:canvas.width,
                y:canvas.height*.8
            }
        ];
    }


    resize();


    function distSq(x1,y1,x2,y2){

        const dx=x2-x1;
        const dy=y2-y1;

        return dx*dx+dy*dy;
    }


    class Enemy{

        constructor(type){

            const base=ENEMY_TYPES[type];
            const currentDifficulty=getDifficultySettings();
            const scale=
                (1+difficultyTime*.01)*currentDifficulty.enemyScale;

            this.x=path[0].x;
            this.y=path[0].y;
            this.pathIndex=0;

            this.maxHp=base.hp*scale;
            this.hp=this.maxHp;
            this.speed=base.speed*scale;
            this.reward=Math.round(base.reward*currentDifficulty.enemyScale*.8);
            this.color=base.color;
            this.slow=1;
            this.poison=0;
            this.reachEnd=false;
            this.angle=0;
        }


        update(){

            if(this.poison>0){

                this.hp-=this.poison;
                this.poison*=.99;
            }

            this.slow=Math.min(
                1,
                this.slow+.003
            );

            const target=
                path[this.pathIndex+1];

            if(!target){

                this.reachEnd=true;
                return;
            }

            const dx=target.x-this.x;
            const dy=target.y-this.y;
            const distance=Math.hypot(dx,dy);
            const speed=this.speed*this.slow;

            if(distance<speed){

                this.x=target.x;
                this.y=target.y;
                this.pathIndex++;

            }else{

                this.x+=dx/distance*speed;
                this.y+=dy/distance*speed;
            }
        }


        draw(){

            const size=28;

            ctx.save();

            ctx.translate(this.x,this.y);
            ctx.rotate(this.angle+=.02);

            ctx.shadowColor=this.color;
            ctx.shadowBlur=14;

            ctx.fillStyle=this.color;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                size/2,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.shadowBlur=0;

            ctx.fillStyle="#fff";

            ctx.beginPath();
            ctx.arc(-5,-4,3,0,Math.PI*2);
            ctx.arc(5,-4,3,0,Math.PI*2);
            ctx.fill();

            ctx.fillStyle="#111";

            ctx.beginPath();
            ctx.arc(-5,-4,1.5,0,Math.PI*2);
            ctx.arc(5,-4,1.5,0,Math.PI*2);
            ctx.fill();

            ctx.restore();

            ctx.fillStyle="rgba(0,0,0,.65)";

            ctx.fillRect(
                this.x-15,
                this.y-23,
                30,
                5
            );

            ctx.fillStyle="#2ecc71";

            ctx.fillRect(
                this.x-15,
                this.y-23,
                30*Math.max(
                    0,
                    this.hp/this.maxHp
                ),
                5
            );
        }
    }


    class Tower{

        constructor(x,y,type){

            Object.assign(
                this,
                {
                    x:x,
                    y:y,
                    type:type,
                    cooldown:0
                },
                TOWER_DATA[type]
            );
        }


        getTarget(){

            let best=null;
            let bestProgress=-1;

            for(const e of enemies){

                if(
                    distSq(
                        this.x,
                        this.y,
                        e.x,
                        e.y
                    )<
                    this.range*this.range
                ){

                    if(e.pathIndex>bestProgress){

                        bestProgress=e.pathIndex;
                        best=e;
                    }
                }
            }

            return best;
        }


        update(){

            if(this.type==="money"){

                if(this.cooldown--<=0){

                    const gain=addCoins(this.income);
                    if(gain>0){
                        floatText.spawn(this.x,this.y-12,"+"+gain,"#f1c40f",12);
                    }
                    this.cooldown=this.rate;
                }

                return;
            }

            if(this.cooldown>0){
                this.cooldown--;
            }

            const target=this.getTarget();

            if(target && this.cooldown<=0){

                this.attack(target);
                this.cooldown=this.rate;
            }
        }


        attack(target){

            if(this.type==="ice"){

                target.slow=.5;
                target.hp-=this.dmg;
                return;
            }


            if(this.type==="burn"){

                target.hp-=this.dmg+this.dot;
                return;
            }


            if(this.type==="poison"){

                target.hp-=this.dmg;
                target.poison+=this.dot;
                return;
            }


            if(this.type==="cannon"){

                for(const e of enemies){

                    if(
                        distSq(
                            target.x,
                            target.y,
                            e.x,
                            e.y
                        )<2500
                    ){
                        e.hp-=this.dmg;
                    }
                }

                return;
            }


            if(this.type==="lightning"){

                let current=target;
                let hits=0;
                const used=[];

                while(
                    current &&
                    hits<this.chain
                ){

                    current.hp-=this.dmg;
                    used.push(current);

                    current=enemies.find(e=>
                        !used.includes(e)&&
                        distSq(
                            used[used.length-1].x,
                            used[used.length-1].y,
                            e.x,
                            e.y
                        )<6000
                    );

                    hits++;
                }

                return;
            }


            bullets.push(
                new Bullet(
                    this.x,
                    this.y,
                    target,
                    this.dmg,
                    this.color
                )
            );
        }


        draw(){

            if(this.range>0){

                ctx.save();

                ctx.strokeStyle=this.color;
                ctx.globalAlpha=.08;

                ctx.beginPath();

                ctx.arc(
                    this.x,
                    this.y,
                    this.range,
                    0,
                    Math.PI*2
                );

                ctx.stroke();

                ctx.globalAlpha=1;

                ctx.shadowColor=this.color;
                ctx.shadowBlur=12;

                ctx.fillStyle="#111";

                ctx.fillRect(
                    this.x-15,
                    this.y-15,
                    30,
                    30
                );

                ctx.fillStyle=this.color;

                ctx.fillRect(
                    this.x-11,
                    this.y-11,
                    22,
                    22
                );

                ctx.shadowBlur=0;

                ctx.fillStyle="#fff";

                ctx.beginPath();

                ctx.arc(
                    this.x,
                    this.y,
                    4,
                    0,
                    Math.PI*2
                );

                ctx.fill();

                ctx.restore();

            }else{

                ctx.fillStyle="#111";

                ctx.fillRect(
                    this.x-15,
                    this.y-15,
                    30,
                    30
                );

                ctx.fillStyle=this.color;

                ctx.fillRect(
                    this.x-11,
                    this.y-11,
                    22,
                    22
                );
            }
        }
    }


    class Bullet{

        constructor(x,y,target,damage,color){

            this.x=x;
            this.y=y;
            this.t=target;
            this.d=damage;
            this.color=color;
            this.hit=false;
        }


        update(){

            if(!this.t || this.t.hp<=0){

                this.hit=true;
                return;
            }

            const dx=this.t.x-this.x;
            const dy=this.t.y-this.y;
            const distance=Math.hypot(dx,dy);

            if(distance<BULLET_SPEED){

                this.t.hp-=this.d;
                this.hit=true;

            }else{

                this.x+=dx/distance*BULLET_SPEED;
                this.y+=dy/distance*BULLET_SPEED;
            }
        }


        draw(){

            ctx.save();

            ctx.shadowColor=this.color||"yellow";
            ctx.shadowBlur=12;

            ctx.fillStyle=this.color||"yellow";

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                4,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.restore();
        }
    }


    const title=document.createElement("div");

    title.textContent="TOWERS";

    Object.assign(title.style,{
        color:"#fff",
        textAlign:"center",
        fontWeight:"bold",
        fontSize:"16px",
        paddingBottom:"3px",
        textShadow:"0 0 8px rgba(255,255,255,.5)"
    });

    shop.appendChild(title);

    const difficultyLabel=document.createElement("div");
    difficultyLabel.textContent="DIFFICULTY";
    Object.assign(difficultyLabel.style,{
        color:"#dfeefc",
        fontSize:"12px",
        fontWeight:"bold",
        letterSpacing:"1px",
        marginTop:"5px",
        marginBottom:"2px",
        opacity:"0.9"
    });
    shop.appendChild(difficultyLabel);

    const diffButtons=[];
    function syncDifficultyButtons(){
        for(const btn of diffButtons){
            const isActive=btn.dataset.mode===difficulty;
            btn.style.background=isActive?
                "linear-gradient(135deg,#f1c40f,#e67e22)":
                "linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,0,0,.38))";
            btn.style.border=isActive?
                "1px solid rgba(255,255,255,.8)":
                "1px solid rgba(255,255,255,.18)";
            btn.style.transform=isActive?"scale(1.02)":"scale(1)";
        }
    }

    function resetWaveProgress(){
        waveNumber=1;
        enemiesThisWave=0;
        waveTarget=10;
    }

    for(const key of Object.keys(DIFFICULTY_SETTINGS)){
        const btn=document.createElement("button");
        const cfg=DIFFICULTY_SETTINGS[key];
        btn.dataset.mode=key;
        btn.textContent=cfg.label+"  ▸  $MAX "+cfg.coinCap;
        Object.assign(btn.style,{
            background:"linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,0,0,.38))",
            color:"#fff",
            border:"1px solid rgba(255,255,255,.18)",
            padding:"7px",
            borderRadius:"7px",
            cursor:"pointer",
            fontWeight:"bold",
            textShadow:"0 1px 2px #000",
            boxShadow:"0 3px 8px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.25)"
        });
        btn.onclick=function(){
            difficulty=key;
            moneyCap=DIFFICULTY_SETTINGS[key].coinCap;
            coins=Math.min(coins, moneyCap);
            health=Math.min(health, DIFFICULTY_SETTINGS[key].startHealth);
            resetWaveProgress();
            syncDifficultyButtons();
        };
        shop.appendChild(btn);
        diffButtons.push(btn);
    }
    syncDifficultyButtons();

    const difficultyMenu=document.createElement("div");
    Object.assign(difficultyMenu.style,{position:"fixed",inset:"0",zIndex:"100004",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"14px",background:"linear-gradient(145deg,rgba(5,18,22,.97),rgba(4,8,12,.98))",color:"#fff",fontFamily:"Arial,sans-serif",textAlign:"center"});
    const difficultyTitle=document.createElement("div");
    difficultyTitle.innerHTML="<div style='font-size:34px;font-weight:900;color:#f1c40f;text-shadow:0 0 18px rgba(241,196,15,.7)'>TOWER DEFENSE</div><div style='font-size:16px;margin-top:8px;color:#cfe8dc'>SELECT DIFFICULTY</div>";
    difficultyMenu.appendChild(difficultyTitle);
    for(const key of Object.keys(DIFFICULTY_SETTINGS)){
        const cfg=DIFFICULTY_SETTINGS[key];
        const button=document.createElement("button");
        button.textContent=cfg.label;
        Object.assign(button.style,{width:"220px",padding:"13px",borderRadius:"9px",border:"1px solid rgba(255,255,255,.35)",background:key==="EASY"?"#2ecc71":key==="NORMAL"?"#f1c40f":"#e74c3c",color:"#101820",fontSize:"17px",fontWeight:"900",cursor:"pointer",boxShadow:"0 5px 18px rgba(0,0,0,.35)"});
        button.onclick=function(){
            difficulty=key;
            moneyCap=cfg.coinCap;
            coins=cfg.startCoins;
            health=cfg.startHealth;
            resetWaveProgress();
            difficultyMenu.remove();
            shop.style.display="flex";
            paused=false;
            syncDifficultyButtons();
        };
        difficultyMenu.appendChild(button);
    }
    document.body.appendChild(difficultyMenu);


    for(const key in TOWER_DATA){

        const data=TOWER_DATA[key];

        const b=document.createElement("button");

        b.textContent=
            key.toUpperCase()+
            "  $"+
            data.cost;

        Object.assign(b.style,{
            background:
                "linear-gradient(135deg,"+
                data.color+
                ",rgba(0,0,0,.45))",
            color:"#fff",
            border:"1px solid rgba(255,255,255,.18)",
            padding:"7px",
            borderRadius:"7px",
            cursor:"pointer",
            fontWeight:"bold",
            textShadow:"0 1px 2px #000",
            boxShadow:
                "0 3px 8px rgba(0,0,0,.35),"+
                "inset 0 1px 0 rgba(255,255,255,.25)"
        });

        b.onclick=function(){
            selectedTower=key;
        };

        shop.appendChild(b);
    }


    function placeTower(e){

        e.preventDefault();

        if(gameOver||paused)return;

        const rect=canvas.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        if(
            x>canvas.width-200 &&
            y<canvas.height*.95
        ){
            return;
        }

        if(x<250 && y<125){
            return;
        }

        if(x<190 && y>canvas.height-100){
            return;
        }

        for(let i=0;i<path.length-1;i++){

            const a=path[i];
            const b=path[i+1];

            const minX=Math.min(a.x,b.x)-28;
            const maxX=Math.max(a.x,b.x)+28;
            const minY=Math.min(a.y,b.y)-28;
            const maxY=Math.max(a.y,b.y)+28;

            if(
                x>=minX &&
                x<=maxX &&
                y>=minY &&
                y<=maxY
            ){
                return;
            }
        }

        const tower=
            new Tower(
                x,
                y,
                selectedTower
            );

        if(coins>=tower.cost){

            coins-=tower.cost;
            towers.push(tower);
        }
    }


    canvas.addEventListener(
        "pointerdown",
        placeTower,
        {passive:false}
    );


    function drawPath(){

        ctx.save();

        ctx.strokeStyle="rgba(0,0,0,.45)";
        ctx.lineWidth=58;
        ctx.lineCap="round";
        ctx.lineJoin="round";

        ctx.beginPath();

        ctx.moveTo(
            path[0].x,
            path[0].y
        );

        for(let i=1;i<path.length;i++){

            ctx.lineTo(
                path[i].x,
                path[i].y
            );
        }

        ctx.stroke();

        ctx.strokeStyle="#c2b280";
        ctx.lineWidth=48;

        ctx.beginPath();

        ctx.moveTo(
            path[0].x,
            path[0].y
        );

        for(let i=1;i<path.length;i++){

            ctx.lineTo(
                path[i].x,
                path[i].y
            );
        }

        ctx.stroke();

        ctx.strokeStyle="rgba(255,255,255,.18)";
        ctx.lineWidth=3;
        ctx.setLineDash([12,12]);

        ctx.beginPath();

        ctx.moveTo(
            path[0].x,
            path[0].y
        );

        for(let i=1;i<path.length;i++){

            ctx.lineTo(
                path[i].x,
                path[i].y
            );
        }

        ctx.stroke();

        ctx.setLineDash([]);

        ctx.restore();
    }


    function loop(){

        animationId=
            requestAnimationFrame(loop);

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(
            0,0,0,canvas.height
        );

        bg.addColorStop(0,"#081c13");
        bg.addColorStop(.55,"#102b1d");
        bg.addColorStop(1,"#07130c");

        ctx.fillStyle=bg;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Subtle terrain grid

        ctx.strokeStyle="rgba(130,220,150,.035)";
        ctx.lineWidth=1;

        for(let x=0;x<canvas.width;x+=40){

            ctx.beginPath();
            ctx.moveTo(x,0);
            ctx.lineTo(x,canvas.height);
            ctx.stroke();
        }

        for(let y=0;y<canvas.height;y+=40){

            ctx.beginPath();
            ctx.moveTo(0,y);
            ctx.lineTo(canvas.width,y);
            ctx.stroke();
        }

        drawPath();


        if(!gameOver){

            difficultyTime+=.008*gameSpeedMultiplier;
            spawnTimer+=gameSpeedMultiplier;

            const currentDifficulty=getDifficultySettings();
            const spawnRate=
                Math.max(
                    18,
                    (80-difficultyTime*1.2)/currentDifficulty.spawnScale
                );

            if(spawnTimer>spawnRate){

                const bossInterval=
                    currentDifficulty.bossWaveInterval;
                const bossWave=
                    waveNumber % bossInterval === 0;

                if(
                    bossWave &&
                    enemiesThisWave===0
                ){
                    floatText.spawn(
                        canvas.width*.5,
                        90,
                        "BOSS WAVE!",
                        "#ff6b6b",
                        22
                    );
                }

                const spawnType=
                    bossWave ? "boss" : [
                        "grunt",
                        "fast",
                        "tank",
                        "regen"
                    ][
                        Math.floor(
                            Math.random()*4
                        )
                    ];

                enemies.push(
                    new Enemy(spawnType)
                );

                enemiesThisWave++;

                if(enemiesThisWave>=waveTarget){
                    waveNumber++;
                    enemiesThisWave=0;
                    waveTarget=Math.max(
                        8,
                        10+waveNumber*2
                    );
                }

                spawnTimer=0;
            }
        }


        for(
            let i=enemies.length-1;
            i>=0;
            i--
        ){

            const enemy=enemies[i];

            if(!gameOver){
                enemy.update();
                if(gameSpeedMultiplier===2)enemy.update();
            }

            enemy.draw();

            if(enemy.hp<=0){

                const gain=addCoins(enemy.reward);
                floatText.spawn(enemy.x,enemy.y-10,"+"+gain,"#f1c40f",14);

                enemies.splice(i,1);
                continue;
            }

            if(enemy.reachEnd){

                health-=10;
                shaker.kick(8);

                enemies.splice(i,1);

                if(health<=0){

                    health=0;
                    gameOver=true;
                    shaker.kick(20);
                }
            }
        }


        for(const tower of towers){

            if(!gameOver){
                tower.update();
                if(gameSpeedMultiplier===2)tower.update();
            }

            tower.draw();
        }


        for(
            let i=bullets.length-1;
            i>=0;
            i--
        ){

            if(!gameOver){
                bullets[i].update();
                if(gameSpeedMultiplier===2&&!bullets[i].hit)bullets[i].update();
            }

            bullets[i].draw();

            if(bullets[i].hit){
                bullets.splice(i,1);
            }
        }


        ctx.save();

        ctx.fillStyle="rgba(0,0,0,.75)";

        ctx.shadowColor="rgba(0,0,0,.5)";
        ctx.shadowBlur=12;

        ctx.fillRect(
            10,
            10,
            245,
            112
        );

        ctx.shadowBlur=0;

        ctx.strokeStyle="rgba(255,255,255,.25)";

        ctx.strokeRect(
            10,
            10,
            245,
            112
        );

        ctx.fillStyle="#f1c40f";
        ctx.font="bold 19px Arial";

        ctx.fillText(
            "💰 Coins: "+Math.floor(coins)+" / "+moneyCap,
            22,
            38
        );

        ctx.fillStyle="#2ecc71";

        ctx.fillText(
            "❤️ Health: "+Math.floor(health),
            22,
            67
        );

        ctx.fillStyle="#fff";
        ctx.font="bold 15px Arial";

        ctx.fillText(
            "Tower: "+selectedTower.toUpperCase(),
            22,
            94
        );

        ctx.font="12px Arial";

        ctx.fillStyle="#aaa";

        ctx.fillText(
            "Wave: "+waveNumber+"  |  Diff: "+getDifficultySettings().label+"  |  Cap: "+moneyCap,
            22,
            112
        );

        ctx.restore();

        floatText.update(1/60);
        floatText.draw(ctx);

        ctx.restore();


        if(gameOver){

            ctx.fillStyle="rgba(0,0,0,.8)";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.textAlign="center";

            ctx.shadowColor="#e74c3c";
            ctx.shadowBlur=25;

            ctx.fillStyle="#e74c3c";

            ctx.font="bold 48px Arial";

            ctx.fillText(
                "GAME OVER",
                canvas.width/2,
                canvas.height/2-30
            );

            ctx.shadowBlur=0;

            ctx.fillStyle="#fff";

            ctx.font="bold 20px Arial";

            ctx.fillText(
                "Your base was destroyed!",
                canvas.width/2,
                canvas.height/2+15
            );

            ctx.font="16px Arial";

            ctx.fillText(
                "Use MENU to return",
                canvas.width/2,
                canvas.height/2+50
            );
        }
    }


    function drawPauseOverlay(){

        ctx.fillStyle="rgba(0,0,0,.6)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.textAlign="center";

        ctx.shadowColor="#f1c40f";
        ctx.shadowBlur=22;
        ctx.fillStyle="#fff";
        ctx.font="900 42px Arial";

        ctx.fillText(
            "PAUSED",
            canvas.width/2,
            canvas.height/2-10
        );

        ctx.shadowBlur=0;
        ctx.fillStyle="#f1c40f";
        ctx.font="16px Arial";

        ctx.fillText(
            "Tap ▶ to resume",
            canvas.width/2,
            canvas.height/2+30
        );
    }


    pauseBtn.onclick=function(){

        paused=!paused;

        if(paused){

            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();

        }else{

            pauseBtn.textContent="⏸";
            loop();
        }
    };


    back.onclick=function(){

        cancelAnimationFrame(animationId);
        showMainMenu();
    };


    function resizeHandler(){
        resize();
        if(paused){
            drawPauseOverlay();
        }
    }

    window.addEventListener(
        "resize",
        resizeHandler
    );


    currentCleanup=function(){

        cancelAnimationFrame(animationId);

        window.removeEventListener(
            "resize",
            resizeHandler
        );

        canvas.removeEventListener(
            "pointerdown",
            placeTower
        );

        canvas.remove();
        back.remove();
        shop.remove();
        pauseBtn.remove();
        speedBtn.remove();
        difficultyMenu.remove();
    };


    loop();
}


// ============================================================
// RAGDOLL ARCHERS  (v2 — upgraded visuals)
// ============================================================

function startRagdollArchers(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";


    const canvas=document.createElement("canvas");

    canvas.className="ra-canvas";

    const ctx=canvas.getContext("2d");


    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }


    resize();


    Object.assign(canvas.style,{
        position:"fixed",
        inset:"0",
        width:"100%",
        height:"100%",
        zIndex:"100000",
        background:"#111827",
        touchAction:"none",
        userSelect:"none",
        WebkitUserSelect:"none"
    });


    document.body.appendChild(canvas);


    // ========================================================
    // UI
    // ========================================================

    const ui=document.createElement("div");

    ui.className="ra-ui";

    Object.assign(ui.style,{
        position:"fixed",
        top:"12px",
        left:"12px",
        zIndex:"100002",
        color:"#fff",
        fontFamily:"Arial,sans-serif",
        background:
            "linear-gradient(145deg,rgba(5,8,16,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(255,255,255,.25)",
        borderRadius:"12px",
        padding:"10px 13px",
        pointerEvents:"none",
        boxShadow:
            "0 8px 24px rgba(0,0,0,.4),"+
            "inset 0 1px 0 rgba(255,255,255,.12)",
        textShadow:"0 1px 3px #000"
    });

    document.body.appendChild(ui);


    const back=document.createElement("button");

    back.className="ra-back";
    back.textContent="☰ MENU";

    Object.assign(back.style,{
        position:"fixed",
        left:"15px",
        bottom:"15px",
        zIndex:"100003",
        background:
            "linear-gradient(135deg,rgba(20,12,30,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.55)",
        borderRadius:"9px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        boxShadow:
            "0 0 18px rgba(142,68,173,.3),"+
            "0 6px 20px rgba(0,0,0,.5)"
    });

    document.body.appendChild(back);


    const pauseBtn=document.createElement("button");
    pauseBtn.className="ra-pause";
    pauseBtn.textContent="⏸";

    Object.assign(pauseBtn.style,{
        position:"fixed",
        top:"12px",
        right:"12px",
        zIndex:"100003",
        background:
            "linear-gradient(135deg,rgba(20,12,30,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,255,255,.55)",
        borderRadius:"9px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"16px",
        boxShadow:
            "0 0 18px rgba(142,68,173,.3),"+
            "0 6px 20px rgba(0,0,0,.5)"
    });

    document.body.appendChild(pauseBtn);


    // ========================================================
    // PHYSICS SETTINGS
    // ========================================================

    const gravity=0.34;
    const groundFriction=.82;
    const air=.992;

    const JOINT_STIFFNESS=.72;
    const JOINT_DAMPING=.78;
    const MAX_JOINT_CORRECTION=12;

    let player;
    let enemy;
    let arrows=[];
    let particles=[];
    let clouds=[];

    let dragging=false;
    let dragX=0;
    let dragY=0;

    let score=0;
    let round=1;
    let gameOver=false;
    let shakeTime=0;
    let paused=false;
    let flashColor=null;
    let flashAlpha=0;

    let animationId;


    for(let i=0;i<6;i++){

        clouds.push({
            x:Math.random()*window.innerWidth,
            y:40+Math.random()*120,
            s:.6+Math.random()*.9,
            v:.08+Math.random()*.1
        });
    }


    // ========================================================
    // VECTOR / JOINT HELPERS
    // ========================================================

    function constrainDistance(a,b,length){

        let dx=b.x-a.x;
        let dy=b.y-a.y;

        let distance=Math.hypot(dx,dy);

        if(distance<0.0001){
            return;
        }

        const error=distance-length;

        const nx=dx/distance;
        const ny=dy/distance;

        let correction=
            error*
            JOINT_STIFFNESS*
            .5;

        correction=Math.max(
            -MAX_JOINT_CORRECTION,
            Math.min(
                MAX_JOINT_CORRECTION,
                correction
            )
        );

        a.x+=nx*correction;
        a.y+=ny*correction;

        b.x-=nx*correction;
        b.y-=ny*correction;

        const rvx=b.vx-a.vx;
        const rvy=b.vy-a.vy;

        const relativeVelocity=
            rvx*nx+
            rvy*ny;

        const impulse=
            relativeVelocity*
            JOINT_DAMPING*
            .5;

        a.vx+=nx*impulse;
        a.vy+=ny*impulse;

        b.vx-=nx*impulse;
        b.vy-=ny*impulse;
    }


    function pinVertical(a,b,length){

        constrainDistance(a,b,length);
    }


    // ========================================================
    // PARTICLES (hit sparks / feathers / confetti)
    // ========================================================

    function spawnBurst(x,y,color,count,spread){

        for(let i=0;i<count;i++){

            const a=Math.random()*Math.PI*2;
            const sp=(spread||6)*(.4+Math.random()*.9);

            particles.push({
                x:x,
                y:y,
                vx:Math.cos(a)*sp,
                vy:Math.sin(a)*sp-2,
                life:28+Math.random()*20,
                maxLife:48,
                color:color,
                size:2+Math.random()*3
            });
        }
    }


    function updateParticles(){

        for(let i=particles.length-1;i>=0;i--){

            const p=particles[i];

            p.vy+=gravity*.5;
            p.vx*=.96;
            p.vy*=.96;

            p.x+=p.vx;
            p.y+=p.vy;
            p.life--;

            if(p.life<=0){
                particles.splice(i,1);
            }
        }
    }


    function drawParticles(){

        for(const p of particles){

            ctx.save();

            ctx.globalAlpha=
                Math.max(0,p.life/p.maxLife);

            ctx.fillStyle=p.color;
            ctx.shadowColor=p.color;
            ctx.shadowBlur=6;

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.restore();
        }
    }


    // ========================================================
    // RAGDOLL BODY
    // ========================================================

    class Body{

        constructor(x,y,color,skin,name,facing){

            this.color=color;
            this.skin=skin;
            this.name=name;
            this.facing=facing;

            this.spawnX=x;
            this.spawnY=y;

            this.head={
                x:x,
                y:y-82,
                vx:0,
                vy:0,
                r:13
            };

            this.body={
                x:x,
                y:y-40,
                vx:0,
                vy:0
            };

            this.arm1={
                x:x-30,
                y:y-34,
                vx:0,
                vy:0
            };

            this.arm2={
                x:x+30,
                y:y-34,
                vx:0,
                vy:0
            };

            this.leg1={
                x:x-17,
                y:y+20,
                vx:0,
                vy:0
            };

            this.leg2={
                x:x+17,
                y:y+20,
                vx:0,
                vy:0
            };

            this.hp=100;
            this.alive=true;
            this.hitFlash=0;
            this.breathe=Math.random()*Math.PI*2;

            this.stand={
                headY:-82,
                bodyY:-40,
                arm1X:-30,
                arm1Y:-34,
                arm2X:30,
                arm2Y:-34,
                leg1X:-17,
                leg1Y:20,
                leg2X:17,
                leg2Y:20
            };
        }


        parts(){

            return [
                this.head,
                this.body,
                this.arm1,
                this.arm2,
                this.leg1,
                this.leg2
            ];
        }


        solveJoints(){

            constrainDistance(this.head,this.body,42);
            constrainDistance(this.body,this.arm1,32);
            constrainDistance(this.body,this.arm2,32);
            constrainDistance(this.body,this.leg1,61);
            constrainDistance(this.body,this.leg2,61);
            pinVertical(this.head,this.body,42);
            constrainDistance(this.leg1,this.leg2,34);
        }


        applyStandingBalance(){

            const b=this.body;

            const feetMidX=
                (this.leg1.x+this.leg2.x)*.5;

            const feetMidY=
                (this.leg1.y+this.leg2.y)*.5;

            const centerErrorX=
                feetMidX-b.x;

            const centerErrorY=
                (feetMidY-61)-b.y;

            b.vx+=centerErrorX*.008;
            b.vy+=centerErrorY*.006;

            this.head.vx+=(b.x-this.head.x)*.018;
            this.head.vy+=((b.y-42)-this.head.y)*.018;

            this.leg1.vx+=(b.x-17-this.leg1.x)*.012;
            this.leg2.vx+=(b.x+17-this.leg2.x)*.012;

            this.leg1.vy+=(b.y+61-this.leg1.y)*.009;
            this.leg2.vy+=(b.y+61-this.leg2.y)*.009;

            this.arm1.vx+=(b.x-30-this.arm1.x)*.006;
            this.arm2.vx+=(b.x+30-this.arm2.x)*.006;

            this.arm1.vy+=(b.y+6-this.arm1.y)*.004;
            this.arm2.vy+=(b.y+6-this.arm2.y)*.004;
        }


        solveGround(){

            const ground=
                canvas.height-35;

            for(const p of this.parts()){

                if(p.y>ground){

                    p.y=ground;

                    if(p.vy>0){
                        p.vy*=-.18;
                    }

                    p.vx*=groundFriction;
                }

                if(p.x<12){

                    p.x=12;
                    p.vx*=-.25;
                }

                if(p.x>canvas.width-12){

                    p.x=canvas.width-12;
                    p.vx*=-.25;
                }
            }
        }


        update(){

            if(!this.alive)return;

            this.breathe+=.05;

            for(const p of this.parts()){

                p.vy+=gravity;

                p.vx*=air;
                p.vy*=air;

                p.x+=p.vx;
                p.y+=p.vy;
            }

            for(let i=0;i<5;i++){

                this.solveJoints();
                this.solveGround();
            }

            this.applyStandingBalance();

            for(let i=0;i<3;i++){

                this.solveJoints();
                this.solveGround();
            }

            this.hitFlash=
                Math.max(0,this.hitFlash-1);


            if(this.hp<=0){

                this.alive=false;
            }
        }


        // ----------------------------------------------------
        // Draw a filled "capsule" limb — gives volume instead
        // of a flat stroked line.
        // ----------------------------------------------------

        limb(x1,y1,x2,y2,w,baseColor,shadeColor){

            const dx=x2-x1;
            const dy=y2-y1;
            const len=Math.hypot(dx,dy)||1;
            const nx=-dy/len*(w/2);
            const ny=dx/len*(w/2);

            ctx.save();

            ctx.shadowColor="rgba(0,0,0,.5)";
            ctx.shadowBlur=6;
            ctx.shadowOffsetY=2;

            const grad=ctx.createLinearGradient(
                x1+nx,y1+ny,x1-nx,y1-ny
            );

            grad.addColorStop(0,shadeColor);
            grad.addColorStop(.5,baseColor);
            grad.addColorStop(1,shadeColor);

            ctx.fillStyle=grad;

            ctx.beginPath();
            ctx.arc(x1,y1,w/2,0,Math.PI*2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x1+nx,y1+ny);
            ctx.lineTo(x2+nx,y2+ny);
            ctx.arc(x2,y2,w/2,Math.atan2(ny,nx),Math.atan2(-ny,-nx));
            ctx.lineTo(x1-nx,y1-ny);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2,y2,w/2,0,Math.PI*2);
            ctx.fill();

            ctx.shadowColor="transparent";
            ctx.shadowBlur=0;

            // soft highlight down the center
            ctx.globalAlpha=.18;
            ctx.strokeStyle="#fff";
            ctx.lineWidth=Math.max(1,w*.22);
            ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();
            ctx.globalAlpha=1;

            ctx.restore();
        }


        draw(){

            const h=this.head;
            const b=this.body;

            const flashing=this.hitFlash>0;
            const skin=flashing?"#ff5555":this.skin;
            const cloth=flashing?"#ff8080":this.color;
            const shade=flashing
                ?"#a33"
                :shadeOf(this.color);


            // GROUND SHADOW

            const groundY=canvas.height-33;

            ctx.save();
            ctx.fillStyle="rgba(0,0,0,.35)";
            ctx.beginPath();
            ctx.ellipse(
                (this.leg1.x+this.leg2.x)/2,
                groundY+6,
                34,
                8,
                0,0,Math.PI*2
            );
            ctx.fill();
            ctx.restore();


            // BACK ARM (drawn first, behind torso)

            const backArm=
                this.facing==="right"
                ? this.arm1
                : this.arm2;

            this.limb(
                b.x,b.y-5,
                backArm.x,backArm.y,
                13,shadeOf(cloth),shade
            );


            // LEGS (pants)

            this.limb(
                b.x,b.y+12,
                this.leg1.x,this.leg1.y,
                15,"#3b3f4a","#22252c"
            );

            this.limb(
                b.x,b.y+12,
                this.leg2.x,this.leg2.y,
                15,"#454a58","#22252c"
            );

            // boots

            ctx.fillStyle="#1b1b1f";
            for(const leg of [this.leg1,this.leg2]){
                ctx.beginPath();
                ctx.ellipse(leg.x+ (this.facing==="right"?4:-4),leg.y+3,10,6,0,0,Math.PI*2);
                ctx.fill();
            }


            // TORSO (tunic, tapered)

            ctx.save();
            ctx.shadowColor="rgba(0,0,0,.5)";
            ctx.shadowBlur=6;
            ctx.shadowOffsetY=2;

            const torsoGrad=ctx.createLinearGradient(
                b.x-16,b.y,b.x+16,b.y
            );
            torsoGrad.addColorStop(0,shade);
            torsoGrad.addColorStop(.5,cloth);
            torsoGrad.addColorStop(1,shade);

            ctx.fillStyle=torsoGrad;

            ctx.beginPath();
            ctx.moveTo(h.x-14,h.y+10);
            ctx.lineTo(h.x+14,h.y+10);
            ctx.lineTo(b.x+17,b.y+24);
            ctx.lineTo(b.x-17,b.y+24);
            ctx.closePath();
            ctx.fill();

            ctx.shadowColor="transparent";

            // belt
            ctx.fillStyle="rgba(0,0,0,.35)";
            ctx.fillRect(b.x-16,b.y+16,32,4);

            ctx.restore();


            // FRONT ARM

            const frontArm=
                this.facing==="right"
                ? this.arm2
                : this.arm1;

            this.limb(
                b.x,b.y-5,
                frontArm.x,frontArm.y,
                13,cloth,shade
            );


            // hands (gloves)

            ctx.fillStyle="#e3b98c";
            for(const arm of [this.arm1,this.arm2]){
                ctx.beginPath();
                ctx.arc(arm.x,arm.y,6,0,Math.PI*2);
                ctx.fill();
            }


            // HEAD

            ctx.save();
            ctx.shadowColor="rgba(0,0,0,.45)";
            ctx.shadowBlur=8;
            ctx.shadowOffsetY=2;

            const headGrad=ctx.createRadialGradient(
                h.x-5,h.y-5,2,
                h.x,h.y,h.r+3
            );
            headGrad.addColorStop(0,lightenSkin(skin));
            headGrad.addColorStop(1,skin);

            ctx.fillStyle=headGrad;

            ctx.beginPath();
            ctx.arc(h.x,h.y,h.r,0,Math.PI*2);
            ctx.fill();

            ctx.shadowColor="transparent";

            // hair / headband

            ctx.fillStyle=cloth;
            ctx.beginPath();
            ctx.arc(h.x,h.y-2,h.r+1,Math.PI*1.05,Math.PI*1.95);
            ctx.fill();

            // face — eyes follow facing direction

            const eyeDX=this.facing==="right"?3:-3;

            ctx.fillStyle="#1a1a1a";
            ctx.beginPath();
            ctx.arc(h.x+eyeDX-3,h.y-1,1.6,0,Math.PI*2);
            ctx.arc(h.x+eyeDX+3,h.y-1,1.6,0,Math.PI*2);
            ctx.fill();

            // brow (determined look)
            ctx.strokeStyle="rgba(0,0,0,.5)";
            ctx.lineWidth=1.4;
            ctx.beginPath();
            ctx.moveTo(h.x+eyeDX-6,h.y-5);
            ctx.lineTo(h.x+eyeDX-1,h.y-4);
            ctx.moveTo(h.x+eyeDX+1,h.y-4);
            ctx.lineTo(h.x+eyeDX+6,h.y-5);
            ctx.stroke();

            ctx.restore();


            // JOINTS on top (small caps for polish)

            ctx.fillStyle="rgba(255,255,255,.55)";
            for(const p of [this.arm1,this.arm2,this.leg1,this.leg2]){
                ctx.beginPath();
                ctx.arc(p.x,p.y,3,0,Math.PI*2);
                ctx.fill();
            }


            // NAME + HP BAR

            ctx.textAlign="center";
            ctx.font="bold 12px Arial";
            ctx.fillStyle="rgba(255,255,255,.85)";
            ctx.shadowColor="#000";
            ctx.shadowBlur=4;
            ctx.fillText(this.name,h.x,h.y-42);
            ctx.shadowBlur=0;

            const barW=56;
            const barX=h.x-barW/2;
            const barY=h.y-36;

            ctx.fillStyle="rgba(0,0,0,.55)";
            roundRect(ctx,barX,barY,barW,7,3);
            ctx.fill();

            const pct=Math.max(0,this.hp/100);
            const hpGrad=ctx.createLinearGradient(barX,0,barX+barW,0);
            hpGrad.addColorStop(0,"#ff5050");
            hpGrad.addColorStop(.5,"#ffd93d");
            hpGrad.addColorStop(1,"#4ade80");

            ctx.fillStyle=hpGrad;
            roundRect(ctx,barX,barY,barW*pct,7,3);
            ctx.fill();

            ctx.strokeStyle="rgba(255,255,255,.4)";
            ctx.lineWidth=1;
            roundRect(ctx,barX,barY,barW,7,3);
            ctx.stroke();
        }
    }


    function shadeOf(hex){

        try{

            const c=hex.replace("#","");
            const r=Math.max(0,parseInt(c.substring(0,2),16)-55);
            const g=Math.max(0,parseInt(c.substring(2,4),16)-55);
            const b=Math.max(0,parseInt(c.substring(4,6),16)-55);

            return "rgb("+r+","+g+","+b+")";

        }catch(e){

            return "#222";
        }
    }


    function lightenSkin(hex){

        try{

            const c=hex.replace("#","");
            const r=Math.min(255,parseInt(c.substring(0,2),16)+25);
            const g=Math.min(255,parseInt(c.substring(2,4),16)+22);
            const b=Math.min(255,parseInt(c.substring(4,6),16)+18);

            return "rgb("+r+","+g+","+b+")";

        }catch(e){

            return hex;
        }
    }


    function roundRect(c,x,y,w,h,r){

        if(w<=0)w=0.01;

        c.beginPath();
        c.moveTo(x+r,y);
        c.arcTo(x+w,y,x+w,y+h,r);
        c.arcTo(x+w,y+h,x,y+h,r);
        c.arcTo(x,y+h,x,y,r);
        c.arcTo(x,y,x+w,y,r);
        c.closePath();
    }


    // ========================================================
    // RESET ROUND
    // ========================================================

    function resetRound(){

        const y=canvas.height*.65;

        player=
            new Body(
                canvas.width*.22,
                y,
                "#2f7fd6",
                "#e3b98c",
                "YOU",
                "right"
            );

        enemy=
            new Body(
                canvas.width*.78,
                y,
                "#d63c3c",
                "#d99f74",
                "ENEMY "+round,
                "left"
            );

        arrows=[];

        gameOver=false;
        dragging=false;

        for(let i=0;i<8;i++){

            player.solveJoints();
            player.solveGround();

            enemy.solveJoints();
            enemy.solveGround();
        }
    }


    resetRound();


    // ========================================================
    // ARROW
    // ========================================================

    class Arrow{

        constructor(x,y,vx,vy,owner){

            this.x=x;
            this.y=y;
            this.vx=vx;
            this.vy=vy;
            this.owner=owner;
            this.life=500;
            this.hit=false;
        }


        update(){

            if(this.hit)return;

            this.vy+=gravity*.35;

            this.vx*=.998;
            this.vy*=.998;

            this.x+=this.vx;
            this.y+=this.vy;

            this.life--;

            if(this.y>canvas.height-32){

                this.y=canvas.height-32;
                this.vy*=-.35;
                this.vx*=.65;

                spawnBurst(this.x,this.y,"#c9b27a",4,3);
            }


            const target=
                this.owner==="player"
                ? enemy
                : player;


            if(target && target.alive){

                for(const p of target.parts()){

                    const d=
                        Math.hypot(
                            this.x-p.x,
                            this.y-p.y
                        );

                    if(d<18){

                        target.hp-=35;
                        target.hitFlash=8;
                        shakeTime=8;

                        spawnBurst(
                            this.x,this.y,
                            "#ff4444",10,7
                        );

                        spawnBurst(
                            this.x,this.y,
                            "#ffffff",4,4
                        );

                        const force=.7;

                        p.vx+=this.vx*force;
                        p.vy+=this.vy*force;

                        target.body.vx+=this.vx*.18;
                        target.body.vy+=this.vy*.18;

                        for(const limb of target.parts()){

                            if(limb===p)continue;

                            const dd=
                                Math.hypot(
                                    limb.x-p.x,
                                    limb.y-p.y
                                );

                            if(dd<70){

                                limb.vx+=this.vx*.06;
                                limb.vy+=this.vy*.06;
                            }
                        }

                        this.hit=true;

                        if(target.hp<=0){

                            spawnBurst(
                                target.head.x,
                                target.head.y,
                                target===enemy?"#ffd93d":"#7fb3ff",
                                26,9
                            );

                            if(target===enemy){

                                score++;
                                round++;

                                flashColor="#4ade80";
                                flashAlpha=.35;

                                setTimeout(function(){

                                    if(!gameOver){
                                        resetRound();
                                    }

                                },700);

                            }else{

                                gameOver=true;

                                flashColor="#ff4444";
                                flashAlpha=.4;
                            }
                        }

                        break;
                    }
                }
            }


            if(
                this.life<=0 ||
                this.x<-100 ||
                this.x>canvas.width+100 ||
                this.y>canvas.height+100
            ){

                this.hit=true;
            }
        }


        draw(){

            ctx.save();

            const angle=Math.atan2(this.vy,this.vx);

            // shaft shadow trail

            ctx.strokeStyle="rgba(0,0,0,.25)";
            ctx.lineWidth=5;
            ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(this.x,this.y+2);
            ctx.lineTo(this.x-this.vx*2.4,this.y-this.vy*2.4+2);
            ctx.stroke();

            // shaft

            const shaftGrad=ctx.createLinearGradient(
                this.x,this.y,
                this.x-this.vx*2.6,this.y-this.vy*2.6
            );
            shaftGrad.addColorStop(0,"#e8d3a0");
            shaftGrad.addColorStop(1,"#a9895a");

            ctx.strokeStyle=shaftGrad;
            ctx.lineWidth=3.2;
            ctx.lineCap="round";
            ctx.shadowColor="#f5deb3";
            ctx.shadowBlur=6;

            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(this.x-this.vx*2.6,this.y-this.vy*2.6);
            ctx.stroke();

            ctx.shadowBlur=0;

            // fletching feathers

            ctx.translate(
                this.x-this.vx*2.4,
                this.y-this.vy*2.4
            );
            ctx.rotate(angle);

            ctx.fillStyle="#e05656";
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(-9,-6);
            ctx.lineTo(-4,0);
            ctx.lineTo(-9,6);
            ctx.closePath();
            ctx.fill();

            ctx.setTransform(1,0,0,1,0,0);


            // arrowhead

            ctx.translate(this.x,this.y);
            ctx.rotate(angle);

            const headGrad=ctx.createLinearGradient(-4,0,10,0);
            headGrad.addColorStop(0,"#9a9a9a");
            headGrad.addColorStop(1,"#f2f2f2");

            ctx.fillStyle=headGrad;

            ctx.beginPath();
            ctx.moveTo(11,0);
            ctx.lineTo(-3,-5);
            ctx.lineTo(-3,5);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }


    // ========================================================
    // INPUT
    // ========================================================

    function getPointer(e){

        const r=
            canvas.getBoundingClientRect();

        return {
            x:e.clientX-r.left,
            y:e.clientY-r.top
        };
    }


    function pointerDown(e){

        e.preventDefault();

        if(paused)return;

        if(gameOver){

            resetRound();
            return;
        }

        const p=getPointer(e);

        const bowX=player.arm2.x;
        const bowY=player.arm2.y;

        if(
            Math.hypot(
                p.x-bowX,
                p.y-bowY
            )<90
        ){

            dragging=true;
            dragX=p.x;
            dragY=p.y;

            try{
                canvas.setPointerCapture(e.pointerId);
            }catch(err){}
        }
    }


    function pointerMove(e){

        if(!dragging)return;

        e.preventDefault();

        const p=getPointer(e);

        dragX=p.x;
        dragY=p.y;
    }


    function pointerUp(e){

        if(!dragging)return;

        e.preventDefault();

        dragging=false;

        try{
            canvas.releasePointerCapture(e.pointerId);
        }catch(err){}

        const bowX=player.arm2.x;
        const bowY=player.arm2.y;

        let dx=bowX-dragX;
        let dy=bowY-dragY;

        const length=Math.hypot(dx,dy);

        if(length<10)return;

        const power=Math.min(24,length*.18);

        dx/=length;
        dy/=length;

        arrows.push(
            new Arrow(
                bowX,bowY,
                dx*power,dy*power,
                "player"
            )
        );

        setTimeout(
            enemyShoot,
            500+Math.random()*500
        );
    }


    function enemyShoot(){

        if(
            gameOver ||
            !enemy || !enemy.alive ||
            !player || !player.alive
        ){
            return;
        }

        const bowX=enemy.arm1.x;
        const bowY=enemy.arm1.y;

        const tx=player.head.x;
        const ty=player.head.y;

        let dx=tx-bowX;
        let dy=ty-bowY;

        const d=Math.hypot(dx,dy);

        if(d===0)return;

        dx/=d;
        dy/=d;

        const power=13+Math.random()*5;

        arrows.push(
            new Arrow(
                bowX,bowY,
                dx*power,dy*power,
                "enemy"
            )
        );
    }


    canvas.addEventListener("pointerdown",pointerDown,{passive:false});
    canvas.addEventListener("pointermove",pointerMove,{passive:false});
    canvas.addEventListener("pointerup",pointerUp,{passive:false});

    canvas.addEventListener("pointercancel",function(){

        dragging=false;

        try{
            canvas.releasePointerCapture(event.pointerId);
        }catch(err){}
    });

    canvas.addEventListener("contextmenu",e=>e.preventDefault());


    // ========================================================
    // DRAW BOW
    // ========================================================

    function drawBow(){

        const x=player.arm2.x;
        const y=player.arm2.y;

        let bx=x;
        let by=y;

        if(dragging){

            bx=dragX;
            by=dragY;
        }

        const pull=
            dragging
            ? Math.min(1,Math.hypot(x-bx,y-by)/120)
            : 0;

        ctx.save();

        // limbs

        const woodGrad=ctx.createLinearGradient(x-10,y-35,x+10,y+35);
        woodGrad.addColorStop(0,"#6b4326");
        woodGrad.addColorStop(.5,"#9a6b3c");
        woodGrad.addColorStop(1,"#6b4326");

        ctx.strokeStyle=woodGrad;
        ctx.lineWidth=6;
        ctx.lineCap="round";
        ctx.shadowColor="rgba(0,0,0,.4)";
        ctx.shadowBlur=6;

        ctx.beginPath();
        ctx.arc(x,y,35,-Math.PI*.8,Math.PI*.8);
        ctx.stroke();

        ctx.shadowBlur=0;

        // grip

        ctx.fillStyle="#4a2f1c";
        ctx.beginPath();
        ctx.ellipse(x,y,6,10,0,0,Math.PI*2);
        ctx.fill();

        // string — glows more the further it's pulled

        ctx.strokeStyle="rgba(255,255,255,"+(0.55+pull*0.4)+")";
        ctx.lineWidth=1.6+pull*0.6;

        if(pull>0.1){
            ctx.shadowColor="#8fd3ff";
            ctx.shadowBlur=6*pull;
        }

        ctx.beginPath();

        ctx.moveTo(
            x+35*Math.cos(-Math.PI*.8),
            y+35*Math.sin(-Math.PI*.8)
        );

        ctx.lineTo(bx,by);

        ctx.lineTo(
            x+35*Math.cos(Math.PI*.8),
            y+35*Math.sin(Math.PI*.8)
        );

        ctx.stroke();

        ctx.shadowBlur=0;


        if(dragging){

            // nocked arrow preview

            const dx=x-bx;
            const dy=y-by;
            const ang=Math.atan2(dy,dx);

            ctx.save();
            ctx.translate(bx,by);
            ctx.rotate(ang);

            ctx.strokeStyle="#c9a36a";
            ctx.lineWidth=3;
            ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(Math.hypot(dx,dy)+18,0);
            ctx.stroke();

            ctx.fillStyle="#eee";
            ctx.beginPath();
            ctx.moveTo(Math.hypot(dx,dy)+26,0);
            ctx.lineTo(Math.hypot(dx,dy)+14,-4);
            ctx.lineTo(Math.hypot(dx,dy)+14,4);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        ctx.restore();
    }


    // ========================================================
    // BACKGROUND (arena)
    // ========================================================

    function drawBackground(){

        const gradient=ctx.createLinearGradient(0,0,0,canvas.height);
        gradient.addColorStop(0,"#0d1b33");
        gradient.addColorStop(.45,"#1c3a52");
        gradient.addColorStop(.72,"#2f5945");
        gradient.addColorStop(1,"#233b26");

        ctx.fillStyle=gradient;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // sun

        ctx.save();
        ctx.shadowColor="#f9d976";
        ctx.shadowBlur=40;
        ctx.fillStyle="#f9d976";
        ctx.globalAlpha=.85;
        ctx.beginPath();
        ctx.arc(canvas.width*.8,canvas.height*.16,55,0,Math.PI*2);
        ctx.fill();
        ctx.restore();

        // clouds

        ctx.fillStyle="rgba(255,255,255,.12)";

        for(const c of clouds){

            c.x+=c.v;
            if(c.x>canvas.width+80)c.x=-80;

            ctx.save();
            ctx.translate(c.x,c.y);
            ctx.scale(c.s,c.s);
            ctx.beginPath();
            ctx.arc(0,0,22,0,Math.PI*2);
            ctx.arc(20,-6,16,0,Math.PI*2);
            ctx.arc(-18,-4,15,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        // distant hills

        ctx.fillStyle="rgba(20,45,35,.55)";
        ctx.beginPath();
        ctx.moveTo(0,canvas.height*.7);
        for(let x=0;x<=canvas.width;x+=40){
            ctx.lineTo(x,canvas.height*.7-Math.sin(x*.01)*18);
        }
        ctx.lineTo(canvas.width,canvas.height*.72);
        ctx.lineTo(0,canvas.height*.72);
        ctx.closePath();
        ctx.fill();

        // ground

        const groundGrad=ctx.createLinearGradient(
            0,canvas.height-35,0,canvas.height
        );
        groundGrad.addColorStop(0,"#3f6b3a");
        groundGrad.addColorStop(1,"#20351f");

        ctx.fillStyle=groundGrad;
        ctx.fillRect(0,canvas.height-35,canvas.width,35);

        ctx.fillStyle="rgba(255,255,255,.08)";
        ctx.fillRect(0,canvas.height-35,canvas.width,3);

        // grass blades

        ctx.strokeStyle="rgba(90,150,80,.5)";
        ctx.lineWidth=2;
        for(let x=4;x<canvas.width;x+=14){
            const h=4+((x*7)%6);
            ctx.beginPath();
            ctx.moveTo(x,canvas.height-33);
            ctx.lineTo(x+2,canvas.height-33-h);
            ctx.stroke();
        }

        // low fence posts flanking the arena

        ctx.fillStyle="rgba(90,60,35,.55)";
        for(let i=0;i<2;i++){
            const px=i===0?canvas.width*.06:canvas.width*.94;
            ctx.fillRect(px-4,canvas.height-70,8,40);
        }
    }


    // ========================================================
    // GAME LOOP
    // ========================================================

    function loop(){

        animationId=requestAnimationFrame(loop);

        ctx.save();

        if(shakeTime>0){

            shakeTime--;

            const mag=shakeTime*0.6;

            ctx.translate(
                (Math.random()-.5)*mag,
                (Math.random()-.5)*mag
            );
        }

        drawBackground();


        if(!gameOver){

            player.update();
            enemy.update();
        }

        player.draw();
        enemy.draw();


        if(player.alive && !gameOver){
            drawBow();
        }


        for(let i=arrows.length-1;i>=0;i--){

            const a=arrows[i];

            if(!gameOver){
                a.update();
            }

            a.draw();

            if(a.hit){
                arrows.splice(i,1);
            }
        }

        updateParticles();
        drawParticles();


        if(dragging){

            const dx=player.arm2.x-dragX;
            const dy=player.arm2.y-dragY;

            const power=Math.min(100,Math.hypot(dx,dy)*3);

            ctx.fillStyle="rgba(0,0,0,.7)";
            ctx.fillRect(canvas.width/2-100,20,200,15);

            const powGrad=ctx.createLinearGradient(
                canvas.width/2-100,0,canvas.width/2+100,0
            );
            powGrad.addColorStop(0,"#8e44ad");
            powGrad.addColorStop(1,"#e056fd");

            ctx.fillStyle=powGrad;
            ctx.fillRect(canvas.width/2-100,20,power*2,15);

            ctx.strokeStyle="rgba(255,255,255,.35)";
            ctx.strokeRect(canvas.width/2-100,20,200,15);
        }


        if(flashAlpha>0.005 && flashColor){

            ctx.fillStyle=flashColor;
            ctx.globalAlpha=flashAlpha;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.globalAlpha=1;

            flashAlpha*=.9;
        }


        ctx.restore();


        ui.innerHTML=
            "<b style='font-size:18px;text-shadow:0 0 8px rgba(255,255,255,.4)'>🏹 RAGDOLL ARCHERS</b>"+
            "<br>"+
            "<span style='color:#3498db;text-shadow:0 0 6px #3498db'>YOU</span> ❤️ "+
            Math.max(0,Math.ceil(player.hp))+
            " &nbsp; | &nbsp; "+
            "<span style='color:#e74c3c;text-shadow:0 0 6px #e74c3c'>ENEMY</span> ❤️ "+
            Math.max(0,Math.ceil(enemy.hp))+
            "<br>"+
            "Round: "+round+
            " &nbsp; Score: "+score+
            "<br>"+
            "<span style='color:#bbb'>Drag from your bow and release to fire</span>";


        if(gameOver){

            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            ctx.textAlign="center";

            ctx.shadowColor="#e74c3c";
            ctx.shadowBlur=30;
            ctx.fillStyle="#e74c3c";
            ctx.font="900 48px Arial";
            ctx.fillText("YOU LOST",canvas.width/2,canvas.height/2-35);

            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);

            ctx.font="16px Arial";
            ctx.fillText("Tap anywhere to restart",canvas.width/2,canvas.height/2+55);
        }
    }


    // ========================================================
    // PAUSE
    // ========================================================

    function drawPauseOverlay(){

        ctx.fillStyle="rgba(0,0,0,.6)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.textAlign="center";

        ctx.shadowColor="#8e44ad";
        ctx.shadowBlur=22;
        ctx.fillStyle="#fff";
        ctx.font="900 42px Arial";

        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);

        ctx.shadowBlur=0;
        ctx.fillStyle="#d9a8ff";
        ctx.font="16px Arial";

        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
    }


    pauseBtn.onclick=function(){

        paused=!paused;

        if(paused){

            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();

        }else{

            pauseBtn.textContent="⏸";
            loop();
        }
    };


    // ========================================================
    // MENU
    // ========================================================

    back.onclick=function(){

        cancelAnimationFrame(animationId);

        showMainMenu();
    };


    // ========================================================
    // RESIZE
    // ========================================================

    function resizeHandler(){

        resize();

        if(player){

            player.head.x=Math.min(canvas.width-40,Math.max(40,player.head.x));
            player.body.x=player.head.x;
        }

        if(enemy){

            enemy.head.x=Math.min(canvas.width-40,Math.max(40,enemy.head.x));
            enemy.body.x=enemy.head.x;
        }

        if(paused){
            drawPauseOverlay();
        }
    }


    window.addEventListener("resize",resizeHandler);


    // ========================================================
    // CLEANUP
    // ========================================================

    currentCleanup=function(){

        cancelAnimationFrame(animationId);

        window.removeEventListener("resize",resizeHandler);

        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.removeEventListener("pointermove",pointerMove);
        canvas.removeEventListener("pointerup",pointerUp);

        canvas.remove();

        ui.remove();
        back.remove();
        pauseBtn.remove();
    };


    loop();
}


// ============================================================
// SNAKE
// ============================================================

function startSnake(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="sn-canvas";

    const ctx=canvas.getContext("2d");

    const CELL=26;
    let cols,rows;

    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        cols=Math.floor(canvas.width/CELL);
        rows=Math.floor(canvas.height/CELL);
    }

    resize();

    Object.assign(canvas.style,{
        position:"fixed",
        inset:"0",
        width:"100%",
        height:"100%",
        zIndex:"100000",
        background:"#0b1a0f",
        touchAction:"none",
        userSelect:"none",
        WebkitUserSelect:"none",
        WebkitTapHighlightColor:"transparent"
    });

    document.body.appendChild(canvas);


    const ui=document.createElement("div");
    ui.className="sn-ui";

    Object.assign(ui.style,{
        position:"fixed",
        top:"12px",
        left:"12px",
        zIndex:"100002",
        color:"#fff",
        fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(5,15,8,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(120,255,150,.3)",
        borderRadius:"12px",
        padding:"9px 14px",
        pointerEvents:"none",
        fontWeight:"bold",
        fontSize:"15px",
        textShadow:"0 0 6px rgba(80,255,120,.5)",
        boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });

    document.body.appendChild(ui);


    const back=document.createElement("button");
    back.className="sn-back";
    back.textContent="☰ MENU";

    Object.assign(back.style,{
        position:"fixed",
        bottom:"15px",
        right:"15px",
        zIndex:"100003",
        background:"linear-gradient(135deg,rgba(10,25,15,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(80,255,130,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        boxShadow:"0 0 15px rgba(50,220,100,.25),0 5px 18px rgba(0,0,0,.45)"
    });

    document.body.appendChild(back);


    const pauseBtn=document.createElement("button");
    pauseBtn.className="sn-pause";
    pauseBtn.textContent="⏸";

    Object.assign(pauseBtn.style,{
        position:"fixed",
        top:"12px",
        right:"12px",
        zIndex:"100003",
        background:"linear-gradient(135deg,rgba(10,25,15,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(80,255,130,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"16px",
        boxShadow:"0 0 15px rgba(50,220,100,.25),0 5px 18px rgba(0,0,0,.45)"
    });

    document.body.appendChild(pauseBtn);


    // On-screen D-pad for mobile

    const dpad=document.createElement("div");
    dpad.className="sn-dpad";

    Object.assign(dpad.style,{
        position:"fixed",
        left:"15px",
        bottom:"15px",
        zIndex:"100003",
        display:"grid",
        gridTemplateColumns:"46px 46px 46px",
        gridTemplateRows:"46px 46px 46px",
        gap:"4px",
        opacity:".85"
    });

    document.body.appendChild(dpad);

    function dpadBtn(label,gridArea,dx,dy){

        const b=document.createElement("button");
        b.textContent=label;

        Object.assign(b.style,{
            gridArea:gridArea,
            background:"rgba(20,40,25,.85)",
            color:"#9fffb0",
            border:"1px solid rgba(120,255,150,.35)",
            borderRadius:"8px",
            fontSize:"18px",
            fontWeight:"bold"
        });

        b.style.touchAction="none";

        b.addEventListener("pointerdown",function(e){
            e.preventDefault();
            queueDir(dx,dy);
        },{passive:false});

        dpad.appendChild(b);
    }

    dpadBtn("▲","2 / 1",0,-1);
    dpadBtn("◀","1 / 2",-1,0);
    dpadBtn("▶","3 / 2",1,0);
    dpadBtn("▼","2 / 3",0,1);

    dpad.style.gridTemplateAreas="'. u .' 'l . r' '. d .'";

    // fix grid-area names properly

    dpad.innerHTML="";

    const dpadGrid=[
        [null,"up",null],
        ["left",null,"right"],
        [null,"down",null]
    ];

    function makeDpadCell(dir){

        const b=document.createElement("button");

        Object.assign(b.style,{
            background:dir?"rgba(20,40,25,.85)":"transparent",
            color:"#9fffb0",
            border:dir?"1px solid rgba(120,255,150,.35)":"none",
            borderRadius:"8px",
            fontSize:"18px",
            fontWeight:"bold",
            touchAction:"none"
        });

        if(!dir){
            b.disabled=true;
            b.style.pointerEvents="none";
            return b;
        }

        const map={
            up:["▲",0,-1],
            down:["▼",0,1],
            left:["◀",-1,0],
            right:["▶",1,0]
        };

        const [label,dx,dy]=map[dir];
        b.textContent=label;

        b.addEventListener("pointerdown",function(e){
            e.preventDefault();
            queueDir(dx,dy);
        },{passive:false});

        return b;
    }

    for(const row of dpadGrid){
        for(const cell of row){
            dpad.appendChild(makeDpadCell(cell));
        }
    }


    let snake,dir,nextDirQueue,food,foodPulse,score,best=0,gameOver,started;
    let paused=false;
    let moveTimer=0;
    let moveInterval=140;
    let animationId;
    let lastTime=performance.now();
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();
    let particles=[];


    function resetGame(){

        cols=Math.floor(canvas.width/CELL);
        rows=Math.floor(canvas.height/CELL);

        const startX=Math.floor(cols/2);
        const startY=Math.floor(rows/2);

        snake=[
            {x:startX,y:startY},
            {x:startX-1,y:startY},
            {x:startX-2,y:startY}
        ];

        dir={x:1,y:0};
        nextDirQueue=[];
        score=0;
        gameOver=false;
        started=false;
        moveInterval=140;
        moveTimer=0;
        particles=[];

        placeFood();
    }


    function placeFood(){

        let fx,fy,collide;

        do{

            fx=Math.floor(Math.random()*cols);
            fy=Math.floor(Math.random()*rows);

            collide=snake.some(s=>s.x===fx&&s.y===fy);

        }while(collide);

        food={x:fx,y:fy};
        foodPulse=0;
    }


    function queueDir(dx,dy){

        if(paused)return;

        started=true;

        const last=
            nextDirQueue.length
            ? nextDirQueue[nextDirQueue.length-1]
            : dir;

        // prevent reversing directly into itself
        if(dx===-last.x && dy===-last.y)return;
        if(dx===last.x && dy===last.y)return;

        if(nextDirQueue.length<2){
            nextDirQueue.push({x:dx,y:dy});
        }
    }


    function keyHandler(e){

        const k=e.key;

        if(k==="ArrowUp"||k==="w")queueDir(0,-1);
        else if(k==="ArrowDown"||k==="s")queueDir(0,1);
        else if(k==="ArrowLeft"||k==="a")queueDir(-1,0);
        else if(k==="ArrowRight"||k==="d")queueDir(1,0);
    }

    window.addEventListener("keydown",keyHandler);


    // swipe support directly on canvas

    let touchStartX=0,touchStartY=0,touchActive=false;

    function swipeStart(e){

        if(paused)return;

        if(gameOver){
            resetGame();
            return;
        }

        touchActive=true;
        touchStartX=e.clientX;
        touchStartY=e.clientY;
    }

    function swipeEnd(e){

        if(!touchActive)return;
        touchActive=false;

        const dx=e.clientX-touchStartX;
        const dy=e.clientY-touchStartY;

        if(Math.hypot(dx,dy)<20)return;

        if(Math.abs(dx)>Math.abs(dy)){
            queueDir(dx>0?1:-1,0);
        }else{
            queueDir(0,dy>0?1:-1);
        }
    }

    canvas.addEventListener("pointerdown",swipeStart,{passive:false});
    canvas.addEventListener("pointerup",swipeEnd,{passive:false});


    function spawnEatBurst(x,y){

        for(let i=0;i<14;i++){

            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*3;

            particles.push({
                x:x*CELL+CELL/2,
                y:y*CELL+CELL/2,
                vx:Math.cos(a)*sp,
                vy:Math.sin(a)*sp,
                life:24,
                maxLife:24,
                color:Math.random()>.5?"#ffe66d":"#ff6b6b"
            });
        }
    }


    function updateGame(){

        const nd=nextDirQueue.shift();

        if(nd)dir=nd;

        const head=snake[0];

        const nx=head.x+dir.x;
        const ny=head.y+dir.y;

        // wall collision

        if(nx<0||ny<0||nx>=cols||ny>=rows){
            gameOver=true;
            best=Math.max(best,score);
            shaker.kick(14);
            return;
        }

        // self collision — exclude the tail cell when it's about to
        // move out of the way (i.e. we're not eating food this turn)

        const eating = (nx===food.x && ny===food.y);
        const bodyToCheck = eating ? snake : snake.slice(0,-1);

        if(bodyToCheck.some(s=>s.x===nx&&s.y===ny)){
            gameOver=true;
            best=Math.max(best,score);
            shaker.kick(14);
            return;
        }

        snake.unshift({x:nx,y:ny});

        if(eating){

            score++;
            spawnEatBurst(nx,ny);
            floatText.spawn(nx*CELL+CELL/2,ny*CELL+CELL/2,"+1","#ffe66d",16);
            moveInterval=Math.max(60,moveInterval-2.5);
            placeFood();

        }else{

            snake.pop();
        }
    }


    function updateParticles(dt){

        for(let i=particles.length-1;i>=0;i--){

            const p=particles[i];

            p.x+=p.vx;
            p.y+=p.vy;
            p.vx*=.92;
            p.vy*=.92;
            p.life--;

            if(p.life<=0)particles.splice(i,1);
        }
    }


    function drawParticles(){

        for(const p of particles){

            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.shadowColor=p.color;
            ctx.shadowBlur=6;
            ctx.beginPath();
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    }


    function drawRoundedCell(x,y,r,color,glow){

        const px=x*CELL;
        const py=y*CELL;

        ctx.save();

        if(glow){
            ctx.shadowColor=color;
            ctx.shadowBlur=10;
        }

        ctx.fillStyle=color;

        const rr=r||6;

        ctx.beginPath();
        ctx.moveTo(px+rr,py);
        ctx.arcTo(px+CELL,py,px+CELL,py+CELL,rr);
        ctx.arcTo(px+CELL,py+CELL,px,py+CELL,rr);
        ctx.arcTo(px,py+CELL,px,py,rr);
        ctx.arcTo(px,py,px+CELL,py,rr);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }


    resetGame();


    function draw(t){

        animationId=requestAnimationFrame(draw);

        const dt=Math.min((t-lastTime)/1000,.1);
        lastTime=t;

        ctx.save();
        shaker.apply(ctx);

        // background checker grid

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#0e2013");
        bg.addColorStop(1,"#081409");

        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        for(let y=0;y<rows;y++){
            for(let x=0;x<cols;x++){
                if((x+y)%2===0){
                    ctx.fillStyle="rgba(255,255,255,.02)";
                    ctx.fillRect(x*CELL,y*CELL,CELL,CELL);
                }
            }
        }


        if(!gameOver && started){

            moveTimer+=dt*1000;

            while(moveTimer>=moveInterval){

                moveTimer-=moveInterval;
                updateGame();

                if(gameOver)break;
            }
        }


        // food (glowing pulsing orb)

        foodPulse=(foodPulse||0)+dt*6;

        const pulseR=CELL*.32+Math.sin(foodPulse)*2;

        ctx.save();
        ctx.shadowColor="#ff5b5b";
        ctx.shadowBlur=16;

        const foodGrad=ctx.createRadialGradient(
            food.x*CELL+CELL/2-3,
            food.y*CELL+CELL/2-3,
            1,
            food.x*CELL+CELL/2,
            food.y*CELL+CELL/2,
            pulseR
        );

        foodGrad.addColorStop(0,"#ffb3b3");
        foodGrad.addColorStop(1,"#ff3b3b");

        ctx.fillStyle=foodGrad;

        ctx.beginPath();
        ctx.arc(
            food.x*CELL+CELL/2,
            food.y*CELL+CELL/2,
            pulseR,0,Math.PI*2
        );
        ctx.fill();
        ctx.restore();


        // snake body

        for(let i=snake.length-1;i>=1;i--){

            const seg=snake[i];
            const frac=i/snake.length;

            const g=Math.floor(200-frac*80);

            drawRoundedCell(
                seg.x,seg.y,
                7,
                "rgb("+Math.floor(40+frac*20)+","+g+","+Math.floor(90+frac*30)+")",
                false
            );
        }

        // head

        const head=snake[0];

        drawRoundedCell(head.x,head.y,8,"#5cff8a",true);

        // eyes on head, oriented by dir

        ctx.save();
        ctx.fillStyle="#0b1a0f";

        const hx=head.x*CELL+CELL/2;
        const hy=head.y*CELL+CELL/2;

        const ex=dir.x*5;
        const ey=dir.y*5;
        const px2=-dir.y*5;
        const py2=dir.x*5;

        ctx.beginPath();
        ctx.arc(hx+ex+px2*.5,hy+ey+py2*.5,2.4,0,Math.PI*2);
        ctx.arc(hx+ex-px2*.5,hy+ey-py2*.5,2.4,0,Math.PI*2);
        ctx.fill();
        ctx.restore();


        updateParticles(dt);
        drawParticles();

        floatText.update(dt);
        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🐍 SNAKE<br>Score: "+score+
            " &nbsp; Best: "+best+
            (started?"":"<br><span style='font-weight:normal;color:#bbb'>Swipe, arrow keys, or D-pad to move</span>");


        if(gameOver){

            ctx.fillStyle="rgba(0,0,0,.75)";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            ctx.textAlign="center";
            ctx.shadowColor="#ff4444";
            ctx.shadowBlur=20;
            ctx.fillStyle="#ff5b5b";
            ctx.font="900 42px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);

            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score+"   Best: "+best,canvas.width/2,canvas.height/2+10);

            ctx.font="16px Arial";
            ctx.fillStyle="#9fffb0";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }


    function drawPauseOverlay(){

        ctx.fillStyle="rgba(0,0,0,.65)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.textAlign="center";

        ctx.shadowColor="#5cff8a";
        ctx.shadowBlur=22;
        ctx.fillStyle="#fff";
        ctx.font="900 42px Arial";

        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);

        ctx.shadowBlur=0;
        ctx.fillStyle="#9fffb0";
        ctx.font="16px Arial";

        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
    }


    pauseBtn.onclick=function(){

        paused=!paused;

        if(paused){

            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();

        }else{

            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(draw);
        }
    };


    back.onclick=function(){

        cancelAnimationFrame(animationId);
        showMainMenu();
    };


    function resizeHandler(){
        resize();
        if(paused){
            drawPauseOverlay();
        }
    }

    window.addEventListener("resize",resizeHandler);


    currentCleanup=function(){

        cancelAnimationFrame(animationId);

        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyHandler);

        canvas.removeEventListener("pointerdown",swipeStart);
        canvas.removeEventListener("pointerup",swipeEnd);

        canvas.remove();
        ui.remove();
        back.remove();
        dpad.remove();
        pauseBtn.remove();
    };


    lastTime=performance.now();
    animationId=requestAnimationFrame(draw);
}


// ============================================================
// ENDLESS RUNNER
// ============================================================

function startEndlessRunner(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="er-canvas";

    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }

    resize();

    Object.assign(canvas.style,{
        position:"fixed",
        inset:"0",
        width:"100%",
        height:"100%",
        zIndex:"100000",
        background:"#87ceeb",
        touchAction:"none",
        userSelect:"none",
        WebkitUserSelect:"none",
        WebkitTapHighlightColor:"transparent"
    });

    document.body.appendChild(canvas);


    const ui=document.createElement("div");
    ui.className="er-ui";

    Object.assign(ui.style,{
        position:"fixed",
        top:"12px",
        left:"12px",
        zIndex:"100002",
        color:"#fff",
        fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(20,15,5,.85),rgba(0,0,0,.65))",
        border:"1px solid rgba(255,180,90,.35)",
        borderRadius:"12px",
        padding:"9px 14px",
        pointerEvents:"none",
        fontWeight:"bold",
        fontSize:"15px",
        textShadow:"0 1px 3px #000",
        boxShadow:"0 8px 24px rgba(0,0,0,.35)"
    });

    document.body.appendChild(ui);


    const back=document.createElement("button");
    back.className="er-back";
    back.textContent="☰ MENU";

    Object.assign(back.style,{
        position:"fixed",
        bottom:"15px",
        right:"15px",
        zIndex:"100003",
        background:"linear-gradient(135deg,rgba(30,18,8,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,180,90,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        boxShadow:"0 0 15px rgba(255,150,50,.25),0 5px 18px rgba(0,0,0,.45)"
    });

    document.body.appendChild(back);


    const pauseBtn=document.createElement("button");
    pauseBtn.className="er-pause";
    pauseBtn.textContent="⏸";

    Object.assign(pauseBtn.style,{
        position:"fixed",
        top:"12px",
        right:"12px",
        zIndex:"100003",
        background:"linear-gradient(135deg,rgba(30,18,8,.95),rgba(0,0,0,.9))",
        color:"#fff",
        border:"1px solid rgba(255,180,90,.5)",
        borderRadius:"10px",
        padding:"9px 16px",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"16px",
        boxShadow:"0 0 15px rgba(255,150,50,.25),0 5px 18px rgba(0,0,0,.45)"
    });

    document.body.appendChild(pauseBtn);


    // physics constants

    const GROUND_RATIO=.78;
    const GRAVITY=2200;
    const JUMP_VELOCITY=-880;
    const DOUBLE_JUMP_VELOCITY=-760;

    let groundY;

    function computeGround(){
        groundY=canvas.height*GROUND_RATIO;
    }

    computeGround();


    let player,obstacles,coins,particles,clouds2,hills;
    let speed,distance,score,coinCount,gameOver,started;
    let paused=false;
    let animationId;
    let lastTime=performance.now();
    let spawnDist=0;
    let nextSpawn=0;
    let bgOffset=0;
    const shaker=makeShaker();


    function resetGame(){

        computeGround();

        player={
            x:canvas.width*.2,
            y:groundY-30,
            w:34,
            h:44,
            vy:0,
            onGround:true,
            jumps:0,
            crouch:false,
            legPhase:0
        };

        obstacles=[];
        coins=[];
        particles=[];

        speed=380;
        distance=0;
        score=0;
        coinCount=0;
        gameOver=false;
        started=false;
        spawnDist=0;
        nextSpawn=260+Math.random()*180;

        clouds2=[];
        for(let i=0;i<6;i++){
            clouds2.push({
                x:Math.random()*canvas.width,
                y:40+Math.random()*canvas.height*.35,
                s:.6+Math.random()*.8,
                v:12+Math.random()*10
            });
        }

        hills=[];
        for(let i=0;i<5;i++){
            hills.push({x:i*260,h:60+Math.random()*40});
        }
    }


    resetGame();


    function doJump(){

        if(paused)return;

        started=true;

        if(gameOver){
            resetGame();
            return;
        }

        if(player.onGround){

            player.vy=JUMP_VELOCITY;
            player.onGround=false;
            player.jumps=1;
            spawnDust(player.x,player.y+player.h/2,8);

        }else if(player.jumps<2){

            player.vy=DOUBLE_JUMP_VELOCITY;
            player.jumps=2;
            spawnDust(player.x,player.y+player.h/2,10);
        }
    }


    function spawnDust(x,y,n){

        for(let i=0;i<n;i++){

            particles.push({
                x:x,
                y:y,
                vx:(Math.random()-.5)*120,
                vy:-Math.random()*60,
                life:.4+Math.random()*.3,
                maxLife:.6,
                color:"rgba(255,255,255,.6)",
                size:2+Math.random()*3
            });
        }
    }


    function spawnBurst(x,y,color,n){

        for(let i=0;i<n;i++){

            const a=Math.random()*Math.PI*2;
            const sp=60+Math.random()*160;

            particles.push({
                x:x,
                y:y,
                vx:Math.cos(a)*sp,
                vy:Math.sin(a)*sp,
                life:.5+Math.random()*.3,
                maxLife:.8,
                color:color,
                size:2+Math.random()*3
            });
        }
    }


    function pointerDown(e){

        e.preventDefault();
        doJump();
    }

    function keyHandler(e){

        if(e.code==="Space"||e.key==="ArrowUp"||e.key==="w"){
            e.preventDefault();
            doJump();
        }
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});
    window.addEventListener("keydown",keyHandler);


    function spawnObstacle(){

        const kinds=["rock","spike","bird"];
        const kind=kinds[Math.floor(Math.random()*kinds.length)];

        if(kind==="bird"){

            obstacles.push({
                type:"bird",
                x:canvas.width+40,
                y:groundY-90-Math.random()*70,
                w:34,
                h:24,
                phase:Math.random()*Math.PI*2
            });

        }else if(kind==="spike"){

            const count=1+Math.floor(Math.random()*2);

            obstacles.push({
                type:"spike",
                x:canvas.width+40,
                w:26*count,
                h:36,
                count:count
            });

        }else{

            obstacles.push({
                type:"rock",
                x:canvas.width+40,
                w:30+Math.random()*20,
                h:30+Math.random()*22
            });
        }

        if(Math.random()<.55){

            const cx=canvas.width+40+Math.random()*40;
            const cy=groundY-60-Math.random()*140;

            for(let i=0;i<3;i++){
                coins.push({
                    x:cx+i*26,
                    y:cy,
                    r:8,
                    taken:false,
                    phase:i*.6
                });
            }
        }
    }


    function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){

        return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
    }


    function update(dt){

        if(!started||gameOver)return;

        distance+=speed*dt;
        score=Math.floor(distance/10);

        speed=Math.min(760,speed+dt*7);

        // player physics

        player.vy+=GRAVITY*dt;
        player.y+=player.vy*dt;

        const footY=groundY;

        if(player.y+player.h>=footY){

            player.y=footY-player.h;

            if(!player.onGround && player.vy>0){
                spawnDust(player.x,player.y+player.h,6);
            }

            player.vy=0;
            player.onGround=true;
            player.jumps=0;

        }else{

            player.onGround=false;
        }

        player.legPhase+=dt*(player.onGround?14:0);


        // spawn obstacles

        spawnDist+=speed*dt;

        if(spawnDist>=nextSpawn){

            spawnDist=0;
            nextSpawn=Math.max(140,260-speed*.15)+Math.random()*180;
            spawnObstacle();
        }


        // move + collide obstacles

        for(let i=obstacles.length-1;i>=0;i--){

            const o=obstacles[i];
            o.x-=speed*dt;

            let oy,oh;

            if(o.type==="bird"){
                o.phase+=dt*6;
                oy=o.y+Math.sin(o.phase)*10;
                oh=o.h;
            }else if(o.type==="spike"){
                oy=groundY-o.h;
                oh=o.h;
            }else{
                oy=groundY-o.h;
                oh=o.h;
            }

            if(!gameOver && rectsOverlap(
                player.x-player.w/2+6,player.y+4,
                player.w-12,player.h-8,
                o.x,oy,o.w,oh
            )){

                gameOver=true;
                spawnBurst(player.x,player.y+player.h/2,"#ff6b6b",20);
                shaker.kick(16);
            }

            if(o.x<-100){
                obstacles.splice(i,1);
            }
        }


        // coins

        for(let i=coins.length-1;i>=0;i--){

            const c=coins[i];
            c.x-=speed*dt;
            c.phase+=dt*4;

            if(!c.taken && Math.hypot(
                (player.x)-c.x,
                (player.y+player.h/2)-c.y
            )<28){

                c.taken=true;
                coinCount++;
                spawnBurst(c.x,c.y,"#ffd93d",10);
            }

            if(c.x<-40){
                coins.splice(i,1);
            }
        }


        // particles

        for(let i=particles.length-1;i>=0;i--){

            const p=particles[i];

            p.x+=p.vx*dt;
            p.y+=p.vy*dt;
            p.vy+=400*dt;
            p.life-=dt;

            if(p.life<=0)particles.splice(i,1);
        }


        // parallax

        bgOffset+=speed*dt*.4;

        for(const c of clouds2){
            c.x-=c.v*dt;
            if(c.x<-80)c.x=canvas.width+80;
        }

        for(const h of hills){
            h.x-=speed*dt*.3;
            if(h.x<-260)h.x+=260*hills.length;
        }
    }


    function drawBackground(){

        const sky=ctx.createLinearGradient(0,0,0,canvas.height);
        sky.addColorStop(0,"#5fb8e8");
        sky.addColorStop(.6,"#bfe6f2");
        sky.addColorStop(1,"#e8f6e0");

        ctx.fillStyle=sky;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // sun

        ctx.save();
        ctx.fillStyle="#fff6c2";
        ctx.shadowColor="#fff6c2";
        ctx.shadowBlur=40;
        ctx.beginPath();
        ctx.arc(canvas.width*.85,canvas.height*.15,45,0,Math.PI*2);
        ctx.fill();
        ctx.restore();

        // clouds

        ctx.fillStyle="rgba(255,255,255,.85)";

        for(const c of clouds2){
            ctx.save();
            ctx.translate(c.x,c.y);
            ctx.scale(c.s,c.s);
            ctx.beginPath();
            ctx.arc(0,0,20,0,Math.PI*2);
            ctx.arc(18,-6,14,0,Math.PI*2);
            ctx.arc(-16,-4,13,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        // hills

        ctx.fillStyle="rgba(90,160,90,.55)";

        for(const h of hills){
            ctx.beginPath();
            ctx.ellipse(h.x,groundY,180,h.h,0,Math.PI,0,true);
            ctx.fill();
        }


        // ground

        const groundGrad=ctx.createLinearGradient(0,groundY,0,canvas.height);
        groundGrad.addColorStop(0,"#8b5e34");
        groundGrad.addColorStop(1,"#5c3d21");

        ctx.fillStyle=groundGrad;
        ctx.fillRect(0,groundY,canvas.width,canvas.height-groundY);

        ctx.fillStyle="#6fae4a";
        ctx.fillRect(0,groundY,canvas.width,8);

        // scrolling ground ticks

        ctx.strokeStyle="rgba(0,0,0,.15)";
        ctx.lineWidth=2;

        const tick=40;
        const off=(-bgOffset)%tick;

        for(let x=off;x<canvas.width;x+=tick){
            ctx.beginPath();
            ctx.moveTo(x,groundY+10);
            ctx.lineTo(x-14,groundY+34);
            ctx.stroke();
        }
    }


    function drawPlayer(){

        const p=player;
        const cx=p.x;
        const cy=p.y+p.h/2;

        ctx.save();

        // shadow

        ctx.fillStyle="rgba(0,0,0,.25)";
        ctx.beginPath();
        ctx.ellipse(cx,groundY+6,20,6,0,0,Math.PI*2);
        ctx.fill();


        // legs (simple running animation)

        const legSwing=p.onGround?Math.sin(p.legPhase)*14:6;

        ctx.strokeStyle="#274472";
        ctx.lineWidth=8;
        ctx.lineCap="round";

        ctx.beginPath();
        ctx.moveTo(cx-4,cy+14);
        ctx.lineTo(cx-4+legSwing,cy+30);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx+4,cy+14);
        ctx.lineTo(cx+4-legSwing,cy+30);
        ctx.stroke();


        // body

        const bodyGrad=ctx.createLinearGradient(cx-16,cy,cx+16,cy);
        bodyGrad.addColorStop(0,"#3b6fd4");
        bodyGrad.addColorStop(1,"#5a8bee");

        ctx.fillStyle=bodyGrad;
        ctx.shadowColor="rgba(0,0,0,.3)";
        ctx.shadowBlur=6;

        roundRectER(ctx,cx-14,cy-18,28,32,10);
        ctx.fill();

        ctx.shadowBlur=0;


        // arm (swings opposite to legs)

        ctx.strokeStyle="#e3b98c";
        ctx.lineWidth=6;
        ctx.lineCap="round";
        ctx.beginPath();
        ctx.moveTo(cx+8,cy-8);
        ctx.lineTo(cx+16-legSwing*.6,cy+8);
        ctx.stroke();


        // head

        ctx.fillStyle="#e3b98c";
        ctx.beginPath();
        ctx.arc(cx,cy-26,11,0,Math.PI*2);
        ctx.fill();

        // headband

        ctx.fillStyle="#e74c3c";
        ctx.beginPath();
        ctx.arc(cx,cy-28,11.5,Math.PI*1.1,Math.PI*1.9);
        ctx.fill();

        // eye

        ctx.fillStyle="#1a1a1a";
        ctx.beginPath();
        ctx.arc(cx+4,cy-26,1.6,0,Math.PI*2);
        ctx.fill();

        ctx.restore();
    }


    function drawObstacle(o){

        if(o.type==="rock"){

            const oy=groundY-o.h;

            ctx.save();
            ctx.fillStyle="#6b6b6b";
            ctx.shadowColor="rgba(0,0,0,.3)";
            ctx.shadowBlur=5;

            ctx.beginPath();
            ctx.moveTo(o.x,groundY);
            ctx.lineTo(o.x+o.w*.15,oy+o.h*.2);
            ctx.lineTo(o.x+o.w*.5,oy);
            ctx.lineTo(o.x+o.w*.85,oy+o.h*.25);
            ctx.lineTo(o.x+o.w,groundY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle="rgba(255,255,255,.15)";
            ctx.beginPath();
            ctx.moveTo(o.x+o.w*.5,oy);
            ctx.lineTo(o.x+o.w*.6,oy+o.h*.4);
            ctx.lineTo(o.x+o.w*.4,oy+o.h*.4);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

        }else if(o.type==="spike"){

            const oy=groundY-o.h;
            const spikeW=o.w/o.count;

            ctx.save();
            ctx.fillStyle="#c0392b";
            ctx.shadowColor="rgba(200,50,50,.4)";
            ctx.shadowBlur=6;

            for(let i=0;i<o.count;i++){

                const sx=o.x+i*spikeW;

                ctx.beginPath();
                ctx.moveTo(sx,groundY);
                ctx.lineTo(sx+spikeW/2,oy);
                ctx.lineTo(sx+spikeW,groundY);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();

        }else if(o.type==="bird"){

            const oy=o.y+Math.sin(o.phase)*10;

            ctx.save();
            ctx.translate(o.x+o.w/2,oy+o.h/2);

            ctx.fillStyle="#8e44ad";
            ctx.shadowColor="#8e44ad";
            ctx.shadowBlur=8;

            const wing=Math.sin(o.phase*2)*10;

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.quadraticCurveTo(-16,-8-wing,-24,2);
            ctx.quadraticCurveTo(-10,2,0,0);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.quadraticCurveTo(16,-8-wing,24,2);
            ctx.quadraticCurveTo(10,2,0,0);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0,0,7,0,Math.PI*2);
            ctx.fill();

            ctx.restore();
        }
    }


    function roundRectER(c,x,y,w,h,r){

        c.beginPath();
        c.moveTo(x+r,y);
        c.arcTo(x+w,y,x+w,y+h,r);
        c.arcTo(x+w,y+h,x,y+h,r);
        c.arcTo(x,y+h,x,y,r);
        c.arcTo(x,y,x+w,y,r);
        c.closePath();
    }


    function drawCoin(c){

        if(c.taken)return;

        const bob=Math.sin(c.phase)*4;

        ctx.save();
        ctx.translate(c.x,c.y+bob);

        ctx.shadowColor="#ffd93d";
        ctx.shadowBlur=10;

        const grad=ctx.createRadialGradient(-2,-2,1,0,0,c.r);
        grad.addColorStop(0,"#fff6c2");
        grad.addColorStop(1,"#ffb300");

        ctx.fillStyle=grad;

        ctx.beginPath();
        ctx.arc(0,0,c.r,0,Math.PI*2);
        ctx.fill();

        ctx.strokeStyle="rgba(255,255,255,.7)";
        ctx.lineWidth=1.5;
        ctx.stroke();

        ctx.restore();
    }


    function drawParticles(){

        for(const p of particles){

            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    }


    function draw(t){

        animationId=requestAnimationFrame(draw);

        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;

        update(dt);

        ctx.save();
        shaker.apply(ctx);

        drawBackground();

        for(const c of coins){
            drawCoin(c);
        }

        for(const o of obstacles){
            drawObstacle(o);
        }

        drawPlayer();
        drawParticles();

        ctx.restore();

        ui.innerHTML=
            "🏃 ENDLESS RUNNER<br>"+
            "Score: "+score+
            " &nbsp; 🪙 "+coinCount+
            (started?"":"<br><span style='font-weight:normal;color:#eee'>Tap / Space to jump (double-jump too!)</span>");


        if(!started && !gameOver){

            ctx.save();
            ctx.textAlign="center";
            ctx.fillStyle="rgba(0,0,0,.35)";
            ctx.fillRect(0,canvas.height*.32,canvas.width,70);
            ctx.fillStyle="#fff";
            ctx.font="bold 22px Arial";
            ctx.fillText("TAP TO START",canvas.width/2,canvas.height*.32+45);
            ctx.restore();
        }


        if(gameOver){

            ctx.fillStyle="rgba(0,0,0,.72)";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            ctx.textAlign="center";
            ctx.shadowColor="#ff5b5b";
            ctx.shadowBlur=25;
            ctx.fillStyle="#ff5b5b";
            ctx.font="900 42px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-35);

            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText(
                "Score: "+score+"   Coins: "+coinCount,
                canvas.width/2,canvas.height/2+5
            );

            ctx.font="16px Arial";
            ctx.fillStyle="#ffe27a";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+40);
        }
    }


    function drawPauseOverlay(){

        ctx.save();

        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.textAlign="center";

        ctx.shadowColor="#ffb35a";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);

        ctx.shadowBlur=0;
        ctx.fillStyle="#ffe27a";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);

        ctx.restore();
    }


    pauseBtn.onclick=function(){

        paused=!paused;

        if(paused){

            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();

        }else{

            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(draw);
        }
    };


    back.onclick=function(){

        cancelAnimationFrame(animationId);
        showMainMenu();
    };


    function resizeHandler(){
        resize();
        computeGround();
        if(paused){
            drawPauseOverlay();
        }
    }

    window.addEventListener("resize",resizeHandler);


    currentCleanup=function(){

        cancelAnimationFrame(animationId);

        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyHandler);

        canvas.removeEventListener("pointerdown",pointerDown);

        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
    };


    lastTime=performance.now();
    animationId=requestAnimationFrame(draw);
}


// ============================================================
// BREAKOUT
// ============================================================

function startBreakout(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="bo-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#0b0b1a",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="bo-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(15,5,20,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(255,120,120,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("bo-back");
    const pauseBtn=makePauseButton("bo-pause");

    const ROWS=6,COLS=9;
    const BRICK_COLORS=["#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db","#9b59b6"];

    let paddle,ball,bricks,lives,score,level,gameOver,won,paused=false;
    let launched=false;
    let animationId;
    let particles=[];
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();

    function layoutBricks(){

        bricks=[];
        const top=70;
        const gap=6;
        const areaW=canvas.width-40;
        const bw=(areaW-gap*(COLS-1))/COLS;
        const bh=22;

        for(let r=0;r<ROWS;r++){
            for(let c=0;c<COLS;c++){
                bricks.push({
                    x:20+c*(bw+gap),
                    y:top+r*(bh+gap),
                    w:bw,h:bh,
                    color:BRICK_COLORS[r%BRICK_COLORS.length],
                    hp:1+Math.floor(r/3),
                    alive:true
                });
            }
        }
    }

    function resetBall(){

        ball={
            x:paddle.x+paddle.w/2,
            y:paddle.y-10,
            r:8,
            vx:0,
            vy:0
        };
        launched=false;
    }

    function resetGame(){

        paddle={
            x:canvas.width/2-55,
            y:canvas.height-46,
            w:110,h:14,
            speed:520
        };

        lives=3;
        score=0;
        level=1;
        gameOver=false;
        won=false;
        particles=[];

        layoutBricks();
        resetBall();
    }

    resetGame();

    function spawnBurst(x,y,color){
        for(let i=0;i<10;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*3;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:24,maxLife:24,color});
        }
    }

    function launchBall(){
        if(launched||gameOver)return;
        launched=true;
        const speed=460;
        const angle=-Math.PI/2+(Math.random()-.5)*.6;
        ball.vx=Math.cos(angle)*speed;
        ball.vy=Math.sin(angle)*speed;
    }

    let pointerX=null;

    function pointerMove(e){
        e.preventDefault();
        const rect=canvas.getBoundingClientRect();
        pointerX=e.clientX-rect.left;
    }

    function pointerDown(e){
        e.preventDefault();
        if(paused)return;
        if(gameOver){ resetGame(); return; }
        const rect=canvas.getBoundingClientRect();
        pointerX=e.clientX-rect.left;
        launchBall();
    }

    canvas.addEventListener("pointermove",pointerMove,{passive:false});
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    let keys={};
    function keyDown(e){
        keys[e.key]=true;
        if(e.key===" "){ e.preventDefault(); launchBall(); }
    }
    function keyUp(e){ keys[e.key]=false; }
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    let lastTime=performance.now();

    function update(dt){

        if(gameOver||paused)return;

        if(pointerX!==null){
            paddle.x+=((pointerX-paddle.w/2)-paddle.x)*.35;
        }
        if(keys["ArrowLeft"])paddle.x-=paddle.speed*dt;
        if(keys["ArrowRight"])paddle.x+=paddle.speed*dt;

        paddle.x=Math.max(10,Math.min(canvas.width-paddle.w-10,paddle.x));

        if(!launched){
            ball.x=paddle.x+paddle.w/2;
            ball.y=paddle.y-10;
            return;
        }

        ball.x+=ball.vx*dt;
        ball.y+=ball.vy*dt;

        if(ball.x-ball.r<10){ ball.x=10+ball.r; ball.vx*=-1; }
        if(ball.x+ball.r>canvas.width-10){ ball.x=canvas.width-10-ball.r; ball.vx*=-1; }
        if(ball.y-ball.r<10){ ball.y=10+ball.r; ball.vy*=-1; }

        if(ball.y-ball.r>canvas.height){

            lives--;
            spawnBurst(ball.x,canvas.height-20,"#ff6b6b");
            shaker.kick(16);
            floatText.spawn(canvas.width/2,canvas.height/2-40,"-1 LIFE","#ff6b6b",26);

            if(lives<=0){
                gameOver=true;
            }else{
                resetBall();
            }
            return;
        }

        // paddle collision
        if(
            ball.y+ball.r>paddle.y &&
            ball.y-ball.r<paddle.y+paddle.h &&
            ball.x>paddle.x &&
            ball.x<paddle.x+paddle.w &&
            ball.vy>0
        ){
            const hitPos=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2);
            const speed=Math.hypot(ball.vx,ball.vy);
            const angle=hitPos*1.1-Math.PI/2;
            ball.vx=Math.cos(angle)*speed;
            ball.vy=Math.sin(angle)*speed;
            ball.y=paddle.y-ball.r-1;
        }

        // brick collisions
        for(const b of bricks){
            if(!b.alive)continue;

            if(
                ball.x+ball.r>b.x && ball.x-ball.r<b.x+b.w &&
                ball.y+ball.r>b.y && ball.y-ball.r<b.y+b.h
            ){
                b.hp--;
                if(b.hp<=0){
                    b.alive=false;
                    score+=10;
                    spawnBurst(b.x+b.w/2,b.y+b.h/2,b.color);
                    floatText.spawn(b.x+b.w/2,b.y+b.h/2,"+10",b.color,16);
                    shaker.kick(4);
                }

                const overlapX=Math.min(ball.x+ball.r-b.x,b.x+b.w-(ball.x-ball.r));
                const overlapY=Math.min(ball.y+ball.r-b.y,b.y+b.h-(ball.y-ball.r));

                if(overlapX<overlapY)ball.vx*=-1;
                else ball.vy*=-1;

                break;
            }
        }

        if(bricks.every(b=>!b.alive)){
            won=true;
            gameOver=true;
        }

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.vy+=.15; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function drawBackground(){
        const g=ctx.createLinearGradient(0,0,0,canvas.height);
        g.addColorStop(0,"#150a24");
        g.addColorStop(1,"#050308");
        ctx.fillStyle=g;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="rgba(255,255,255,.4)";
        for(let i=0;i<40;i++){
            const sx=(i*173)%canvas.width;
            const sy=(i*281)%canvas.height;
            ctx.fillRect(sx,sy,1.2,1.2);
        }
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        drawBackground();

        for(const b of bricks){
            if(!b.alive)continue;
            ctx.save();
            ctx.shadowColor=b.color;
            ctx.shadowBlur=8;
            ctx.fillStyle=b.color;
            roundRectHub(ctx,b.x,b.y,b.w,b.h,5);
            ctx.fill();
            ctx.fillStyle="rgba(255,255,255,.2)";
            ctx.fillRect(b.x,b.y,b.w,4);
            ctx.restore();
        }

        // paddle
        ctx.save();
        ctx.shadowColor="#00e5ff";
        ctx.shadowBlur=12;
        const pg=ctx.createLinearGradient(paddle.x,0,paddle.x+paddle.w,0);
        pg.addColorStop(0,"#00c3e6");
        pg.addColorStop(1,"#66f0ff");
        ctx.fillStyle=pg;
        roundRectHub(ctx,paddle.x,paddle.y,paddle.w,paddle.h,7);
        ctx.fill();
        ctx.restore();

        // ball
        ctx.save();
        ctx.shadowColor="#fff";
        ctx.shadowBlur=14;
        ctx.fillStyle="#fff";
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🧱 BREAKOUT<br>Score: "+score+" &nbsp; ❤️ "+lives+
            (launched?"":"<br><span style='font-weight:normal;color:#bbb'>Move + tap/space to launch</span>");

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor=won?"#4ade80":"#ff5b5b";
            ctx.shadowBlur=25;
            ctx.fillStyle=won?"#4ade80":"#ff5b5b";
            ctx.font="900 42px Arial";
            ctx.fillText(won?"YOU WIN!":"GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#9fe0ff";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#00e5ff";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#9fe0ff";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
        resetGame();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        window.removeEventListener("keyup",keyUp);
        canvas.removeEventListener("pointermove",pointerMove);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// PONG (vs AI)
// ============================================================

function startPong(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="pg-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#04110d",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="pg-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(5,20,15,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(100,255,200,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("pg-back");
    const pauseBtn=makePauseButton("pg-pause");

    const PADDLE_W=14,PADDLE_H=90;
    const WIN_SCORE=7;

    let player,ai,ball,playerScore,aiScore,gameOver,paused=false;
    let particles=[];
    let animationId;
    let lastTime=performance.now();
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();

    function resetBall(dir){

        const speed=360;
        const angle=(Math.random()-.5)*.6;

        ball={
            x:canvas.width/2,
            y:canvas.height/2,
            r:9,
            vx:Math.cos(angle)*speed*(dir||1),
            vy:Math.sin(angle)*speed
        };
    }

    function resetGame(){

        player={x:26,y:canvas.height/2-PADDLE_H/2,w:PADDLE_W,h:PADDLE_H};
        ai={x:canvas.width-26-PADDLE_W,y:canvas.height/2-PADDLE_H/2,w:PADDLE_W,h:PADDLE_H};

        playerScore=0;
        aiScore=0;
        gameOver=false;
        particles=[];

        resetBall(Math.random()>.5?1:-1);
    }

    resetGame();

    function spawnBurst(x,y,color){
        for(let i=0;i<10;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*3;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:22,maxLife:22,color});
        }
    }

    let pointerY=null;

    function pointerMove(e){
        e.preventDefault();
        const rect=canvas.getBoundingClientRect();
        pointerY=e.clientY-rect.top;
    }

    function pointerDown(e){
        e.preventDefault();
        if(gameOver)resetGame();
        const rect=canvas.getBoundingClientRect();
        pointerY=e.clientY-rect.top;
    }

    canvas.addEventListener("pointermove",pointerMove,{passive:false});
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    let keys={};
    function keyDown(e){ keys[e.key]=true; }
    function keyUp(e){ keys[e.key]=false; }
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    function update(dt){

        if(gameOver||paused)return;

        if(pointerY!==null){
            player.y+=((pointerY-player.h/2)-player.y)*.4;
        }
        if(keys["ArrowUp"])player.y-=520*dt;
        if(keys["ArrowDown"])player.y+=520*dt;

        player.y=Math.max(10,Math.min(canvas.height-player.h-10,player.y));

        // AI tracks with limited speed + slight lag
        const target=ball.y-ai.h/2+(Math.random()-.5)*10;
        const aiSpeed=310;
        if(ai.y<target)ai.y+=Math.min(aiSpeed*dt,target-ai.y);
        else ai.y-=Math.min(aiSpeed*dt,ai.y-target);
        ai.y=Math.max(10,Math.min(canvas.height-ai.h-10,ai.y));

        ball.x+=ball.vx*dt;
        ball.y+=ball.vy*dt;

        if(ball.y-ball.r<0){ ball.y=ball.r; ball.vy*=-1; }
        if(ball.y+ball.r>canvas.height){ ball.y=canvas.height-ball.r; ball.vy*=-1; }

        // player paddle
        if(
            ball.vx<0 &&
            ball.x-ball.r<player.x+player.w &&
            ball.x-ball.r>player.x-20 &&
            ball.y>player.y && ball.y<player.y+player.h
        ){
            const hitPos=(ball.y-(player.y+player.h/2))/(player.h/2);
            const speed=Math.min(760,Math.hypot(ball.vx,ball.vy)*1.06);
            const angle=hitPos*1.0;
            ball.vx=Math.cos(angle)*speed;
            ball.vy=Math.sin(angle)*speed;
            if(ball.vx<0)ball.vx*=-1;
            ball.x=player.x+player.w+ball.r+1;
            spawnBurst(ball.x,ball.y,"#5cff8a");
            shaker.kick(6);
        }

        // ai paddle
        if(
            ball.vx>0 &&
            ball.x+ball.r>ai.x &&
            ball.x+ball.r<ai.x+ai.w+20 &&
            ball.y>ai.y && ball.y<ai.y+ai.h
        ){
            const hitPos=(ball.y-(ai.y+ai.h/2))/(ai.h/2);
            const speed=Math.min(760,Math.hypot(ball.vx,ball.vy)*1.06);
            const angle=hitPos*1.0;
            ball.vx=-Math.cos(angle)*speed;
            ball.vy=Math.sin(angle)*speed;
            if(ball.vx>0)ball.vx*=-1;
            ball.x=ai.x-ball.r-1;
            spawnBurst(ball.x,ball.y,"#ff6b6b");
            shaker.kick(6);
        }

        if(ball.x<-30){
            aiScore++;
            spawnBurst(0,ball.y,"#ff6b6b");
            floatText.spawn(canvas.width*.25,canvas.height/2-60,"POINT","#ff6b6b",24);
            shaker.kick(12);
            if(aiScore>=WIN_SCORE)gameOver=true;
            else resetBall(1);
        }
        if(ball.x>canvas.width+30){
            playerScore++;
            spawnBurst(canvas.width,ball.y,"#5cff8a");
            floatText.spawn(canvas.width*.75,canvas.height/2-60,"POINT","#5cff8a",24);
            shaker.kick(12);
            if(playerScore>=WIN_SCORE)gameOver=true;
            else resetBall(-1);
        }

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const g=ctx.createLinearGradient(0,0,0,canvas.height);
        g.addColorStop(0,"#0a2a1f");
        g.addColorStop(1,"#020806");
        ctx.fillStyle=g;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle="rgba(255,255,255,.18)";
        ctx.lineWidth=3;
        ctx.setLineDash([14,14]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2,0);
        ctx.lineTo(canvas.width/2,canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.textAlign="center";
        ctx.font="900 60px Arial";
        ctx.fillStyle="rgba(255,255,255,.12)";
        ctx.fillText(playerScore,canvas.width/2-90,90);
        ctx.fillText(aiScore,canvas.width/2+90,90);

        ctx.save();
        ctx.shadowColor="#5cff8a";
        ctx.shadowBlur=14;
        ctx.fillStyle="#5cff8a";
        roundRectHub(ctx,player.x,player.y,player.w,player.h,6);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowColor="#ff6b6b";
        ctx.shadowBlur=14;
        ctx.fillStyle="#ff6b6b";
        roundRectHub(ctx,ai.x,ai.y,ai.w,ai.h,6);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowColor="#fff";
        ctx.shadowBlur=16;
        ctx.fillStyle="#fff";
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,2.6,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML="🏓 PONG &nbsp; first to "+WIN_SCORE;

        if(gameOver){
            const win=playerScore>aiScore;
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor=win?"#4ade80":"#ff5b5b";
            ctx.shadowBlur=25;
            ctx.fillStyle=win?"#4ade80":"#ff5b5b";
            ctx.font="900 42px Arial";
            ctx.fillText(win?"YOU WIN!":"AI WINS",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText(playerScore+" — "+aiScore,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#9fe0c0";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#5cff8a";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#9fe0c0";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
        resetGame();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        window.removeEventListener("keyup",keyUp);
        canvas.removeEventListener("pointermove",pointerMove);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// 2048
// ============================================================

function start2048(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="tt-canvas";
    const ctx=canvas.getContext("2d");

    const SIZE=4;
    let cellSize,boardX,boardY,boardPx;

    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        boardPx=Math.min(canvas.width,canvas.height)*.82;
        cellSize=boardPx/SIZE;
        boardX=(canvas.width-boardPx)/2;
        boardY=(canvas.height-boardPx)/2+20;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#faf8ef",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="tt-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#5c4a3a",fontFamily:"Arial,sans-serif",
        background:"rgba(255,255,255,.85)",
        border:"1px solid rgba(150,120,90,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        boxShadow:"0 8px 24px rgba(0,0,0,.15)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("tt-back");

    const TILE_COLORS={
        2:["#eee4da","#776e65"],
        4:["#ede0c8","#776e65"],
        8:["#f2b179","#f9f6f2"],
        16:["#f59563","#f9f6f2"],
        32:["#f67c5f","#f9f6f2"],
        64:["#f65e3b","#f9f6f2"],
        128:["#edcf72","#f9f6f2"],
        256:["#edcc61","#f9f6f2"],
        512:["#edc850","#f9f6f2"],
        1024:["#edc53f","#f9f6f2"],
        2048:["#edc22e","#f9f6f2"]
    };

    let grid,score,best=0,gameOver,won,continueAfterWin;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();
    let ftAnimId=null;
    let ftLastTime=performance.now();

    function ensureFloatTextAnimation(){

        if(ftAnimId!==null)return;

        ftLastTime=performance.now();

        function ftLoop(t){

            const dt=Math.min((t-ftLastTime)/1000,.05);
            ftLastTime=t;

            floatText.update(dt);
            draw();

            if(floatText.hasActive()){
                ftAnimId=requestAnimationFrame(ftLoop);
            }else{
                ftAnimId=null;
            }
        }

        ftAnimId=requestAnimationFrame(ftLoop);
    }

    function emptyGrid(){
        const g=[];
        for(let r=0;r<SIZE;r++){
            g.push(new Array(SIZE).fill(0));
        }
        return g;
    }

    function addRandomTile(){
        const empties=[];
        for(let r=0;r<SIZE;r++){
            for(let c=0;c<SIZE;c++){
                if(grid[r][c]===0)empties.push([r,c]);
            }
        }
        if(empties.length===0)return;
        const [r,c]=empties[Math.floor(Math.random()*empties.length)];
        grid[r][c]=Math.random()<.9?2:4;
    }

    function resetGame(){
        grid=emptyGrid();
        score=0;
        gameOver=false;
        won=false;
        continueAfterWin=false;
        addRandomTile();
        addRandomTile();
        draw();
    }

    function slideRow(row){

        const nums=row.filter(v=>v!==0);
        const result=[];
        let gained=0;

        for(let i=0;i<nums.length;i++){
            if(nums[i]===nums[i+1]){
                const merged=nums[i]*2;
                result.push(merged);
                gained+=merged;
                if(merged===2048)won=true;
                i++;
            }else{
                result.push(nums[i]);
            }
        }

        while(result.length<SIZE)result.push(0);

        return {row:result,gained};
    }

    function rotateGrid(g){
        const ng=emptyGrid();
        for(let r=0;r<SIZE;r++){
            for(let c=0;c<SIZE;c++){
                ng[c][SIZE-1-r]=g[r][c];
            }
        }
        return ng;
    }

    function move(dir){

        if(gameOver)return;
        if(won && !continueAfterWin)return;

        let g=grid;
        let rotations=0;

        // normalize so we always slide "left"
        if(dir==="up")rotations=3;
        else if(dir==="right")rotations=2;
        else if(dir==="down")rotations=1;

        for(let i=0;i<rotations;i++)g=rotateGrid(g);

        let moved=false;
        let totalGain=0;

        for(let r=0;r<SIZE;r++){
            const before=g[r].join(",");
            const {row,gained}=slideRow(g[r]);
            g[r]=row;
            totalGain+=gained;
            if(row.join(",")!==before)moved=true;
        }

        for(let i=0;i<(4-rotations)%4;i++)g=rotateGrid(g);

        if(moved){
            grid=g;
            score+=totalGain;
            best=Math.max(best,score);
            addRandomTile();

            if(totalGain>0){
                floatText.spawn(boardX+boardPx/2,boardY-6,"+"+totalGain,"#f2b179",22);
                if(totalGain>=64)shaker.kick(Math.min(16,totalGain/32));
                ensureFloatTextAnimation();
            }

            if(!canMove()){
                gameOver=true;
            }
        }

        draw();
    }

    function canMove(){
        for(let r=0;r<SIZE;r++){
            for(let c=0;c<SIZE;c++){
                if(grid[r][c]===0)return true;
                if(c<SIZE-1 && grid[r][c]===grid[r][c+1])return true;
                if(r<SIZE-1 && grid[r][c]===grid[r+1][c])return true;
            }
        }
        return false;
    }

    resetGame();

    function keyHandler(e){
        const map={
            ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",
            w:"up",s:"down",a:"left",d:"right"
        };
        if(map[e.key]){
            e.preventDefault();
            move(map[e.key]);
        }
    }
    window.addEventListener("keydown",keyHandler);

    let touchStartX=0,touchStartY=0,touchActive=false;

    function pointerDown(e){
        if(gameOver||(won&&!continueAfterWin)){
            if(won&&!continueAfterWin){
                continueAfterWin=true;
                draw();
                return;
            }
            resetGame();
            return;
        }
        touchActive=true;
        touchStartX=e.clientX;
        touchStartY=e.clientY;
    }

    function pointerUp(e){
        if(!touchActive)return;
        touchActive=false;
        const dx=e.clientX-touchStartX;
        const dy=e.clientY-touchStartY;
        if(Math.hypot(dx,dy)<24)return;
        if(Math.abs(dx)>Math.abs(dy)){
            move(dx>0?"right":"left");
        }else{
            move(dy>0?"down":"up");
        }
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});
    canvas.addEventListener("pointerup",pointerUp,{passive:false});

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        ctx.fillStyle="#faf8ef";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save();
        ctx.fillStyle="#bbada0";
        roundRectHub(ctx,boardX-8,boardY-8,boardPx+16,boardPx+16,10);
        ctx.fill();
        ctx.restore();

        const gap=cellSize*.08;

        for(let r=0;r<SIZE;r++){
            for(let c=0;c<SIZE;c++){

                const x=boardX+c*cellSize+gap/2;
                const y=boardY+r*cellSize+gap/2;
                const w=cellSize-gap;

                ctx.save();
                ctx.fillStyle="rgba(238,228,218,.35)";
                roundRectHub(ctx,x,y,w,w,6);
                ctx.fill();
                ctx.restore();

                const val=grid[r][c];

                if(val!==0){

                    const colors=TILE_COLORS[val]||["#3c3a32","#f9f6f2"];

                    ctx.save();
                    ctx.fillStyle=colors[0];
                    roundRectHub(ctx,x,y,w,w,6);
                    ctx.fill();

                    ctx.fillStyle=colors[1];
                    ctx.textAlign="center";
                    ctx.textBaseline="middle";
                    const fontSize=val>512?w*.32:w*.4;
                    ctx.font="900 "+fontSize+"px Arial";
                    ctx.fillText(val,x+w/2,y+w/2+2);
                    ctx.restore();
                }
            }
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🔢 2048<br>Score: "+score+" &nbsp; Best: "+best+
            "<br><span style='font-weight:normal;color:#8a7a68'>Swipe or arrow keys</span>";

        if(gameOver || (won && !continueAfterWin)){
            ctx.fillStyle="rgba(250,248,239,.85)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.fillStyle="#776e65";
            ctx.font="900 44px Arial";
            ctx.fillText(won?"YOU MADE 2048!":"GAME OVER",canvas.width/2,canvas.height/2-20);
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+20);
            ctx.font="16px Arial";
            ctx.fillText(
                won?"Tap to keep playing":"Tap to try again",
                canvas.width/2,canvas.height/2+55
            );
        }
    }

    back.onclick=function(){
        showMainMenu();
    };

    function resizeHandler(){
        resize();
        draw();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        if(ftAnimId!==null)cancelAnimationFrame(ftAnimId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyHandler);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.removeEventListener("pointerup",pointerUp);
        canvas.remove();
        ui.remove();
        back.remove();
    };
}


// ============================================================
// MEMORY MATCH
// ============================================================

function startMemoryMatch(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="mm-canvas";
    const ctx=canvas.getContext("2d");

    const COLS=4,ROWS=4;
    const MEMORY_ART=[
        {emoji:"🍎",bg:"#ff657a",accent:"#ffd5dd"},
        {emoji:"🍋",bg:"#ffd449",accent:"#fff4b8"},
        {emoji:"🍇",bg:"#8e5cf6",accent:"#e9d7ff"},
        {emoji:"🍓",bg:"#ff5a7a",accent:"#ffd4de"},
        {emoji:"🍑",bg:"#ff9a5b",accent:"#ffe0c9"},
        {emoji:"🍒",bg:"#eb4d6a",accent:"#ffd5de"},
        {emoji:"🍉",bg:"#4bd97b",accent:"#dfffe8"},
        {emoji:"🥝",bg:"#7fdc7a",accent:"#eaffdc"}
    ];

    function drawMemoryArt(ctx,x,y,size,art){
        const pad=size*0.12;
        const cx=x+size/2;
        const cy=y+size/2;

        ctx.save();
        ctx.fillStyle=art.bg;
        ctx.shadowColor="rgba(0,0,0,.2)";
        ctx.shadowBlur=12;
        roundRectHub(ctx,x+pad/2,y+pad/2,size-pad,size-pad,14);
        ctx.fill();
        ctx.shadowBlur=0;

        ctx.fillStyle=art.accent;
        ctx.globalAlpha=.22;
        ctx.beginPath();
        ctx.arc(cx,cy,size*0.32,0,Math.PI*2);
        ctx.fill();

        ctx.globalAlpha=1;
        ctx.fillStyle="#fff";
        ctx.font="900 "+(size*0.4)+"px Arial";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(art.emoji,cx,cy+size*0.03);
        ctx.restore();
    }

    let cellSize,gridX,gridY,gridW,gridH;

    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        const margin=40;
        const availW=canvas.width-margin*2;
        const availH=canvas.height-160;

        cellSize=Math.min(availW/COLS,availH/ROWS,110);
        gridW=cellSize*COLS;
        gridH=cellSize*ROWS;
        gridX=(canvas.width-gridW)/2;
        gridY=(canvas.height-gridH)/2+30;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#1a2333",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="mm-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(10,15,30,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(120,160,255,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("mm-back");

    let cards,firstPick,secondPick,locked,moves,matches,startTime,elapsed,won;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();

    function resetGame(){

        const icons=[];
        for(let i=0;i<(COLS*ROWS)/2;i++){
            const art=MEMORY_ART[i%MEMORY_ART.length];
            icons.push(art,art);
        }

        for(let i=icons.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            [icons[i],icons[j]]=[icons[j],icons[i]];
        }

        cards=[];
        let idx=0;
        for(let r=0;r<ROWS;r++){
            for(let c=0;c<COLS;c++){
                cards.push({
                    r,c,art:icons[idx++],
                    flipped:false,matched:false,flipT:0
                });
            }
        }

        firstPick=null;
        secondPick=null;
        locked=false;
        moves=0;
        matches=0;
        won=false;
        startTime=performance.now();
        elapsed=0;
    }

    resetGame();

    function cardAt(x,y){

        if(x<gridX||y<gridY||x>gridX+gridW||y>gridY+gridH)return null;

        const c=Math.floor((x-gridX)/cellSize);
        const r=Math.floor((y-gridY)/cellSize);

        return cards.find(k=>k.r===r&&k.c===c)||null;
    }

    function pointerDown(e){

        if(won){ resetGame(); return; }
        if(locked)return;

        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        const card=cardAt(x,y);
        if(!card||card.flipped||card.matched)return;

        card.flipped=true;

        if(!firstPick){
            firstPick=card;
        }else if(!secondPick && card!==firstPick){

            secondPick=card;
            moves++;
            locked=true;

            setTimeout(function(){

                if(firstPick.art.emoji===secondPick.art.emoji){

                    firstPick.matched=true;
                    secondPick.matched=true;
                    matches++;

                    const cx=gridX+secondPick.c*cellSize+cellSize/2;
                    const cy=gridY+secondPick.r*cellSize+cellSize/2;
                    floatText.spawn(cx,cy-cellSize/2,"MATCH!","#4ade80",18);

                    if(matches===(COLS*ROWS)/2){
                        won=true;
                        floatText.spawn(canvas.width/2,gridY-20,"SOLVED!","#ffd93d",26);
                    }

                }else{

                    firstPick.flipped=false;
                    secondPick.flipped=false;
                    shaker.kick(5);
                }

                firstPick=null;
                secondPick=null;
                locked=false;

            },650);
        }
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#1f2a44");
        bg.addColorStop(1,"#0d1220");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        for(const card of cards){

            const x=gridX+card.c*cellSize+6;
            const y=gridY+card.r*cellSize+6;
            const w=cellSize-12;

            ctx.save();

            if(card.matched){
                ctx.globalAlpha=.35;
            }

            if(card.flipped||card.matched){

                ctx.shadowColor="#4ade80";
                ctx.shadowBlur=card.matched?4:12;

                const g=ctx.createLinearGradient(x,y,x+w,y+w);
                g.addColorStop(0,"#2c3a5c");
                g.addColorStop(1,"#3d5080");
                ctx.fillStyle=g;
                roundRectHub(ctx,x,y,w,w,10);
                ctx.fill();

                ctx.shadowBlur=0;
                drawMemoryArt(ctx,x+7,y+7,w-14,card.art);

            }else{

                ctx.shadowColor="rgba(0,0,0,.4)";
                ctx.shadowBlur=6;

                const g=ctx.createLinearGradient(x,y,x+w,y+w);
                g.addColorStop(0,"#5c6bc0");
                g.addColorStop(1,"#3949ab");
                ctx.fillStyle=g;
                roundRectHub(ctx,x,y,w,w,10);
                ctx.fill();

                ctx.shadowBlur=0;
                ctx.strokeStyle="rgba(255,255,255,.25)";
                ctx.lineWidth=2;
                roundRectHub(ctx,x+8,y+8,w-16,w-16,6);
                ctx.stroke();

                ctx.fillStyle="rgba(255,255,255,.5)";
                ctx.font="900 "+(w*.3)+"px Arial";
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillText("?",x+w/2,y+w/2+2);
            }

            ctx.restore();
        }

        if(!won){
            elapsed=(performance.now()-startTime)/1000;
        }

        floatText.update(1/60);
        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🧠 MEMORY MATCH<br>Moves: "+moves+
            " &nbsp; Time: "+elapsed.toFixed(1)+"s";

        if(won){
            ctx.fillStyle="rgba(0,0,0,.75)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#4ade80";
            ctx.shadowBlur=25;
            ctx.fillStyle="#4ade80";
            ctx.font="900 40px Arial";
            ctx.fillText("SOLVED!",canvas.width/2,canvas.height/2-25);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText(
                "Moves: "+moves+"   Time: "+elapsed.toFixed(1)+"s",
                canvas.width/2,canvas.height/2+10
            );
            ctx.font="16px Arial";
            ctx.fillStyle="#a9c6ff";
            ctx.fillText("Tap to play again",canvas.width/2,canvas.height/2+45);
        }

        animationId=requestAnimationFrame(draw);
    }

    let animationId;

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
    };

    animationId=requestAnimationFrame(draw);
}


// ============================================================
// ASTEROIDS
// ============================================================

function startAsteroids(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="as-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#000",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="as-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(5,5,15,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(150,200,255,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("as-back");
    const pauseBtn=makePauseButton("as-pause");

    // touch controls

    const controls=document.createElement("div");
    controls.className="as-controls";
    Object.assign(controls.style,{
        position:"fixed",inset:"0",zIndex:"100001",pointerEvents:"none"
    });
    document.body.appendChild(controls);

    function ctrlBtn(label,style){
        const b=document.createElement("button");
        b.textContent=label;
        Object.assign(b.style,{
            position:"fixed",
            width:"64px",height:"64px",
            borderRadius:"50%",
            background:"rgba(255,255,255,.12)",
            color:"#fff",
            border:"1px solid rgba(255,255,255,.35)",
            fontSize:"22px",
            fontWeight:"bold",
            pointerEvents:"auto",
            touchAction:"none"
        },style);
        controls.appendChild(b);
        return b;
    }

    const btnLeft=ctrlBtn("◀",{left:"20px",bottom:"90px"});
    const btnRight=ctrlBtn("▶",{left:"94px",bottom:"90px"});
    const btnThrust=ctrlBtn("▲",{left:"57px",bottom:"164px"});
    const btnFire=ctrlBtn("●",{right:"25px",bottom:"110px",width:"78px",height:"78px",background:"rgba(255,80,80,.25)",borderColor:"rgba(255,150,150,.5)"});

    let held={left:false,right:false,thrust:false,fire:false};

    function bindHold(btn,key){
        btn.addEventListener("pointerdown",function(e){e.preventDefault();held[key]=true;},{passive:false});
        btn.addEventListener("pointerup",function(e){e.preventDefault();held[key]=false;},{passive:false});
        btn.addEventListener("pointercancel",function(){held[key]=false;});
        btn.addEventListener("pointerleave",function(){held[key]=false;});
    }
    bindHold(btnLeft,"left");
    bindHold(btnRight,"right");
    bindHold(btnThrust,"thrust");
    bindHold(btnFire,"fire");

    let keys={};
    function keyDown(e){
        keys[e.key]=true;
        if(e.key===" ")e.preventDefault();
    }
    function keyUp(e){ keys[e.key]=false; }
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    let ship,bullets,asteroids,particles,score,lives,level,gameOver,paused=false;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();
    let fireTimer=0;
    let animationId;
    let lastTime=performance.now();

    function wrap(p){
        if(p.x<0)p.x+=canvas.width;
        if(p.x>canvas.width)p.x-=canvas.width;
        if(p.y<0)p.y+=canvas.height;
        if(p.y>canvas.height)p.y-=canvas.height;
    }

    function makeAsteroid(x,y,size){

        const points=[];
        const n=8+Math.floor(Math.random()*4);

        for(let i=0;i<n;i++){
            const a=(i/n)*Math.PI*2;
            const r=size*(.75+Math.random()*.4);
            points.push({a,r});
        }

        return {
            x,y,size,
            vx:(Math.random()-.5)*(90/size*30),
            vy:(Math.random()-.5)*(90/size*30),
            rot:Math.random()*Math.PI*2,
            vr:(Math.random()-.5)*1.4,
            points
        };
    }

    function spawnWave(n){
        for(let i=0;i<n;i++){
            let x,y;
            do{
                x=Math.random()*canvas.width;
                y=Math.random()*canvas.height;
            }while(Math.hypot(x-ship.x,y-ship.y)<160);

            asteroids.push(makeAsteroid(x,y,44));
        }
    }

    function resetGame(){

        ship={
            x:canvas.width/2,y:canvas.height/2,
            angle:-Math.PI/2,
            vx:0,vy:0,
            r:12,
            invuln:2,
            alive:true
        };

        bullets=[];
        asteroids=[];
        particles=[];
        score=0;
        lives=3;
        level=1;
        gameOver=false;

        spawnWave(4);
    }

    resetGame();

    function spawnBurst(x,y,color,n){
        for(let i=0;i<n;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*4;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:30,maxLife:30,color});
        }
    }

    function shoot(){
        if(!ship.alive||fireTimer>0)return;
        fireTimer=.22;
        bullets.push({
            x:ship.x+Math.cos(ship.angle)*ship.r,
            y:ship.y+Math.sin(ship.angle)*ship.r,
            vx:Math.cos(ship.angle)*520+ship.vx,
            vy:Math.sin(ship.angle)*520+ship.vy,
            life:.9
        });
    }

    function pointerDown(e){
        e.preventDefault();
        if(gameOver){ resetGame(); return; }
    }
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function update(dt){

        if(gameOver||paused)return;

        const rotating=keys["ArrowLeft"]||keys["a"]||held.left;
        const rotatingR=keys["ArrowRight"]||keys["d"]||held.right;
        const thrusting=keys["ArrowUp"]||keys["w"]||held.thrust;
        const firing=keys[" "]||held.fire;

        if(ship.alive){

            if(rotating)ship.angle-=3.4*dt;
            if(rotatingR)ship.angle+=3.4*dt;

            if(thrusting){
                ship.vx+=Math.cos(ship.angle)*260*dt;
                ship.vy+=Math.sin(ship.angle)*260*dt;
                spawnBurst(
                    ship.x-Math.cos(ship.angle)*ship.r,
                    ship.y-Math.sin(ship.angle)*ship.r,
                    "#ffb35a",1
                );
            }

            ship.vx*=.992;
            ship.vy*=.992;

            ship.x+=ship.vx*dt;
            ship.y+=ship.vy*dt;
            wrap(ship);

            if(firing)shoot();

            if(ship.invuln>0)ship.invuln-=dt;
        }

        if(fireTimer>0)fireTimer-=dt;

        for(let i=bullets.length-1;i>=0;i--){
            const b=bullets[i];
            b.x+=b.vx*dt; b.y+=b.vy*dt;
            wrap(b);
            b.life-=dt;
            if(b.life<=0)bullets.splice(i,1);
        }

        for(const a of asteroids){
            a.x+=a.vx*dt; a.y+=a.vy*dt;
            a.rot+=a.vr*dt;
            wrap(a);
        }

        // bullet-asteroid collisions
        for(let i=asteroids.length-1;i>=0;i--){

            const a=asteroids[i];

            for(let j=bullets.length-1;j>=0;j--){

                const b=bullets[j];

                if(Math.hypot(a.x-b.x,a.y-b.y)<a.size){

                    bullets.splice(j,1);
                    asteroids.splice(i,1);

                    const gained=Math.floor(120/a.size*10);
                    score+=gained;
                    spawnBurst(a.x,a.y,"#cfd8e3",14);
                    floatText.spawn(a.x,a.y,"+"+gained,"#cfd8e3",14);

                    if(a.size>20){
                        asteroids.push(makeAsteroid(a.x,a.y,a.size*.6));
                        asteroids.push(makeAsteroid(a.x,a.y,a.size*.6));
                    }

                    break;
                }
            }
        }

        // ship-asteroid collisions
        if(ship.alive && ship.invuln<=0){

            for(const a of asteroids){

                if(Math.hypot(a.x-ship.x,a.y-ship.y)<a.size+ship.r*.6){

                    lives--;
                    spawnBurst(ship.x,ship.y,"#5cd6ff",22);
                    shaker.kick(18);
                    floatText.spawn(ship.x,ship.y-30,"-1 LIFE","#5cd6ff",20);

                    if(lives<=0){
                        gameOver=true;
                        ship.alive=false;
                    }else{
                        ship.x=canvas.width/2;
                        ship.y=canvas.height/2;
                        ship.vx=0; ship.vy=0;
                        ship.invuln=2.5;
                    }

                    break;
                }
            }
        }

        if(asteroids.length===0 && !gameOver){
            level++;
            floatText.spawn(canvas.width/2,canvas.height/2-60,"LEVEL "+level,"#5cd6ff",26);
            spawnWave(3+level);
        }

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.vx*=.96; p.vy*=.96; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function drawShip(){

        if(!ship.alive)return;
        if(ship.invuln>0 && Math.floor(ship.invuln*10)%2===0)return;

        ctx.save();
        ctx.translate(ship.x,ship.y);
        ctx.rotate(ship.angle);

        ctx.fillStyle="rgba(18,66,94,.95)";
        ctx.strokeStyle="#5cd6ff";
        ctx.shadowColor="#5cd6ff";
        ctx.shadowBlur=10;
        ctx.lineWidth=2;

        ctx.beginPath();
        ctx.moveTo(14,0);
        ctx.lineTo(-10,-9);
        ctx.lineTo(-5,0);
        ctx.lineTo(-10,9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle="#dff9ff";
        ctx.beginPath();
        ctx.ellipse(1,0,5,3,0,0,Math.PI*2);
        ctx.fill();

        ctx.restore();
    }

    function drawAsteroid(a){

        ctx.save();
        ctx.translate(a.x,a.y);
        ctx.rotate(a.rot);

        const rock=ctx.createRadialGradient(-a.size*.35,-a.size*.4,2,0,0,a.size);
        rock.addColorStop(0,"#8998a8");
        rock.addColorStop(.55,"#4d5d70");
        rock.addColorStop(1,"#202b3b");
        ctx.fillStyle=rock;
        ctx.strokeStyle="#b8c4d0";
        ctx.shadowColor="rgba(180,200,220,.4)";
        ctx.shadowBlur=6;
        ctx.lineWidth=2;

        ctx.beginPath();
        a.points.forEach((p,i)=>{
            const x=Math.cos(p.a)*p.r;
            const y=Math.sin(p.a)*p.r;
            if(i===0)ctx.moveTo(x,y);
            else ctx.lineTo(x,y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle="rgba(8,15,25,.35)";
        for(let i=0;i<Math.max(2,Math.floor(a.size/15));i++){
            const craterAngle=a.rot*.7+i*2.4;
            const craterRadius=a.size*(.22+((i*17)%20)/100);
            ctx.beginPath();
            ctx.arc(
                Math.cos(craterAngle)*craterRadius,
                Math.sin(craterAngle)*craterRadius,
                Math.max(2,a.size*.07),
                0,
                Math.PI*2
            );
            ctx.fill();
        }

        ctx.restore();
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        ctx.fillStyle="#000";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // starfield (cheap deterministic dots)
        ctx.fillStyle="rgba(255,255,255,.5)";
        for(let i=0;i<60;i++){
            const sx=(i*97)%canvas.width;
            const sy=(i*233)%canvas.height;
            ctx.fillRect(sx,sy,1.4,1.4);
        }

        for(const a of asteroids)drawAsteroid(a);

        for(const b of bullets){
            ctx.save();
            ctx.fillStyle="#fff";
            ctx.shadowColor="#fff";
            ctx.shadowBlur=8;
            ctx.beginPath();
            ctx.arc(b.x,b.y,2.4,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        drawShip();

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,2.2,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "☄️ ASTEROIDS<br>Score: "+score+
            " &nbsp; ❤️ "+lives+
            " &nbsp; Level "+level;

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#5cd6ff";
            ctx.shadowBlur=25;
            ctx.fillStyle="#5cd6ff";
            ctx.font="900 42px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#9fe0ff";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#5cd6ff";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#9fe0ff";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        window.removeEventListener("keyup",keyUp);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
        controls.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// TETRIS
// ============================================================

function startTetris(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="tx-canvas";
    const ctx=canvas.getContext("2d");

    const COLS=10,ROWS=20;
    let cell,boardX,boardY;

    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        const availH=canvas.height-40;
        const availW=canvas.width*.62;

        cell=Math.min(availH/ROWS,availW/COLS,34);
        boardX=canvas.width*.5-cell*COLS*.62;
        boardY=(canvas.height-cell*ROWS)/2+10;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#0d0d18",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="tx-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(15,10,25,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(150,150,255,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("tx-back");
    const pauseBtn=makePauseButton("tx-pause");

    // touch controls

    const controls=document.createElement("div");
    controls.className="tx-controls";
    Object.assign(controls.style,{position:"fixed",inset:"0",zIndex:"100001",pointerEvents:"none"});
    document.body.appendChild(controls);

    function ctrlBtn(label,style){
        const b=document.createElement("button");
        b.textContent=label;
        Object.assign(b.style,{
            position:"fixed",width:"58px",height:"58px",borderRadius:"14px",
            background:"rgba(255,255,255,.12)",color:"#fff",
            border:"1px solid rgba(255,255,255,.35)",fontSize:"22px",fontWeight:"bold",
            pointerEvents:"auto",touchAction:"none"
        },style);
        controls.appendChild(b);
        return b;
    }

    const btnLeft=ctrlBtn("◀",{left:"16px",bottom:"156px"});
    const btnRight=ctrlBtn("▶",{left:"80px",bottom:"156px"});
    const btnRotate=ctrlBtn("⟳",{left:"144px",bottom:"156px"});
    const btnDown=ctrlBtn("▼",{left:"48px",bottom:"90px"});
    const btnDrop=ctrlBtn("⤓",{left:"112px",bottom:"90px",width:"80px"});

    const SHAPES={
        I:{color:"#4dd9ff",states:[
            [[0,1],[1,1],[2,1],[3,1]],
            [[2,0],[2,1],[2,2],[2,3]],
            [[0,2],[1,2],[2,2],[3,2]],
            [[1,0],[1,1],[1,2],[1,3]]
        ]},
        O:{color:"#ffe14d",states:[
            [[1,0],[2,0],[1,1],[2,1]],
            [[1,0],[2,0],[1,1],[2,1]],
            [[1,0],[2,0],[1,1],[2,1]],
            [[1,0],[2,0],[1,1],[2,1]]
        ]},
        T:{color:"#c04dff",states:[
            [[1,0],[0,1],[1,1],[2,1]],
            [[1,0],[1,1],[2,1],[1,2]],
            [[0,1],[1,1],[2,1],[1,2]],
            [[1,0],[0,1],[1,1],[1,2]]
        ]},
        S:{color:"#4dff88",states:[
            [[1,0],[2,0],[0,1],[1,1]],
            [[1,0],[1,1],[2,1],[2,2]],
            [[1,1],[2,1],[0,2],[1,2]],
            [[0,0],[0,1],[1,1],[1,2]]
        ]},
        Z:{color:"#ff4d4d",states:[
            [[0,0],[1,0],[1,1],[2,1]],
            [[2,0],[1,1],[2,1],[1,2]],
            [[0,1],[1,1],[1,2],[2,2]],
            [[1,0],[0,1],[1,1],[0,2]]
        ]},
        J:{color:"#4d6bff",states:[
            [[0,0],[0,1],[1,1],[2,1]],
            [[1,0],[2,0],[1,1],[1,2]],
            [[0,1],[1,1],[2,1],[2,2]],
            [[1,0],[1,1],[0,2],[1,2]]
        ]},
        L:{color:"#ff9a4d",states:[
            [[2,0],[0,1],[1,1],[2,1]],
            [[1,0],[1,1],[1,2],[2,2]],
            [[0,1],[1,1],[2,1],[0,2]],
            [[0,0],[1,0],[1,1],[1,2]]
        ]}
    };
    const KEYS=Object.keys(SHAPES);

    let grid,cur,curX,curY,curRot,nextType,score,lines,level,gameOver,paused=false;
    let dropTimer,dropInterval;
    let animationId,lastTime;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();
    let flashRows=[];

    function emptyGrid(){
        const g=[];
        for(let r=0;r<ROWS;r++)g.push(new Array(COLS).fill(null));
        return g;
    }

    function spawnPiece(){

        const type=nextType||KEYS[Math.floor(Math.random()*KEYS.length)];
        nextType=KEYS[Math.floor(Math.random()*KEYS.length)];

        cur=type;
        curRot=0;
        curX=3;
        curY=-1;

        if(collides(curX,curY,curRot)){
            gameOver=true;
        }
    }

    function cellsFor(type,rot){
        return SHAPES[type].states[((rot%4)+4)%4];
    }

    function collides(px,py,rot){

        const cells=cellsFor(cur,rot);

        for(const [cx,cy] of cells){

            const x=px+cx;
            const y=py+cy;

            if(x<0||x>=COLS||y>=ROWS)return true;
            if(y>=0 && grid[y][x])return true;
        }
        return false;
    }

    function lockPiece(){

        const cells=cellsFor(cur,curRot);
        const color=SHAPES[cur].color;

        for(const [cx,cy] of cells){
            const x=curX+cx;
            const y=curY+cy;
            if(y>=0 && y<ROWS)grid[y][x]=color;
        }

        clearLines();
        spawnPiece();
    }

    function clearLines(){

        let cleared=0;
        let clearedRowYs=[];

        for(let r=ROWS-1;r>=0;r--){

            if(grid[r].every(c=>c!==null)){

                clearedRowYs.push(r);
                grid.splice(r,1);
                grid.unshift(new Array(COLS).fill(null));
                cleared++;
                r++;
            }
        }

        if(cleared>0){

            const points=[0,100,300,500,800][cleared]*level;
            score+=points;
            lines+=cleared;
            level=1+Math.floor(lines/10);
            dropInterval=Math.max(120,600-level*45);

            const avgRow=clearedRowYs.reduce((a,b)=>a+b,0)/clearedRowYs.length;
            const ty=boardY+avgRow*cell;
            const label=cleared>=4?"TETRIS! +"+points:"+"+points;
            const color=cleared>=4?"#ffe14d":"#4dd9ff";

            floatText.spawn(boardX+cell*COLS/2,ty,label,color,cleared>=4?26:18);
            shaker.kick(4+cleared*5);
        }
    }

    function resetGame(){

        grid=emptyGrid();
        score=0;
        lines=0;
        level=1;
        gameOver=false;
        dropTimer=0;
        dropInterval=600;
        nextType=null;

        spawnPiece();
    }

    resetGame();

    function tryMove(dx,dy){
        if(gameOver||paused)return false;
        if(!collides(curX+dx,curY+dy,curRot)){
            curX+=dx; curY+=dy;
            return true;
        }
        if(dy>0){
            lockPiece();
        }
        return false;
    }

    function tryRotate(){
        if(gameOver||paused)return;
        const nr=(curRot+1)%4;
        if(!collides(curX,curY,nr)){
            curRot=nr;
        }else if(!collides(curX-1,curY,nr)){
            curX-=1; curRot=nr;
        }else if(!collides(curX+1,curY,nr)){
            curX+=1; curRot=nr;
        }
    }

    function hardDrop(){
        if(gameOver||paused)return;
        while(!collides(curX,curY+1,curRot)){
            curY++;
            score+=1;
        }
        lockPiece();
    }

    function bindHold(btn,fn,repeat){
        let interval=null;
        btn.addEventListener("pointerdown",function(e){
            e.preventDefault();
            fn();
            if(repeat){
                interval=setInterval(fn,140);
            }
        },{passive:false});
        function stop(){ if(interval){clearInterval(interval);interval=null;} }
        btn.addEventListener("pointerup",stop);
        btn.addEventListener("pointercancel",stop);
        btn.addEventListener("pointerleave",stop);
    }

    bindHold(btnLeft,function(){tryMove(-1,0);},true);
    bindHold(btnRight,function(){tryMove(1,0);},true);
    bindHold(btnDown,function(){tryMove(0,1);},true);
    bindHold(btnRotate,tryRotate,false);
    bindHold(btnDrop,hardDrop,false);

    function keyDown(e){

        if(gameOver&&e.key==="Enter"){ resetGame(); return; }
        if(paused)return;

        if(e.key==="ArrowLeft"){ e.preventDefault(); tryMove(-1,0); }
        else if(e.key==="ArrowRight"){ e.preventDefault(); tryMove(1,0); }
        else if(e.key==="ArrowDown"){ e.preventDefault(); tryMove(0,1); }
        else if(e.key==="ArrowUp"){ e.preventDefault(); tryRotate(); }
        else if(e.key===" "){ e.preventDefault(); hardDrop(); }
    }
    window.addEventListener("keydown",keyDown);

    function pointerDown(e){
        if(gameOver){ e.preventDefault(); resetGame(); }
    }
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function update(dt){

        if(gameOver||paused)return;

        dropTimer+=dt*1000;
        if(dropTimer>=dropInterval){
            dropTimer=0;
            tryMove(0,1);
        }

        floatText.update(dt);
    }

    function drawCell(x,y,color,alpha){

        const px=boardX+x*cell;
        const py=boardY+y*cell;

        ctx.save();
        if(alpha!==undefined)ctx.globalAlpha=alpha;
        ctx.fillStyle=color;
        ctx.shadowColor=color;
        ctx.shadowBlur=6;
        roundRectHub(ctx,px+1,py+1,cell-2,cell-2,3);
        ctx.fill();
        ctx.fillStyle="rgba(255,255,255,.22)";
        ctx.fillRect(px+2,py+2,cell-4,3);
        ctx.restore();
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#1a1530");
        bg.addColorStop(1,"#08060f");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save();
        ctx.fillStyle="rgba(255,255,255,.04)";
        ctx.fillRect(boardX,boardY,cell*COLS,cell*ROWS);
        ctx.strokeStyle="rgba(255,255,255,.15)";
        ctx.lineWidth=2;
        ctx.strokeRect(boardX,boardY,cell*COLS,cell*ROWS);
        ctx.restore();

        for(let r=0;r<ROWS;r++){
            for(let c=0;c<COLS;c++){
                if(grid[r][c])drawCell(c,r,grid[r][c]);
            }
        }

        if(!gameOver){

            // ghost piece
            let ghostY=curY;
            while(!collides(curX,ghostY+1,curRot))ghostY++;

            const cells=cellsFor(cur,curRot);
            for(const [cx,cy] of cells){
                const y=ghostY+cy;
                if(y>=0)drawCell(curX+cx,y,SHAPES[cur].color,.22);
            }

            for(const [cx,cy] of cells){
                const y=curY+cy;
                if(y>=0)drawCell(curX+cx,y,SHAPES[cur].color);
            }
        }

        // next piece preview
        const previewX=boardX+cell*COLS+30;
        const previewY=boardY+10;

        ctx.fillStyle="rgba(255,255,255,.7)";
        ctx.font="bold 14px Arial";
        ctx.textAlign="left";
        ctx.fillText("NEXT",previewX,previewY);

        if(nextType){
            const cells=SHAPES[nextType].states[0];
            for(const [cx,cy] of cells){
                const px=previewX+cx*(cell*.6);
                const py=previewY+18+cy*(cell*.6);
                ctx.fillStyle=SHAPES[nextType].color;
                roundRectHub(ctx,px,py,cell*.55,cell*.55,3);
                ctx.fill();
            }
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🧩 TETRIS<br>Score: "+score+
            " &nbsp; Lines: "+lines+
            " &nbsp; Lvl "+level;

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#c04dff";
            ctx.shadowBlur=25;
            ctx.fillStyle="#c04dff";
            ctx.font="900 40px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#d4b3ff";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#c04dff";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#d4b3ff";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){ resize(); }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
        controls.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// SPACE INVADERS
// ============================================================

function startSpaceInvaders(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="si-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#000",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="si-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(5,15,10,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(120,255,150,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("si-back");
    const pauseBtn=makePauseButton("si-pause");

    const controls=document.createElement("div");
    controls.className="si-controls";
    Object.assign(controls.style,{position:"fixed",inset:"0",zIndex:"100001",pointerEvents:"none"});
    document.body.appendChild(controls);

    function ctrlBtn(label,style){
        const b=document.createElement("button");
        b.textContent=label;
        Object.assign(b.style,{
            position:"fixed",width:"64px",height:"64px",borderRadius:"50%",
            background:"rgba(255,255,255,.12)",color:"#fff",
            border:"1px solid rgba(255,255,255,.35)",fontSize:"22px",fontWeight:"bold",
            pointerEvents:"auto",touchAction:"none"
        },style);
        controls.appendChild(b);
        return b;
    }

    const btnLeft=ctrlBtn("◀",{left:"20px",bottom:"90px"});
    const btnRight=ctrlBtn("▶",{left:"94px",bottom:"90px"});
    const btnFire=ctrlBtn("●",{right:"25px",bottom:"100px",width:"78px",height:"78px",background:"rgba(255,80,80,.25)",borderColor:"rgba(255,150,150,.5)"});

    let held={left:false,right:false,fire:false};

    function bindHold(btn,key){
        btn.addEventListener("pointerdown",function(e){e.preventDefault();held[key]=true;},{passive:false});
        btn.addEventListener("pointerup",function(e){e.preventDefault();held[key]=false;},{passive:false});
        btn.addEventListener("pointercancel",function(){held[key]=false;});
        btn.addEventListener("pointerleave",function(){held[key]=false;});
    }
    bindHold(btnLeft,"left");
    bindHold(btnRight,"right");
    bindHold(btnFire,"fire");

    let keys={};
    function keyDown(e){
        keys[e.key]=true;
        if(e.key===" ")e.preventDefault();
    }
    function keyUp(e){ keys[e.key]=false; }
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    let player,bullets,enemyBullets,enemies,barriers,particles;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();
    let enemyDir,enemySpeed,score,lives,wave,gameOver,paused=false;
    let fireTimer=0;
    let enemyFireTimer=0;
    let animationId,lastTime;

    const ROWS=4,COLS=8;

    function spawnWave(){

        enemies=[];

        const spacing=46;
        const startX=(canvas.width-COLS*spacing)/2;
        const startY=70;

        for(let r=0;r<ROWS;r++){
            for(let c=0;c<COLS;c++){
                enemies.push({
                    x:startX+c*spacing,
                    y:startY+r*40,
                    w:28,h:20,
                    alive:true,
                    row:r
                });
            }
        }

        enemyDir=1;
        enemySpeed=40+wave*10;
    }

    function spawnBarriers(){

        barriers=[];
        const count=4;

        for(let i=0;i<count;i++){

            const bx=canvas.width*(i+1)/(count+1)-30;
            const by=canvas.height-140;

            const blocks=[];
            for(let r=0;r<3;r++){
                for(let c=0;c<6;c++){
                    if(r===2 && (c===2||c===3))continue;
                    blocks.push({x:bx+c*10,y:by+r*10,alive:true});
                }
            }

            barriers.push(blocks);
        }
    }

    function resetGame(){

        player={x:canvas.width/2-16,y:canvas.height-60,w:32,h:18};
        bullets=[];
        enemyBullets=[];
        particles=[];
        score=0;
        lives=3;
        wave=1;
        gameOver=false;

        spawnWave();
        spawnBarriers();
    }

    resetGame();

    function spawnBurst(x,y,color,n){
        for(let i=0;i<n;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*3;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:24,maxLife:24,color});
        }
    }

    function shoot(){
        if(fireTimer>0)return;
        fireTimer=.35;
        bullets.push({x:player.x+player.w/2,y:player.y,vy:-560});
    }

    function pointerDown(e){
        e.preventDefault();
        if(gameOver){ resetGame(); return; }
    }
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function update(dt){

        if(gameOver||paused)return;

        const left=keys["ArrowLeft"]||keys["a"]||held.left;
        const right=keys["ArrowRight"]||keys["d"]||held.right;
        const firing=keys[" "]||held.fire;

        if(left)player.x-=380*dt;
        if(right)player.x+=380*dt;
        player.x=Math.max(10,Math.min(canvas.width-player.w-10,player.x));

        if(fireTimer>0)fireTimer-=dt;
        if(firing)shoot();

        for(let i=bullets.length-1;i>=0;i--){
            const b=bullets[i];
            b.y+=b.vy*dt;
            if(b.y<-10)bullets.splice(i,1);
        }

        for(let i=enemyBullets.length-1;i>=0;i--){
            const b=enemyBullets[i];
            b.y+=b.vy*dt;
            if(b.y>canvas.height+10)enemyBullets.splice(i,1);
        }

        // move enemy swarm
        let hitEdge=false;
        const alive=enemies.filter(e=>e.alive);

        for(const en of alive){
            en.x+=enemyDir*enemySpeed*dt;
            if(en.x<20||en.x>canvas.width-20-en.w)hitEdge=true;
        }

        if(hitEdge){
            enemyDir*=-1;
            for(const en of alive)en.y+=16;
        }

        for(const en of alive){
            if(en.y+en.h>=player.y){
                gameOver=true;
            }
        }

        enemyFireTimer-=dt;
        if(enemyFireTimer<=0 && alive.length>0){
            enemyFireTimer=Math.max(.4,1.3-wave*.08);
            const shooter=alive[Math.floor(Math.random()*alive.length)];
            enemyBullets.push({x:shooter.x+shooter.w/2,y:shooter.y+shooter.h,vy:260+wave*15});
        }

        // bullet vs enemy
        for(let i=bullets.length-1;i>=0;i--){
            const b=bullets[i];
            for(const en of enemies){
                if(!en.alive)continue;
                if(b.x>en.x&&b.x<en.x+en.w&&b.y>en.y&&b.y<en.y+en.h){
                    en.alive=false;
                    bullets.splice(i,1);
                    score+=(ROWS-en.row)*10;
                    spawnBurst(en.x+en.w/2,en.y+en.h/2,"#5cff8a",10);
                    break;
                }
            }
        }

        // bullet vs barrier
        function hitBarrier(bx,by){
            for(const blocks of barriers){
                for(const blk of blocks){
                    if(!blk.alive)continue;
                    if(Math.abs(bx-blk.x)<7 && Math.abs(by-blk.y)<7){
                        blk.alive=false;
                        return true;
                    }
                }
            }
            return false;
        }

        for(let i=bullets.length-1;i>=0;i--){
            if(hitBarrier(bullets[i].x,bullets[i].y)){
                bullets.splice(i,1);
            }
        }
        for(let i=enemyBullets.length-1;i>=0;i--){
            if(hitBarrier(enemyBullets[i].x,enemyBullets[i].y)){
                enemyBullets.splice(i,1);
            }
        }

        // enemy bullet vs player
        for(let i=enemyBullets.length-1;i>=0;i--){
            const b=enemyBullets[i];
            if(b.x>player.x&&b.x<player.x+player.w&&b.y>player.y&&b.y<player.y+player.h){
                enemyBullets.splice(i,1);
                lives--;
                spawnBurst(player.x+player.w/2,player.y+player.h/2,"#5cd6ff",16);
                shaker.kick(14);
                floatText.spawn(player.x+player.w/2,player.y-20,"-1 LIFE","#ff5c5c",20);
                if(lives<=0)gameOver=true;
            }
        }

        if(enemies.every(e=>!e.alive)){
            wave++;
            floatText.spawn(canvas.width/2,canvas.height/2-80,"WAVE "+wave,"#5cff8a",28);
            spawnWave();
        }

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        ctx.fillStyle="#000";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="rgba(255,255,255,.5)";
        for(let i=0;i<50;i++){
            const sx=(i*131)%canvas.width;
            const sy=(i*197)%canvas.height;
            ctx.fillRect(sx,sy,1.4,1.4);
        }

        // barriers
        ctx.fillStyle="#5cff8a";
        for(const blocks of barriers){
            for(const blk of blocks){
                if(blk.alive)ctx.fillRect(blk.x,blk.y,9,9);
            }
        }

        // enemies
        for(const en of enemies){
            if(!en.alive)continue;
            const colors=["#ff5c8a","#ffb35c","#5cd6ff","#5cff8a"];
            ctx.save();
            ctx.fillStyle=colors[en.row%colors.length];
            ctx.shadowColor=colors[en.row%colors.length];
            ctx.shadowBlur=8;
            ctx.fillRect(en.x,en.y,en.w,en.h);
            ctx.fillStyle="rgba(0,0,0,.4)";
            ctx.fillRect(en.x+6,en.y+6,4,4);
            ctx.fillRect(en.x+en.w-10,en.y+6,4,4);
            ctx.restore();
        }

        // player ship
        ctx.save();
        ctx.fillStyle="#5cd6ff";
        ctx.shadowColor="#5cd6ff";
        ctx.shadowBlur=10;
        ctx.beginPath();
        ctx.moveTo(player.x+player.w/2,player.y);
        ctx.lineTo(player.x+player.w,player.y+player.h);
        ctx.lineTo(player.x,player.y+player.h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // bullets
        ctx.fillStyle="#fff";
        for(const b of bullets)ctx.fillRect(b.x-1.5,b.y-8,3,10);

        ctx.fillStyle="#ff5c5c";
        for(const b of enemyBullets)ctx.fillRect(b.x-1.5,b.y,3,10);

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.fillRect(p.x-1.5,p.y-1.5,3,3);
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "👾 SPACE INVADERS<br>Score: "+score+
            " &nbsp; ❤️ "+lives+
            " &nbsp; Wave "+wave;

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#5cd6ff";
            ctx.shadowBlur=25;
            ctx.fillStyle="#5cd6ff";
            ctx.font="900 40px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#9fe0ff";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#5cd6ff";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#9fe0ff";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
        resetGame();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        window.removeEventListener("keyup",keyUp);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
        controls.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// FLAPPY BIRD
// ============================================================

function startFlappyBird(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="fb-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#4ec0ca",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="fb-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(10,25,25,.85),rgba(0,0,0,.6))",
        border:"1px solid rgba(255,220,120,.35)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.35)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("fb-back");

    const GRAVITY=1500;
    const FLAP_VELOCITY=-460;
    const PIPE_GAP=190;
    const PIPE_W=68;

    let bird,pipes,particles,groundOffset;
    const shaker=makeShaker();
    let score,best=0,gameOver,started;
    let speed=200;
    let spawnDist,nextSpawn;
    let animationId,lastTime;

    function resetGame(){

        bird={
            x:canvas.width*.28,
            y:canvas.height/2,
            vy:0,
            r:16,
            rot:0
        };

        pipes=[];
        particles=[];
        score=0;
        gameOver=false;
        started=false;
        speed=200;
        spawnDist=0;
        nextSpawn=260;
        groundOffset=0;
    }

    resetGame();

    function spawnBurst(x,y,color){
        for(let i=0;i<14;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*3;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:26,maxLife:26,color});
        }
    }

    function flap(){

        started=true;

        if(gameOver){
            resetGame();
            return;
        }

        bird.vy=FLAP_VELOCITY;
    }

    function pointerDown(e){
        e.preventDefault();
        flap();
    }
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function keyDown(e){
        if(e.code==="Space"||e.key==="ArrowUp"){
            e.preventDefault();
            flap();
        }
    }
    window.addEventListener("keydown",keyDown);

    const groundH=70;

    function spawnPipe(){

        const minY=90;
        const maxY=canvas.height-groundH-90-PIPE_GAP;
        const gapY=minY+Math.random()*Math.max(10,maxY-minY);

        pipes.push({
            x:canvas.width+PIPE_W,
            gapY,
            passed:false
        });
    }

    function update(dt){

        if(!started||gameOver)return;

        bird.vy+=GRAVITY*dt;
        bird.y+=bird.vy*dt;
        bird.rot=Math.max(-.5,Math.min(1.3,bird.vy/700));

        groundOffset-=speed*dt;

        spawnDist+=speed*dt;
        if(spawnDist>=nextSpawn){
            spawnDist=0;
            nextSpawn=220+Math.random()*60;
            spawnPipe();
        }

        speed=Math.min(340,speed+dt*4);

        for(let i=pipes.length-1;i>=0;i--){

            const p=pipes[i];
            p.x-=speed*dt;

            if(!p.passed && p.x+PIPE_W<bird.x){
                p.passed=true;
                score++;
                best=Math.max(best,score);
            }

            const hitX=bird.x+bird.r>p.x && bird.x-bird.r<p.x+PIPE_W;
            const hitY=bird.y-bird.r<p.gapY || bird.y+bird.r>p.gapY+PIPE_GAP;

            if(hitX&&hitY){
                gameOver=true;
                spawnBurst(bird.x,bird.y,"#ffe27a");
                shaker.kick(16);
            }

            if(p.x<-PIPE_W-10)pipes.splice(i,1);
        }

        if(bird.y+bird.r>canvas.height-groundH){
            bird.y=canvas.height-groundH-bird.r;
            gameOver=true;
            spawnBurst(bird.x,bird.y,"#ffe27a");
            shaker.kick(16);
        }
        if(bird.y-bird.r<0){
            bird.y=bird.r;
            bird.vy=0;
        }

        for(let i=particles.length-1;i>=0;i--){
            const pt=particles[i];
            pt.x+=pt.vx; pt.y+=pt.vy; pt.vy+=.2; pt.life--;
            if(pt.life<=0)particles.splice(i,1);
        }
    }

    function drawPipe(p){

        const topH=p.gapY;
        const botY=p.gapY+PIPE_GAP;
        const botH=canvas.height-groundH-botY;

        ctx.save();
        const pipeGradient=ctx.createLinearGradient(p.x,0,p.x+PIPE_W,0);
        pipeGradient.addColorStop(0,"#267a45");
        pipeGradient.addColorStop(.28,"#65d66b");
        pipeGradient.addColorStop(.7,"#42b95a");
        pipeGradient.addColorStop(1,"#185b3c");
        ctx.fillStyle=pipeGradient;
        ctx.strokeStyle="#174d36";
        ctx.lineWidth=3;

        ctx.fillRect(p.x,0,PIPE_W,topH);
        ctx.strokeRect(p.x,0,PIPE_W,topH);
        ctx.fillRect(p.x-8,topH-30,PIPE_W+16,30);
        ctx.strokeRect(p.x-8,topH-30,PIPE_W+16,30);

        ctx.fillRect(p.x,botY,PIPE_W,botH);
        ctx.strokeRect(p.x,botY,PIPE_W,botH);
        ctx.fillRect(p.x-8,botY,PIPE_W+16,30);
        ctx.strokeRect(p.x-8,botY,PIPE_W+16,30);

        ctx.fillStyle="rgba(255,255,255,.2)";
        ctx.fillRect(p.x+10,0,8,Math.max(0,topH-4));
        ctx.fillRect(p.x+10,botY+4,8,Math.max(0,botH-4));

        ctx.restore();
    }

    function drawBird(){

        ctx.save();
        ctx.translate(bird.x,bird.y);
        ctx.rotate(bird.rot);

        ctx.fillStyle="#ffcc33";
        ctx.strokeStyle="#c9941f";
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.ellipse(0,0,bird.r,bird.r*.8,0,0,Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle="#fff";
        ctx.beginPath();
        ctx.arc(5,-4,5,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle="#1a1a1a";
        ctx.beginPath();
        ctx.arc(7,-4,2.4,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle="#ff8c3c";
        ctx.beginPath();
        ctx.moveTo(bird.r-2,0);
        ctx.lineTo(bird.r+10,-2);
        ctx.lineTo(bird.r-2,6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle="#ffb84d";
        ctx.beginPath();
        ctx.ellipse(-4,4,7,5,.3,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle="#f29b25";
        ctx.beginPath();
        ctx.moveTo(-12,5);
        ctx.lineTo(-24,12);
        ctx.lineTo(-9,12);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const sky=ctx.createLinearGradient(0,0,0,canvas.height);
        sky.addColorStop(0,"#4ec0ca");
        sky.addColorStop(1,"#8fe0c8");
        ctx.fillStyle=sky;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="rgba(255,255,255,.4)";
        for(let i=0;i<5;i++){
            const cxp=((i*220-groundOffset*.2)%(canvas.width+200))-100;
            ctx.beginPath();
            ctx.arc(cxp,80+i*40%160,26,0,Math.PI*2);
            ctx.arc(cxp+22,72+i*40%160,20,0,Math.PI*2);
            ctx.fill();
        }

        for(let layer=0;layer<3;layer++){
            const base=canvas.height-groundH-layer*26;
            ctx.fillStyle=layer===0?"#78c59d":layer===1?"#53a883":"#3a806d";
            ctx.beginPath();
            ctx.moveTo(0,base);
            for(let x=0;x<=canvas.width+80;x+=80){
                const y=base-35-layer*18-Math.sin(x*.012+layer*1.7)*24;
                ctx.lineTo(x,y);
            }
            ctx.lineTo(canvas.width,base);
            ctx.closePath();
            ctx.fill();
        }

        for(const p of pipes)drawPipe(p);

        drawBird();

        for(const pt of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,pt.life/pt.maxLife);
            ctx.fillStyle=pt.color;
            ctx.beginPath();
            ctx.arc(pt.x,pt.y,3,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        // ground
        ctx.fillStyle="#ded895";
        ctx.fillRect(0,canvas.height-groundH,canvas.width,groundH);
        ctx.fillStyle="#c9c07a";
        ctx.fillRect(0,canvas.height-groundH,canvas.width,8);

        ctx.strokeStyle="rgba(0,0,0,.15)";
        ctx.lineWidth=3;
        const tick=30;
        const off=groundOffset%tick;
        for(let x=off;x<canvas.width;x+=tick){
            ctx.beginPath();
            ctx.moveTo(x,canvas.height-groundH+10);
            ctx.lineTo(x-10,canvas.height-groundH+22);
            ctx.stroke();
        }

        ctx.textAlign="center";
        ctx.fillStyle="#fff";
        ctx.strokeStyle="rgba(0,0,0,.4)";
        ctx.lineWidth=4;
        ctx.font="900 44px Arial";
        ctx.strokeText(score,canvas.width/2,80);
        ctx.fillText(score,canvas.width/2,80);

        ui.innerHTML=
            "🐤 FLAPPY BIRD<br>Best: "+best+
            (started?"":"<br><span style='font-weight:normal;color:#eafff5'>Tap / Space to flap</span>");

        if(!started&&!gameOver){
            ctx.save();
            ctx.textAlign="center";
            ctx.fillStyle="rgba(0,0,0,.35)";
            ctx.fillRect(0,canvas.height*.35,canvas.width,60);
            ctx.fillStyle="#fff";
            ctx.font="bold 22px Arial";
            ctx.fillText("TAP TO START",canvas.width/2,canvas.height*.35+38);
            ctx.restore();
        }

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.72)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#ffe27a";
            ctx.shadowBlur=25;
            ctx.fillStyle="#ffe27a";
            ctx.font="900 40px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score+"   Best: "+best,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#eafff5";
            ctx.fillText("Tap to try again",canvas.width/2,canvas.height/2+45);
        }

        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.033);
        lastTime=t;
        update(dt);
        draw();
    }

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// STACK TOWER
// ============================================================

function startStackTower(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="st-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#1b1030",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="st-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(20,10,35,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(200,150,255,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("st-back");

    const BLOCK_H=34;
    const HUE_STEP=14;

    let stack,moving,camY,score,best=0,gameOver,speed,particles;
    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();
    let animationId,lastTime;

    function baseWidth(){
        return Math.min(canvas.width*.62,320);
    }

    function resetGame(){

        const w=baseWidth();

        stack=[{
            x:canvas.width/2-w/2,
            w:w,
            y:canvas.height-140,
            hue:200
        }];

        camY=0;
        score=0;
        gameOver=false;
        particles=[];
        speed=220;

        spawnMoving();
    }

    function spawnMoving(){

        const top=stack[stack.length-1];

        moving={
            x: Math.random()<.5 ? -top.w : canvas.width,
            w:top.w,
            y:top.y-BLOCK_H,
            dir: Math.random()<.5?1:-1,
            hue:(top.hue+HUE_STEP)%360
        };

        if(moving.x<0)moving.dir=1;
        else moving.dir=-1;
    }

    resetGame();

    function spawnBurst(x,y,color,n){
        for(let i=0;i<n;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*4;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,life:26,maxLife:26,color});
        }
    }

    function drop(){

        if(gameOver){
            resetGame();
            return;
        }

        const top=stack[stack.length-1];

        const left=Math.max(moving.x,top.x);
        const right=Math.min(moving.x+moving.w,top.x+top.w);
        const overlap=right-left;

        if(overlap<=4){

            gameOver=true;
            best=Math.max(best,score);
            spawnBurst(moving.x+moving.w/2,moving.y+BLOCK_H/2,"#ff5b5b",24);
            shaker.kick(20);
            return;
        }

        const isPerfect = Math.abs(overlap-moving.w)<2;

        const newBlock={
            x:left,
            w:overlap,
            y:moving.y,
            hue:moving.hue
        };

        // shaved-off pieces fall away
        if(moving.x<left){
            spawnBurst(moving.x+(left-moving.x)/2,moving.y+BLOCK_H/2,"hsl("+moving.hue+",80%,60%)",6);
        }
        if(moving.x+moving.w>right){
            spawnBurst(right+(moving.x+moving.w-right)/2,moving.y+BLOCK_H/2,"hsl("+moving.hue+",80%,60%)",6);
        }

        stack.push(newBlock);
        score++;
        best=Math.max(best,score);
        speed=Math.min(560,speed+8);

        if(isPerfect){
            floatText.spawn(newBlock.x+newBlock.w/2,newBlock.y,"PERFECT!","#ffe14d",20);
            spawnBurst(newBlock.x+newBlock.w/2,newBlock.y+BLOCK_H/2,"#ffe14d",12);
            shaker.kick(6);
        }else if(score%10===0){
            floatText.spawn(newBlock.x+newBlock.w/2,newBlock.y,score+"!","#ff8fd6",22);
        }

        spawnMoving();
    }

    function pointerDown(e){
        e.preventDefault();
        drop();
    }
    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function keyDown(e){
        if(e.code==="Space"||e.key==="ArrowDown"){
            e.preventDefault();
            drop();
        }
    }
    window.addEventListener("keydown",keyDown);

    function update(dt){

        if(gameOver)return;

        moving.x+=moving.dir*speed*dt;

        if(moving.x<-moving.w-20){
            moving.x=-moving.w-20;
            moving.dir=1;
        }
        if(moving.x>canvas.width+20){
            moving.x=canvas.width+20;
            moving.dir=-1;
        }

        // camera follows tower height
        const targetCamY=Math.max(0,(canvas.height*.6)-stack[stack.length-1].y);
        camY+=(targetCamY-camY)*.12;

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.vy+=.2; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#2a1854");
        bg.addColorStop(1,"#0d0620");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save();
        ctx.translate(0,camY);

        for(const b of stack){
            ctx.save();
            ctx.fillStyle="hsl("+b.hue+",70%,58%)";
            ctx.shadowColor="hsla("+b.hue+",70%,58%,.6)";
            ctx.shadowBlur=8;
            ctx.fillRect(b.x,b.y,b.w,BLOCK_H);
            ctx.fillStyle="rgba(255,255,255,.2)";
            ctx.fillRect(b.x,b.y,b.w,5);
            ctx.restore();
        }

        if(!gameOver){
            ctx.save();
            ctx.fillStyle="hsl("+moving.hue+",70%,58%)";
            ctx.shadowColor="hsla("+moving.hue+",70%,58%,.7)";
            ctx.shadowBlur=12;
            ctx.fillRect(moving.x,moving.y,moving.w,BLOCK_H);
            ctx.fillStyle="rgba(255,255,255,.25)";
            ctx.fillRect(moving.x,moving.y,moving.w,5);
            ctx.restore();
        }

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.fillRect(p.x-3,p.y-3,6,6);
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ctx.textAlign="center";
        ctx.fillStyle="#fff";
        ctx.font="900 46px Arial";
        ctx.fillText(score,canvas.width/2,90);

        ui.innerHTML=
            "🗼 STACK TOWER<br>Height: "+score+
            " &nbsp; Best: "+best+
            "<br><span style='font-weight:normal;color:#d6c0ff'>Tap / Space to drop</span>";

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.72)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#ff8fd6";
            ctx.shadowBlur=25;
            ctx.fillStyle="#ff8fd6";
            ctx.font="900 40px Arial";
            ctx.fillText("TOPPLED!",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Height: "+score+"   Best: "+best,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#d6c0ff";
            ctx.fillText("Tap to try again",canvas.width/2,canvas.height/2+45);
        }

        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.033);
        lastTime=t;
        update(dt);
        draw();
    }

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// BUBBLE SHOOTER
// ============================================================

function startBubbleShooter(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="bs-canvas";
    const ctx=canvas.getContext("2d");

    const COLORS=["#ff5c5c","#5cd6ff","#5cff8a","#ffe14d","#c04dff"];
    const ROWS_VISIBLE=9;
    let cellW,cellH,gridCols,offsetX,offsetY;

    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        gridCols=Math.min(11,Math.floor(canvas.width/38));
        cellW=Math.min(42,canvas.width/gridCols);
        cellH=cellW*0.87;
        offsetX=(canvas.width-gridCols*cellW)/2;
        offsetY=50;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#0d1a2b",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="bs-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(10,15,30,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(120,180,255,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("bs-back");
    const pauseBtn=makePauseButton("bs-pause");

    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();

    let grid,shooter,flying,nextColor,score,gameOver,paused=false;
    let particles=[];
    let animationId,lastTime;
    let aimX,aimY;

    function cellPos(r,c){
        const x=offsetX+c*cellW+((r%2)?cellW/2:0)+cellW/2;
        const y=offsetY+r*cellH+cellH/2;
        return {x,y};
    }

    function colsInRow(r){
        return (r%2)? gridCols-1 : gridCols;
    }

    function makeGrid(){

        const g=[];

        for(let r=0;r<ROWS_VISIBLE;r++){

            const row=[];
            const cols=colsInRow(r);

            for(let c=0;c<cols;c++){
                row.push(r<5 ? COLORS[Math.floor(Math.random()*COLORS.length)] : null);
            }

            g.push(row);
        }

        return g;
    }

    function resetGame(){

        grid=makeGrid();
        score=0;
        gameOver=false;
        particles=[];

        shooter={x:canvas.width/2,y:canvas.height-50};
        nextColor=COLORS[Math.floor(Math.random()*COLORS.length)];
        spawnFlying();

        aimX=shooter.x;
        aimY=shooter.y-200;
    }

    function spawnFlying(){

        const color=nextColor;
        nextColor=COLORS[Math.floor(Math.random()*COLORS.length)];

        flying={
            x:shooter.x,
            y:shooter.y,
            vx:0,vy:0,
            color,
            moving:false
        };
    }

    resetGame();

    function spawnBurst(x,y,color,n){
        for(let i=0;i<n;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*4;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:26,maxLife:26,color});
        }
    }

    function neighbors(r,c){

        const odd=r%2===1;
        const deltas=odd
            ? [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]]
            : [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]];

        const result=[];
        for(const [dr,dc] of deltas){
            const nr=r+dr, nc=c+dc;
            if(nr>=0 && nr<grid.length && grid[nr] && nc>=0 && nc<grid[nr].length){
                result.push([nr,nc]);
            }
        }
        return result;
    }

    function findMatches(r,c){

        const color=grid[r][c];
        if(!color)return [];

        const visited=new Set();
        const stack=[[r,c]];
        const group=[];

        while(stack.length){

            const [cr,cc]=stack.pop();
            const key=cr+","+cc;
            if(visited.has(key))continue;
            visited.add(key);

            if(grid[cr][cc]!==color)continue;

            group.push([cr,cc]);

            for(const [nr,nc] of neighbors(cr,cc)){
                if(!visited.has(nr+","+nc))stack.push([nr,nc]);
            }
        }

        return group;
    }

    function dropFloating(){

        // find all bubbles connected to the top row
        const connected=new Set();
        const stack=[];

        for(let c=0;c<colsInRow(0);c++){
            if(grid[0][c]){
                stack.push([0,c]);
            }
        }

        while(stack.length){
            const [r,c]=stack.pop();
            const key=r+","+c;
            if(connected.has(key))continue;
            if(!grid[r] || !grid[r][c])continue;
            connected.add(key);
            for(const [nr,nc] of neighbors(r,c)){
                if(!connected.has(nr+","+nc))stack.push([nr,nc]);
            }
        }

        let dropped=0;

        for(let r=0;r<grid.length;r++){
            for(let c=0;c<grid[r].length;c++){
                if(grid[r][c] && !connected.has(r+","+c)){
                    const p=cellPos(r,c);
                    spawnBurst(p.x,p.y,grid[r][c],8);
                    grid[r][c]=null;
                    dropped++;
                }
            }
        }

        return dropped;
    }

    function snapToGrid(){

        let bestR=0,bestC=0,bestDist=Infinity;

        for(let r=0;r<ROWS_VISIBLE+2;r++){

            if(!grid[r]) grid[r]=new Array(colsInRow(r)).fill(null);

            for(let c=0;c<colsInRow(r);c++){

                if(grid[r][c])continue;

                const p=cellPos(r,c);
                const d=Math.hypot(p.x-flying.x,p.y-flying.y);

                if(d<bestDist){
                    bestDist=d;
                    bestR=r; bestC=c;
                }
            }
        }

        grid[bestR][bestC]=flying.color;

        const group=findMatches(bestR,bestC);

        if(group.length>=3){

            const p=cellPos(bestR,bestC);

            for(const [r,c] of group){
                const gp=cellPos(r,c);
                spawnBurst(gp.x,gp.y,flying.color,10);
                grid[r][c]=null;
            }

            const gained=group.length*10;
            score+=gained;
            floatText.spawn(p.x,p.y,"+"+gained,flying.color,20);
            shaker.kick(Math.min(14,group.length*2));

            const droppedCount=dropFloating();
            if(droppedCount>0){
                score+=droppedCount*15;
                floatText.spawn(p.x,p.y-30,"+"+(droppedCount*15)+" BONUS","#ffe14d",18);
            }
        }

        // check danger line
        for(let c=0;c<colsInRow(ROWS_VISIBLE-1);c++){
            if(grid[ROWS_VISIBLE-1] && grid[ROWS_VISIBLE-1][c]){
                gameOver=true;
                shaker.kick(18);
            }
        }

        flying=null;
        spawnFlying();
    }

    function getPointer(e){
        const rect=canvas.getBoundingClientRect();
        return {x:e.clientX-rect.left,y:e.clientY-rect.top};
    }

    function aimAt(x,y){
        const dx=x-shooter.x;
        const dy=y-shooter.y;
        const len=Math.hypot(dx,dy)||1;
        const angle=Math.max(-2.7,Math.min(-0.44,Math.atan2(dy,dx)));
        aimX=shooter.x+Math.cos(angle)*200;
        aimY=shooter.y+Math.sin(angle)*200;
    }

    function pointerMove(e){
        e.preventDefault();
        if(paused)return;
        const p=getPointer(e);
        aimAt(p.x,p.y);
    }

    function pointerUp(e){
        e.preventDefault();
        if(paused)return;

        if(gameOver){ resetGame(); return; }
        if(flying.moving)return;

        const dx=aimX-shooter.x;
        const dy=aimY-shooter.y;
        const len=Math.hypot(dx,dy)||1;
        const speed=680;

        flying.vx=dx/len*speed;
        flying.vy=dy/len*speed;
        flying.moving=true;
    }

    canvas.addEventListener("pointermove",pointerMove,{passive:false});
    canvas.addEventListener("pointerup",pointerUp,{passive:false});
    canvas.addEventListener("pointerdown",pointerMove,{passive:false});

    function update(dt){

        if(gameOver||paused)return;

        if(flying && flying.moving){

            flying.x+=flying.vx*dt;
            flying.y+=flying.vy*dt;

            if(flying.x<offsetX+cellW/2 || flying.x>canvas.width-cellW/2){
                flying.vx*=-1;
                flying.x=Math.max(offsetX+cellW/2,Math.min(canvas.width-cellW/2,flying.x));
            }

            if(flying.y<offsetY){
                snapToGrid();
            }else{

                for(let r=0;r<grid.length;r++){
                    for(let c=0;c<grid[r].length;c++){
                        if(!grid[r][c])continue;
                        const p=cellPos(r,c);
                        if(Math.hypot(p.x-flying.x,p.y-flying.y)<cellW*.86){
                            snapToGrid();
                            r=grid.length; break;
                        }
                    }
                }
            }
        }

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.vy+=.15; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function drawBubble(x,y,color,r){
        ctx.save();
        ctx.shadowColor=color;
        ctx.shadowBlur=8;
        const g=ctx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);
        g.addColorStop(0,"#fff");
        g.addColorStop(.35,color);
        g.addColorStop(1,color);
        ctx.fillStyle=g;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#132540");
        bg.addColorStop(1,"#050a14");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // danger line
        ctx.strokeStyle="rgba(255,80,80,.3)";
        ctx.setLineDash([8,8]);
        ctx.beginPath();
        ctx.moveTo(0,offsetY+(ROWS_VISIBLE-1)*cellH+cellH);
        ctx.lineTo(canvas.width,offsetY+(ROWS_VISIBLE-1)*cellH+cellH);
        ctx.stroke();
        ctx.setLineDash([]);

        for(let r=0;r<grid.length;r++){
            for(let c=0;c<grid[r].length;c++){
                if(grid[r][c]){
                    const p=cellPos(r,c);
                    drawBubble(p.x,p.y,grid[r][c],cellW*.46);
                }
            }
        }

        if(flying){
            drawBubble(flying.x,flying.y,flying.color,cellW*.46);
        }

        if(!flying.moving && !gameOver){
            ctx.save();
            ctx.strokeStyle="rgba(255,255,255,.35)";
            ctx.setLineDash([6,8]);
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(shooter.x,shooter.y);
            ctx.lineTo(aimX,aimY);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }

        // next bubble preview
        drawBubble(shooter.x+50,shooter.y,nextColor,cellW*.32);
        ctx.fillStyle="rgba(255,255,255,.6)";
        ctx.font="11px Arial";
        ctx.textAlign="center";
        ctx.fillText("NEXT",shooter.x+50,shooter.y-22);

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🎯 BUBBLE SHOOTER<br>Score: "+score+
            "<br><span style='font-weight:normal;color:#9fc0ff'>Aim and release to shoot</span>";

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#ff5c5c";
            ctx.shadowBlur=25;
            ctx.fillStyle="#ff5c5c";
            ctx.font="900 40px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#9fc0ff";
            ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#5cd6ff";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#9fc0ff";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.033);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        canvas.removeEventListener("pointermove",pointerMove);
        canvas.removeEventListener("pointerup",pointerUp);
        canvas.removeEventListener("pointerdown",pointerMove);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// FRUIT SLICE
// ============================================================

function startFruitSlice(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="fs-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#1a0f2e",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="fs-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(25,10,35,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(255,150,200,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("fs-back");
    const pauseBtn=makePauseButton("fs-pause");

    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();

    const FRUITS=[
        {name:"watermelon",color:"#ff5c7a",inner:"#ffb3c1",r:34},
        {name:"orange",color:"#ff9a3c",inner:"#ffd08a",r:28},
        {name:"lime",color:"#7ed957",inner:"#cdf5b8",r:24},
        {name:"grape",color:"#a55cff",inner:"#d8b3ff",r:22},
        {name:"lemon",color:"#ffe14d",inner:"#fff6b3",r:26}
    ];

    const GRAVITY=900;

    let fruits,halves,particles,trail,score,combo,lives,gameOver,started,paused=false;
    let spawnTimer=0;
    let animationId,lastTime;

    function resetGame(){

        fruits=[];
        halves=[];
        particles=[];
        trail=[];
        score=0;
        combo=0;
        lives=3;
        gameOver=false;
        started=false;
        spawnTimer=0;
    }

    resetGame();

    function spawnBurst(x,y,color,n){
        for(let i=0;i<n;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*4;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:26,maxLife:26,color});
        }
    }

    function spawnObject(){

        const isBomb=Math.random()<0.12;
        const fx=canvas.width*.2+Math.random()*canvas.width*.6;
        const vx=(canvas.width/2-fx)/1.1 + (Math.random()-.5)*80;
        const vy=-(780+Math.random()*180);

        if(isBomb){
            fruits.push({
                x:fx,y:canvas.height+40,vx,vy,
                rot:0,vr:(Math.random()-.5)*3,
                isBomb:true,r:26,sliced:false
            });
        }else{
            const type=FRUITS[Math.floor(Math.random()*FRUITS.length)];
            fruits.push({
                x:fx,y:canvas.height+40,vx,vy,
                rot:0,vr:(Math.random()-.5)*3,
                isBomb:false,type,r:type.r,sliced:false
            });
        }
    }

    function getPointer(e){
        const rect=canvas.getBoundingClientRect();
        return {x:e.clientX-rect.left,y:e.clientY-rect.top};
    }

    let dragging=false;

    function pointerDown(e){
        e.preventDefault();
        if(paused)return;

        if(gameOver){ resetGame(); return; }
        started=true;

        dragging=true;
        const p=getPointer(e);
        trail=[{x:p.x,y:p.y,life:1}];
    }

    function pointerMove(e){
        e.preventDefault();
        if(!dragging||paused)return;

        const p=getPointer(e);
        trail.push({x:p.x,y:p.y,life:1});
        if(trail.length>18)trail.shift();

        checkSlices(p.x,p.y);
    }

    function pointerUp(e){
        e.preventDefault();
        dragging=false;
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});
    canvas.addEventListener("pointermove",pointerMove,{passive:false});
    canvas.addEventListener("pointerup",pointerUp,{passive:false});
    canvas.addEventListener("pointercancel",function(){dragging=false;});

    function checkSlices(x,y){

        if(gameOver)return;

        for(const f of fruits){

            if(f.sliced)continue;

            if(Math.hypot(f.x-x,f.y-y)<f.r+8){

                f.sliced=true;

                if(f.isBomb){

                    gameOver=true;
                    shaker.kick(24);
                    spawnBurst(f.x,f.y,"#ff4444",30);
                    floatText.spawn(f.x,f.y,"BOOM!","#ff4444",30);

                }else{

                    combo++;
                    const gained=10*Math.min(combo,5);
                    score+=gained;

                    spawnBurst(f.x,f.y,f.type.color,18);
                    floatText.spawn(f.x,f.y-10,"+"+gained+(combo>1?" x"+combo:""),f.type.color,combo>2?22:16);

                    halves.push({
                        x:f.x,y:f.y,vx:f.vx-90,vy:f.vy-60,
                        rot:f.rot,vr:f.vr-2,type:f.type,side:-1,life:1
                    });
                    halves.push({
                        x:f.x,y:f.y,vx:f.vx+90,vy:f.vy-60,
                        rot:f.rot,vr:f.vr+2,type:f.type,side:1,life:1
                    });
                }
            }
        }
    }

    function update(dt){

        if(paused)return;

        if(started && !gameOver){

            spawnTimer-=dt;
            if(spawnTimer<=0){
                spawnTimer=0.55+Math.random()*0.5;
                spawnObject();
            }
        }

        for(let i=fruits.length-1;i>=0;i--){

            const f=fruits[i];
            f.vy+=GRAVITY*dt;
            f.x+=f.vx*dt;
            f.y+=f.vy*dt;
            f.rot+=f.vr*dt;

            if(f.y>canvas.height+60){

                if(!f.sliced && !f.isBomb && !gameOver){
                    lives--;
                    combo=0;
                    shaker.kick(8);
                    if(lives<=0){
                        gameOver=true;
                    }
                }

                fruits.splice(i,1);
            }else if(f.sliced && f.isBomb===false){
                fruits.splice(i,1);
            }
        }

        for(let i=halves.length-1;i>=0;i--){
            const h=halves[i];
            h.vy+=GRAVITY*dt;
            h.x+=h.vx*dt;
            h.y+=h.vy*dt;
            h.rot+=h.vr*dt;
            h.life-=dt*.5;
            if(h.life<=0 || h.y>canvas.height+80)halves.splice(i,1);
        }

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.vy+=.2; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        for(let i=trail.length-1;i>=0;i--){
            trail[i].life-=dt*3;
            if(trail[i].life<=0)trail.splice(i,1);
        }

        floatText.update(dt);
    }

    function drawFruitShape(x,y,rot,r,color,inner){
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(rot);
        ctx.shadowColor=color;
        ctx.shadowBlur=10;
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.arc(0,0,r,0,Math.PI*2);
        ctx.fill();
        ctx.shadowBlur=0;
        ctx.fillStyle=inner;
        ctx.beginPath();
        ctx.arc(0,0,r*.55,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

    function drawHalf(h){
        ctx.save();
        ctx.globalAlpha=Math.max(0,h.life);
        ctx.translate(h.x,h.y);
        ctx.rotate(h.rot);
        ctx.fillStyle=h.type.color;
        ctx.beginPath();
        ctx.arc(0,0,h.type.r,h.side>0?-Math.PI/2:Math.PI/2,h.side>0?Math.PI/2:Math.PI*1.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle=h.type.inner;
        ctx.beginPath();
        ctx.arc(0,0,h.type.r*.55,h.side>0?-Math.PI/2:Math.PI/2,h.side>0?Math.PI/2:Math.PI*1.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#241238");
        bg.addColorStop(1,"#0b0616");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        for(const f of fruits){
            if(f.sliced && !f.isBomb)continue;
            if(f.isBomb){
                ctx.save();
                ctx.translate(f.x,f.y);
                ctx.rotate(f.rot);
                ctx.fillStyle="#222";
                ctx.shadowColor="#ff4444";
                ctx.shadowBlur=f.sliced?0:14;
                ctx.beginPath();
                ctx.arc(0,0,f.r,0,Math.PI*2);
                ctx.fill();
                ctx.strokeStyle="#ff4444";
                ctx.lineWidth=2;
                ctx.stroke();
                ctx.fillStyle="#ff4444";
                ctx.font="bold "+(f.r*.9)+"px Arial";
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillText("!",0,2);
                ctx.restore();
            }else{
                drawFruitShape(f.x,f.y,f.rot,f.type.r,f.type.color,f.type.inner);
            }
        }

        for(const h of halves)drawHalf(h);

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        if(trail.length>1){
            ctx.save();
            ctx.strokeStyle="rgba(255,255,255,.8)";
            ctx.shadowColor="#fff";
            ctx.shadowBlur=10;
            ctx.lineWidth=4;
            ctx.lineCap="round";
            ctx.lineJoin="round";
            ctx.beginPath();
            ctx.moveTo(trail[0].x,trail[0].y);
            for(let i=1;i<trail.length;i++){
                ctx.globalAlpha=trail[i].life;
                ctx.lineTo(trail[i].x,trail[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "🍉 FRUIT SLICE<br>Score: "+score+
            " &nbsp; ❤️ "+lives+
            (started?"":"<br><span style='font-weight:normal;color:#ffb3d9'>Swipe to slice — avoid bombs!</span>");

        if(!started&&!gameOver){
            ctx.save();
            ctx.textAlign="center";
            ctx.fillStyle="rgba(0,0,0,.35)";
            ctx.fillRect(0,canvas.height*.35,canvas.width,60);
            ctx.fillStyle="#fff";
            ctx.font="bold 22px Arial";
            ctx.fillText("SWIPE TO START",canvas.width/2,canvas.height*.35+38);
            ctx.restore();
        }

        if(gameOver){
            ctx.fillStyle="rgba(0,0,0,.78)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.textAlign="center";
            ctx.shadowColor="#ff4444";
            ctx.shadowBlur=25;
            ctx.fillStyle="#ff4444";
            ctx.font="900 40px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-30);
            ctx.shadowBlur=0;
            ctx.fillStyle="#fff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Score: "+score,canvas.width/2,canvas.height/2+10);
            ctx.font="16px Arial";
            ctx.fillStyle="#ffb3d9";
            ctx.fillText("Tap to try again",canvas.width/2,canvas.height/2+45);
        }
    }

    function drawPauseOverlay(){
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.55)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.textAlign="center";
        ctx.shadowColor="#ff5c7a";
        ctx.shadowBlur=20;
        ctx.fillStyle="#fff";
        ctx.font="900 44px Arial";
        ctx.fillText("PAUSED",canvas.width/2,canvas.height/2-10);
        ctx.shadowBlur=0;
        ctx.fillStyle="#ffb3d9";
        ctx.font="16px Arial";
        ctx.fillText("Tap ▶ to resume",canvas.width/2,canvas.height/2+30);
        ctx.restore();
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.033);
        lastTime=t;
        update(dt);
        draw();
    }

    pauseBtn.onclick=function(){
        paused=!paused;
        if(paused){
            cancelAnimationFrame(animationId);
            pauseBtn.textContent="▶";
            drawPauseOverlay();
        }else{
            pauseBtn.textContent="⏸";
            lastTime=performance.now();
            animationId=requestAnimationFrame(loop);
        }
    };

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.removeEventListener("pointermove",pointerMove);
        canvas.removeEventListener("pointerup",pointerUp);
        canvas.remove();
        ui.remove();
        back.remove();
        pauseBtn.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// JEWEL SWAP (match-3)
// ============================================================

function startJewelSwap(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="js-canvas";
    const ctx=canvas.getContext("2d");

    const SIZE=8;
    const GEMS=[
        {color:"#ff5c5c",shape:"circle"},
        {color:"#5cd6ff",shape:"square"},
        {color:"#5cff8a",shape:"triangle"},
        {color:"#ffe14d",shape:"diamond"},
        {color:"#c04dff",shape:"star"},
        {color:"#ff9a3c",shape:"hex"}
    ];

    let cell,boardX,boardY,boardPx;

    function resize(){

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        boardPx=Math.min(canvas.width*.92,canvas.height*.72,520);
        cell=boardPx/SIZE;
        boardX=(canvas.width-boardPx)/2;
        boardY=(canvas.height-boardPx)/2+20;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"#120c22",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="js-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(15,10,30,.88),rgba(0,0,0,.7))",
        border:"1px solid rgba(200,150,255,.3)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        textShadow:"0 1px 3px #000",boxShadow:"0 8px 24px rgba(0,0,0,.4)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("js-back");

    const floatText=makeFloatingTextPool();
    const shaker=makeShaker();

    let grid,score,best=0,selected,busy,moves;
    let animationId,lastTime;

    function randGem(){
        return Math.floor(Math.random()*GEMS.length);
    }

    function makeGridNoMatches(){

        const g=[];

        for(let r=0;r<SIZE;r++){
            const row=[];
            for(let c=0;c<SIZE;c++){

                let val;
                do{
                    val=randGem();
                }while(
                    (c>=2 && row[c-1]===val && row[c-2]===val) ||
                    (r>=2 && g[r-1][c]===val && g[r-2][c]===val)
                );

                row.push(val);
            }
            g.push(row);
        }

        return g;
    }

    function resetGame(){

        grid=makeGridNoMatches();
        score=0;
        selected=null;
        busy=false;
        moves=0;
    }

    resetGame();

    function findAllMatches(){

        const matched=new Set();

        for(let r=0;r<SIZE;r++){
            let runStart=0;
            for(let c=1;c<=SIZE;c++){
                if(c<SIZE && grid[r][c]===grid[r][runStart] && grid[r][c]!==null){
                    continue;
                }
                if(c-runStart>=3){
                    for(let k=runStart;k<c;k++)matched.add(r+","+k);
                }
                runStart=c;
            }
        }

        for(let c=0;c<SIZE;c++){
            let runStart=0;
            for(let r=1;r<=SIZE;r++){
                if(r<SIZE && grid[r][c]===grid[runStart][c] && grid[r][c]!==null){
                    continue;
                }
                if(r-runStart>=3){
                    for(let k=runStart;k<r;k++)matched.add(k+","+c);
                }
                runStart=r;
            }
        }

        return matched;
    }

    function cellCenter(r,c){
        return {
            x:boardX+c*cell+cell/2,
            y:boardY+r*cell+cell/2
        };
    }

    function clearMatches(matched,comboLevel){

        if(matched.size===0)return false;

        const gained=matched.size*10*comboLevel;
        score+=gained;
        best=Math.max(best,score);

        let sumX=0,sumY=0;

        for(const key of matched){
            const [r,c]=key.split(",").map(Number);
            const p=cellCenter(r,c);
            sumX+=p.x; sumY+=p.y;
            spawnBurst(p.x,p.y,GEMS[grid[r][c]].color,8);
            grid[r][c]=null;
        }

        const cx=sumX/matched.size, cy=sumY/matched.size;
        const label=comboLevel>1?("+"+gained+" x"+comboLevel+" COMBO"):("+"+gained);
        floatText.spawn(cx,cy,label,"#ffe14d",comboLevel>1?22:16);
        shaker.kick(Math.min(14,matched.size*1.5));

        return true;
    }

    let particles=[];

    function spawnBurst(x,y,color,n){
        for(let i=0;i<n;i++){
            const a=Math.random()*Math.PI*2;
            const sp=1+Math.random()*3;
            particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:24,maxLife:24,color});
        }
    }

    function collapseAndFill(){

        for(let c=0;c<SIZE;c++){

            const colVals=[];
            for(let r=SIZE-1;r>=0;r--){
                if(grid[r][c]!==null)colVals.push(grid[r][c]);
            }
            while(colVals.length<SIZE)colVals.push(randGem());

            for(let r=SIZE-1;r>=0;r--){
                grid[r][c]=colVals[SIZE-1-r];
            }
        }
    }

    function resolveBoard(){

        busy=true;
        let comboLevel=1;

        function step(){

            const matched=findAllMatches();

            if(matched.size>0){

                clearMatches(matched,comboLevel);
                comboLevel++;

                setTimeout(function(){
                    collapseAndFill();
                    setTimeout(step,220);
                },260);

            }else{

                busy=false;
            }
        }

        step();
    }

    function swap(r1,c1,r2,c2){

        const tmp=grid[r1][c1];
        grid[r1][c1]=grid[r2][c2];
        grid[r2][c2]=tmp;
    }

    function tryMakeMove(r1,c1,r2,c2){

        if(busy)return;

        swap(r1,c1,r2,c2);

        const matched=findAllMatches();

        if(matched.size===0){

            // no match — swap back
            swap(r1,c1,r2,c2);

        }else{

            moves++;
            resolveBoard();
        }
    }

    function cellAt(x,y){

        if(x<boardX||y<boardY||x>boardX+boardPx||y>boardY+boardPx)return null;

        const c=Math.floor((x-boardX)/cell);
        const r=Math.floor((y-boardY)/cell);

        return {r,c};
    }

    function pointerDown(e){

        e.preventDefault();
        if(busy)return;

        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        const hit=cellAt(x,y);
        if(!hit)return;

        if(!selected){
            selected=hit;
            return;
        }

        const dr=Math.abs(hit.r-selected.r);
        const dc=Math.abs(hit.c-selected.c);

        if((dr===1&&dc===0)||(dr===0&&dc===1)){
            tryMakeMove(selected.r,selected.c,hit.r,hit.c);
            selected=null;
        }else{
            selected=hit;
        }
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function drawGemShape(x,y,size,gem){

        ctx.save();
        ctx.translate(x,y);
        ctx.shadowColor=gem.color;
        ctx.shadowBlur=8;
        ctx.fillStyle=gem.color;

        const r=size*.36;

        if(gem.shape==="circle"){
            ctx.beginPath();
            ctx.arc(0,0,r,0,Math.PI*2);
            ctx.fill();
        }else if(gem.shape==="square"){
            roundRectHub(ctx,-r,-r,r*2,r*2,5);
            ctx.fill();
        }else if(gem.shape==="triangle"){
            ctx.beginPath();
            ctx.moveTo(0,-r);
            ctx.lineTo(r*.9,r*.7);
            ctx.lineTo(-r*.9,r*.7);
            ctx.closePath();
            ctx.fill();
        }else if(gem.shape==="diamond"){
            ctx.beginPath();
            ctx.moveTo(0,-r);
            ctx.lineTo(r,0);
            ctx.lineTo(0,r);
            ctx.lineTo(-r,0);
            ctx.closePath();
            ctx.fill();
        }else if(gem.shape==="hex"){
            ctx.beginPath();
            for(let i=0;i<6;i++){
                const a=Math.PI/3*i-Math.PI/2;
                const px=Math.cos(a)*r, py=Math.sin(a)*r;
                if(i===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
            }
            ctx.closePath();
            ctx.fill();
        }else{
            // star
            ctx.beginPath();
            for(let i=0;i<10;i++){
                const a=Math.PI/5*i-Math.PI/2;
                const rr=i%2===0?r:r*.45;
                const px=Math.cos(a)*rr, py=Math.sin(a)*rr;
                if(i===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
            }
            ctx.closePath();
            ctx.fill();
        }

        ctx.shadowBlur=0;
        ctx.fillStyle="rgba(255,255,255,.35)";
        ctx.beginPath();
        ctx.arc(-r*.3,-r*.3,r*.28,0,Math.PI*2);
        ctx.fill();

        ctx.restore();
    }

    function update(dt){

        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i];
            p.x+=p.vx; p.y+=p.vy; p.vy+=.15; p.life--;
            if(p.life<=0)particles.splice(i,1);
        }

        floatText.update(dt);
    }

    function draw(){

        ctx.save();
        shaker.apply(ctx);

        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#1c1436");
        bg.addColorStop(1,"#08051a");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save();
        ctx.fillStyle="rgba(255,255,255,.04)";
        roundRectHub(ctx,boardX-6,boardY-6,boardPx+12,boardPx+12,10);
        ctx.fill();
        ctx.restore();

        for(let r=0;r<SIZE;r++){
            for(let c=0;c<SIZE;c++){

                const p=cellCenter(r,c);

                if(selected && selected.r===r && selected.c===c){
                    ctx.save();
                    ctx.fillStyle="rgba(255,255,255,.15)";
                    roundRectHub(ctx,boardX+c*cell+2,boardY+r*cell+2,cell-4,cell-4,6);
                    ctx.fill();
                    ctx.restore();
                }

                if(grid[r][c]!==null){
                    drawGemShape(p.x,p.y,cell,GEMS[grid[r][c]]);
                }
            }
        }

        for(const p of particles){
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
            ctx.fillStyle=p.color;
            ctx.beginPath();
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        floatText.draw(ctx);

        ctx.restore();

        ui.innerHTML=
            "💎 JEWEL SWAP<br>Score: "+score+
            " &nbsp; Best: "+best+
            " &nbsp; Moves: "+moves+
            "<br><span style='font-weight:normal;color:#d6c0ff'>Tap two adjacent gems to swap</span>";
    }

    function loop(t){
        animationId=requestAnimationFrame(loop);
        const dt=Math.min((t-lastTime)/1000,.05);
        lastTime=t;
        update(dt);
        draw();
    }

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){
        resize();
    }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
    };

    lastTime=performance.now();
    animationId=requestAnimationFrame(loop);
}


// ============================================================
// TIC TAC TOE
// ============================================================

function startTicTacToe(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="ttt-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"linear-gradient(160deg,#0f172a,#111827)",
        touchAction:"none",userSelect:"none",WebkitTapHighlightColor:"transparent"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="ttt-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(20,30,50,.9),rgba(0,0,0,.7))",
        border:"1px solid rgba(255,255,255,.2)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        boxShadow:"0 8px 24px rgba(0,0,0,.35)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("ttt-back");

    const board=[[null,null,null],[null,null,null],[null,null,null]];
    let current="X";
    let winner=null;
    let moveCount=0;

    function lineWin(a,b,c){
        const p=board[a[0]][a[1]];
        if(p && p===board[b[0]][b[1]] && p===board[c[0]][c[1]]) return p;
        return null;
    }

    function checkWinner(){
        const wins=[
            [[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]],[[0,2],[1,1],[2,0]]
        ];

        for(const w of wins){
            const result=lineWin(w[0],w[1],w[2]);
            if(result){ return result; }
        }
        return null;
    }

    function resetBoard(){
        for(let r=0;r<3;r++){
            for(let c=0;c<3;c++) board[r][c]=null;
        }
        current="X";
        winner=null;
        moveCount=0;
    }

    function cellAt(x,y){
        const size=Math.min(canvas.width,canvas.height)*.72;
        const offsetX=(canvas.width-size)/2;
        const offsetY=(canvas.height-size)/2+30;
        const cell=size/3;

        if(x<offsetX||y<offsetY||x>offsetX+size||y>offsetY+size)return null;

        const row=Math.floor((y-offsetY)/cell);
        const col=Math.floor((x-offsetX)/cell);

        if(row<0||row>2||col<0||col>2)return null;
        return {row,col};
    }

    function pointerDown(e){
        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        if(winner) {
            resetBoard();
            return;
        }

        const pos=cellAt(x,y);
        if(!pos) return;
        const {row,col}=pos;
        if(board[row][col]) return;

        board[row][col]=current;
        moveCount++;

        const result=checkWinner();
        if(result){
            winner=result;
        }else if(moveCount===9){
            winner="draw";
        }else{
            current=current=="X"?"O":"X";
        }
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,"#0f172a");
        bg.addColorStop(1,"#111827");
        ctx.fillStyle=bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        const size=Math.min(canvas.width,canvas.height)*.72;
        const x=(canvas.width-size)/2;
        const y=(canvas.height-size)/2+30;
        const cell=size/3;

        ctx.strokeStyle="rgba(255,255,255,.2)";
        ctx.lineWidth=4;
        for(let i=1;i<3;i++){
            const lineX=x+i*cell;
            const lineY=y+i*cell;
            ctx.beginPath();
            ctx.moveTo(lineX, y);
            ctx.lineTo(lineX, y+size);
            ctx.moveTo(x, lineY);
            ctx.lineTo(x+size, lineY);
            ctx.stroke();
        }

        ctx.font="900 "+(cell*.52)+"px Arial";
        ctx.textAlign="center";
        ctx.textBaseline="middle";

        for(let r=0;r<3;r++){
            for(let c=0;c<3;c++){
                const val=board[r][c];
                if(!val) continue;
                const px=x+c*cell+cell/2;
                const py=y+r*cell+cell/2;
                ctx.fillStyle=val=="X"?"#67e8f9":"#fda4af";
                ctx.fillText(val,px,py+2);
            }
        }

        if(winner){
            ctx.fillStyle="rgba(0,0,0,.65)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="#fff";
            ctx.font="900 42px Arial";
            ctx.textAlign="center";
            ctx.fillText(winner=="draw"?"DRAW!":winner+" WINS!",canvas.width/2,canvas.height/2-20);
            ctx.font="bold 18px Arial";
            ctx.fillStyle="#cfe4ff";
            ctx.fillText("Tap to play again",canvas.width/2,canvas.height/2+22);
        }

        ui.innerHTML = winner==="draw" ? "❌ TIC TAC TOE — DRAW" : winner ? "❌ TIC TAC TOE — "+winner+" wins" : "❌ TIC TAC TOE — Turn: "+current;
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});

    function loop(){
        draw();
        requestAnimationFrame(loop);
    }

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    let animationId=requestAnimationFrame(loop);

    function resizeHandler(){ resize(); }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
    };
}


// ============================================================
// 2 PLAYER DUEL
// ============================================================

function startTwoPlayerDuel(){

    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    canvas.className="duel-canvas";
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();

    Object.assign(canvas.style,{
        position:"fixed",inset:"0",width:"100%",height:"100%",
        zIndex:"100000",background:"linear-gradient(180deg,#090b1a,#100d1e)",
        touchAction:"none",userSelect:"none"
    });
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    ui.className="duel-ui";
    Object.assign(ui.style,{
        position:"fixed",top:"12px",left:"12px",zIndex:"100002",
        color:"#fff",fontFamily:"Arial,sans-serif",
        background:"linear-gradient(145deg,rgba(30,20,45,.88),rgba(0,0,0,.72))",
        border:"1px solid rgba(255,255,255,.25)",borderRadius:"12px",
        padding:"9px 14px",pointerEvents:"none",fontWeight:"bold",fontSize:"15px",
        boxShadow:"0 8px 24px rgba(0,0,0,.35)"
    });
    document.body.appendChild(ui);

    const back=makeBackButton("duel-back");

    const player1={x:90,y:canvas.height/2-28,w:18,h:90,up:false,down:false,color:"#67e8f9",score:0};
    const player2={x:canvas.width-110,y:canvas.height/2-28,w:18,h:90,up:false,down:false,color:"#fda4af",score:0};
    const ball={x:canvas.width/2,y:canvas.height/2,r:10,vx:420,vy:220};

    let animationId;
    let lastTime=performance.now();
    let winner=null;

    function resetBall(direction){
        ball.x=canvas.width/2;
        ball.y=canvas.height/2;
        const angle=(Math.random()*1.4)-0.7;
        ball.vx=(direction||1)*Math.max(380,420+Math.random()*80);
        ball.vy=Math.sin(angle)*320;
    }

    function resetMatch(){
        player1.y=canvas.height/2-45;
        player2.y=canvas.height/2-45;
        player1.score=0;
        player2.score=0;
        winner=null;
        resetBall(Math.random()>0.5?1:-1);
    }

    function keyDown(e){
        if(e.key==="w"||e.key==="W") player1.up=true;
        if(e.key==="s"||e.key==="S") player1.down=true;
        if(e.key==="ArrowUp") player2.up=true;
        if(e.key==="ArrowDown") player2.down=true;
    }

    function keyUp(e){
        if(e.key==="w"||e.key==="W") player1.up=false;
        if(e.key==="s"||e.key==="S") player1.down=false;
        if(e.key==="ArrowUp") player2.up=false;
        if(e.key==="ArrowDown") player2.down=false;
    }

    function update(dt){
        if(winner) return;

        const moveSpeed=440*dt;
        if(player1.up) player1.y-=moveSpeed;
        if(player1.down) player1.y+=moveSpeed;
        if(player2.up) player2.y-=moveSpeed;
        if(player2.down) player2.y+=moveSpeed;

        player1.y=Math.max(20,Math.min(canvas.height-player1.h-20,player1.y));
        player2.y=Math.max(20,Math.min(canvas.height-player2.h-20,player2.y));

        ball.x+=ball.vx*dt;
        ball.y+=ball.vy*dt;

        if(ball.y-ball.r<0 || ball.y+ball.r>canvas.height){
            ball.vy*=-1;
            ball.y=Math.max(ball.r,Math.min(canvas.height-ball.r,ball.y));
        }

        if(ball.x-ball.r<player1.x+player1.w && ball.x-ball.r>player1.x && ball.y>player1.y && ball.y<player1.y+player1.h){
            ball.x=player1.x+player1.w+ball.r;
            ball.vx=Math.abs(ball.vx)+40;
            ball.vy+=(ball.y-(player1.y+player1.h/2))*2.5;
        }

        if(ball.x+ball.r>player2.x && ball.x-ball.r<player2.x+player2.w && ball.y>player2.y && ball.y<player2.y+player2.h){
            ball.x=player2.x-ball.r;
            ball.vx=-(Math.abs(ball.vx)+40);
            ball.vy+=(ball.y-(player2.y+player2.h/2))*2.5;
        }

        if(ball.x < -20){
            player2.score++;
            if(player2.score>=5){ winner="Player 2"; }
            else resetBall(1);
        }

        if(ball.x > canvas.width+20){
            player1.score++;
            if(player1.score>=5){ winner="Player 1"; }
            else resetBall(-1);
        }
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const g=ctx.createLinearGradient(0,0,0,canvas.height);
        g.addColorStop(0,"#080c18");
        g.addColorStop(1,"#150b1d");
        ctx.fillStyle=g;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle="rgba(255,255,255,.15)";
        ctx.lineWidth=3;
        ctx.setLineDash([14,12]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2,0);
        ctx.lineTo(canvas.width/2,canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle=player1.color;
        roundRectHub(ctx,player1.x,player1.y,player1.w,player1.h,8);
        ctx.fill();

        ctx.fillStyle=player2.color;
        roundRectHub(ctx,player2.x,player2.y,player2.w,player2.h,8);
        ctx.fill();

        ctx.fillStyle="#fff";
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
        ctx.fill();

        ctx.textAlign="center";
        ctx.font="900 52px Arial";
        ctx.fillStyle="rgba(255,255,255,.75)";
        ctx.fillText(player1.score,canvas.width/2-90,72);
        ctx.fillText(player2.score,canvas.width/2+90,72);

        if(winner){
            ctx.fillStyle="rgba(0,0,0,.7)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="#fff";
            ctx.font="900 42px Arial";
            ctx.fillText(winner+" WINS!",canvas.width/2,canvas.height/2-20);
            ctx.font="bold 18px Arial";
            ctx.fillStyle="#d9e6ff";
            ctx.fillText("Tap to rematch",canvas.width/2,canvas.height/2+18);
        }

        ui.innerHTML="🕹️ 2P DUEL — First to 5";
    }

    function loop(ts){
        const dt=Math.min((ts-lastTime)/1000,0.03);
        lastTime=ts;
        update(dt);
        draw();
        animationId=requestAnimationFrame(loop);
    }

    function pointerDown(){
        if(winner){
            resetMatch();
        }
    }

    canvas.addEventListener("pointerdown",pointerDown,{passive:false});
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    back.onclick=function(){
        cancelAnimationFrame(animationId);
        showMainMenu();
    };

    function resizeHandler(){ resize(); }
    window.addEventListener("resize",resizeHandler);

    currentCleanup=function(){
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize",resizeHandler);
        window.removeEventListener("keydown",keyDown);
        window.removeEventListener("keyup",keyUp);
        canvas.removeEventListener("pointerdown",pointerDown);
        canvas.remove();
        ui.remove();
        back.remove();
    };

    resetMatch();
    animationId=requestAnimationFrame(loop);
}

// ============================================================
// BRAWL BOX
// ============================================================

function startBrawlBox(){
    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    resize();
    Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",background:"#0f172a",touchAction:"none",userSelect:"none"});
    document.body.appendChild(canvas);

    const back=makeBackButton("brawl-back");
    const ui=document.createElement("div");
    Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(15,23,42,.9)",color:"#fff",padding:"8px 12px",borderRadius:"10px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid rgba(255,255,255,.2)"});
    ui.textContent="⚔️ BRAWL BOX";
    document.body.appendChild(ui);

    const player={x:80,y:canvas.height/2-55,w:18,h:110,up:false,down:false,score:0,color:"#67e8f9"};
    const enemy={x:canvas.width-98,y:canvas.height/2-55,w:18,h:110,up:false,down:false,score:0,color:"#fca5a5"};
    const ball={x:canvas.width/2,y:canvas.height/2,r:12,vx:360,vy:200};
    let animationId,lastTime=performance.now();
    let winner=null;

    function keyDown(e){ if(e.key==="w"||e.key==="W") player.up=true; if(e.key==="s"||e.key==="S") player.down=true; if(e.key==="ArrowUp") enemy.up=true; if(e.key==="ArrowDown") enemy.down=true; }
    function keyUp(e){ if(e.key==="w"||e.key==="W") player.up=false; if(e.key==="s"||e.key==="S") player.down=false; if(e.key==="ArrowUp") enemy.up=false; if(e.key==="ArrowDown") enemy.down=false; }

    function resetBall(dir){ ball.x=canvas.width/2; ball.y=canvas.height/2; ball.vx=(dir||1)*(360+Math.random()*80); ball.vy=(Math.random()*260)-130; }

    function update(dt){
        if(winner) return;
        const move=420*dt;
        if(player.up) player.y-=move; if(player.down) player.y+=move; if(enemy.up) enemy.y-=move; if(enemy.down) enemy.y+=move;
        player.y=Math.max(20,Math.min(canvas.height-player.h-20,player.y));
        enemy.y=Math.max(20,Math.min(canvas.height-enemy.h-20,enemy.y));

        ball.x+=ball.vx*dt; ball.y+=ball.vy*dt;
        if(ball.y-ball.r<0 || ball.y+ball.r>canvas.height){ ball.vy*=-1; }

        if(ball.x-ball.r<player.x+player.w && ball.x-ball.r>player.x && ball.y>player.y && ball.y<player.y+player.h){
            ball.x=player.x+player.w+ball.r; ball.vx=Math.abs(ball.vx)+40; ball.vy=(ball.y-(player.y+player.h/2))*3.2;
        }
        if(ball.x+ball.r>enemy.x && ball.x-ball.r<enemy.x+enemy.w && ball.y>enemy.y && ball.y<enemy.y+enemy.h){
            ball.x=enemy.x-ball.r; ball.vx=-(Math.abs(ball.vx)+40); ball.vy=(ball.y-(enemy.y+enemy.h/2))*3.2;
        }

        if(ball.x < -30){ enemy.score++; if(enemy.score>=5) winner="Player 2"; else resetBall(1); }
        if(ball.x > canvas.width+30){ player.score++; if(player.score>=5) winner="Player 1"; else resetBall(-1); }
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#0b1120"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle="rgba(255,255,255,.18)"; ctx.setLineDash([14,14]); ctx.beginPath(); ctx.moveTo(canvas.width/2,0); ctx.lineTo(canvas.width/2,canvas.height); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle=player.color; roundRectHub(ctx,player.x,player.y,player.w,player.h,8); ctx.fill();
        ctx.fillStyle=enemy.color; roundRectHub(ctx,enemy.x,enemy.y,enemy.w,enemy.h,8); ctx.fill();
        ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
        ctx.font="900 48px Arial"; ctx.textAlign="center"; ctx.fillStyle="rgba(255,255,255,.8)"; ctx.fillText(player.score,canvas.width/2-90,70); ctx.fillText(enemy.score,canvas.width/2+90,70);
        if(winner){ ctx.fillStyle="rgba(0,0,0,.7)"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle="#fff"; ctx.font="900 42px Arial"; ctx.fillText(winner+" WINS!",canvas.width/2,canvas.height/2-20); ctx.font="bold 18px Arial"; ctx.fillText("Tap to play again",canvas.width/2,canvas.height/2+18); }
        ui.textContent="⚔️ BRAWL BOX  —  first to 5";
    }

    function loop(ts){ const dt=Math.min((ts-lastTime)/1000,.03); lastTime=ts; update(dt); draw(); animationId=requestAnimationFrame(loop); }
    canvas.addEventListener("pointerdown",()=>{ if(winner){ winner=null; player.score=0; enemy.score=0; resetBall(Math.random()>0.5?1:-1); } },{passive:true});
    window.addEventListener("keydown",keyDown); window.addEventListener("keyup",keyUp);
    back.onclick=()=>{ cancelAnimationFrame(animationId); showMainMenu(); };
    resetBall(Math.random()>0.5?1:-1); animationId=requestAnimationFrame(loop);
    currentCleanup=()=>{ cancelAnimationFrame(animationId); window.removeEventListener("keydown",keyDown); window.removeEventListener("keyup",keyUp); canvas.remove(); back.remove(); ui.remove(); };
}

// ============================================================
// TARGET BATTLE
// ============================================================

function startTargetBattle(){
    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    resize();
    Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",background:"#160f1f",touchAction:"none",userSelect:"none"});
    document.body.appendChild(canvas);

    const ui=document.createElement("div");
    Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(22,15,31,.9)",color:"#fff",padding:"8px 12px",borderRadius:"10px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid rgba(255,255,255,.2)"});
    ui.textContent="🎯 TARGET BATTLE";
    document.body.appendChild(ui);

    const back=makeBackButton("target-back");
    let score1=0, score2=0, turn=1, winner=null; const targets=[]; let animationId,lastTime=performance.now();

    function spawnTargets(){
        targets.length=0;
        for(let i=0;i<5;i++){
            targets.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:26+Math.random()*20,team:Math.random()>0.5?1:2,color:Math.random()>0.5?"#f8d076":"#7dd3fc"});
        }
    }

    function pointerDown(e){
        if(winner){ winner=null; score1=0; score2=0; turn=1; spawnTargets(); return; }
        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left; const y=e.clientY-rect.top;
        for(const t of targets){
            const d=Math.hypot(x-t.x,y-t.y);
            if(d < t.r){
                if(t.team===turn){
                    if(turn===1) score1++; else score2++;
                    if(score1>=5 || score2>=5) winner=score1>score2 ? "Player 1" : "Player 2";
                    else turn=turn===1?2:1;
                }
                spawnTargets();
                return;
            }
        }
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#160f1f"; ctx.fillRect(0,0,canvas.width,canvas.height);
        for(const t of targets){
            ctx.fillStyle=t.color; ctx.beginPath(); ctx.arc(t.x,t.y,t.r,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle="rgba(255,255,255,.45)"; ctx.beginPath(); ctx.arc(t.x,t.y,t.r*0.55,0,Math.PI*2); ctx.stroke();
        }
        ctx.fillStyle="#fff"; ctx.font="900 44px Arial"; ctx.textAlign="center"; ctx.fillText(score1,canvas.width/2-100,70); ctx.fillText(score2,canvas.width/2+100,70);
        ctx.font="bold 18px Arial"; ctx.fillText("Player "+turn+" turn",canvas.width/2,canvas.height-20);
        if(winner){ ctx.fillStyle="rgba(0,0,0,.7)"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle="#fff"; ctx.font="900 42px Arial"; ctx.fillText(winner+" WINS!",canvas.width/2,canvas.height/2-20); ctx.font="bold 18px Arial"; ctx.fillText("Tap to reset",canvas.width/2,canvas.height/2+20); }
    }

    function loop(ts){ const dt=Math.min((ts-lastTime)/1000,.03); lastTime=ts; draw(); animationId=requestAnimationFrame(loop); }
    canvas.addEventListener("pointerdown",pointerDown,{passive:true});
    back.onclick=()=>{ cancelAnimationFrame(animationId); showMainMenu(); };
    spawnTargets(); animationId=requestAnimationFrame(loop);
    currentCleanup=()=>{ cancelAnimationFrame(animationId); canvas.remove(); back.remove(); ui.remove(); };
}

// ============================================================
// SHIELD RACE
// ============================================================

function startShieldRace(){
    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.touchAction="none";

    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    resize();
    Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",background:"#061b12",touchAction:"none",userSelect:"none"});
    document.body.appendChild(canvas);

    const back=makeBackButton("shield-back");
    const ui=document.createElement("div");
    Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(6,27,18,.9)",color:"#fff",padding:"8px 12px",borderRadius:"10px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid rgba(255,255,255,.2)"});
    ui.textContent="🛡️ SHIELD RACE";
    document.body.appendChild(ui);

    let players=[{x:120,y:canvas.height/2-30,w:18,h:90,color:"#67e8f9",keyUp:"w",keyDown:"s"},{x:canvas.width-138,y:canvas.height/2-30,w:18,h:90,color:"#fda4af",keyUp:"ArrowUp",keyDown:"ArrowDown"}];
    const finishX=canvas.width*0.8; let animationId,lastTime=performance.now();

    function update(dt){
        for(const p of players){
            if((keys[p.keyUp]||false)) p.y-=260*dt; if((keys[p.keyDown]||false)) p.y+=260*dt; p.y=Math.max(20,Math.min(canvas.height-p.h-20,p.y));
            if(p.x < finishX && p.x + p.w > finishX) p.x = finishX - p.w;
        }
        for(const p of players){ p.x += 0; }
        players[0].x += (keys["d"]? 150:0)*dt;
        players[1].x += (keys["ArrowRight"]? 150:0)*dt;
        players[0].x = Math.min(players[0].x, finishX - 20);
        players[1].x = Math.min(players[1].x, finishX - 20);
    }

    let keys={};
    function keyDown(e){ keys[e.key]=true; }
    function keyUp(e){ keys[e.key]=false; }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#061b12"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle="rgba(255,255,255,.2)"; ctx.beginPath(); ctx.moveTo(finishX,0); ctx.lineTo(finishX,canvas.height); ctx.stroke();
        for(const p of players){ ctx.fillStyle=p.color; roundRectHub(ctx,p.x,p.y,p.w,p.h,8); ctx.fill(); }
    }

    function loop(ts){ const dt=Math.min((ts-lastTime)/1000,.03); lastTime=ts; update(dt); draw(); animationId=requestAnimationFrame(loop); }
    window.addEventListener("keydown",keyDown); window.addEventListener("keyup",keyUp);
    back.onclick=()=>{ cancelAnimationFrame(animationId); showMainMenu(); };
    animationId=requestAnimationFrame(loop);
    currentCleanup=()=>{ cancelAnimationFrame(animationId); window.removeEventListener("keydown",keyDown); window.removeEventListener("keyup",keyUp); canvas.remove(); back.remove(); ui.remove(); };
}

// ============================================================
// NEON HOCKEY
// ============================================================

function startNeonHockey(){

    document.body.style.touchAction="none";
    const canvas=document.createElement("canvas"); const ctx=canvas.getContext("2d");
    function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
    resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("hockey-back"); let paused=false;
    const pause=makeArcadePauseButton("hockey-pause",v=>paused=v);
    const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(4,18,35,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #67e8f9"}); document.body.appendChild(ui);
    const keys={}; let p1,p2,puck,score1=0,score2=0,winner=null,animationId,lastTime=performance.now(),trail=[];
    function reset(){p1={x:canvas.width*.25,y:canvas.height/2,r:25,color:"#67e8f9"};p2={x:canvas.width*.75,y:canvas.height/2,r:25,color:"#fb7185"};puck={x:canvas.width/2,y:canvas.height/2,r:13,vx:420*(Math.random()>.5?1:-1),vy:(Math.random()-.5)*260};trail=[];}
    function resetMatch(){score1=0;score2=0;winner=null;reset();} reset();
    function keyDown(e){keys[e.key]=true;} function keyUp(e){keys[e.key]=false;}
    function update(dt){if(winner)return;const speed=420;for(const [p,up,down,left,right,side] of [[p1,"w","s","a","d",0],[p2,"ArrowUp","ArrowDown","ArrowLeft","ArrowRight",1]]){if(keys[up])p.y-=speed*dt;if(keys[down])p.y+=speed*dt;if(keys[left])p.x-=speed*dt;if(keys[right])p.x+=speed*dt;p.x=Math.max(side?canvas.width/2+35:35,Math.min(side?canvas.width-35:canvas.width/2-35,p.x));p.y=Math.max(80,Math.min(canvas.height-45,p.y));}puck.x+=puck.vx*dt;puck.y+=puck.vy*dt;if(puck.y-puck.r<55||puck.y+puck.r>canvas.height-25){puck.vy*=-1;puck.y=Math.max(55+puck.r,Math.min(canvas.height-25-puck.r,puck.y));}for(const p of [p1,p2]){const dx=puck.x-p.x,dy=puck.y-p.y,d=Math.hypot(dx,dy);if(d<p.r+puck.r){const nx=dx/(d||1),ny=dy/(d||1);puck.x=p.x+nx*(p.r+puck.r+2);puck.y=p.y+ny*(p.r+puck.r+2);const speedNow=Math.min(820,Math.hypot(puck.vx,puck.vy)+35);puck.vx=nx*speedNow;puck.vy=ny*speedNow;}}if(puck.x<-30){score2++;if(score2>=5)winner="PLAYER 2";else reset();}if(puck.x>canvas.width+30){score1++;if(score1>=5)winner="PLAYER 1";else reset();}trail.push({x:puck.x,y:puck.y});if(trail.length>18)trail.shift();}
    function draw(){drawGameAtmosphere(ctx,canvas,"#67e8f9",performance.now()*.02);ctx.strokeStyle="rgba(255,255,255,.2)";ctx.lineWidth=3;ctx.strokeRect(25,55,canvas.width-50,canvas.height-80);ctx.beginPath();ctx.moveTo(canvas.width/2,55);ctx.lineTo(canvas.width/2,canvas.height-25);ctx.stroke();ctx.beginPath();ctx.arc(canvas.width/2,canvas.height/2,100,0,Math.PI*2);ctx.stroke();for(const x of [25,canvas.width-45]){ctx.fillStyle="rgba(251,113,133,.18)";ctx.fillRect(x,canvas.height/2-90,20,180);}for(let i=1;i<trail.length;i++){ctx.globalAlpha=i/trail.length*.5;ctx.fillStyle="#e0f2fe";ctx.beginPath();ctx.arc(trail[i].x,trail[i].y,4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;for(const p of [p1,p2]){ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=25;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.7)";ctx.beginPath();ctx.arc(p.x-7,p.y-8,6,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.save();ctx.shadowColor="#fff";ctx.shadowBlur=22;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(puck.x,puck.y,puck.r,0,Math.PI*2);ctx.fill();ctx.restore();ctx.textAlign="center";ctx.font="900 42px Arial";ctx.fillStyle="#67e8f9";ctx.fillText(score1,canvas.width/2-80,48);ctx.fillStyle="#fb7185";ctx.fillText(score2,canvas.width/2+80,48);ui.innerHTML="🏒 NEON HOCKEY<br><small>WASD vs Arrow keys • first to 5</small>";if(winner){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fff";ctx.font="900 48px Arial";ctx.fillText(winner+" WINS!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillText("Tap to rematch",canvas.width/2,canvas.height/2+25);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}function pointerDown(){if(winner)resetMatch();}canvas.addEventListener("pointerdown",pointerDown);window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.removeEventListener("pointerdown",pointerDown);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// COLOR CLASH
// ============================================================

function startColorClash(){

    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("clash-back");let paused=false;const pause=makeArcadePauseButton("clash-pause",v=>paused=v);const ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(28,12,5,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #fb923c"});document.body.appendChild(ui);
    const keys={};let p1,p2,zones,score1=0,score2=0,winner=null,animationId,lastTime=performance.now(),phase=0;
    function reset(){p1={x:canvas.width*.25,y:canvas.height/2,r:20,color:"#67e8f9"};p2={x:canvas.width*.75,y:canvas.height/2,r:20,color:"#fb7185"};zones=[];for(let i=0;i<7;i++)zones.push({x:canvas.width*.18+Math.random()*canvas.width*.64,y:100+Math.random()*(canvas.height-180),r:27,owner:0,flash:0});}reset();
    function keyDown(e){keys[e.key]=true;}function keyUp(e){keys[e.key]=false;}
    function update(dt){if(winner)return;phase+=dt;for(const [p,up,down,left,right] of [[p1,"w","s","a","d"],[p2,"ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]]){if(keys[up])p.y-=300*dt;if(keys[down])p.y+=300*dt;if(keys[left])p.x-=300*dt;if(keys[right])p.x+=300*dt;p.x=Math.max(25,Math.min(canvas.width-25,p.x));p.y=Math.max(75,Math.min(canvas.height-35,p.y));for(const z of zones)if(Math.hypot(p.x-z.x,p.y-z.y)<p.r+z.r*.7&&z.owner!==(p===p1?1:2)){z.owner=p===p1?1:2;z.flash=1;if(z.owner===1)score1++;else score2++;if(score1>=5||score2>=5)winner=score1>score2?"PLAYER 1":"PLAYER 2";}}for(const z of zones)z.flash=Math.max(0,z.flash-dt*2);}
    function draw(){drawGameAtmosphere(ctx,canvas,"#fb923c",phase*25);ctx.fillStyle="rgba(251,146,60,.08)";ctx.fillRect(30,65,canvas.width-60,canvas.height-100);for(const z of zones){ctx.save();ctx.shadowColor=z.owner===1?"#67e8f9":z.owner===2?"#fb7185":"#fbbf24";ctx.shadowBlur=22+z.flash*18;ctx.fillStyle=z.owner===1?"#155e75":z.owner===2?"#9f1239":"#92400e";ctx.beginPath();ctx.arc(z.x,z.y,z.r+Math.sin(phase*4+z.x)*3,0,Math.PI*2);ctx.fill();ctx.strokeStyle=z.owner===1?"#67e8f9":z.owner===2?"#fb7185":"#fbbf24";ctx.lineWidth=4;ctx.stroke();ctx.restore();}for(const p of [p1,p2]){ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=25;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(p.x-6,p.y-7,5,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.textAlign="center";ctx.font="900 38px Arial";ctx.fillStyle="#67e8f9";ctx.fillText(score1,canvas.width/2-80,55);ctx.fillStyle="#fb7185";ctx.fillText(score2,canvas.width/2+80,55);ui.innerHTML="🎨 COLOR CLASH<br><small>Capture five glowing zones</small>";if(winner){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fff";ctx.font="900 48px Arial";ctx.fillText(winner+" WINS!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillText("Tap to rematch",canvas.width/2,canvas.height/2+25);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}function pointerDown(){if(winner){score1=0;score2=0;winner=null;reset();}}canvas.addEventListener("pointerdown",pointerDown);window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.removeEventListener("pointerdown",pointerDown);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// ROCKET TAG
// ============================================================

function startRocketTag(){

    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("rocket-back");let paused=false;const pause=makeArcadePauseButton("rocket-pause",v=>paused=v);const ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(32,8,26,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #ec4899"});document.body.appendChild(ui);
    const keys={};let p1,p2,chaser=1,score1=0,score2=0,winner=null,animationId,lastTime=performance.now(),phase=0,burst=[],dashTrails=[];
    function resetPositions(){p1={x:canvas.width*.25,y:canvas.height/2,r:22,color:"#67e8f9",vx:0,vy:0,dashCooldown:0,dashTime:0,dashHeld:false};p2={x:canvas.width*.75,y:canvas.height/2,r:22,color:"#fb7185",vx:0,vy:0,dashCooldown:0,dashTime:0,dashHeld:false};burst=[];dashTrails=[];}resetPositions();
    function keyDown(e){keys[e.key]=true;}function keyUp(e){keys[e.key]=false;}
    function update(dt){if(winner)return;phase+=dt;for(const [p,up,down,left,right,dash] of [[p1,"w","s","a","d"," "],[p2,"ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"]]){let dx=(keys[right]?1:0)-(keys[left]?1:0),dy=(keys[down]?1:0)-(keys[up]?1:0);p.dashCooldown=Math.max(0,p.dashCooldown-dt);p.dashTime=Math.max(0,p.dashTime-dt);if(!keys[dash])p.dashHeld=false;if(keys[dash]&&!p.dashHeld&&p.dashCooldown<=0){p.dashHeld=true;p.dashCooldown=2.4;p.dashTime=.22;const length=Math.hypot(dx,dy)||1;p.vx=(dx||((chaser===1?p1:p2)===p?1:-1))/length;p.vy=(dy||0)/length;}const speed=p.dashTime>0?920:300;p.x+=((p.dashTime>0?p.vx:dx)||0)*speed*dt;p.y+=((p.dashTime>0?p.vy:dy)||0)*speed*dt;if(p.dashTime>0)dashTrails.push({x:p.x,y:p.y,color:p.color,life:1});p.x=Math.max(35,Math.min(canvas.width-35,p.x));p.y=Math.max(85,Math.min(canvas.height-35,p.y));}const a=chaser===1?p1:p2,b=chaser===1?p2:p1;if(Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r){if(chaser===1)score1++;else score2++;burst.push({x:b.x,y:b.y,life:1});if(score1>=5||score2>=5)winner=score1>score2?"PLAYER 1":"PLAYER 2";else{chaser=chaser===1?2:1;resetPositions();}}for(let i=burst.length-1;i>=0;i--){burst[i].life-=dt*2;if(burst[i].life<=0)burst.splice(i,1);}for(let i=dashTrails.length-1;i>=0;i--){dashTrails[i].life-=dt*3;if(dashTrails[i].life<=0)dashTrails.splice(i,1);}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#ec4899",phase*25);ctx.strokeStyle="rgba(236,72,153,.3)";ctx.lineWidth=3;ctx.strokeRect(35,75,canvas.width-70,canvas.height-110);for(let i=0;i<6;i++){const x=(i+1)*canvas.width/7,y=120+Math.sin(phase*2+i)*40;ctx.fillStyle="rgba(236,72,153,.16)";ctx.beginPath();ctx.arc(x,y,28,0,Math.PI*2);ctx.fill();}for(const trail of dashTrails){ctx.globalAlpha=trail.life*.45;ctx.fillStyle=trail.color;ctx.beginPath();ctx.arc(trail.x,trail.y,30*trail.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;for(const p of [p1,p2]){ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=p.dashTime>0?45:28;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r+(p.dashTime>0?5:0),0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(p.x-7,p.y-8,5,0,Math.PI*2);ctx.fill();ctx.restore();}const hunter=chaser===1?p1:p2;ctx.strokeStyle=hunter.color;ctx.globalAlpha=.35;ctx.lineWidth=5;ctx.beginPath();ctx.arc(hunter.x,hunter.y,hunter.r+12+Math.sin(phase*8)*4,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;for(const b of burst){ctx.globalAlpha=b.life;ctx.strokeStyle="#fff";ctx.lineWidth=4;ctx.beginPath();ctx.arc(b.x,b.y,60*(1-b.life),0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;ctx.textAlign="center";ctx.font="900 38px Arial";ctx.fillStyle="#67e8f9";ctx.fillText(score1,canvas.width/2-80,58);ctx.fillStyle="#fb7185";ctx.fillText(score2,canvas.width/2+80,58);ui.innerHTML="🚀 ROCKET TAG<br><small>"+(chaser===1?"Player 1":"Player 2")+" chases • P1 Dash: Space | P2 Dash: Enter<br>"+(p1.dashCooldown<=0?"P1 READY":"P1 "+p1.dashCooldown.toFixed(1)+"s")+" • "+(p2.dashCooldown<=0?"P2 READY":"P2 "+p2.dashCooldown.toFixed(1)+"s")+"</small>";if(winner){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fff";ctx.font="900 48px Arial";ctx.fillText(winner+" WINS!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillText("Tap to rematch",canvas.width/2,canvas.height/2+25);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}function pointerDown(){if(winner){score1=0;score2=0;winner=null;chaser=1;resetPositions();}}canvas.addEventListener("pointerdown",pointerDown);window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.removeEventListener("pointerdown",pointerDown);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// PULSE TAP
// ============================================================

function startPulseTap(){
    document.body.style.touchAction="none";
    const canvas=document.createElement("canvas"); const ctx=canvas.getContext("2d");
    function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
    resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("pulse-back");
    const pause=makeArcadePauseButton("pulse-pause",value=>paused=value);
    const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(5,17,31,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #38bdf8"}); document.body.appendChild(ui);
    let paused=false,dead=false,score=0,combo=0,misses=0,phase=0,animationId,lastTime=performance.now(),target={x:0,y:0,r:40},ripples=[];
    function nextTarget(){target.x=canvas.width*.14+Math.random()*canvas.width*.72;target.y=canvas.height*.2+Math.random()*canvas.height*.62;target.r=Math.max(24,42-score*.35);ripples.push({x:target.x,y:target.y,r:target.r+12,life:1});}
    nextTarget();
    function pointerDown(e){if(paused)return;if(dead){dead=false;score=0;combo=0;misses=0;nextTarget();return;}const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(Math.hypot(x-target.x,y-target.y)<target.r){score++;combo++;ripples.push({x,y,r:target.r,life:1});nextTarget();}else{combo=0;misses++;if(misses>=5)dead=true;}}
    function draw(){
        phase+=.06; drawGameAtmosphere(ctx,canvas,"#38bdf8",phase*30);
        for(let i=ripples.length-1;i>=0;i--){const p=ripples[i];p.r+=3;p.life-=.035;if(p.life<=0)ripples.splice(i,1);else{ctx.globalAlpha=p.life;ctx.strokeStyle="#7dd3fc";ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.stroke();}} ctx.globalAlpha=1;
        const pulse=target.r+Math.sin(phase*4)*4;ctx.save();ctx.shadowColor="#38bdf8";ctx.shadowBlur=34;const g=ctx.createRadialGradient(target.x-8,target.y-10,2,target.x,target.y,pulse);g.addColorStop(0,"#fff");g.addColorStop(.3,"#a5f3fc");g.addColorStop(1,"#0284c7");ctx.fillStyle=g;ctx.beginPath();ctx.arc(target.x,target.y,pulse,0,Math.PI*2);ctx.fill();ctx.restore();
        ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 38px Arial";ctx.shadowColor="#38bdf8";ctx.shadowBlur=14;ctx.fillText(score,canvas.width/2,72);ctx.shadowBlur=0;ctx.font="bold 15px Arial";ctx.fillStyle="#bae6fd";ctx.fillText("COMBO "+combo+"  •  MISSES "+misses,canvas.width/2,98);ui.innerHTML="⚡ PULSE TAP<br><small>Hit the pulse before it shrinks</small>";if(dead){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#67e8f9";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+28);}
    }
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.05);lastTime=ts;if(!paused)draw();animationId=requestAnimationFrame(loop);}
    canvas.addEventListener("pointerdown",pointerDown,{passive:true}); back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();}; currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.remove();back.remove();pause.remove();ui.remove();}; animationId=requestAnimationFrame(loop);
}

// ============================================================
// ORBIT DODGE
// ============================================================

function startOrbitDodge(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);
    const back=makeBackButton("orbit-back"),pause=makeArcadePauseButton("orbit-pause",v=>paused=v),ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(13,8,30,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #a78bfa"});document.body.appendChild(ui);
    let paused=false,dead=false,score=0,phase=0,animationId,lastTime=performance.now(),keys={},player={x:innerWidth/2,y:innerHeight/2,r:18},trail=[],orbs=[];
    function spawn(){const a=Math.random()*Math.PI*2,d=180+Math.random()*Math.min(canvas.width,canvas.height)*.35;orbs.push({a,d,r:13+Math.random()*12,s:.4+Math.random()*.9});}for(let i=0;i<9;i++)spawn();
    function keyDown(e){keys[e.key]=true;}function keyUp(e){keys[e.key]=false;}
    function update(dt){if(dead)return;if(keys.ArrowLeft||keys.a)player.x-=300*dt;if(keys.ArrowRight||keys.d)player.x+=300*dt;if(keys.ArrowUp||keys.w)player.y-=300*dt;if(keys.ArrowDown||keys.s)player.y+=300*dt;player.x=Math.max(30,Math.min(canvas.width-30,player.x));player.y=Math.max(30,Math.min(canvas.height-30,player.y));phase+=dt;score+=dt*10;trail.push({x:player.x,y:player.y});if(trail.length>28)trail.shift();for(const o of orbs){o.a+=o.s*dt;const x=canvas.width/2+Math.cos(o.a)*o.d,y=canvas.height/2+Math.sin(o.a)*o.d*.62;if(Math.hypot(player.x-x,player.y-y)<player.r+o.r)dead=true;}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#a78bfa",phase*35);ctx.strokeStyle="rgba(167,139,250,.22)";ctx.lineWidth=2;for(const scale of [.22,.36,.5]){ctx.beginPath();ctx.ellipse(canvas.width/2,canvas.height/2,canvas.width*scale,canvas.height*scale*.62,0,0,Math.PI*2);ctx.stroke();}for(let i=1;i<trail.length;i++){ctx.globalAlpha=i/trail.length*.55;ctx.strokeStyle="#c4b5fd";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(trail[i-1].x,trail[i-1].y);ctx.lineTo(trail[i].x,trail[i].y);ctx.stroke();}ctx.globalAlpha=1;for(const o of orbs){const x=canvas.width/2+Math.cos(o.a)*o.d,y=canvas.height/2+Math.sin(o.a)*o.d*.62;ctx.save();ctx.shadowColor="#fb7185";ctx.shadowBlur=22;ctx.fillStyle="#fb7185";ctx.beginPath();ctx.arc(x,y,o.r+Math.sin(phase*5+o.a)*3,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.save();ctx.shadowColor="#a78bfa";ctx.shadowBlur=28;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(player.x,player.y,18,0,Math.PI*2);ctx.fill();ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,72);ui.innerHTML="🛰️ ORBIT DODGE<br><small>Move through the orbital lanes</small>";if(dead){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fda4af";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Use the menu to try again",canvas.width/2,canvas.height/2+28);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// GRID FLIP
// ============================================================

function startGridFlip(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("grid-back"),pause=makeArcadePauseButton("grid-pause",v=>paused=v),ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(20,12,4,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #f59e0b"});document.body.appendChild(ui);
    const size=4;let board=[],moves=0,won=false,paused=false,phase=0,animationId;function reset(){board=[];moves=0;won=false;for(let r=0;r<size;r++){board[r]=[];for(let c=0;c<size;c++)board[r][c]=Math.random()>.5;}}reset();function flip(r,c){if(r<0||c<0||r>=size||c>=size)return;board[r][c]=!board[r][c];}function handleClick(e){if(paused||won)return;const cell=Math.min(canvas.width,canvas.height)*.16,ox=(canvas.width-cell*size)/2,oy=(canvas.height-cell*size)/2,r=Math.floor((e.clientY-oy)/cell),c=Math.floor((e.clientX-ox)/cell);if(r<0||c<0||r>=size||c>=size)return;flip(r,c);flip(r-1,c);flip(r+1,c);flip(r,c-1);flip(r,c+1);moves++;won=board.every(row=>row.every(v=>!v));}
    function draw(){phase+=.03;drawGameAtmosphere(ctx,canvas,"#f59e0b",phase*30);const cell=Math.min(canvas.width,canvas.height)*.16,ox=(canvas.width-cell*size)/2,oy=(canvas.height-cell*size)/2;for(let r=0;r<size;r++)for(let c=0;c<size;c++){const x=ox+c*cell,y=oy+r*cell;ctx.save();ctx.shadowColor=board[r][c]?"#f59e0b":"#334155";ctx.shadowBlur=board[r][c]?28:8;const g=ctx.createLinearGradient(x,y,x,y+cell);g.addColorStop(0,board[r][c]?"#fde68a":"#334155");g.addColorStop(1,board[r][c]?"#d97706":"#111827");ctx.fillStyle=g;roundRectHub(ctx,x+5,y+5,cell-10,cell-10,16);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.3)";ctx.stroke();if(board[r][c]){ctx.fillStyle="#fff7ed";ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(x+cell*.5,y+cell*.5,cell*.12,0,Math.PI*2);ctx.fill();}ctx.restore();}ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 32px Arial";ctx.fillText("MOVES "+moves,canvas.width/2,72);ui.innerHTML="🎲 GRID FLIP<br><small>Turn every light off</small>";if(won){ctx.fillStyle="rgba(0,0,0,.65)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fde68a";ctx.font="900 44px Arial";ctx.fillText("GRID CLEARED",canvas.width/2,canvas.height/2);}}
    function loop(){if(!paused)draw();animationId=requestAnimationFrame(loop);}canvas.addEventListener("pointerdown",handleClick,{passive:true});back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// STAR DASH
// ============================================================

function startStarDash(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("dash-back"),pause=makeArcadePauseButton("dash-pause",v=>paused=v),ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(9,9,32,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #f472b6"});document.body.appendChild(ui);
    let x=canvas.width*.22,y=canvas.height/2,score=0,phase=0,dead=false,paused=false,animationId,lastTime=performance.now(),keys={},stars=[],meteors=[],trail=[];function keyDown(e){keys[e.key]=true;}function keyUp(e){keys[e.key]=false;}function spawnStar(){stars.push({x:canvas.width+30,y:60+Math.random()*(canvas.height-120),r:10+Math.random()*7});}function spawnMeteor(){meteors.push({x:canvas.width+50,y:50+Math.random()*(canvas.height-100),r:15+Math.random()*20,vx:220+Math.random()*130});}for(let i=0;i<4;i++)spawnStar();
    function update(dt){if(dead)return;if(keys.ArrowUp||keys.w)y-=300*dt;if(keys.ArrowDown||keys.s)y+=300*dt;if(keys.ArrowLeft||keys.a)x-=220*dt;if(keys.ArrowRight||keys.d)x+=220*dt;x=Math.max(24,Math.min(canvas.width-24,x));y=Math.max(35,Math.min(canvas.height-35,y));phase+=dt;score+=dt*4;trail.push({x,y});if(trail.length>22)trail.shift();for(let i=stars.length-1;i>=0;i--){stars[i].x-=260*dt;if(Math.hypot(stars[i].x-x,stars[i].y-y)<stars[i].r+18){score+=100;stars.splice(i,1);}else if(stars[i].x<-40)stars.splice(i,1);}for(let i=meteors.length-1;i>=0;i--){meteors[i].x-=meteors[i].vx*dt;meteors[i].y+=Math.sin(phase+i)*.8;if(Math.hypot(meteors[i].x-x,meteors[i].y-y)<meteors[i].r+16){dead=true;}else if(meteors[i].x<-60)meteors.splice(i,1);}if(Math.random()<dt*.8)spawnStar();if(Math.random()<dt*.5)spawnMeteor();}
    function draw(){drawGameAtmosphere(ctx,canvas,"#f472b6",phase*30);for(let i=1;i<trail.length;i++){ctx.globalAlpha=i/trail.length*.5;ctx.strokeStyle="#f9a8d4";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(trail[i-1].x,trail[i-1].y);ctx.lineTo(trail[i].x,trail[i].y);ctx.stroke();}ctx.globalAlpha=1;for(const s of stars){ctx.save();ctx.shadowColor="#fde68a";ctx.shadowBlur=20;ctx.fillStyle="#fde68a";ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?s.r:s.r*.42;const px=s.x+Math.cos(a)*r,py=s.y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.restore();}for(const m of meteors){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(-.5);ctx.shadowColor="#fb7185";ctx.shadowBlur=18;ctx.fillStyle="#fb7185";ctx.beginPath();ctx.moveTo(m.r,0);ctx.lineTo(-m.r*.7,-m.r*.65);ctx.lineTo(-m.r,-m.r*.1);ctx.lineTo(-m.r*.5,m.r*.8);ctx.closePath();ctx.fill();ctx.restore();}ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(phase*4)*.08);ctx.shadowColor="#f472b6";ctx.shadowBlur=28;ctx.fillStyle="#f9a8d4";ctx.beginPath();ctx.moveTo(28,0);ctx.lineTo(-18,-14);ctx.lineTo(-9,0);ctx.lineTo(-18,14);ctx.closePath();ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(3,0,4,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.textAlign="center";ctx.fillText(Math.floor(score),canvas.width/2,72);ui.innerHTML="🌠 STAR DASH<br><small>Collect stars. Dodge meteors.</small>";if(dead){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#f9a8d4";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Use the menu to try again",canvas.width/2,canvas.height/2+28);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// BEAT POP
// ============================================================

function startBeatPop(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("beat-back"),pause=makeArcadePauseButton("beat-pause",v=>paused=v),ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(7,24,25,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #34d399"});document.body.appendChild(ui);
    let paused=false,score=0,combo=0,phase=0,beat=0,animationId,lastTime=performance.now(),notes=[],bursts=[];const lanes=4;function spawn(){notes.push({lane:Math.floor(Math.random()*lanes),y:-30,hit:false});}for(let i=0;i<4;i++)spawn();function pointerDown(e){if(paused)return;const x=e.clientX/(canvas.width/lanes),y=e.clientY;if(y>canvas.height*.7){let best=-1,dist=999;for(let i=0;i<notes.length;i++)if(notes[i].lane===Math.floor(x)&&Math.abs(notes[i].y-canvas.height*.76)<70&&Math.abs(notes[i].y-canvas.height*.76)<dist){best=i;dist=Math.abs(notes[i].y-canvas.height*.76);}if(best>=0){notes.splice(best,1);score+=10+combo*2;combo++;bursts.push({x:(Math.floor(x)+.5)*canvas.width/lanes,y:canvas.height*.76,r:20,life:1});}else combo=0;}}
    function update(dt){phase+=dt;beat+=dt;for(const n of notes)n.y+=260*dt;for(let i=notes.length-1;i>=0;i--)if(notes[i].y>canvas.height+40){notes.splice(i,1);combo=0;}if(beat>.55){beat=0;spawn();}for(let i=bursts.length-1;i>=0;i--){bursts[i].r+=5;bursts[i].life-=dt*2;if(bursts[i].life<=0)bursts.splice(i,1);}score+=dt*.5;}
    function draw(){drawGameAtmosphere(ctx,canvas,"#34d399",phase*30);const laneW=canvas.width/lanes;ctx.fillStyle="rgba(52,211,153,.08)";ctx.fillRect(0,canvas.height*.7,canvas.width,canvas.height*.18);for(let i=1;i<lanes;i++){ctx.strokeStyle="rgba(255,255,255,.12)";ctx.beginPath();ctx.moveTo(i*laneW,0);ctx.lineTo(i*laneW,canvas.height);ctx.stroke();}ctx.strokeStyle="#a7f3d0";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,canvas.height*.76);ctx.lineTo(canvas.width,canvas.height*.76);ctx.stroke();for(const n of notes){const x=(n.lane+.5)*laneW;ctx.save();ctx.shadowColor="#34d399";ctx.shadowBlur=24;ctx.fillStyle=n.lane%2?"#6ee7b7":"#34d399";ctx.beginPath();ctx.arc(x,n.y,22+Math.sin(phase*8+n.lane)*3,0,Math.PI*2);ctx.fill();ctx.restore();}for(const b of bursts){ctx.globalAlpha=b.life;ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,72);ctx.font="bold 16px Arial";ctx.fillStyle="#a7f3d0";ctx.fillText("COMBO "+combo,canvas.width/2,98);ui.innerHTML="🎵 BEAT POP<br><small>Tap notes on the beat line</small>";}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}canvas.addEventListener("pointerdown",pointerDown,{passive:true});back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// FLARE RUN
// ============================================================

function startFlareRun(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("flare-back"),pause=makeArcadePauseButton("flare-pause",v=>paused=v),ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(38,9,11,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #fb7185"});document.body.appendChild(ui);
    let paused=false,dead=false,score=0,phase=0,animationId,lastTime=performance.now(),keys={},player={x:130,y:canvas.height-150,vy:0,onGround:true,jumpCount:0},obstacles=[],sparks=[];function resetRun(){dead=false;score=0;phase=0;player={x:130,y:canvas.height-150,vy:0,onGround:true,jumpCount:0};obstacles=[];sparks=[];}function jump(){if(paused)return;if(dead){resetRun();return;}if(player.jumpCount<2){player.vy=-620;player.onGround=false;player.jumpCount++;}}function keyDown(e){keys[e.key]=true;if((e.key===" "||e.key==="ArrowUp"||e.key==="w")&&!e.repeat)jump();}function keyUp(e){keys[e.key]=false;}function spawn(){const h=42+Math.random()*62;obstacles.push({x:canvas.width+40,y:canvas.height-100-h,w:28+Math.random()*28,h});}function update(dt){if(dead)return;phase+=dt;player.vy+=1500*dt;player.y+=player.vy*dt;const ground=canvas.height-100;if(player.y>=ground){player.y=ground;player.vy=0;player.onGround=true;player.jumpCount=0;}for(let i=obstacles.length-1;i>=0;i--){const o=obstacles[i];o.x-=300*dt;if(o.x+o.w<0){obstacles.splice(i,1);score+=25;}else if(player.x+18>o.x&&player.x-18<o.x+o.w&&player.y-24<o.y+o.h&&player.y+4>o.y){dead=true;for(let j=0;j<16;j++)sparks.push({x:player.x,y:player.y,vx:(Math.random()-.5)*180,vy:-Math.random()*220,life:1});}}score+=dt*8;if(Math.random()<dt*.9)spawn();for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=500*dt;s.life-=dt*2;if(s.life<=0)sparks.splice(i,1);}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#fb7185",phase*30);const ground=canvas.height-100;ctx.fillStyle="rgba(251,113,133,.12)";ctx.fillRect(0,ground,canvas.width,100);ctx.strokeStyle="#fb7185";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,ground);ctx.lineTo(canvas.width,ground);ctx.stroke();for(const o of obstacles){ctx.save();ctx.shadowColor="#fbbf24";ctx.shadowBlur=24;const g=ctx.createLinearGradient(o.x,o.y,o.x+o.w,o.y+o.h);g.addColorStop(0,"#fff7ae");g.addColorStop(.4,"#fb923c");g.addColorStop(1,"#dc2626");ctx.fillStyle=g;roundRectHub(ctx,o.x,o.y,o.w,o.h,8);ctx.fill();ctx.restore();}for(const s of sparks){ctx.globalAlpha=s.life;ctx.fillStyle="#fef08a";ctx.fillRect(s.x,s.y,4,4);}ctx.globalAlpha=1;ctx.save();ctx.translate(player.x,player.y);ctx.shadowColor="#fb7185";ctx.shadowBlur=28;ctx.fillStyle="#f9a8d4";ctx.beginPath();ctx.arc(0,-18,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(-6,-22,4,0,Math.PI*2);ctx.arc(6,-22,4,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.textAlign="center";ctx.fillText(Math.floor(score),canvas.width/2,72);ui.innerHTML="🔥 FLARE RUN<br><small>Tap / Space / Up to double jump</small>";if(dead){ctx.fillStyle="rgba(0,0,0,.78)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fb7185";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-20);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Tap to replay",canvas.width/2,canvas.height/2+28);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);canvas.addEventListener("pointerdown",()=>{jump();},{passive:true});back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};animationId=requestAnimationFrame(loop);
}

// ============================================================
// NEON DRIFT
// ============================================================

function startNeonDrift(){
    document.body.style.touchAction="none";
    const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
    function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
    resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("drift-back"); let paused=false,dead=false,won=false,score=0,distance=0,lane=1,phase=0,animationId,lastTime=performance.now(),keys={},cars=[],boosts=[];
    const pause=makeArcadePauseButton("drift-pause",v=>paused=v);
    const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",color:"#fff",background:"rgba(3,12,28,.88)",border:"1px solid #22d3ee",borderRadius:"12px",padding:"10px 14px",fontFamily:"Arial,sans-serif",fontWeight:"bold"}); document.body.appendChild(ui);
    function reset(){dead=false;won=false;score=0;distance=0;lane=1;phase=0;cars=[];boosts=[];}
    function laneX(value){return canvas.width/2+(value-1)*Math.min(150,canvas.width*.22);}
    function keyDown(e){keys[e.key]=true;if(e.key==="ArrowLeft"||e.key==="a")lane=Math.max(0,lane-1);if(e.key==="ArrowRight"||e.key==="d")lane=Math.min(2,lane+1);}
    function keyUp(e){keys[e.key]=false;}
    function pointerDown(e){if(dead||won){reset();return;}lane=e.clientX<canvas.width/2?Math.max(0,lane-1):Math.min(2,lane+1);}
    canvas.addEventListener("pointerdown",pointerDown);window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);
    function update(dt){if(dead||won)return;phase+=dt;distance+=dt*120;score+=dt*3;if(distance>=1200)won=true;if(Math.random()<dt*.9)cars.push({lane:Math.floor(Math.random()*3),y:-80,h:70,color:["#fb7185","#fbbf24","#c084fc"][Math.floor(Math.random()*3)]});if(Math.random()<dt*.35)boosts.push({lane:Math.floor(Math.random()*3),y:-30});for(let i=cars.length-1;i>=0;i--){const c=cars[i];c.y+=320*dt;if(c.lane===lane&&c.y>canvas.height-180&&c.y<canvas.height-70)dead=true;if(c.y>canvas.height+100)cars.splice(i,1);}for(let i=boosts.length-1;i>=0;i--){const b=boosts[i];b.y+=300*dt;if(b.lane===lane&&b.y>canvas.height-180&&b.y<canvas.height-70){score+=50;boosts.splice(i,1);}else if(b.y>canvas.height+40)boosts.splice(i,1);}}
    function draw(){const bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,"#08142e");bg.addColorStop(1,"#12051f");ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="rgba(34,211,238,.1)";ctx.fillRect(canvas.width*.18,0,canvas.width*.64,canvas.height);for(let i=0;i<12;i++){const y=(i*90+phase*180)%canvas.height;ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(canvas.width*.32,y,4,32);ctx.fillRect(canvas.width*.66,y,4,32);}ctx.strokeStyle="#22d3ee";ctx.lineWidth=4;ctx.strokeRect(canvas.width*.18,0,canvas.width*.64,canvas.height);for(const b of boosts){ctx.save();ctx.shadowColor="#a3e635";ctx.shadowBlur=20;ctx.fillStyle="#a3e635";ctx.beginPath();ctx.arc(laneX(b.lane),b.y,14+Math.sin(phase*8)*3,0,Math.PI*2);ctx.fill();ctx.restore();}for(const c of cars){const x=laneX(c.lane);ctx.save();ctx.shadowColor=c.color;ctx.shadowBlur=18;ctx.fillStyle=c.color;roundRectHub(ctx,x-28,c.y,56,c.h,12);ctx.fill();ctx.fillStyle="rgba(255,255,255,.65)";ctx.fillRect(x-18,c.y+12,36,12);ctx.fillStyle="#111827";ctx.fillRect(x-22,c.y+c.h-10,12,8);ctx.fillRect(x+10,c.y+c.h-10,12,8);ctx.restore();}const px=laneX(lane);ctx.save();ctx.shadowColor="#67e8f9";ctx.shadowBlur=28;ctx.fillStyle="#67e8f9";ctx.beginPath();ctx.moveTo(px,canvas.height-170);ctx.lineTo(px-30,canvas.height-80);ctx.lineTo(px+30,canvas.height-80);ctx.closePath();ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(px-12,canvas.height-125,24,26);ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,58);ui.innerHTML="🏎️ NEON DRIFT<br><small>Arrow keys / tap sides • Finish the circuit</small>";if(dead||won){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=won?"#a3e635":"#fb7185";ctx.font="900 46px Arial";ctx.fillText(won?"CIRCUIT CLEARED":"WRECKED",canvas.width/2,canvas.height/2-18);ctx.fillStyle="#fff";ctx.font="bold 18px Arial";ctx.fillText("Tap to replay",canvas.width/2,canvas.height/2+24);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};reset();animationId=requestAnimationFrame(loop);
}

// ============================================================
// CRYSTAL HUNT
// ============================================================

function startCrystalHunt(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("crystal-back");let paused=false,dead=false,won=false,score=0,phase=0,animationId,lastTime=performance.now(),keys={},crystals=[],drones=[],player={x:innerWidth/2,y:innerHeight/2,r:18};const pause=makeArcadePauseButton("crystal-pause",v=>paused=v);const ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",color:"#fff",background:"rgba(15,30,8,.88)",border:"1px solid #a3e635",borderRadius:"12px",padding:"10px 14px",fontFamily:"Arial,sans-serif",fontWeight:"bold"});document.body.appendChild(ui);
    function reset(){dead=false;won=false;score=0;player.x=canvas.width/2;player.y=canvas.height/2;crystals=[];drones=[];for(let i=0;i<12;i++)crystals.push({x:50+Math.random()*(canvas.width-100),y:100+Math.random()*(canvas.height-180),r:12,spin:Math.random()*6});for(let i=0;i<3;i++)drones.push({x:80+Math.random()*(canvas.width-160),y:120+Math.random()*(canvas.height-220),r:17});}
    function keyDown(e){keys[e.key]=true;}function keyUp(e){keys[e.key]=false;}function pointerDown(){if(dead||won)reset();}
    canvas.addEventListener("pointerdown",pointerDown);window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);
    function update(dt){if(dead||won)return;phase+=dt;const dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);player.x=Math.max(30,Math.min(canvas.width-30,player.x+dx*280*dt));player.y=Math.max(80,Math.min(canvas.height-35,player.y+dy*280*dt));for(let i=crystals.length-1;i>=0;i--)if(Math.hypot(player.x-crystals[i].x,player.y-crystals[i].y)<player.r+crystals[i].r){crystals.splice(i,1);score++;}if(!crystals.length)won=true;for(const d of drones){const angle=Math.atan2(player.y-d.y,player.x-d.x);d.x+=Math.cos(angle)*70*dt;d.y+=Math.sin(angle)*70*dt;if(Math.hypot(player.x-d.x,player.y-d.y)<player.r+d.r)dead=true;}}
    function draw(){const bg=ctx.createRadialGradient(canvas.width*.5,canvas.height*.45,20,canvas.width*.5,canvas.height*.5,canvas.width*.7);bg.addColorStop(0,"#254510");bg.addColorStop(1,"#07120b");ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle="rgba(163,230,53,.13)";for(let x=0;x<canvas.width;x+=48){ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(x,canvas.height);ctx.stroke();}for(let y=70;y<canvas.height;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}for(const c of crystals){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(phase*2+c.spin);ctx.shadowColor="#bef264";ctx.shadowBlur=22;ctx.fillStyle="#a3e635";ctx.beginPath();ctx.moveTo(0,-c.r);ctx.lineTo(c.r*.72,0);ctx.lineTo(0,c.r);ctx.lineTo(-c.r*.72,0);ctx.closePath();ctx.fill();ctx.restore();}for(const d of drones){ctx.save();ctx.shadowColor="#fb7185";ctx.shadowBlur=20;ctx.fillStyle="#fb7185";ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.stroke();ctx.restore();}ctx.save();ctx.shadowColor="#eaffb0";ctx.shadowBlur=24;ctx.fillStyle="#eaffb0";ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill();ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(score+" / 12",canvas.width/2,58);ui.innerHTML="💠 CRYSTAL HUNT<br><small>WASD / arrows • Collect every crystal</small>";if(dead||won){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=won?"#a3e635":"#fb7185";ctx.font="900 44px Arial";ctx.fillText(won?"ALL CRYSTALS FOUND":"DRONE COLLISION",canvas.width/2,canvas.height/2-18);ctx.fillStyle="#fff";ctx.font="bold 18px Arial";ctx.fillText("Tap to replay",canvas.width/2,canvas.height/2+24);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.remove();back.remove();pause.remove();ui.remove();};reset();animationId=requestAnimationFrame(loop);
}

// ============================================================
// TARGET RUSH
// ============================================================

function startTargetRush(){
    document.body.style.touchAction="none";const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});document.body.appendChild(canvas);const back=makeBackButton("rush-back");let paused=false,ended=false,won=false,score=0,time=30,phase=0,animationId,lastTime=performance.now(),targets=[];const pause=makeArcadePauseButton("rush-pause",v=>paused=v);const ui=document.createElement("div");Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",color:"#fff",background:"rgba(38,26,3,.9)",border:"1px solid #facc15",borderRadius:"12px",padding:"10px 14px",fontFamily:"Arial,sans-serif",fontWeight:"bold"});document.body.appendChild(ui);
    function reset(){ended=false;won=false;score=0;time=30;phase=0;targets=[];for(let i=0;i<5;i++)spawn();}function spawn(){targets.push({x:50+Math.random()*(canvas.width-100),y:100+Math.random()*(canvas.height-190),r:22+Math.random()*12,life:1,color:["#facc15","#fb7185","#22d3ee"][Math.floor(Math.random()*3)]});}
    function pointerDown(e){if(ended){reset();return;}const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;for(let i=targets.length-1;i>=0;i--){const t=targets[i];if(Math.hypot(x-t.x,y-t.y)<t.r){score++;targets.splice(i,1);spawn();if(score>=15){won=true;ended=true;}return;}}}canvas.addEventListener("pointerdown",pointerDown);
    function update(dt){if(ended)return;phase+=dt;time-=dt;if(time<=0){time=0;ended=true;won=score>=15;}for(const t of targets){t.x+=Math.cos(phase*2+t.y)*12*dt;t.y+=Math.sin(phase*1.7+t.x)*12*dt;t.life-=dt*.7;if(t.life<=0){t.life=1;t.x=50+Math.random()*(canvas.width-100);t.y=100+Math.random()*(canvas.height-190);}}}
    function draw(){ctx.fillStyle="#171005";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="rgba(250,204,21,.08)";ctx.fillRect(30,80,canvas.width-60,canvas.height-120);ctx.strokeStyle="rgba(250,204,21,.35)";ctx.strokeRect(30,80,canvas.width-60,canvas.height-120);for(const t of targets){ctx.save();ctx.globalAlpha=.65+.35*t.life;ctx.shadowColor=t.color;ctx.shadowBlur=24;ctx.strokeStyle=t.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(t.x,t.y,t.r*.42,0,Math.PI*2);ctx.stroke();ctx.restore();}ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 38px Arial";ctx.fillText(score+" / 15",canvas.width/2,54);ctx.font="bold 18px Arial";ctx.fillStyle="#fef08a";ctx.fillText("TIME "+time.toFixed(1),canvas.width/2,82);ui.innerHTML="🎯 TARGET RUSH<br><small>Tap the moving targets before time runs out</small>";if(ended){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=won?"#a3e635":"#fb7185";ctx.font="900 44px Arial";ctx.fillText(won?"RANGE CLEARED":"TIME UP",canvas.width/2,canvas.height/2-18);ctx.fillStyle="#fff";ctx.font="bold 18px Arial";ctx.fillText("Score: "+score+" • Tap to replay",canvas.width/2,canvas.height/2+24);}}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};currentCleanup=()=>{cancelAnimationFrame(animationId);canvas.removeEventListener("pointerdown",pointerDown);canvas.remove();back.remove();pause.remove();ui.remove();};reset();animationId=requestAnimationFrame(loop);
}

// ============================================================
// MINECRAFT 3D
// ============================================================

function startMinecraft3D(){
    document.body.style.touchAction="none";
    const canvas=document.createElement("canvas");
    const gl=canvas.getContext("webgl",{antialias:false,alpha:false});
    canvas.className="mc3d-canvas";
    Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none",imageRendering:"pixelated"});
    document.body.appendChild(canvas);
    if(!gl){canvas.remove();showMainMenu();return;}

    const back=makeBackButton("mc3d-back");
    let paused=false;
    const pause=makeArcadePauseButton("mc3d-pause",v=>paused=v);
    const ui=document.createElement("div");
    Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(8,18,28,.88)",color:"#fff",padding:"10px 14px",borderRadius:"10px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #7dd3fc",lineHeight:"1.45"});
    document.body.appendChild(ui);
    const crosshair=document.createElement("div");
    crosshair.textContent="+";
    Object.assign(crosshair.style,{position:"fixed",left:"50%",top:"50%",transform:"translate(-50%,-54%)",zIndex:"100001",color:"rgba(255,255,255,.9)",font:"bold 26px monospace",textShadow:"0 1px 3px #000",pointerEvents:"none"});
    document.body.appendChild(crosshair);
    const hotbar=document.createElement("div");
    Object.assign(hotbar.style,{position:"fixed",left:"50%",bottom:"18px",transform:"translateX(-50%)",zIndex:"100002",display:"flex",gap:"4px",padding:"6px",background:"rgba(18,18,18,.82)",border:"2px solid rgba(255,255,255,.35)",borderRadius:"4px",pointerEvents:"none"});
    document.body.appendChild(hotbar);

    const worldSize=28,worldHeight=12;
    const blockTypes={air:{color:[0,0,0]},grass:{color:[.34,.72,.23]},dirt:{color:[.45,.27,.13]},stone:{color:[.48,.51,.56]},sand:{color:[.82,.67,.36]},wood:{color:[.58,.32,.13]},leaves:{color:[.16,.59,.27]},ore:{color:[.82,.58,.09]},brick:{color:[.63,.22,.14]},glass:{color:[.42,.78,.9]},wheat:{color:[.86,.7,.16]}};
    const blockOrder=["grass","dirt","stone","sand","wood","leaves","ore","brick","glass","wheat"];
    const inventory={grass:20,dirt:18,stone:16,sand:10,wood:12,leaves:10,ore:12,brick:4,glass:4,wheat:0,food:8,pickaxe:0,axe:0};
    const voxels=new Uint8Array(worldSize*worldHeight*worldSize);
    const player={x:14.5,y:6,z:14.5,yaw:.7,pitch:-.08,vy:0,onGround:false,hp:20,food:100,damageFlash:0};
    const keys={};
    let selectedIndex=0,mobs=[],worldTime=0,score=0,goal=200,message="Survive. Mine. Craft. Build.";
    let animationId,lastTime=performance.now(),dead=false,meshDirty=true,vertexCount=0;
    let positionBuffer,colorBuffer,program,positionLocation,colorLocation,projectionLocation,viewLocation,dayLocation;

    function index(x,y,z){return x+worldSize*(z+worldSize*y);}
    function inside(x,y,z){return x>=0&&z>=0&&y>=0&&x<worldSize&&z<worldSize&&y<worldHeight;}
    function getVoxel(x,y,z){return inside(x,y,z)?voxels[index(x,y,z)]:0;}
    function setVoxel(x,y,z,value){if(inside(x,y,z))voxels[index(x,y,z)]=value;}
    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
    function terrainHeight(x,z){return clamp(Math.round(4+Math.sin(x*.18+z*.12)*.45+Math.cos(z*.2)*.35),3,5);}
    function typeId(name){return blockOrder.indexOf(name)+1;}
    function blockName(id){return blockOrder[id-1]||"stone";}

    function makeTree(x,z){
        const ground=terrainHeight(x,z);
        for(let y=ground+1;y<=Math.min(worldHeight-2,ground+3);y++)setVoxel(x,y,z,typeId("wood"));
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=0;dy<=2;dy++){
            if(Math.abs(dx)+Math.abs(dz)+dy>4)continue;
            const y=ground+2+dy;if(!getVoxel(x+dx,y,z+dz))setVoxel(x+dx,y,z+dz,typeId("leaves"));
        }
    }

    function resetWorld(){
        voxels.fill(0);
        for(let z=0;z<worldSize;z++)for(let x=0;x<worldSize;x++){
            const surface=terrainHeight(x,z);
            for(let y=0;y<=surface;y++){
                let type="stone";
                if(y===surface)type=surface<=3?"sand":"grass";
                else if(y>=surface-2)type="dirt";
                else if(y>1&&Math.random()<.08)type="ore";
                setVoxel(x,y,z,typeId(type));
            }
        }
        for(let i=0;i<6;i++)makeTree(2+Math.floor(Math.random()*(worldSize-4)),2+Math.floor(Math.random()*(worldSize-4)));
        for(let i=0;i<32;i++){
            const x=2+Math.floor(Math.random()*(worldSize-4)),z=2+Math.floor(Math.random()*(worldSize-4));
            const ground=terrainHeight(x,z);
            if(getVoxel(x,ground+1,z)===0)setVoxel(x,ground+1,z,typeId("wheat"));
        }
        meshDirty=true;
    }
    function resetPlayer(){
        player.x=worldSize/2+.5;player.z=worldSize/2+.5;player.y=terrainHeight(Math.floor(player.x),Math.floor(player.z))+2.2;player.yaw=.7;player.pitch=-.08;player.vy=0;player.onGround=false;player.hp=20;player.food=100;player.damageFlash=0;
    }
    function resetMobs(){
        mobs=[];
        for(let i=0;i<12;i++){const x=2+Math.floor(Math.random()*(worldSize-4)),z=2+Math.floor(Math.random()*(worldSize-4));mobs.push({x:x+.5,z:z+.5,y:terrainHeight(x,z)+1.1,hp:20,alive:true,walk:Math.random()*6});}
    }
    function resetRun(){
        dead=false;score=0;selectedIndex=0;worldTime=0;message="Survive. Mine. Craft. Build.";
        inventory.grass=20;inventory.dirt=18;inventory.stone=16;inventory.sand=10;inventory.wood=12;inventory.leaves=10;inventory.ore=12;inventory.brick=4;inventory.glass=4;inventory.wheat=0;inventory.food=8;inventory.pickaxe=0;inventory.axe=0;
        resetWorld();resetPlayer();resetMobs();
    }

    function compileShader(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;}
    function setupGL(){
        const vertex=compileShader(gl.VERTEX_SHADER,"attribute vec3 aPosition;attribute vec3 aColor;uniform mat4 uProjection;uniform mat4 uView;varying vec3 vColor;varying float vDepth;void main(){vec4 viewPos=uView*vec4(aPosition,1.0);gl_Position=uProjection*viewPos;vColor=aColor;vDepth=-viewPos.z;}");
        const fragment=compileShader(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vColor;varying float vDepth;uniform float uDay;void main(){float fog=clamp((vDepth-10.0)/38.0,0.0,.82);vec3 sky=mix(vec3(.025,.045,.10),vec3(.53,.76,.95),uDay);gl_FragColor=vec4(mix(vColor*uDay,sky,fog),1.0);}");
        program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
        positionLocation=gl.getAttribLocation(program,"aPosition");colorLocation=gl.getAttribLocation(program,"aColor");projectionLocation=gl.getUniformLocation(program,"uProjection");viewLocation=gl.getUniformLocation(program,"uView");dayLocation=gl.getUniformLocation(program,"uDay");
        positionBuffer=gl.createBuffer();colorBuffer=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    }
    function face(vertices,normal,base,positions,colors){
        const light=normal[1]>.5?1:normal[0]!==0?.82:.9;
        const order=[0,1,2,0,2,3];
        for(const i of order){positions.push(vertices[i*3],vertices[i*3+1],vertices[i*3+2]);colors.push(base[0]*light,base[1]*light,base[2]*light);}
    }
    function rebuildMesh(){
        const positions=[],colors=[];
        const faces=[
            {n:[0,1,0],v:[0,1,0,1,1,0,1,1,1,0,1,1]},
            {n:[0,-1,0],v:[0,0,1,1,0,1,1,0,0,0,0,0]},
            {n:[0,0,1],v:[0,0,1,1,0,1,1,1,1,0,1,1]},
            {n:[0,0,-1],v:[1,0,0,0,0,0,0,1,0,1,1,0]},
            {n:[1,0,0],v:[1,0,1,1,0,0,1,1,0,1,1,1]},
            {n:[-1,0,0],v:[0,0,0,0,0,1,0,1,1,0,1,0]}
        ];
        function addCube(x,y,z,width,height,depth,base){
            for(const current of faces){
                if(current.n[0]===0&&current.n[1]===0&&current.n[2]===0)continue;
                const v=current.v,vertices=[];
                for(let i=0;i<v.length;i+=3)vertices.push(x+v[i]*width,y+v[i+1]*height,z+v[i+2]*depth);
                face(vertices,current.n,base,positions,colors);
            }
        }
        for(let y=0;y<worldHeight;y++)for(let z=0;z<worldSize;z++)for(let x=0;x<worldSize;x++){
            const id=getVoxel(x,y,z);if(!id)continue;const base=blockTypes[blockName(id)].color;
            for(const current of faces){if(getVoxel(x+current.n[0],y+current.n[1],z+current.n[2]))continue;const v=current.v;const vertices=[];for(let i=0;i<v.length;i+=3)vertices.push(x+v[i],y+v[i+1],z+v[i+2]);face(vertices,current.n,base,positions,colors);}
        }
        for(const mob of mobs){
            if(!mob.alive)continue;
            addCube(mob.x-.35,mob.y-.7,mob.z-.25,.7,.7,.5,[.35,.65,.55]);
            addCube(mob.x-.28,mob.y,mob.z-.22,.56,.45,.44,[.25,.8,.65]);
        }
        vertexCount=positions.length/3;gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);meshDirty=false;
    }
    function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
    function viewMatrix(){
        const cy=Math.cos(player.yaw),sy=Math.sin(player.yaw),cp=Math.cos(player.pitch),sp=Math.sin(player.pitch);const fx=cy*cp,fy=sp,fz=sy*cp,rx=-sy,rz=cy,ux=-cy*sp,uy=cp,uz=-sy*sp;
        return new Float32Array([rx,ux,-fx,0,0,uy,-fy,0,rz,uz,-fz,0,-(rx*player.x+rz*player.z),-(ux*player.x+uy*player.y+uz*player.z),fx*player.x+fy*player.y+fz*player.z,1]);
    }
    function cameraDirection(){const cp=Math.cos(player.pitch);return{x:Math.cos(player.yaw)*cp,y:Math.sin(player.pitch),z:Math.sin(player.yaw)*cp};}
    function blockHit(maxDistance=7){
        const direction=cameraDirection();
        for(let distance=.15;distance<maxDistance;distance+=.035){const x=Math.floor(player.x+direction.x*distance),y=Math.floor(player.y+direction.y*distance),z=Math.floor(player.z+direction.z*distance);if(getVoxel(x,y,z))return{x,y,z,px:Math.floor(player.x+direction.x*(distance-.04)),py:Math.floor(player.y+direction.y*(distance-.04)),pz:Math.floor(player.z+direction.z*(distance-.04))};}
        return null;
    }
    function mine(){const hit=blockHit();if(!hit)return;const id=getVoxel(hit.x,hit.y,hit.z),name=blockName(id);setVoxel(hit.x,hit.y,hit.z,0);if(name==="wheat"){inventory.food=(inventory.food||0)+2;score+=12;message="Harvested wheat: +2 food.";}else{inventory[name]=(inventory[name]||0)+1;score+=name==="ore"?20:7;message=`Mined ${name}.`;}meshDirty=true;}
    function place(){const hit=blockHit();if(!hit)return;const selected=blockOrder[selectedIndex];if((inventory[selected]||0)<=0||!inside(hit.px,hit.py,hit.pz)||getVoxel(hit.px,hit.py,hit.pz))return;setVoxel(hit.px,hit.py,hit.pz,typeId(selected));inventory[selected]--;score=Math.max(0,score-1);meshDirty=true;message=`Placed ${selected}.`;}
    function craft(kind){if(inventory.wood<3||inventory.stone<3){message="Need 3 wood and 3 stone.";return;}inventory.wood-=3;inventory.stone-=3;inventory[kind]++;score+=18;message=`Crafted ${kind}.`;}
    function eat(){if(!inventory.food){message="No food.";return;}inventory.food--;player.food=clamp(player.food+30,0,100);player.hp=clamp(player.hp+3,0,20);message="Ate food.";}
    function keyDown(e){const key=e.key.toLowerCase();if(key==="f"){if(document.pointerLockElement===canvas)document.exitPointerLock();return;}if(["arrowleft","arrowright","arrowup","arrowdown"," "].includes(key))e.preventDefault();keys[key]=true;if(key==="q"&&!e.repeat)mine();if(key==="e"&&!e.repeat)place();if(key==="c")craft("pickaxe");if(key==="v")craft("axe");if(key==="h")eat();if(/^\d$/.test(key))selectedIndex=clamp(Number(key)-1,0,blockOrder.length-1);if((key===" "||key==="space")&&player.onGround){player.vy=5.2;player.onGround=false;}}
    function keyUp(e){keys[e.key.toLowerCase()]=false;}
    function updateMobs(dt){for(const mob of mobs){if(!mob.alive)continue;const dx=player.x-mob.x,dz=player.z-mob.z,dist=Math.hypot(dx,dz)||1;if(dist<5){mob.x+=dx/dist*.45*dt;mob.z+=dz/dist*.45*dt;if(dist<1.3){player.hp=Math.max(0,player.hp-8*dt);player.damageFlash=.5;}}mob.y=terrainHeight(Math.floor(mob.x),Math.floor(mob.z))+1.1;mob.walk+=dt*4;}meshDirty=true;}
    function update(dt){
        if(dead||paused)return;worldTime+=dt;player.food=Math.max(0,player.food-1.2*dt);if(player.food<=0)player.hp=Math.max(0,player.hp-3*dt);const day=(Math.sin(worldTime*.16)+1)/2;
        player.yaw += ((keys.arrowright?1:0)-(keys.arrowleft?1:0))*1.8*dt;
        player.pitch = clamp(player.pitch + ((keys.arrowdown?1:0)-(keys.arrowup?1:0))*1.4*dt,-1.45,1.45);
        const forward={x:Math.cos(player.yaw),z:Math.sin(player.yaw)},right={x:-forward.z,z:forward.x};let mx=(keys.d?1:0)-(keys.a?1:0),mz=(keys.w?1:0)-(keys.s?1:0),length=Math.hypot(mx,mz)||1,speed=keys.shift?5:3;
        const nx=player.x+(forward.x*mz+right.x*mx)/length*speed*dt,nz=player.z+(forward.z*mz+right.z*mx)/length*speed*dt;if(nx>.5&&nx<worldSize-.5&&!getVoxel(Math.floor(nx),Math.floor(player.y),Math.floor(player.z)))player.x=nx;if(nz>.5&&nz<worldSize-.5&&!getVoxel(Math.floor(player.x),Math.floor(player.y),Math.floor(nz)))player.z=nz;
        player.vy-=12*dt;player.y+=player.vy*dt;const ground=terrainHeight(Math.floor(player.x),Math.floor(player.z))+1.7;if(player.y<=ground){player.y=ground;player.vy=0;player.onGround=true;}else player.onGround=false;player.damageFlash=Math.max(0,player.damageFlash-dt);updateMobs(dt);if(player.hp<=0||score>=goal)dead=true;
    }
    function draw(){
        if(meshDirty)rebuildMesh();const day=(Math.sin(worldTime*.16)+1)/2,isNight=day<.4;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.04+.42*day,.07+.6*day,.16+.72*day,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniformMatrix4fv(projectionLocation,false,perspective(Math.PI/3,canvas.width/canvas.height,.05,100));gl.uniformMatrix4fv(viewLocation,false,viewMatrix());gl.uniform1f(dayLocation,.38+day*.62);gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.enableVertexAttribArray(positionLocation);gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);gl.enableVertexAttribArray(colorLocation);gl.vertexAttribPointer(colorLocation,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,vertexCount);
        const selected=blockOrder[selectedIndex],mouseStatus=document.pointerLockElement===canvas?"Mouse locked":"Click game to lock mouse";ui.innerHTML=`🧱 REAL 3D MINECRAFT<br><small>WASD move • Arrow keys camera • mouse look • Shift sprint • Q break • E place • number keys hotbar</small><br><b>${isNight?"Night":"Day"}</b> • HP ${Math.round(player.hp)} • Food ${Math.round(player.food)} • ${selected.toUpperCase()} x${inventory[selected]||0}<br><small>${mouseStatus} • Press F to unlock • C craft pickaxe • V craft axe • H eat • ${message}</small>`;
        hotbar.innerHTML=blockOrder.map((name,index)=>`<div style="width:48px;height:48px;border:2px solid ${index===selectedIndex?"#fff":"#555"};background:rgba(35,35,35,.9);box-sizing:border-box;position:relative;color:#fff;font:12px Arial;text-align:center"><div style="width:26px;height:26px;margin:4px auto 1px;background:${name==="grass"?"#55a83b":name==="dirt"?"#754522":name==="stone"?"#858b94":name==="sand"?"#d9b86a":name==="wood"?"#a96b32":name==="leaves"?"#35a85b":name==="ore"?"#dca934":name==="brick"?"#b45f44":"#8fd3ef"};border:1px solid rgba(255,255,255,.45)">${index+1}</div><b>${inventory[name]||0}</b></div>`).join("");if(dead)ui.innerHTML+=`<div style="font-size:26px;color:#7dd3fc;margin-top:12px">${score>=goal?"WORLD CLEARED":"YOU DIED"}</div><small>Click to restart</small>`;
    }
    function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
    function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);}
    function pointerDown(e){if(dead){resetRun();return;}if(document.pointerLockElement!==canvas){canvas.focus();canvas.requestPointerLock?.();return;}if(e.button===0)mine();if(e.button===2)place();}
    function pointerMove(e){if(document.pointerLockElement===canvas&&!paused&&!dead){player.yaw-=e.movementX*.0025;player.pitch=clamp(player.pitch-e.movementY*.0025,-1.45,1.45);}}
    const contextMenu=e=>e.preventDefault();
    addEventListener("resize",resize);addEventListener("keydown",keyDown);addEventListener("keyup",keyUp);canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("contextmenu",contextMenu);back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();};
    currentCleanup=()=>{cancelAnimationFrame(animationId);removeEventListener("resize",resize);removeEventListener("keydown",keyDown);removeEventListener("keyup",keyUp);canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointermove",pointerMove);canvas.removeEventListener("contextmenu",contextMenu);if(document.pointerLockElement===canvas)document.exitPointerLock();canvas.remove();back.remove();pause.remove();ui.remove();crosshair.remove();hotbar.remove();};
    resize();setupGL();resetRun();animationId=requestAnimationFrame(loop);
}
/*
    document.body.style.touchAction="none";
    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    canvas.className="mc3d-canvas";
    function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
    resize();
    Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"});
    document.body.appendChild(canvas);

    const back=makeBackButton("mc3d-back");
    let paused=false;
    const pause=makeArcadePauseButton("mc3d-pause",v=>paused=v);
    const ui=document.createElement("div");
    ui.className="mc3d-ui";
    Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(8,18,28,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #7dd3fc"});
    document.body.appendChild(ui);

    const worldSize=22;
    const blockTypes=[
        {name:"grass", top:"#7ed957", mid:"#6b8f5f", side:"#5a7d47"},
        {name:"dirt", top:"#956d3b", mid:"#7b4d2a", side:"#654321"},
        {name:"stone", top:"#c0c4cc", mid:"#8a8e96", side:"#727783"},
        {name:"sand", top:"#f3d98f", mid:"#d9b86a", side:"#c2954d"},
        {name:"wood", top:"#d7a257", mid:"#b67a3a", side:"#8b552c"},
        {name:"leaves", top:"#69d77b", mid:"#45b765", side:"#2b8b4a"},
        {name:"ore", top:"#f9e27b", mid:"#c99628", side:"#a97a19"},
        {name:"brick", top:"#d67e5d", mid:"#b45f44", side:"#8e4031"},
        {name:"glass", top:"#c4f1ff", mid:"#8fd3ef", side:"#63b6d8"}
    ];
    const blockOrder=["grass","dirt","stone","sand","wood","leaves","ore","brick","glass"];
    const inventory={
        grass:20,dirt:18,stone:16,sand:10,wood:12,leaves:10,ore:12,brick:4,glass:4,
        food:8,pickaxe:0,axe:0
    };
    const player={x:10.5,y:0,z:10.5,yaw:0.7,pitch:0,vy:0,onGround:true,hp:20,food:100,damageFlash:0};
    const keys={};
    let selectedIndex=0, map=[], mobs=[], time=0, worldTime=0;
    let animationId,lastTime=performance.now();
    let dead=false,score=0,goal=200,message="";

    function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }
    function getCell(x,z){
        const cx=Math.floor(x), cz=Math.floor(z);
        if(cx<0 || cz<0 || cx>=worldSize || cz>=worldSize) return null;
        return map[cz] && map[cz][cx] ? map[cz][cx] : null;
    }
    function getTerrainHeightAt(x,z){
        const cell=getCell(x,z);
        return cell ? cell.height : 0;
    }
    function clampPlayerToWorld(){
        player.x=clamp(player.x,0.25,worldSize-0.25);
        player.z=clamp(player.z,0.25,worldSize-0.25);
    }
    function getBlockColor(type, isTop, isSide){
        const def=blockTypes.find(b=>b.name===type)||blockTypes[0];
        if(type==="grass" && isTop) return def.top;
        if(type==="grass" && isSide) return def.side;
        if(type==="dirt" && isTop) return def.top;
        if(type==="stone" && isTop) return def.top;
        if(type==="sand" && isTop) return def.top;
        if(type==="wood" && isTop) return def.top;
        if(type==="ore") return isTop ? def.top : def.mid;
        return isSide ? def.side : def.mid;
    }

    function terrainNoise(x,z){
        const n = Math.sin((x+1.7)*0.87) + Math.cos((z+1.3)*0.94) + Math.sin((x+z)*0.57);
        return n;
    }

    function makeTree(x,z){
        const base=getCell(x,z);
        if(!base || base.height < 2) return;
        base.type="grass";
        const trunkHeight=2 + Math.floor(Math.random()*2);
        for(let i=0;i<trunkHeight;i++){
            const c=getCell(x, z-i);
            if(c){ c.type="wood"; c.height=Math.max(c.height,3); }
        }
        for(let dx=-2;dx<=2;dx++){
            for(let dz=-2;dz<=2;dz++){
                if(Math.abs(dx)+Math.abs(dz) > 3) continue;
                const c=getCell(x+dx, z-1+dz);
                if(c && Math.random() < 0.82){ c.type="leaves"; c.height=Math.max(c.height,3); }
            }
        }
    }

    function resetWorld(){
        map=[];
        for(let z=0; z<worldSize; z++){
            const row=[];
            for(let x=0; x<worldSize; x++){
                const ridge = terrainNoise(x,z);
                const base = Math.max(1, Math.round(2 + ridge + Math.random()*2.2));
                let type="grass";
                if(base <= 2) type="sand";
                if(base >= 4) type="stone";
                if(base >= 5 && Math.random() < 0.18) type="ore";
                row.push({height:base, type});
            }
            map.push(row);
        }

        for(let z=0; z<worldSize; z++){
            for(let x=0; x<worldSize; x++){
                const cell = getCell(x,z);
                if(!cell) continue;
                const cave = Math.sin((x+3.2)*0.9) * Math.cos((z+2.7)*0.8) + Math.random() * 0.7;
                if(cell.height > 3 && cave > 0.9){
                    cell.height = Math.max(1, cell.height - 1 - Math.floor(Math.random()*2));
                    cell.type = "stone";
                }
            }
        }

        for(let i=0;i<14;i++){
            const x=2+Math.floor(Math.random()*(worldSize-4));
            const z=2+Math.floor(Math.random()*(worldSize-4));
            makeTree(x,z);
        }
    }

    function resetPlayer(){
        const cx=Math.floor(worldSize/2), cz=Math.floor(worldSize/2);
        const cell=getCell(cx,cz) || {height:3};
        player.x = cx + 0.5;
        player.z = cz + 0.5;
        player.y = cell.height + 1.7;
        player.yaw = 0.7;
        player.pitch = 0;
        player.vy = 0;
        player.onGround = false;
        player.hp = 20;
        player.food = 100;
        player.damageFlash = 0;
    }

    function resetMobs(){
        mobs=[];
        for(let i=0;i<10;i++){
            const x=2+Math.random()*(worldSize-4);
            const z=2+Math.random()*(worldSize-4);
            const cell=getCell(x,z);
            if(!cell || cell.height <= 0) continue;
            mobs.push({x:x+0.5,y:cell.height+1.1,z:z+0.5,hp:18,alive:true,walk:Math.random()*Math.PI*2});
        }
    }

    function resetRun(){
        dead=false; score=0; selectedIndex=0; message="Survive. Mine. Craft. Build.";
        inventory.grass=20; inventory.dirt=18; inventory.stone=16; inventory.sand=10; inventory.wood=12; inventory.leaves=10; inventory.ore=12; inventory.brick=4; inventory.glass=4; inventory.food=8; inventory.pickaxe=0; inventory.axe=0;
        resetWorld(); resetMobs(); resetPlayer();
    }

    function craftTool(kind){
        const needWood = 3;
        const needStone = 3;
        if((inventory.wood||0) < needWood || (inventory.stone||0) < needStone) {
            message = "Need 3 wood and 3 stone to craft a tool.";
            return;
        }
        inventory.wood -= needWood;
        inventory.stone -= needStone;
        inventory[kind] = (inventory[kind] || 0) + 1;
        score += 18;
        message = kind === "pickaxe" ? "Pickaxe crafted." : "Axe crafted.";
    }

    function eatFood(){
        if((inventory.food||0) <= 0) {
            message = "No food in inventory.";
            return;
        }
        inventory.food -= 1;
        player.food = clamp(player.food + 30, 0, 100);
        player.hp = clamp(player.hp + 3, 0, 20);
        message = "Ate food.";
    }

    function raycast(maxDist=6){
        for(let dist=0.25; dist<maxDist; dist += 0.08){
            const x=player.x + Math.cos(player.yaw)*dist;
            const z=player.z + Math.sin(player.yaw)*dist;
            const cell=getCell(x,z);
            if(cell && cell.height > 0 && player.y < cell.height + 1.7){
                return {x,z,cell,dist};
            }
        }
        return null;
    }

    function mineAtTarget(){
        if(dead || paused) return;
        const hit=raycast(5.5);
        if(!hit || !hit.cell) return;
        const cx=Math.floor(hit.x), cz=Math.floor(hit.z);
        const cell=getCell(cx,cz);
        if(!cell || cell.height <= 0) return;
        const minedType=cell.type;
        const minedValue = minedType === "ore" ? 18 : minedType === "wood" ? 11 : minedType === "leaves" ? 9 : 7;
        cell.height=Math.max(0, cell.height - 1);
        if(cell.height === 0) cell.type = "stone";
        score += minedValue;
        inventory[minedType] = (inventory[minedType] || 0) + 1;
        if(minedType === "leaves" && Math.random() < 0.35) inventory.food = (inventory.food || 0) + 1;
        if(score >= goal){ dead = true; message = "You survived the night!"; }
        message = `Mined ${minedType}.`;
    }

    function placeSelectedBlock(){
        if(dead || paused) return;
        const selected=blockOrder[selectedIndex % blockOrder.length];
        if((inventory[selected] || 0) <= 0) return;
        const hit=raycast(4.8);
        if(!hit || !hit.cell) return;
        const cx=Math.floor(hit.x), cz=Math.floor(hit.z);
        const cell=getCell(cx,cz);
        if(!cell || cell.height >= 8) return;
        cell.height=Math.min(8, cell.height + 1);
        cell.type=selected;
        inventory[selected] = Math.max(0, (inventory[selected] || 0) - 1);
        score = Math.max(0, score - 1);
        message = `Placed ${selected}.`;
    }

    function cycleSelection(dir){ selectedIndex=(selectedIndex + dir + blockOrder.length) % blockOrder.length; }

    function keyDown(e){
        const key=e.key.toLowerCase();
        keys[key]=true;
        if(e.key === "ArrowLeft" || key === "a") player.yaw -= 0.12;
        if(e.key === "ArrowRight" || key === "d") player.yaw += 0.12;
        if(e.key === "ArrowUp" || key === "w") player.pitch = clamp(player.pitch - 0.08, -1.2, 1.2);
        if(e.key === "ArrowDown" || key === "s") player.pitch = clamp(player.pitch + 0.08, -1.2, 1.2);
        if((e.key === " " || key === "space") && player.onGround){ player.vy = 4.8; player.onGround = false; }
        if(key === "q") cycleSelection(-1);
        if(key === "e") cycleSelection(1);
        if(key === "c") craftTool("pickaxe");
        if(key === "v") craftTool("axe");
        if(key === "h") eatFood();
        if(key === "1") selectedIndex = 0;
        if(key === "2") selectedIndex = 1;
        if(key === "3") selectedIndex = 2;
        if(key === "4") selectedIndex = 3;
        if(key === "5") selectedIndex = 4;
        if(key === "6") selectedIndex = 5;
        if(key === "7") selectedIndex = 6;
        if(key === "8") selectedIndex = 7;
        if(key === "9") selectedIndex = 8;
    }
    function keyUp(e){ keys[e.key.toLowerCase()] = false; }

    function updateMobs(dt){
        for(let i=mobs.length-1;i>=0;i--){
            const mob=mobs[i];
            if(!mob.alive) continue;
            const dx=player.x - mob.x;
            const dz=player.z - mob.z;
            const distance=Math.hypot(dx,dz) || 1;
            if(distance < 8){
                const speed=0.9;
                mob.x += (dx / distance) * speed * dt;
                mob.z += (dz / distance) * speed * dt;
                if(distance < 1.35){
                    player.hp = Math.max(0, player.hp - 8 * dt);
                    player.food = Math.max(0, player.food - 4 * dt);
                    player.damageFlash = 0.55;
                }
            }
            const ground=getTerrainHeightAt(mob.x, mob.z) + 1.1;
            if(mob.y > ground){ mob.y -= 10 * dt; }
            else { mob.y = ground; }
            mob.walk += dt * 2;
        }
    }

    function update(dt){
        if(dead || paused) return;
        time += dt;
        worldTime += dt;
        player.food = Math.max(0, player.food - 1.5 * dt);
        if(player.food <= 0){ player.hp = Math.max(0, player.hp - 4 * dt); }
        if(player.hp <= 0){ dead = true; message = "You were overwhelmed."; }

        const forwardX=Math.cos(player.yaw), forwardZ=Math.sin(player.yaw);
        const rightX=Math.cos(player.yaw + Math.PI/2), rightZ=Math.sin(player.yaw + Math.PI/2);
        const moveX=(keys.d||keys.arrowright?1:0) - (keys.a||keys.arrowleft?1:0);
        const moveZ=(keys.w||keys.arrowup?1:0) - (keys.s||keys.arrowdown?1:0);
        const moveVecX = forwardX*moveZ + rightX*moveX;
        const moveVecZ = forwardZ*moveZ + rightZ*moveX;
        const moveLen=Math.hypot(moveVecX, moveVecZ) || 1;
        const sprint = (keys.shift ? 1.5 : 1);

        const nextX = player.x + (moveVecX/moveLen) * 2.8 * sprint * dt;
        const nextZ = player.z + (moveVecZ/moveLen) * 2.8 * sprint * dt;
        const nextCell = getCell(nextX, player.z);
        const nextCell2 = getCell(player.x, nextZ);
        if(nextCell && nextCell.height > 0) player.x = nextX;
        if(nextCell2 && nextCell2.height > 0) player.z = nextZ;
        clampPlayerToWorld();

        player.vy -= 11.5 * dt;
        player.y += player.vy * dt;
        const groundHeight = getTerrainHeightAt(player.x, player.z) + 1.7;
        if(player.y <= groundHeight){
            player.y = groundHeight;
            player.vy = 0;
            player.onGround = true;
        } else {
            player.onGround = false;
        }

        if(player.y < -5){
            player.hp = 0; dead = true; message = "You fell out of the world.";
        }

        player.damageFlash = Math.max(0, player.damageFlash - dt);
        updateMobs(dt);
        if(score >= goal){ dead = true; message = "You survived the world and built enough!"; }
    }

    function shadeColor(hex, factor){
        const clean=hex.replace('#','');
        const num=parseInt(clean,16);
        const r=((num>>16)&255)*factor;
        const g=((num>>8)&255)*factor;
        const b=(num&255)*factor;
        return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    }

    function drawMobProjection(mob){
        const dx=mob.x - player.x;
        const dz=mob.z - player.z;
        const dist=Math.hypot(dx,dz) || 1;
        const angle=Math.atan2(dz,dx)-player.yaw;
        const fov=Math.PI/3.2;
        if(Math.abs(angle) > fov/2 + 0.4) return null;
        const screenX=canvas.width/2 + Math.tan(angle) * (canvas.width*0.36);
        const screenY=canvas.height/2 + player.pitch * 110 + 12;
        const size=Math.max(8, 48 - dist*4.4);
        return {x:screenX,y:screenY,size,dist};
    }

    function draw(){
        const w=canvas.width, h=canvas.height;
        const dayMix=(Math.sin(worldTime*0.18)+1)/2;
        const sky = ctx.createLinearGradient(0,0,0,h);
        const dayR=Math.round(70 + dayMix*130), dayG=Math.round(110 + dayMix*110), dayB=Math.round(180 + dayMix*75);
        sky.addColorStop(0, `rgb(${dayR}, ${dayG}, ${dayB})`);
        sky.addColorStop(0.5, `rgb(${Math.round(100 + dayMix*90)}, ${Math.round(150 + dayMix*80)}, ${Math.round(210 + dayMix*45)})`);
        sky.addColorStop(1, "#dff7ff");
        ctx.fillStyle=sky;
        ctx.fillRect(0,0,w,h);

        ctx.fillStyle=`rgba(255, ${Math.round(220 + dayMix*25)}, ${Math.round(120 + dayMix*20)}, 0.95)`;
        ctx.beginPath();
        ctx.arc(w*0.78, h*0.2 + 18*(1-dayMix), 40, 0, Math.PI*2);
        ctx.fill();

        const cycleText = Math.floor((worldTime / 20) % 24);
        const isNight = dayMix < 0.45;

        const fov=Math.PI/3.2;
        for(let i=0; i<240; i++){
            const ray = player.yaw - fov/2 + (i/239)*fov;
            let dist=0.15;
            let hit=null;
            while(dist < 10){
                const x=player.x + Math.cos(ray)*dist;
                const z=player.z + Math.sin(ray)*dist;
                const cell=getCell(x,z);
                if(cell && cell.height > 0){
                    const top = cell.height + 1.2;
                    if(player.y < top + 1.3){
                        hit={x,z,cell,dist};
                        break;
                    }
                }
                dist += 0.08;
            }
            if(hit){
                const brightness=Math.max(0.22, 1.35 - hit.dist/8.5);
                const sx = i * (w / 240);
                const wallH=Math.max(32, (h*0.86)/hit.dist);
                const top = h/2 - wallH/2 + player.pitch*120;
                const base=getBlockColor(hit.cell.type, true, true);
                ctx.fillStyle=shadeColor(base, brightness);
                ctx.fillRect(sx, top, (w / 240)+1, wallH);
                ctx.fillStyle="rgba(0,0,0,.12)";
                ctx.fillRect(sx, Math.max(top,0), (w / 240)+1, Math.max(9, wallH * 0.08));
            }
        }

        for(const mob of mobs){
            if(!mob.alive) continue;
            const proj=drawMobProjection(mob);
            if(!proj) continue;
            ctx.save();
            ctx.translate(proj.x, proj.y + Math.sin(mob.walk)*4);
            ctx.fillStyle="#2dd4bf";
            ctx.fillRect(-proj.size/2, -proj.size/2, proj.size, proj.size);
            ctx.fillStyle="rgba(16,185,129,.35)";
            ctx.fillRect(-proj.size*0.35, proj.size*0.25, proj.size*0.7, proj.size*0.18);
            ctx.restore();
        }

        ctx.fillStyle="#90d97b";
        ctx.fillRect(0, h*0.72, w, h*0.28);

        ctx.save();
        ctx.strokeStyle="rgba(255,255,255,.9)";
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(w/2-10,h/2); ctx.lineTo(w/2+10,h/2); ctx.moveTo(w/2,h/2-10); ctx.lineTo(w/2,h/2+10); ctx.stroke();
        ctx.restore();

        const selected=blockOrder[selectedIndex % blockOrder.length];
        const hudW=230, hudH=170, hudX=18, hudY=h-176;
        ctx.fillStyle="rgba(0,0,0,.42)";
        ctx.fillRect(hudX,hudY,hudW,hudH);
        ctx.strokeStyle="rgba(255,255,255,.22)";
        ctx.strokeRect(hudX,hudY,hudW,hudH);
        ctx.fillStyle=getBlockColor(selected,true,true);
        ctx.fillRect(hudX+18,hudY+18,38,38);
        ctx.fillStyle="#fff";
        ctx.font="900 18px Arial";
        ctx.textAlign="left";
        ctx.fillText(selected.toUpperCase(), hudX+68, hudY+42);
        ctx.font="bold 12px Arial";
        ctx.fillText("INVENTORY", hudX+18, hudY+80);
        let invX=hudX+18;
        for(const key of blockOrder){
            ctx.fillStyle=getBlockColor(key,true,true);
            ctx.fillRect(invX, hudY+88, 18, 18);
            ctx.fillStyle="#fff";
            ctx.fillText(String(inventory[key] || 0), invX+22, hudY+102);
            invX += 42;
        }
        ctx.fillStyle="#fff";
        ctx.font="900 22px Arial";
        ctx.fillText(`HP ${Math.max(0,Math.round(player.hp))}`, 18, 30);
        ctx.fillText(`FOOD ${Math.max(0,Math.round(player.food))}`, 18, 58);
        ctx.fillText(`SCORE ${score}/${goal}`, 18, 86);
        ctx.fillText(`Y ${player.y.toFixed(1)}`, 18, 114);

        if(player.damageFlash>0){
            ctx.fillStyle=`rgba(255,80,80,${0.16 + player.damageFlash * 0.4})`;
            ctx.fillRect(0,0,w,h);
        }

        ctx.fillStyle="#dbeafe";
        ctx.font="bold 18px Arial";
        ctx.textAlign="center";
        ctx.fillText(`${cycleText}:00 ${isNight ? "Night" : "Day"}  •  ${message}`, w/2, h-22);

        ui.innerHTML="🧱 MINECRAFT SURVIVAL<br><small>WASD move • Shift sprint • Space jump • Q/E hotbar • C craft • H eat • Left mine • Right place</small>";

        if(dead){
            ctx.fillStyle="rgba(0,0,0,.72)";
            ctx.fillRect(0,0,w,h);
            ctx.fillStyle="#7dd3fc";
            ctx.font="900 52px Arial";
            ctx.textAlign="center";
            ctx.fillText(score >= goal ? "WORLD CLEARED" : "YOU DIED!", w/2, h/2-20);
            ctx.fillStyle="#ffffff";
            ctx.font="bold 20px Arial";
            ctx.fillText("Tap to restart", w/2, h/2+26);
            ctx.fillStyle="#dbeafe";
            ctx.font="bold 16px Arial";
            ctx.fillText(message, w/2, h/2+60);
        }
    }

    function loop(ts){
        const dt=Math.min((ts-lastTime)/1000,.04);
        lastTime=ts;
        if(!paused){ update(dt); draw(); }
        animationId=requestAnimationFrame(loop);
    }

    canvas.addEventListener("pointerdown", e=>{
        if(dead){ resetRun(); return; }
        if(e.button === 0){
            const nearest = mobs.filter(m => m.alive).sort((a,b)=>{
                const da = Math.hypot(a.x-player.x,a.z-player.z);
                const db = Math.hypot(b.x-player.x,b.z-player.z);
                return da-db;
            })[0];
            if(nearest && Math.hypot(nearest.x-player.x,nearest.z-player.z) < 1.9){
                nearest.hp -= 18;
                if(nearest.hp <= 0){
                    nearest.alive = false;
                    score += 25;
                    inventory.food = (inventory.food || 0) + 1;
                    message = "Mob defeated.";
                }
            } else {
                mineAtTarget();
            }
        }
        if(e.button === 2) placeSelectedBlock();
    }, {passive:true});

    const handleContextMenu = e => e.preventDefault();
    canvas.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    back.onclick=()=>{ cancelAnimationFrame(animationId); showMainMenu(); };

    const handlePointerMove = (e)=>{
        if(!paused && !dead && e.buttons === 1){
            player.yaw += e.movementX * 0.004;
            player.pitch = clamp(player.pitch - e.movementY * 0.0025, -1.1, 1.1);
        }
    };
    canvas.addEventListener("pointermove", handlePointerMove, {passive:true});
    currentCleanup=()=>{
        cancelAnimationFrame(animationId);
        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("keyup", keyUp);
        canvas.removeEventListener("contextmenu", handleContextMenu);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.remove();
        back.remove();
        pause.remove();
        ui.remove();
    };
    resetRun();
    animationId=requestAnimationFrame(loop);
}

*/
// ============================================================
// SKY SURFER
// ============================================================

function startSkySurfer(){
    document.body.style.touchAction="none"; const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d"); function resize(){canvas.width=innerWidth;canvas.height=innerHeight;} resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("sky-back"); const pause=makeArcadePauseButton("sky-pause",v=>paused=v); const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(6,17,31,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #38bdf8"}); document.body.appendChild(ui);
    let paused=false,dead=false,phase=0,score=0,animationId,lastTime=performance.now(),keys={},player={x:140,y:innerHeight/2,r:18},hazards=[],stars=[];
    function reset(){dead=false;score=0;phase=0;player.x=140;player.y=innerHeight/2;hazards=[];stars=[];} function keyDown(e){keys[e.key]=true;} function keyUp(e){keys[e.key]=false;}
    function spawnHazard(){hazards.push({x:canvas.width+40,y:50+Math.random()*(canvas.height-120),r:18+Math.random()*18,s:220+Math.random()*180});}
    function spawnStar(){stars.push({x:canvas.width+50,y:60+Math.random()*(canvas.height-150),r:10+Math.random()*8});}
    function update(dt){if(dead||paused)return;phase+=dt;score+=dt*10;if(keys.ArrowUp||keys.w)player.y-=320*dt;if(keys.ArrowDown||keys.s)player.y+=320*dt;player.y=Math.max(50,Math.min(canvas.height-50,player.y));if(Math.random()<dt*1.2)spawnHazard();if(Math.random()<dt*0.7)spawnStar();for(let i=hazards.length-1;i>=0;i--){const h=hazards[i];h.x-=h.s*dt;if(Math.hypot(player.x-h.x,player.y-h.y)<player.r+h.r){dead=true;} if(h.x<-60)hazards.splice(i,1);}for(let i=stars.length-1;i>=0;i--){const s=stars[i];s.x-=260*dt;if(Math.hypot(player.x-s.x,player.y-s.y)<player.r+s.r+6){score+=18;stars.splice(i,1);}else if(s.x<-40)stars.splice(i,1);}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#38bdf8",phase*24);for(const h of hazards){ctx.save();ctx.shadowColor="#fca5a5";ctx.shadowBlur=18;ctx.fillStyle="#fb7185";ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,Math.PI*2);ctx.fill();ctx.restore();}for(const s of stars){ctx.save();ctx.shadowColor="#fef08a";ctx.shadowBlur=18;ctx.fillStyle="#fef08a";ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.PI/2;const r=i%2?s.r:s.r*0.5;const px=s.x+Math.cos(a)*r,py=s.y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.restore();}ctx.save();ctx.translate(player.x,player.y);ctx.shadowColor="#bae6fd";ctx.shadowBlur=28;ctx.fillStyle="#e0f2fe";ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#38bdf8";ctx.fillRect(-6,-10,12,18);ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,64);ui.innerHTML="🌌 SKY SURFER<br><small>W/S or ↑/↓ • Stay above the hazard drones</small>"; if(dead){ctx.fillStyle="rgba(0,0,0,.78)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#67e8f9";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-18);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+24);}} 
    function pointerDown(){if(dead){reset();}} canvas.addEventListener("pointerdown",pointerDown,{passive:true}); window.addEventListener("keydown",keyDown); window.addEventListener("keyup",keyUp); back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();}; currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.removeEventListener("pointerdown",pointerDown);canvas.remove();back.remove();pause.remove();ui.remove();}; reset(); function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);} animationId=requestAnimationFrame(loop);
}

// ============================================================
// AETHER DASH
// ============================================================

function startAetherDash(){
    document.body.style.touchAction="none"; const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d"); function resize(){canvas.width=innerWidth;canvas.height=innerHeight;} resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("aether-back"); const pause=makeArcadePauseButton("aether-pause",v=>paused=v); const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(11,8,30,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #a78bfa"}); document.body.appendChild(ui);
    let paused=false,dead=false,score=0,phase=0,animationId,lastTime=performance.now(),keys={},player={x:140,y:innerHeight/2,r:18},blocks=[],cores=[];
    function reset(){dead=false;score=0;phase=0;player.x=140;player.y=innerHeight/2;blocks=[];cores=[];} function keyDown(e){keys[e.key]=true;} function keyUp(e){keys[e.key]=false;}
    function spawnBlock(){const gap=120+Math.random()*140;blocks.push({x:canvas.width+40,y:Math.random()*(canvas.height-220)+80,w:34+Math.random()*30,h:Math.random()*(canvas.height*0.52)+80,gap,hit:false});}
    function spawnCore(){cores.push({x:canvas.width+40,y:80+Math.random()*(canvas.height-160),r:10+Math.random()*8});}
    function update(dt){if(dead||paused)return;phase+=dt;score+=dt*15;if(keys.ArrowUp||keys.w)player.y-=320*dt;if(keys.ArrowDown||keys.s)player.y+=320*dt;player.y=Math.max(60,Math.min(canvas.height-60,player.y));if(Math.random()<dt*1.0)spawnBlock();if(Math.random()<dt*0.6)spawnCore();for(let i=blocks.length-1;i>=0;i--){const b=blocks[i];b.x-=300*dt;const nearest=player.y;const inWall=(player.x+player.r>b.x && player.x-player.r<b.x+b.w && (nearest< b.y || nearest> b.y+b.gap));if(inWall||Math.abs(player.y-b.y)<5)dead=true;if(b.x<-80)blocks.splice(i,1);}for(let i=cores.length-1;i>=0;i--){const c=cores[i];c.x-=260*dt;if(Math.hypot(player.x-c.x,player.y-c.y)<player.r+c.r+6){score+=28;cores.splice(i,1);}else if(c.x<-40)cores.splice(i,1);}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#a78bfa",phase*26);for(const b of blocks){ctx.fillStyle="rgba(196,181,253,.12)";ctx.fillRect(0,b.y,canvas.width,b.gap);ctx.fillStyle="rgba(167,139,250,.28)";ctx.fillRect(b.x,b.y,b.w,canvas.height-b.y);ctx.fillRect(b.x,b.y+b.gap,b.w,canvas.height-(b.y+b.gap));ctx.strokeStyle="rgba(196,181,253,.5)";ctx.lineWidth=3;ctx.strokeRect(b.x,b.y,b.w,canvas.height-b.y);ctx.strokeRect(b.x,b.y+b.gap,b.w,canvas.height-(b.y+b.gap));}for(const c of cores){ctx.save();ctx.shadowColor="#f5d0fe";ctx.shadowBlur=20;ctx.fillStyle="#f5d0fe";ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.save();ctx.translate(player.x,player.y);ctx.shadowColor="#ddd6fe";ctx.shadowBlur=18;ctx.fillStyle="#f5f3ff";ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#a78bfa";ctx.fillRect(-5,-10,10,20);ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,64);ui.innerHTML="🪐 AETHER DASH<br><small>W/S or ↑/↓ • dodge the rift walls</small>"; if(dead){ctx.fillStyle="rgba(0,0,0,.78)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#c4b5fd";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-18);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+24);}} 
    function pointerDown(){if(dead){reset();}} canvas.addEventListener("pointerdown",pointerDown,{passive:true}); window.addEventListener("keydown",keyDown); window.addEventListener("keyup",keyUp); back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();}; currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.removeEventListener("pointerdown",pointerDown);canvas.remove();back.remove();pause.remove();ui.remove();}; reset(); function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);} animationId=requestAnimationFrame(loop);
}

// ============================================================
// PRISM SHIFT
// ============================================================

function startPrismShift(){
    document.body.style.touchAction="none"; const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d"); function resize(){canvas.width=innerWidth;canvas.height=innerHeight;} resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("prism-back"); const pause=makeArcadePauseButton("prism-pause",v=>paused=v); const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(6,23,31,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #67e8f9"}); document.body.appendChild(ui);
    let paused=false,dead=false,phase=0,score=0,animationId,lastTime=performance.now(),keys={},player={lane:1},beams=[];
    function reset(){dead=false;score=0;phase=0;player.lane=1;beams=[];for(let i=0;i<7;i++)beams.push({y:80+i*70,dir:Math.random()>0.5?1:-1,speed:80+Math.random()*120,lane:Math.floor(Math.random()*3)});} 
    function laneX(value){return canvas.width/2+(value-1)*150;} function keyDown(e){if(e.key==="ArrowLeft"||e.key==="a")player.lane=Math.max(0,player.lane-1); if(e.key==="ArrowRight"||e.key==="d")player.lane=Math.min(2,player.lane+1);} 
    function update(dt){if(dead||paused)return;phase+=dt;score+=dt*11;for(let i=beams.length-1;i>=0;i--){const b=beams[i];b.y+=b.speed*dt*b.dir; if(b.y<80||b.y>canvas.height-80)b.dir*=-1; if(Math.abs(b.y-(canvas.height-140))<50 && b.lane===player.lane){dead=true;}} if(Math.random()<dt*0.35){beams.push({y:60+Math.random()*(canvas.height-130),dir:Math.random()>0.5?1:-1,speed:80+Math.random()*120,lane:Math.floor(Math.random()*3)}); if(beams.length>18)beams.shift();}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#67e8f9",phase*28);ctx.strokeStyle="rgba(103,232,249,.3)";ctx.lineWidth=3;for(let i=0;i<3;i++){const x=laneX(i);ctx.beginPath();ctx.moveTo(x,60);ctx.lineTo(x,canvas.height-50);ctx.stroke();}for(const b of beams){ctx.beginPath();ctx.moveTo(laneX(b.lane)-30,b.y);ctx.lineTo(laneX(b.lane)+30,b.y);ctx.strokeStyle=(b.dir>0?"#22d3ee":"#f472b6");ctx.lineWidth=7;ctx.stroke();}ctx.save();const px=laneX(player.lane);ctx.shadowColor="#cffafe";ctx.shadowBlur=22;ctx.fillStyle="#e0f2fe";ctx.beginPath();ctx.arc(px,canvas.height-110,30,0,Math.PI*2);ctx.fill();ctx.fillStyle="#67e8f9";ctx.fillRect(px-12,canvas.height-150,24,40);ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,64);ui.innerHTML="🔷 PRISM SHIFT<br><small>Use ←/→ or tap sides to dodge the wave beams</small>"; if(dead){ctx.fillStyle="rgba(0,0,0,.78)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#67e8f9";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-18);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+24);}} 
    function pointerDown(e){if(dead){reset();} else {const side=e.clientX<canvas.width/2? -1:1; player.lane = Math.max(0,Math.min(2,player.lane + (side<0?-1:1)));}} canvas.addEventListener("pointerdown",pointerDown,{passive:true}); window.addEventListener("keydown",keyDown); window.addEventListener("keyup",keyUp); back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();}; currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.removeEventListener("pointerdown",pointerDown);canvas.remove();back.remove();pause.remove();ui.remove();}; reset(); function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);} animationId=requestAnimationFrame(loop);
}

// ============================================================
// BLAST LOOP
// ============================================================

function startBlastLoop(){
    document.body.style.touchAction="none"; const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d"); function resize(){canvas.width=innerWidth;canvas.height=innerHeight;} resize(); Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",zIndex:"100000",touchAction:"none"}); document.body.appendChild(canvas);
    const back=makeBackButton("blast-back"); const pause=makeArcadePauseButton("blast-pause",v=>paused=v); const ui=document.createElement("div"); Object.assign(ui.style,{position:"fixed",top:"12px",left:"12px",zIndex:"100002",background:"rgba(30,13,3,.9)",color:"#fff",padding:"10px 14px",borderRadius:"12px",fontFamily:"Arial,sans-serif",fontWeight:"bold",border:"1px solid #f97316"}); document.body.appendChild(ui);
    let paused=false,dead=false,score=0,phase=0,animationId,lastTime=performance.now(),keys={},player={x:canvas.width/2,y:canvas.height-90,r:18},shards=[];
    function reset(){dead=false;score=0;phase=0;player.x=canvas.width/2;player.y=canvas.height-90;shards=[];for(let i=0;i<10;i++)shards.push({x:60+Math.random()*(canvas.width-120),y:40+Math.random()*(canvas.height-200),r:12+Math.random()*14,vy:50+Math.random()*80});}
    function keyDown(e){keys[e.key]=true;} function keyUp(e){keys[e.key]=false;}
    function update(dt){if(dead||paused)return;phase+=dt;score+=dt*12;const dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0);const dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);player.x=Math.max(26,Math.min(canvas.width-26,player.x+dx*260*dt));player.y=Math.max(50,Math.min(canvas.height-50,player.y+dy*260*dt));for(let i=shards.length-1;i>=0;i--){const s=shards[i];s.y+=s.vy*dt;if(s.y>canvas.height+30){s.y=-30;s.x=30+Math.random()*(canvas.width-60);}if(Math.hypot(player.x-s.x,player.y-s.y)<player.r+s.r+5){dead=true;}}}
    function draw(){drawGameAtmosphere(ctx,canvas,"#f97316",phase*22);for(const s of shards){ctx.save();ctx.shadowColor="#fdba74";ctx.shadowBlur=18;ctx.fillStyle="#f97316";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.save();ctx.translate(player.x,player.y);ctx.shadowColor="#fed7aa";ctx.shadowBlur=24;ctx.fillStyle="#fff7ed";ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#f97316";ctx.fillRect(-6,-8,12,18);ctx.restore();ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 34px Arial";ctx.fillText(Math.floor(score),canvas.width/2,64);ui.innerHTML="💣 BLAST LOOP<br><small>Move with WASD or arrows • dodge the crystal shards</small>"; if(dead){ctx.fillStyle="rgba(0,0,0,.78)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fdba74";ctx.font="900 48px Arial";ctx.fillText("YOU DIED!",canvas.width/2,canvas.height/2-18);ctx.font="bold 18px Arial";ctx.fillStyle="#fff";ctx.fillText("Tap to restart",canvas.width/2,canvas.height/2+24);}} 
    function pointerDown(){if(dead){reset();}} canvas.addEventListener("pointerdown",pointerDown,{passive:true}); window.addEventListener("keydown",keyDown); window.addEventListener("keyup",keyUp); back.onclick=()=>{cancelAnimationFrame(animationId);showMainMenu();}; currentCleanup=()=>{cancelAnimationFrame(animationId);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);canvas.removeEventListener("pointerdown",pointerDown);canvas.remove();back.remove();pause.remove();ui.remove();}; reset(); function loop(ts){const dt=Math.min((ts-lastTime)/1000,.04);lastTime=ts;if(!paused){update(dt);draw();}animationId=requestAnimationFrame(loop);} animationId=requestAnimationFrame(loop);
}

// ============================================================
// START HUB
// ============================================================

showMainMenu();

})();
