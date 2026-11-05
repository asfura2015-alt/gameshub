(()=>{"use strict";
const LEVELS=[["bag","bed","pig","fox","jug","ten","sun"],["cat","pen","fig","box","bug","map","tub"],["jam","wet","ink","log","hut","dog","bin"]],MAX_LIVES=4,$=id=>document.getElementById(id);
const board=$("shellBoard"),wordButton=$("wordButton"),wordText=$("wordText"),wordHint=$("wordHint"),levelNumber=$("levelNumber"),fishLives=$("fishLives"),backBtn=$("backBtn"),nextBtn=$("nextBtn"),restartBtn=$("restartBtn"),complete=$("completeRibbon"),infoModal=$("infoModal"),endModal=$("endModal"),loseModal=$("loseModal");
const sounds={right:new Audio("assets/audio/right.mp3"),wrong:new Audio("assets/audio/wrong.mp3"),win:new Audio("assets/audio/win.mp3"),lose:new Audio("assets/audio/lose.mp3")};Object.values(sounds).forEach(a=>a.preload="auto");
let level=0,lives=MAX_LIVES,revealed=false,locked=false,gameOver=false,firstHintUsed=false;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let progress=LEVELS.map(words=>({order:shuffle(words),found:new Set(),index:0,current:null,complete:false}));
function play(k){try{sounds[k].currentTime=0;sounds[k].play().catch(()=>{})}catch(e){}}
function livesUI(){fishLives.innerHTML="";for(let i=0;i<MAX_LIVES;i++){const im=document.createElement("img");im.src="assets/images/life-fish.webp";im.className="life-fish"+(i<lives?"":" lost");fishLives.appendChild(im)}}
function ensure(){const s=progress[level];while(s.index<s.order.length&&s.found.has(s.order[s.index]))s.index++;if(s.index>=s.order.length){s.complete=true;s.current=null}else s.current=s.order[s.index]}
function shells(){const s=progress[level];board.innerHTML="";LEVELS[level].forEach((w,i)=>{const z=document.createElement("div");z.className=`shell-zone pos-${i}`;z.dataset.word=w;const b=document.createElement("button");b.className="shell-card";b.setAttribute("aria-label",w);const img=document.createElement("img");img.src=`assets/images/${w}.webp`;img.alt=w;img.onerror=()=>console.error("Missing image:",w);b.appendChild(img);z.appendChild(b);board.appendChild(z);if(s.found.has(w)){z.style.opacity=0;z.style.pointerEvents="none"}else b.onclick=()=>choose(z)})}
function render(){ensure();const s=progress[level];levelNumber.textContent=level+1;livesUI();shells();revealed=false;locked=false;wordButton.classList.remove("revealed");wordText.textContent=s.current||"✓";wordButton.disabled=s.complete||gameOver;if(s.complete)wordButton.classList.add("revealed");
  const showFirstHint=!firstHintUsed&&level===0&&s.index===0&&!s.complete;wordHint.hidden=!showFirstHint;
  complete.hidden=!s.complete;
  // Back becomes available once a previous level exists; Next only after the current level is complete.
  backBtn.hidden=level===0;
  nextBtn.hidden=!(s.complete&&level<2);
  nextBtn.classList.toggle("pulse",!nextBtn.hidden);
  if(s.complete&&level===2&&!gameOver)setTimeout(finish,450)
}
wordButton.onclick=()=>{if(gameOver||locked||progress[level].complete)return;if(!firstHintUsed){firstHintUsed=true;wordHint.hidden=true}revealed=!revealed;wordButton.classList.toggle("revealed",revealed)};
function choose(z){if(gameOver||locked||!revealed)return;const s=progress[level],w=z.dataset.word;if(w===s.current){locked=true;play("right");s.found.add(w);z.classList.add("correct");setTimeout(()=>{s.index++;if(s.found.size===7)s.complete=true;render()},560)}else{lives=Math.max(0,lives-1);livesUI();play("wrong");z.classList.remove("wrong");void z.offsetWidth;z.classList.add("wrong");setTimeout(()=>z.classList.remove("wrong"),380);if(!lives){locked=true;gameOver=true;setTimeout(()=>{play("lose");loseModal.classList.add("open")},430)}}}
function finish(){if(gameOver)return;gameOver=true;play("win");endModal.classList.add("open")}
function reset(){Object.values(sounds).forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}});level=0;lives=MAX_LIVES;revealed=locked=gameOver=false;firstHintUsed=false;progress=LEVELS.map(words=>({order:shuffle(words),found:new Set(),index:0,current:null,complete:false}));[endModal,loseModal,infoModal].forEach(m=>m.classList.remove("open"));render()}
nextBtn.onclick=()=>{if(progress[level].complete&&level<2){level++;lives=MAX_LIVES;render()}};
backBtn.onclick=()=>{if(level>0){level--;lives=MAX_LIVES;render()}};
function restartCurrentLevel(){Object.values(sounds).forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}});lives=MAX_LIVES;revealed=locked=gameOver=false;progress[level]={order:shuffle(LEVELS[level]),found:new Set(),index:0,current:null,complete:false};[endModal,loseModal,infoModal].forEach(m=>m.classList.remove("open"));render()}
restartBtn.onclick=restartCurrentLevel;$("againBtn").onclick=reset;$("loseRestartBtn").onclick=restartCurrentLevel;$("infoBtn").onclick=()=>infoModal.classList.add("open");$("closeInfo").onclick=()=>infoModal.classList.remove("open");infoModal.onpointerdown=e=>{if(e.target.classList.contains("shade"))infoModal.classList.remove("open")};render();})();
