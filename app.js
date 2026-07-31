const REAL_PHOTOS = [
"photos/p1.jpg",
"photos/p2.jpg",
"photos/p3.jpg",
"photos/p4.jpg",
"photos/p5.jpg",
"photos/p6.jpg",
"photos/p7.jpg",
"photos/p8.jpg",
"photos/p9.jpg",
"photos/p10.jpg",
"photos/p11.jpg",
"photos/p12.jpg",
"photos/p13.jpg",
"photos/p14.jpg",
"photos/p15.jpg",
"photos/p16.jpg"
];


/* ================= 날짜 유틸 ================= */
const TODAY = new Date(); // 현재 날짜 (2026년 7월 31일 기준 D+443일)
const BIRTH_DATE = new Date(2025,4,15);
const WD = ['일','월','화','수','목','금','토'];
function dDay(d){ return Math.round((d-BIRTH_DATE)/(24*60*60*1000)); }
function ageMonths(d){
    let m = (d.getFullYear()-BIRTH_DATE.getFullYear())*12 + (d.getMonth()-BIRTH_DATE.getMonth());
    if(d.getDate() < BIRTH_DATE.getDate()) m--;
    return m;
}
const CURRENT_AGE_MONTHS = ageMonths(TODAY);

/* ================= 사진 카드 (액자 프레임 스타일) ================= */
function photoCard(seed, opts={}){
    const src = opts.src || REAL_PHOTOS[Math.abs(seed) % REAL_PHOTOS.length];
    const shape = opts.big ? "aspect-[4/3]" : "aspect-square";
    const video = opts.video ? `<span class="absolute inset-0 flex items-center justify-center"><span class="w-7 h-7 rounded-full bg-black/35 flex items-center justify-center text-white text-xs">▶</span></span>` : "";
    return `<div class="relative ${shape} overflow-hidden cursor-pointer group" style="border-radius:10px;" onclick="openPhotoDetail('${src}', -1)">
        <img src="${src}" class="w-full h-full object-cover group-hover:opacity-80 transition-opacity" loading="lazy"/>
        ${video}
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
    </div>`;
}
let photoSelectionMode = false;
let selectedPhotoIndexes = new Set();

function uploadedPhotoCard(idx){
    const p = UPLOADED_PHOTOS[idx];
    if(photoSelectionMode){
        const checked = selectedPhotoIndexes.has(idx);
        return `<div class="relative aspect-square overflow-hidden block w-full cursor-pointer" style="border-radius:10px;" onclick="togglePhotoCheckboxFromCard(${idx})">
            <img src="${p.src}" class="w-full h-full object-cover" loading="lazy" style="${checked ? 'opacity:0.55;' : ''}"/>
            <span style="position:absolute;top:6px;left:6px;width:22px;height:22px;border-radius:50%;background:${checked ? '#FF8A7A' : 'rgba(255,255,255,0.85)'};border:2px solid ${checked ? '#FF8A7A' : '#ccc'};display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800;">${checked ? '✓' : ''}</span>
        </div>`;
    }
    const tagCount = p.tags.length;
    const badge = tagCount > 0
        ? `<span class="absolute bottom-1 right-1 bg-[#5FA88F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">🏷️ ${tagCount}</span>`
        : `<span class="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">🏷️ 태그하기</span>`;
    return `<div class="relative aspect-square overflow-hidden block w-full group cursor-pointer" style="border-radius:10px;" onclick="openPhotoDetail('${p.src}', ${idx})">
        <img src="${p.src}" class="w-full h-full object-cover group-hover:opacity-80 transition-opacity" loading="lazy"/>
        ${badge}
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
    </div>`;
}
function photoUrl(seed){ return REAL_PHOTOS[Math.abs(seed) % REAL_PHOTOS.length]; }

/* ================= 픽셀 아이콘 (하단 네비) ================= */
function svgIcon(rects, size, vb){
    const inner = rects.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${r[4]}"/>`).join('');
    return `<svg class="pixel-svg" viewBox="0 0 ${vb} ${vb}" width="${size}" height="${size}">${inner}</svg>`;
}
const ICON_LION = [
    [0,0,14,14,'#D9822E'],
    [5,0,4,2,'#F0A85C'],
    [5,12,4,2,'#F0A85C'],
    [0,5,2,4,'#F0A85C'],
    [12,5,2,4,'#F0A85C'],
    [1,1,2,2,'#F0A85C'],
    [11,1,2,2,'#F0A85C'],
    [1,11,2,2,'#F0A85C'],
    [11,11,2,2,'#F0A85C'],
    [3,3,8,8,'#FBD9A8'],
    [4,8,1,1,'#F4A68C'],
    [9,8,1,1,'#F4A68C'],
    [5,7,1,1,'#2A2118'],
    [8,7,1,1,'#2A2118'],
    [6,8,2,1,'#2A2118'],
    [6,10,2,1,'#2A2118'],
];
const ICON_CAT = [
    [2,0,3,3,'#9CA3AE'],
    [9,0,3,3,'#9CA3AE'],
    [3,1,1,1,'#F8B8C9'],
    [10,1,1,1,'#F8B8C9'],
    [2,3,10,8,'#ADB4BD'],
    [5,7,1,1,'#2A2118'],
    [8,7,1,1,'#2A2118'],
    [6,8,2,1,'#F8B8C9'],
    [0,8,2,1,'#E8EAED'],
    [0,9,2,1,'#E8EAED'],
    [12,8,2,1,'#E8EAED'],
    [12,9,2,1,'#E8EAED'],
];
const ICON_TEDDY = [
    [2,1,3,3,'#8B5E3C'],
    [9,1,3,3,'#8B5E3C'],
    [3,2,1,1,'#C99A6B'],
    [10,2,1,1,'#C99A6B'],
    [3,3,8,8,'#A9764F'],
    [5,7,1,1,'#2A2118'],
    [8,7,1,1,'#2A2118'],
    [6,8,2,2,'#2A2118'],
    [6,10,2,1,'#2A2118'],
];
const ICON_RABBIT = [
    [3,0,2,6,'#D6467D'],
    [9,0,2,6,'#D6467D'],
    [4,1,1,4,'#F48FB1'],
    [10,1,1,4,'#F48FB1'],
    [2,6,10,7,'#F06BA8'],
    [5,9,1,1,'#3A2E27'],
    [8,9,1,1,'#3A2E27'],
    [6,10,2,1,'#3A2E27'],
];

/* ================= 픽셀 아트 (소이 캐릭터) ================= */
const C = { ink:"#1a1613", skin:"#f6ceac", hair:"#3b2417", cheek:"#ea8f8a", red:"#c94a3a", blue:"#3a6dc6", green:"#5a8a4e", yellow:"#e3b04b", pink:"#f0b8b0", lightBlue:"#b7cbe6", ribbon:"#c94a3a", wood:"#a97a4a", mat:"#dfe9f5" };
function svgFromRects(rects, size){
    const inner = rects.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${r[4]}"/>`).join('');
    return `<svg class="pixel-svg" viewBox="0 0 20 20" width="${size}" height="${size}">${inner}</svg>`;
}
function poseLie(dress){ return [[5,13,10,4,C.lightBlue],[4,14,1,2,C.lightBlue],[15,14,1,2,C.lightBlue],[5,12,10,1,C.lightBlue],[8,10,5,3,C.skin],[8,9,5,1,C.hair],[9,11,1,1,C.ink],[11,11,1,1,C.ink],[10,12,1,1,C.cheek]]; }
function poseRoll(dress){ return [[3,15,14,2,C.mat],[6,12,8,4,dress],[4,13,2,2,C.skin],[14,13,2,2,C.skin],[7,7,6,5,C.skin],[7,6,6,1,C.hair],[6,7,1,3,C.hair],[13,7,1,3,C.hair],[8,5,4,1,C.hair],[8,9,1,1,C.ink],[11,9,1,1,C.ink],[7,10,1,1,C.cheek],[12,10,1,1,C.cheek],[9,11,2,1,C.cheek]]; }
function poseSitChair(dress){ return [[3,15,13,1,C.wood],[3,16,1,3,C.wood],[15,16,1,3,C.wood],[3,7,1,9,C.wood],[3,7,3,1,C.wood],[7,10,6,5,dress],[5,11,2,3,C.skin],[13,11,2,3,C.skin],[6,15,3,2,C.skin],[11,15,3,2,C.skin],[7,4,6,5,C.skin],[7,3,6,1,C.hair],[6,4,1,4,C.hair],[13,4,1,4,C.hair],[8,2,4,1,C.hair],[8,6,1,1,C.ink],[11,6,1,1,C.ink],[7,7,1,1,C.cheek],[12,7,1,1,C.cheek]]; }
function poseCrawl(dress){ return [[7,10,8,4,dress],[3,8,5,5,C.skin],[3,7,5,1,C.hair],[2,8,1,3,C.hair],[3,6,3,1,C.hair],[4,10,1,1,C.ink],[6,10,1,1,C.ink],[3,11,1,1,C.cheek],[7,11,1,1,C.cheek],[5,13,2,3,C.skin],[8,14,2,2,C.skin],[12,13,2,3,C.skin],[15,12,2,4,C.skin]]; }
function poseStand(dress){ return [[7,3,6,5,C.skin],[7,2,6,1,C.hair],[6,3,1,5,C.hair],[13,3,1,5,C.hair],[8,1,4,1,C.hair],[8,5,1,1,C.ink],[11,5,1,1,C.ink],[7,6,1,1,C.cheek],[12,6,1,1,C.cheek],[9,7,2,1,C.ink],[7,8,6,5,dress],[4,9,2,2,C.skin],[14,9,2,2,C.skin],[8,13,2,4,C.skin],[11,13,2,4,C.skin],[8,17,2,1,C.ink],[11,17,2,1,C.ink],[2,6,2,10,C.wood]]; }
function poseWalk(dress){ return [[7,2,6,5,C.skin],[7,1,6,1,C.hair],[6,2,1,5,C.hair],[13,2,1,5,C.hair],[8,0,4,1,C.hair],[8,4,1,1,C.ink],[11,4,1,1,C.ink],[7,5,1,1,C.cheek],[12,5,1,1,C.cheek],[9,6,2,1,C.ink],[7,7,6,5,dress],[6,11,8,1,dress],[4,8,2,2,C.skin],[14,8,2,2,C.skin],[7,12,2,4,C.skin],[11,12,2,3,C.skin],[12,15,3,1,C.skin],[7,16,2,1,C.ink],[12,16,3,1,C.ink]]; }
function poseRun(dress){ return [[7,2,6,5,C.skin],[7,1,6,1,C.hair],[6,2,1,5,C.hair],[13,2,1,5,C.hair],[8,0,4,1,C.hair],[8,4,1,1,C.ink],[11,4,1,1,C.ink],[7,5,1,1,C.cheek],[12,5,1,1,C.cheek],[9,6,2,1,C.ink],[7,7,6,5,dress],[6,11,8,1,dress],[3,7,2,2,C.skin],[15,9,2,2,C.skin],[6,12,2,3,C.skin],[12,12,2,5,C.skin],[6,15,2,1,C.ink],[12,17,2,1,C.ink]]; }

const STAGES = [
    { label:"목 가누기", months:"0~3개월", desc:"누워서 목을 가누기 시작해요", pose:poseLie },
    { label:"뒤집기", months:"3~6개월", desc:"뒤집고 배밀이를 준비해요", pose:poseRoll },
    { label:"혼자 앉기", months:"6~8개월", desc:"의자에 앉아서 노는 걸 좋아해요", pose:poseSitChair },
    { label:"기어다니기", months:"6~9개월", desc:"네 발로 신나게 기어다녀요", pose:poseCrawl },
    { label:"잡고 서기", months:"8~9개월", desc:"가구를 잡고 일어서 봐요", pose:poseStand },
    { label:"걸음마", months:"9~15개월", desc:"첫 걸음을 떼기 시작해요", pose:poseWalk },
    { label:"뛰어놀기", months:"15개월+", desc:"신나게 뛰어다녀요", pose:poseRun },
];
const CURRENT_STAGE_INDEX = 5;
const MONTH_POSE_MAP = { 3:{pose:poseRoll, dress:C.red}, 6:{pose:poseSitChair, dress:C.yellow}, 9:{pose:poseCrawl, dress:C.blue}, 12:{pose:poseWalk, dress:C.pink} };

const ITEMS = [
    { id:"ribbon", name:"머리 리본", icon:"🎀", xpNeeded:30 },
    { id:"dress_pink", name:"분홍 원피스", icon:"👗", xpNeeded:60 },
    { id:"shoes_bow", name:"리본 신발", icon:"👟", xpNeeded:100 },
];

let state = { totalXP: 290, totalComments: 12, totalLikes: 34 };
function getLevel(xp){ return Math.floor(xp/50)+1; }
function getUnlocked(xp){ return ITEMS.filter(i=>xp>=i.xpNeeded).map(i=>i.id); }
function decoratedRects(stageIndex){
    const idx = (typeof stageIndex === 'number') ? stageIndex : CURRENT_STAGE_INDEX;
    const unlocked = getUnlocked(state.totalXP);
    const dress = unlocked.includes("dress_pink") ? C.pink : C.yellow;
    let rects = STAGES[idx].pose(dress);
    if(unlocked.includes("ribbon")) rects = rects.concat([[9,0,2,1,C.ribbon]]);
    return rects;
}

/* ================= 데이터 ================= */
const MONTH_PREVIEWS = [ {month:3, seed:5}, {month:6, seed:11}, {month:9, seed:22}, {month:12, seed:33} ];
const MORE_MONTHS_COUNT = Math.max(0, CURRENT_AGE_MONTHS - MONTH_PREVIEWS.length);
const MONTH_BG = ["#FFE0D2","#FFEED9","#BCE8DA","#FFD9E1"];

/* ================= 가족 앨범: 가입한 사람만 동적으로 카드 생성 ================= */
/* 이미 등록된 것처럼 시연할 가짜 프로필 (실제로는 서버에 저장된 데이터) */
const EXISTING_PROFILES = {
    "엄마":     { name:"엄마",     photoSeed:501, comments:24, likes:38, photoCount:16 },
    "아빠":     { name:"아빠",     photoSeed:502, comments:31, likes:42, photoCount:22 },
    "할머니":   { name:"친할머니", photoSeed:503, comments:18, likes:26, photoCount:14 },
    "할아버지": { name:"할아버지", photoSeed:504, comments:12, likes:19, photoCount:12 },
    "외할아버지": { name:"외할아버지", photoSeed:505, comments:10, likes:15, photoCount:11 },
    "고모":     { name:"고모",     photoSeed:506, comments:5,  likes:7,  photoCount:3  },
    "외삼촌":   { name:"외삼촌",   photoSeed:507, comments:9,  likes:15, photoCount:4  },
};

/* 미리 만들어두지 않고, EXISTING_PROFILES(이미 가입된 것으로 시연하는 멤버)로부터 초기 목록을 구성.
   이후 온보딩을 완료하는 신규 멤버가 생기면 completeOnboarding()에서 이 배열에 추가됨. */
let REGISTERED_FAMILY = Object.keys(EXISTING_PROFILES).map(relation => ({
    relation,
    name: EXISTING_PROFILES[relation].name,
    seed: EXISTING_PROFILES[relation].photoSeed,
    comments: EXISTING_PROFILES[relation].comments,
    likes: EXISTING_PROFILES[relation].likes,
    photoCount: EXISTING_PROFILES[relation].photoCount,
}));
let nextFamilySeed = 600;
const UNLOCK_THRESHOLD = 10;

/* ================= 최근 활동 피드 ================= */
let ACTIVITY_FEED = [
    { type:"comment", name:"이모할머니", emoji:"👵", text:"밥좀 마니 주세요.....", photoSeed:12, date:new Date(2026,7,28) },
    { type:"comment", name:"할아버지", emoji:"👴", text:"우리 소이 최고! 오늘도 예쁘네", photoSeed:45, date:new Date(2026,7,28) },
    { type:"upload", name:"엄마", emoji:"👩", count:3, photoSeed:60, date:new Date(2026,7,28) },
    { type:"like", name:"아빠", emoji:"👨", count:5, date:new Date(2026,7,27) },
    { type:"comment", name:"이모", emoji:"👩‍🦱", text:"까르르 웃는 거 너무 귀여워요", photoSeed:70, date:new Date(2026,7,27) },
];
const MEMORY_CARDS = [
    { label:"한 달 전 소이는 어땠을까?", sub:"1개월 전 오늘", photoSeed:910 },
    { label:"일 년 전 소이의 하루", sub:"1년 전 오늘", photoSeed:911 },
    { label:"저번주 소이는 이렇게 놀았대요", sub:"7일 전", photoSeed:912 },
];
function timeAgoLabel(d){
    const diffDays = Math.floor((TODAY - d)/(24*60*60*1000));
    if(diffDays<=0) return "오늘";
    if(diffDays===1) return "어제";
    return `${d.getMonth()+1}.${d.getDate()}`;
}
function activityBodyHtml(a){
    if(a.type === "comment"){
        return `<div class="card p-3.5 flex gap-3 items-center">
            <div class="flex-1">
                <p class="text-xs font-bold text-[#3A2E27]">💬 ${a.name}님이 댓글을 남겼어요</p>
                <div class="bg-[#F6F3EE] rounded-xl px-3 py-2 mt-1.5">
                    <p class="text-[11px] text-[#C9BFB2] font-bold">${a.emoji} ${a.name}</p>
                    <p class="text-xs text-[#5C5048]">${a.text}</p>
                </div>
            </div>
            <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onclick="openPhotoDetail('${photoUrl(a.photoSeed)}', -1)"><img src="${photoUrl(a.photoSeed)}" class="w-full h-full object-cover"/></div>
        </div>`;
    } else if(a.type === "upload"){
        return `<div class="card p-3.5 flex items-center gap-3">
            <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onclick="openPhotoDetail('${photoUrl(a.photoSeed)}', -1)"><img src="${photoUrl(a.photoSeed)}" class="w-full h-full object-cover"/></div>
            <p class="text-xs font-bold text-[#3A2E27]">📸 ${a.name}님이 새 사진 ${a.count}장을 올렸어요</p>
        </div>`;
    } else {
        return `<div class="card p-3.5 flex items-center gap-3">
            <span class="text-2xl">❤️</span>
            <p class="text-xs font-bold text-[#3A2E27]">${a.name}님이 좋아요 ${a.count}개를 눌렀어요</p>
        </div>`;
    }
}
function memoryBodyHtml(mem){
    return `<div class="card p-4 flex gap-3" style="background:linear-gradient(135deg,#EDF3FF,#F3EEFB);">
        <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"><img src="${photoUrl(mem.photoSeed)}" class="w-full h-full object-cover"/></div>
        <div class="flex-1">
            <p class="font-display text-sm text-[#4A5A9A]">${mem.label}</p>
            <p class="text-[11px] text-[#8B95D1] mt-1">${mem.sub}</p>
        </div>
        <span class="text-lg">✨</span>
    </div>`;
}
function renderActivityFeed(){
    const el = document.getElementById("activityFeed");
    if(!el) return;
    const items = ACTIVITY_FEED.slice(0,8);
    const combined = [];
    let memIdx = 0;
    items.forEach((a, idx) => {
        combined.push({ kind:"activity", data:a });
        if((idx+1) % 2 === 0 && memIdx < MEMORY_CARDS.length){
            combined.push({ kind:"memory", data:MEMORY_CARDS[memIdx] });
            memIdx++;
        }
    });
    el.innerHTML = combined.map((entry, idx) => {
        const isLast = idx === combined.length-1;
        const isMemory = entry.kind === "memory";
        const dotColor = isMemory ? "#8B95D1" : "#FF8A7A";
        const body = isMemory ? memoryBodyHtml(entry.data) : activityBodyHtml(entry.data);
        const timeLabel = isMemory ? "추억 회상" : timeAgoLabel(entry.data.date);
        return `<div class="flex gap-3 pb-2.5">
            <div class="flex flex-col items-center">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style="background:${dotColor}"></span>
                ${isLast ? '' : '<span class="w-0.5 flex-1 bg-gray-200 mt-1"></span>'}
            </div>
            <div class="flex-1 -mt-0.5">
                <p class="text-[11px] text-[#C9BFB2] mb-1 font-bold">${timeLabel}</p>
                ${body}
            </div>
        </div>`;
    }).join('');
}
function pushActivity(entry){
    ACTIVITY_FEED.unshift(entry);
    renderActivityFeed();
}

/* ================= 렌더: 홈 ================= */
function renderHome(){
    document.getElementById("homeCharDisplay").innerHTML = svgFromRects(decoratedRects(), 60);
    document.getElementById("homeDday").textContent = dDay(TODAY);

    const growthRow = document.getElementById("growthRow");
    let html = MONTH_PREVIEWS.map((m,idx) => {
        const mp = MONTH_POSE_MAP[m.month];
        return `<button onclick="openMonthDetail(${m.month})" class="text-center">
            <div class="w-14 h-14 mx-auto mb-1 rounded-2xl flex items-center justify-center shadow-sm" style="background:${MONTH_BG[idx]}">
                ${svgFromRects(mp.pose(mp.dress), 38)}
            </div>
            <p class="font-display text-xs text-[#3A2E27]">${m.month}개월</p>
        </button>`;
    }).join('');
    html += `
        <button onclick="switchTab('album', event)" class="text-center">
            <div class="w-14 h-14 mx-auto mb-1 rounded-2xl flex items-center justify-center bg-[#F4F1EC] shadow-sm">
                <span class="font-display text-base text-[#FF8A7A]">+${MORE_MONTHS_COUNT}</span>
            </div>
            <p class="font-display text-xs text-[#3A2E27]">더보기</p>
        </button>`;
    growthRow.innerHTML = html;

    document.getElementById("calMonthLabel").textContent = `${TODAY.getFullYear()}년 ${TODAY.getMonth()+1}월`;
    renderMiniCalendar();

    const todayGrid = document.getElementById("todayGrid");
    let t = '';
    UPLOADED_PHOTOS.forEach((p, idx) => {
        const pd = p.date || TODAY;
        const isToday = pd.getFullYear()===TODAY.getFullYear() && pd.getMonth()===TODAY.getMonth() && pd.getDate()===TODAY.getDate();
        if(isToday) t += uploadedPhotoCard(idx);
    });
    for(let i=0;i<8;i++) t += photoCard(100+i);
    t += `<button onclick="switchTab('album', event)" class="aspect-square flex flex-col items-center justify-center bg-[#F4F1EC]">
                <span class="font-display text-base text-[#3A2E27]">더보기</span>
                <span class="text-[10px] text-[#C9BFB2] font-bold">전체 앨범</span>
          </button>`;
    todayGrid.innerHTML = t;

    renderActivityFeed();
    renderWeeklyVote();
    renderMonthlyStats();
}

function renderMiniCalendar(targetId){
    targetId = targetId || "calGrid";
    const y = TODAY.getFullYear(), m = TODAY.getMonth();
    const firstDay = new Date(y,m,1);
    const daysInMonth = new Date(y,m+1,0).getDate();
    const startOffset = (firstDay.getDay()+6)%7;
    const photoSeeds = {3:201, 7:202, 10:203, 12:204, 16:205, 19:206, 23:207};
    let html = ['월','화','수','목','금','토','일'].map(d=>`<div class="text-[#C9BFB2] py-1.5 text-xs font-bold">${d}</div>`).join('');
    for(let i=0;i<startOffset;i++) html += `<div class="py-4"></div>`;
    for(let d=1; d<=daysInMonth; d++){
        const hasPhoto = photoSeeds[d] !== undefined && d <= TODAY.getDate();
        const isToday = d === TODAY.getDate();
        if(isToday){
            html += `<div class="relative w-12 h-12 mx-auto my-1 rounded-full overflow-hidden ring-2 ring-[#FF8A7A] shadow-sm cursor-pointer" style="transform:scale(0.8); transform-origin:center;" onclick="openPhotoDetail('${photoUrl(500)}', -1)">
                <img src="${photoUrl(500)}" class="w-full h-full object-cover"/>
                <span class="absolute inset-0 flex items-center justify-center bg-[#3A2E27]/45 text-white font-bold text-base" style="transform:scale(1.25);">${d}</span>
            </div>`;
        } else if(hasPhoto){
            html += `<div class="relative w-12 h-12 mx-auto my-1 rounded-full overflow-hidden shadow-sm cursor-pointer" style="transform:scale(0.8); transform-origin:center;" onclick="openPhotoDetail('${photoUrl(photoSeeds[d])}', -1)">
                <img src="${photoUrl(photoSeeds[d])}" class="w-full h-full object-cover"/>
                <span class="absolute inset-0 flex items-center justify-center bg-[#3A2E27]/35 text-white font-bold text-sm" style="transform:scale(1.25);">${d}</span>
            </div>`;
        } else {
            html += `<div class="py-4 text-[#7A6A5A] text-sm font-bold">${d}</div>`;
        }
    }
    document.getElementById(targetId).innerHTML = html;
}

/* ================= 렌더: 앨범 (연속 스크롤) ================= */
function buildAlbumFeed(){
    const groups = [];
    const keyOf = (y,mm,d) => `${y}-${mm}-${d}`;
    const groupMap = {};

    let cursor = new Date(TODAY);
    let seedBase = 500;
    for(let i=0;i<40;i++){
        const y = cursor.getFullYear(), mm = cursor.getMonth()+1, d = cursor.getDate();
        const photoCount = 4 + (d % 4);
        const g = { y, mm, d, date:new Date(cursor), photoCount, seedStart: seedBase };
        groups.push(g);
        groupMap[keyOf(y,mm,d)] = g;
        seedBase += photoCount + 3;
        cursor.setDate(cursor.getDate() - (3 + (i%3)));
    }

    /* 실제 업로드된 사진의 날짜 중, 위 데모 그룹에 없는 날짜는 새 그룹으로 추가 */
    UPLOADED_PHOTOS.forEach(p => {
        const pd = p.date || TODAY;
        const y = pd.getFullYear(), mm = pd.getMonth()+1, d = pd.getDate();
        const key = keyOf(y,mm,d);
        if(!groupMap[key]){
            const g = { y, mm, d, date:new Date(pd), photoCount:0, seedStart:null };
            groups.push(g);
            groupMap[key] = g;
        }
    });

    groups.sort((a,b) => b.date - a.date);
    return groups;
}
function renderAlbumTab(){
    document.getElementById("albumHeaderAvatar").src = photoUrl(1);
    renderAlbumFeatured();
    const groups = buildAlbumFeed();

    /* 월 바로가기 탭: 태어난 달부터 이번 달까지 전체 범위 생성 (사진이 아직 없어도 탭은 보여줌) */
    const monthTabs = [];
    let mCursor = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    const birthMonthStart = new Date(BIRTH_DATE.getFullYear(), BIRTH_DATE.getMonth(), 1);
    while(mCursor >= birthMonthStart){
        monthTabs.push({ y: mCursor.getFullYear(), mm: mCursor.getMonth()+1 });
        mCursor.setMonth(mCursor.getMonth()-1);
    }
    document.getElementById("monthTabs").innerHTML = monthTabs.map((t, idx) => {
        const ym = `${t.y}-${String(t.mm).padStart(2,'0')}`;
        const prevY = idx > 0 ? monthTabs[idx-1].y : null;
        const yearChanged = idx === 0 || t.y !== prevY;
        const label = yearChanged ? `${String(t.y).slice(2)}년 ${t.mm}월` : `${t.mm}월`;
        return `<button onclick="jumpToMonth('${ym}')" class="month-tab ${idx===0?'active':''}" data-ym="${ym}">${label}</button>`;
    }).join('');

    let html = '';
    groups.forEach((g)=>{
        const wd = WD[g.date.getDay()];
        const label = `${g.y}.${String(g.mm).padStart(2,'0')}.${String(g.d).padStart(2,'0')}. (${wd}) D+${dDay(g.date)}`;
        const ym = `${g.y}-${String(g.mm).padStart(2,'0')}`;
        const matchedUploads = [];
        UPLOADED_PHOTOS.forEach((p, idx) => {
            const pd = p.date || TODAY;
            if(pd.getFullYear()===g.y && pd.getMonth()+1===g.mm && pd.getDate()===g.d) matchedUploads.push(idx);
        });
        if(matchedUploads.length === 0 && g.seedStart === null) return; /* 실제 사진도 없고 데모 데이터도 없는 빈 그룹은 건너뜀 */
        const groupTags = matchedUploads.flatMap(idx => UPLOADED_PHOTOS[idx].tags || []).join(',').toLowerCase();
        html += `<div class="date-group" data-ym="${ym}" data-label="${label}" data-tags="${groupTags}">
            <p class="text-sm font-bold text-[#3A2E27] mb-3">${label}</p>
            <div class="photo-grid-container">
                <div class="grid grid-cols-3 gap-1 photo-grid-80">`;
        matchedUploads.forEach(idx => html += uploadedPhotoCard(idx));
        if(g.seedStart !== null){
            for(let i=0;i<g.photoCount;i++){
                html += photoCard(g.seedStart+i);
            }
        }
        html += `</div></div></div>`;
    });
    document.getElementById("albumBody").innerHTML = html;
    if(photoSelectionMode){
        const cnt = document.getElementById('selectedCount');
        if(cnt) cnt.textContent = `선택됨: ${selectedPhotoIndexes.size}`;
    }
    setTimeout(updateDateBadge, 50);
}
function getAlbumTotalPhotoCount(){
    const groups = buildAlbumFeed();
    let demoTotal = 0;
    groups.forEach(g => { if(g.seedStart !== null) demoTotal += g.photoCount; });
    return demoTotal + UPLOADED_PHOTOS.length;
}

function renderAlbumFeatured(){
    document.getElementById('albumPhotoCount').textContent = getAlbumTotalPhotoCount();
    renderMiniCalendar('albumCalGrid');

    let featuredSrc, featuredIdx;
    if(UPLOADED_PHOTOS.length){
        featuredIdx = 0; // 최신 업로드가 항상 배열 맨 앞(unshift)
        featuredSrc = UPLOADED_PHOTOS[0].src;
    } else {
        featuredIdx = -1;
        featuredSrc = photoUrl(1);
    }
    const featuredEl = document.getElementById('albumFeaturedPhoto');
    featuredEl.innerHTML = `<img src="${featuredSrc}" style="width:100%;height:100%;object-fit:cover;"/>`;
    featuredEl.onclick = () => openPhotoDetail(featuredSrc, featuredIdx);
}

/* 사진(N장)/영상(N개) 버튼: 누르면 전체 그리드 모드로, 다시 누르면 기본 화면으로 */
let albumGridMode = null; // null = 기본화면(캘린더+대표사진+이어지는 피드), 'photo' | 'video' = 전체 그리드
function toggleAlbumGridMode(mode){
    albumGridMode = (albumGridMode === mode) ? null : mode;

    const photoBtn = document.getElementById('albumPhotoTabBtn');
    const videoBtn = document.getElementById('albumVideoTabBtn');
    const photoActive = albumGridMode === 'photo';
    const videoActive = albumGridMode === 'video';
    photoBtn.style.background = photoActive ? '#FF8A7A' : '#F6F1E9';
    photoBtn.style.color = photoActive ? '#fff' : '#9B8A7C';
    videoBtn.style.background = videoActive ? '#FF8A7A' : '#F6F1E9';
    videoBtn.style.color = videoActive ? '#fff' : '#9B8A7C';

    const showGrid = albumGridMode !== null;
    document.getElementById('albumDefaultSection').classList.toggle('hidden', showGrid);
    document.getElementById('albumFullGridSection').classList.toggle('hidden', !showGrid);
    if(showGrid) renderAlbumFullGrid(albumGridMode);
}

function renderAlbumFullGrid(mode){
    const grid = document.getElementById('albumFullGrid');
    if(mode === 'photo'){
        let html = '';
        UPLOADED_PHOTOS.forEach((p, i) => { html += uploadedPhotoCard(i); });
        const demoCount = Math.max(getAlbumTotalPhotoCount() - UPLOADED_PHOTOS.length, 0);
        for(let i=0;i<demoCount;i++){ html += photoCard(400+i); }
        grid.innerHTML = html;
    } else {
        let html = '';
        for(let i=0;i<12;i++){ html += photoCard(600+i, {video:true}); }
        grid.innerHTML = html;
    }
}

function handleAlbumSearch(){
    const q = document.getElementById('albumSearchInput').value.trim().toLowerCase();
    document.querySelectorAll('#albumBody .date-group').forEach(group => {
        if(!q){ group.style.display=''; return; }
        const label = (group.dataset.label||'').toLowerCase();
        const tags = (group.dataset.tags||'').toLowerCase();
        group.style.display = (label.includes(q) || tags.includes(q)) ? '' : 'none';
    });
}

function jumpToMonth(ym){
    const target = document.querySelector(`.date-group[data-ym="${ym}"]`);
    if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
    } else {
        showToast('이 달엔 아직 등록된 사진이 없어요', innerWidth/2, innerHeight/2, '#9B8A7C');
    }
    document.querySelectorAll('.month-tab').forEach(el=>el.classList.toggle('active', el.dataset.ym===ym));
}
function updateDateBadge(){
    const scrollArea = document.getElementById('scrollArea');
    const groups = document.querySelectorAll('.date-group');
    const areaTop = scrollArea.getBoundingClientRect().top;
    let current = null;
    groups.forEach(g=>{
        const r = g.getBoundingClientRect();
        if(r.top - areaTop < 90) current = g;
    });
    if(current){
        document.getElementById('dateBadgeText').textContent = current.dataset.label;
        document.querySelectorAll('.month-tab').forEach(el=>el.classList.toggle('active', el.dataset.ym===current.dataset.ym));
    }
}
let scrollIdleTimer;
document.getElementById('scrollArea').addEventListener('scroll', ()=>{
    if(!document.getElementById('tab-album').classList.contains('active')) return;
    document.getElementById('dateBadge').style.opacity = '0';
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(()=>{
        updateDateBadge();
        document.getElementById('dateBadge').style.opacity = '1';
    }, 350);
});

/* ================= 렌더: 가족 ================= */
function renderFamily(){
    document.getElementById("familyGrid").innerHTML = REGISTERED_FAMILY.map((m, idx) => {
        const locked = m.photoCount < UNLOCK_THRESHOLD;
        if(locked){
            return `
            <button onclick="openLockedFamilyModal(${idx})" class="card p-3 text-center">
                <div class="avatar-ring w-14 h-14 mx-auto mb-2 relative overflow-hidden">
                    <img src="${photoUrl(m.seed*13)}" class="w-full h-full object-cover" style="filter:grayscale(1) blur(2px);"/>
                    <span class="absolute inset-0 flex items-center justify-center text-lg">🔒</span>
                </div>
                <p class="font-display text-sm text-[#3A2E27]">${m.name}</p>
                <p class="text-[10px] text-[#C9BFB2] font-bold">🔒 ${m.photoCount} / ${UNLOCK_THRESHOLD}장</p>
            </button>`;
        }
        return `
            <button onclick="openFamilyMember(${idx})" class="card p-3 text-center">
                <div class="avatar-ring w-14 h-14 mx-auto mb-2"><img src="${photoUrl(m.seed*13)}" class="w-full h-full object-cover"/></div>
                <p class="font-display text-sm text-[#3A2E27]">${m.name}</p>
                <p class="text-[10px] text-[#C9BFB2] font-bold">💬${m.comments} ❤️${m.likes}</p>
            </button>`;
    }).join('') || `<p class="col-span-3 text-center text-xs text-[#C9BFB2] font-bold py-6">아직 가입한 가족이 없어요</p>`;

    const unlockedMembers = REGISTERED_FAMILY.filter(m => m.photoCount >= UNLOCK_THRESHOLD);
    const photoRowSection = document.getElementById("familyPhotoRow").parentElement;
    if(unlockedMembers.length === 0){
        photoRowSection.classList.add('hidden');
    } else {
        photoRowSection.classList.remove('hidden');
        document.getElementById("familyPhotoRow").innerHTML = unlockedMembers.map(m => {
            const idx = REGISTERED_FAMILY.indexOf(m);
            return `
            <button onclick="openFamilyMember(${idx})" class="w-full bg-white rounded-3xl p-2 shadow-sm block">
                <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden">
                    <img src="${photoUrl(m.seed*13+5)}" class="w-full h-full object-cover"/>
                </div>
            </button>`;
        }).join('');
    }
}
function openLockedFamilyModal(idx){
    const m = REGISTERED_FAMILY[idx];
    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 text-center pop-in" style="max-width:300px;">
        <p class="text-3xl mb-2">🔒</p>
        <p class="font-display text-lg text-[#3A2E27] mb-3">아직 비밀 앨범이에요!</p>
        <p class="text-sm text-[#9B8A7C] leading-relaxed">${m.name}님과 소이가 함께 찍은 사진이<br/>10장 이상 모이면 앨범이 오픈됩니다!<br/>(현재 ${m.photoCount}장 / ${UNLOCK_THRESHOLD}장)<br/><br/>소이를 자주 만나러 오셔서<br/>소중한 추억을 많이 남겨주세요 📸✨</p>
        <button onclick="this.closest('.levelup-modal').remove()" class="mt-4 bg-[#FF8A7A] text-white text-sm font-bold px-5 py-2 rounded-full">확인</button>
    </div>`;
    document.body.appendChild(modal);
}
function openFamilyMember(idx){
    const m = REGISTERED_FAMILY[idx];
    document.getElementById("familyDetailTitle").innerHTML = `<span class="inline-flex items-center gap-2"><span class="w-8 h-8 rounded-full overflow-hidden inline-block align-middle"><img src="${photoUrl(m.seed*13)}" class="w-full h-full object-cover"/></span>${m.name}</span>`;
    let photos = '';
    for(let i=0;i<m.photoCount;i++){
        photos += `<div class="relative aspect-square overflow-hidden cursor-pointer group" style="border-radius:10px;" onclick="openFamilyPhotoDetail(${idx}, ${i})">
            <img src="${photoUrl(m.seed*50+i)}" class="w-full h-full object-cover group-hover:opacity-80 transition-opacity" loading="lazy"/>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
        </div>`;
    }
    document.getElementById("familyDetailBody").innerHTML = `
        <div class="flex justify-center gap-3">
            <span class="chip bg-[#E3F5EF] text-[#5FA88F]">💬 댓글 ${m.comments}개</span>
            <span class="chip bg-[#FFF0F3] text-[#FF8A7A]">❤️ 좋아요 ${m.likes}개</span>
        </div>
        <div class="grid grid-cols-3 gap-1">${photos}</div>
    `;
    openOverlay('overlay-family');
}

/* ================= 렌더: 마이 ================= */
function renderMy(){
    document.getElementById("myProfileImg").src = (typeof onboardState !== 'undefined' && onboardState.photo) ? onboardState.photo : photoUrl(900);
    const charStageIndex = (typeof isFirstTimeMember !== 'undefined' && isFirstTimeMember) ? 0 : CURRENT_STAGE_INDEX;
    document.getElementById("charDisplay").innerHTML = svgFromRects(decoratedRects(charStageIndex), 140);
    const level = getLevel(state.totalXP);
    const xpInLevel = state.totalXP % 50;
    document.getElementById("levelBadge").textContent = `Lv.${level}`;
    document.getElementById("stageNameBig").textContent = STAGES[charStageIndex].label;
    document.getElementById("xpBar").style.width = `${(xpInLevel/50)*100}%`;
    document.getElementById("xpText").textContent = `${xpInLevel} / 50 XP`;
    document.getElementById("totalCommentsText").textContent = state.totalComments;
    document.getElementById("totalLikesText").textContent = state.totalLikes;

    const unlocked = getUnlocked(state.totalXP);
    document.getElementById("unlockedList").innerHTML = ITEMS.map(i=>{
        const on = unlocked.includes(i.id);
        return `<span class="chip ${on ? 'bg-white text-[#C99A2B]' : 'bg-white/40 text-[#C9BFB2]'}">${i.icon} ${i.name}${on? '' : ' (Lv.'+(Math.floor(i.xpNeeded/50)+1)+')'}</span>`;
    }).join('');
}

function renderGrowthTimeline(){
    document.getElementById("stageTimeline").innerHTML = STAGES.map((s, idx)=>{
        const achieved = idx < CURRENT_STAGE_INDEX;
        const isCurrent = idx === CURRENT_STAGE_INDEX;
        const opacity = idx > CURRENT_STAGE_INDEX ? "opacity-50" : "";
        const bg = isCurrent ? "#FFF0F3" : "#fff";
        return `<div class="card p-3 flex items-center gap-3 ${opacity}" style="background:${bg}">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#F6F3EE] flex-shrink-0">${svgFromRects(s.pose(C.yellow), 44)}</div>
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <p class="font-display text-base text-[#3A2E27]">${s.label}</p>
                    ${isCurrent ? '<span class="chip bg-[#FF8A7A] text-white">지금 이 단계</span>' : ''}
                    ${achieved ? '<span class="text-[#5FA88F] text-sm">✓</span>' : ''}
                </div>
                <p class="text-xs text-[#C9BFB2] font-bold">${s.months}</p>
                <p class="text-xs text-[#9B8A7C] mt-0.5">${s.desc}</p>
            </div>
        </div>`;
    }).join('');
}

/* ================= 오버레이 ================= */
function openOverlay(id){ document.getElementById(id).classList.add('show'); }
function closeOverlay(id){ document.getElementById(id).classList.remove('show'); }

function openMonthDetail(month){
    document.getElementById("monthDetailTitle").textContent = `${month}개월 소이`;
    const seedBase = month*7;
    let small = '';
    for(let i=0;i<9;i++) small += photoCard(seedBase+i+1);
    document.getElementById("monthDetailBody").innerHTML = `
        ${photoCard(seedBase, {big:true})}
        <div class="photo-grid-container">
            <div class="grid grid-cols-3 gap-1 photo-grid-80">${small}</div>
        </div>
        <button onclick="closeOverlay('overlay-month'); switchTab('album', null);" class="w-full bg-[#3A2E27] hover:bg-black text-white text-sm font-bold py-3 rounded-2xl">앨범에서 전체보기</button>
    `;
    openOverlay('overlay-month');
}
function openGrowthDetail(){ openOverlay('overlay-growth'); }

function openMyCollection(type){
    const isComment = type === 'comment';
    document.getElementById("mycolTitle").textContent = isComment ? "댓글 단 사진 모음" : "좋아요한 사진 모음";
    const count = isComment ? state.totalComments : state.totalLikes;
    let grid = '';
    for(let i=0;i<count;i++) grid += photoCard((isComment?300:400)+i);
    document.getElementById("mycolBody").innerHTML = `<div class="photo-grid-container"><div class="grid grid-cols-3 gap-1 photo-grid-80">${grid}</div></div>`;
    openOverlay('overlay-mycol');
}
function openInvite(){ openOverlay('overlay-invite'); }

/* ================= 5. 이번 달 소이 통계 (표정/일상 뱃지) ================= */
const MONTHLY_STAT_TAGS = [
    { tag:"#웃음", count:12, color:"#5FA88F" },
    { tag:"#이유식", count:8, color:"#C99A2B" },
    { tag:"#첫걸음", count:3, color:"#5C7CC9" },
];
function renderMonthlyStats(){
    document.getElementById("monthlyStatMain").innerHTML = `이번 달 소이는 <b>아빠</b>님과 함께할 때 가장 많이 웃었어요! 😊`;
    document.getElementById("monthlyStatTags").innerHTML = MONTHLY_STAT_TAGS.map(t =>
        `<span class="chip bg-white" style="color:${t.color}">${t.tag} ${t.count}회</span>`
    ).join('');
}

/* ================= 6. 이주의 베스트 소이 샷 투표 ================= */
let WEEKLY_VOTE_CANDIDATES = [
    { name:"엄마", photoSeed:701, votes:3 },
    { name:"아빠", photoSeed:702, votes:5 },
    { name:"할머니", photoSeed:703, votes:2 },
];
let hasVotedThisWeek = false;
function renderWeeklyVote(){
    const totalVotes = WEEKLY_VOTE_CANDIDATES.reduce((s,c)=>s+c.votes,0);
    const maxVotes = Math.max(...WEEKLY_VOTE_CANDIDATES.map(c=>c.votes));
    const html = WEEKLY_VOTE_CANDIDATES.map((c, idx) => {
        const isLeader = c.votes === maxVotes;
        return `<div class="card p-2 text-center relative">
            ${(hasVotedThisWeek && isLeader) ? `<span class="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">👑</span>` : ''}
            <div class="aspect-square rounded-2xl overflow-hidden mb-2 mt-1 cursor-pointer" onclick="openPhotoDetail('${photoUrl(c.photoSeed)}', -1)">
                <img src="${photoUrl(c.photoSeed)}" class="w-full h-full object-cover"/>
            </div>
            <p class="font-display text-xs text-[#3A2E27]">${c.name}</p>
            <p class="text-[10px] text-[#C9BFB2] font-bold mb-1.5">❤️ ${c.votes}표</p>
            ${hasVotedThisWeek
                ? (isLeader ? `<span class="chip bg-[#FFF0F3] text-[#FF8A7A]">이주의 찍사 📸</span>` : `<span class="text-[10px] text-[#C9BFB2]">투표완료</span>`)
                : `<button onclick="voteForCandidate(${idx}, event)" class="w-full bg-[#FF8A7A] text-white text-[11px] font-bold py-1.5 rounded-full">투표하기</button>`
            }
        </div>`;
    }).join('');
    document.getElementById("weeklyVoteWidget").innerHTML = `<div class="grid grid-cols-3 gap-2">${html}</div>`;
}
function voteForCandidate(idx, evt){
    if(hasVotedThisWeek) return;
    WEEKLY_VOTE_CANDIDATES[idx].votes++;
    hasVotedThisWeek = true;
    addXP(5, evt);
    showToast('투표 완료! 감사해요 💗', evt ? evt.clientX : innerWidth/2, evt ? evt.clientY : innerHeight/2, '#5FA88F');
    renderWeeklyVote();
}

/* ================= 7. 소이 목소리 모음 (Audio Moments) ================= */
let currentPlayingAudio = null;
let AUDIO_MOMENTS = [
    { title:"소이의 첫 웃음소리", uploader:"엄마", duration:"0:07", src:null },
    { title:"소이의 첫 마디 \"엄마\"", uploader:"아빠", duration:"0:04", src:null },
    { title:"옹알이 대화", uploader:"할머니", duration:"0:12", src:null },
];
function waveformBars(seed){
    let bars = '';
    for(let i=0;i<18;i++){
        const h = 6 + Math.abs(Math.sin(seed + i*1.3)) * 18;
        bars += `<span style="display:inline-block; width:2px; height:${h.toFixed(0)}px; background:#F4A67D; border-radius:2px; margin-right:2px;"></span>`;
    }
    return bars;
}
function renderAudioMoments(){
    document.getElementById("audioMomentsList").innerHTML = AUDIO_MOMENTS.map((a, idx) => `
        <div class="card p-4 flex items-center gap-3">
            <button onclick="playAudioMoment(${idx})" id="audioPlayBtn${idx}" class="w-10 h-10 rounded-full bg-[#FFE0E6] flex items-center justify-center text-lg flex-shrink-0">▶️</button>
            <div class="flex-1 min-w-0">
                <p class="font-display text-sm text-[#3A2E27] truncate">${a.title}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span id="audioWave${idx}" class="flex items-end" style="height:20px;">${waveformBars(idx*7+3)}</span>
                    <span class="text-[10px] text-[#C9BFB2] font-bold flex-shrink-0">${a.duration} · ${a.uploader}</span>
                </div>
            </div>
        </div>`).join('');
}
function openAudioAlbum(){
    renderAudioMoments();
    openOverlay('overlay-audio');
}
function playAudioMoment(idx){
    if(currentPlayingAudio){ currentPlayingAudio.pause(); currentPlayingAudio = null; }
    const a = AUDIO_MOMENTS[idx];
    const src = a.src || 'audio/beep.wav';
    const audio = new Audio(src);
    currentPlayingAudio = audio;
    const wave = document.getElementById(`audioWave${idx}`);
    wave.style.animation = 'breathe .5s ease-in-out infinite';
    audio.play().catch(()=>{});
    audio.onended = () => { wave.style.animation = ''; };
    setTimeout(()=>{ wave.style.animation = ''; }, 3000);
}
function handleAudioUpload(evt){
    const file = evt.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const authorName = (typeof onboardState !== 'undefined' && onboardState.name) ? onboardState.name : '가족';
        AUDIO_MOMENTS.unshift({ title:`${authorName}가 남긴 목소리`, uploader:authorName, duration:"녹음됨", src:e.target.result });
        renderAudioMoments();
        showToast('목소리가 저장됐어요! 🎙️', innerWidth/2, innerHeight/2, '#5FA88F');
    };
    reader.readAsDataURL(file);
}

/* ================= 사진 업로드 (촬영일 자동감지 + 한 장씩 바로 커밋) ================= */
let UPLOADED_PHOTOS = [];
let uploadDateManuallySet = false;

function openUploadModal(){
    uploadDateManuallySet = false;
    document.getElementById('uploadPhotoPreview').innerHTML = `<span class="text-4xl">🖼️</span><span class="text-xs text-[#9B8A7C] font-bold">탭해서 사진 선택 (여러 장 가능)</span>`;
    document.getElementById('uploadPhotoPreview').className = 'w-full aspect-square rounded-3xl bg-[#F6F1E9] flex flex-col items-center justify-center gap-2 overflow-hidden';
    const y = TODAY.getFullYear(), m = String(TODAY.getMonth()+1).padStart(2,'0'), d = String(TODAY.getDate()).padStart(2,'0');
    document.getElementById('uploadDateInput').value = `${y}-${m}-${d}`;
    openOverlay('overlay-upload');
}
function onUploadDateManualChange(){ uploadDateManuallySet = true; }
function sameDate(a,b){
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

/* 큰 원본 그대로 두면 사진 여러 장(특히 50장 이상) 선택 시 브라우저가 멈추므로,
   캔버스로 축소해서 가볍게 만든 뒤 저장한다.
   이미지 디코딩이 안 되거나(예: 일부 웹뷰의 HEIC) 너무 오래 걸리면,
   무한정 멈추지 않도록 일정 시간 후 원본 그대로 폴백한다. */
function fallbackToRawDataURL(file, finish){
    const reader = new FileReader();
    reader.onload = e => finish(e.target.result);
    reader.onerror = () => finish(null);
    reader.readAsDataURL(file);
}
function resizeImageFile(file, maxDim=500){
    return new Promise((resolve) => {
        let settled = false;
        const finish = (val) => { if(!settled){ settled = true; resolve(val); } };
        const timeoutId = setTimeout(() => fallbackToRawDataURL(file, finish), 2000);

        let url;
        try { url = URL.createObjectURL(file); }
        catch(err){ clearTimeout(timeoutId); fallbackToRawDataURL(file, finish); return; }

        const img = new Image();
        img.onload = () => {
            clearTimeout(timeoutId);
            try {
                let w = img.width, h = img.height;
                if(w > h){ if(w > maxDim){ h = Math.round(h*maxDim/w); w = maxDim; } }
                else { if(h > maxDim){ w = Math.round(w*maxDim/h); h = maxDim; } }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const result = canvas.toDataURL('image/jpeg', 0.6);
                URL.revokeObjectURL(url);
                img.src = '';
                canvas.width = 0; canvas.height = 0;
                finish(result);
            } catch(err){
                URL.revokeObjectURL(url);
                img.src = '';
                fallbackToRawDataURL(file, finish);
            }
        };
        img.onerror = () => {
            clearTimeout(timeoutId);
            URL.revokeObjectURL(url);
            fallbackToRawDataURL(file, finish);
        };
        img.src = url;
    });
}
function showUploadProcessing(done, total){
    const preview = document.getElementById('uploadPhotoPreview');
    preview.className = 'w-full aspect-square rounded-3xl bg-[#F6F1E9] flex flex-col items-center justify-center gap-2 overflow-hidden';
    preview.innerHTML = `<span class="text-4xl">⏳</span><span class="text-xs text-[#9B8A7C] font-bold">사진 처리 중... (${done}/${total})</span>`;
}

// 1. 사진 선택 시 '자동 압축' 후 미리보기를 띄우고 임시 저장하는 함수
function handleUploadPhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 파일이 이미지인지 한 번 더 안전하게 확인
    if (!file.type.match('image.*')) {
        showToast('이미지 파일만 업로드 가능합니다.', window.innerWidth/2, window.innerHeight/2, '#D9534F');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // 이미지를 메모리에 로드
        const img = new Image();
        img.onload = function() {
            // --- [핵심] 이미지 압축을 위한 캔버스(Canvas) 작업 시작 ---
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 최대 해상도 설정 (예: 가로 또는 세로 최대 1080px로 제한)
            const MAX_WIDTH = 1080;
            const MAX_HEIGHT = 1080;
            let width = img.width;
            let height = img.height;

            // 원본 비율을 유지하면서 크기 계산
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            // 계산된 크기로 캔버스 크기 지정 및 이미지 그리기
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // 캔버스에 그려진 이미지를 JPEG 포맷, 품질 0.7(70%)로 압축하여 추출
            // 이 과정을 거치면 수 MB의 사진이 100~300KB 내외로 대폭 줄어듭니다.
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            // --------------------------------------------------------

            // 압축된 이미지를 state에 임시 저장 (파이어베이스 연동 시 이 데이터를 업로드하면 됨)
            state.tempPhoto = compressedDataUrl; 
            
            // 태그 모달의 미리보기 영역에 압축된 이미지 렌더링
            document.getElementById('tagPhotoPreview').innerHTML = `<img src="${compressedDataUrl}" class="w-full h-full object-cover rounded-xl"/>`;
            
            // 업로드 모달을 닫고 태그 작성 모달 열기
            closeOverlay('overlay-upload');
            openOverlay('overlay-tagphoto');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    const dateVal = document.getElementById('uploadDateInput').value;
    const uploadDate = dateVal ? new Date(dateVal + 'T00:00:00') : new Date(TODAY);

    if(uploadDateManuallySet){
        startCommitUpload(files, uploadDate, false, null);
        return;
    }

    /* 파일의 lastModified만 보면 되므로 무겁지 않게 바로 계산 가능 */
    const detectedDates = files.map(f => (f && f.lastModified) ? new Date(f.lastModified) : null);
    const hasDifferentDate = detectedDates.some(d => d && !sameDate(d, uploadDate));

    if(!hasDifferentDate){
        startCommitUpload(files, uploadDate, false, null);
        return;
    }

    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 text-center pop-in" style="max-width:300px;">
        <p class="text-3xl mb-2">📅</p>
        <p class="font-display text-lg text-[#3A2E27] mb-2">촬영일이 오늘과 달라요</p>
        <p class="text-sm text-[#9B8A7C] leading-relaxed mb-4">선택한 사진 중 일부는 촬영된 날짜가<br/>오늘과 다른 것 같아요. 어떻게 올릴까요?</p>
        <button id="btnUseDetectedDate" class="w-full bg-[#FF8A7A] text-white font-bold py-3 rounded-2xl text-sm mb-2">촬영일 그대로 올리기</button>
        <button id="btnUseTodayDate" class="w-full bg-[#F6F1E9] text-[#3A2E27] font-bold py-3 rounded-2xl text-sm">전부 오늘 날짜로 올리기</button>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById('btnUseDetectedDate').onclick = () => { modal.remove(); startCommitUpload(files, uploadDate, true, detectedDates); };
    document.getElementById('btnUseTodayDate').onclick = () => { modal.remove(); startCommitUpload(files, uploadDate, false, null); };
}

/* 사진을 한 장씩 처리하는 즉시, 곧바로 UPLOADED_PHOTOS(진짜 앨범)에 반영하고
   임시로 들고 있던 참조는 바로 손을 뗀다. 처리 중 사진들을 별도 배열에
   전부 모아뒀다가 한꺼번에 반영하지 않도록 해서, 대기 중인 사진이 쌓여
   메모리를 누르는 일이 없게 한다. */
function startCommitUpload(files, uploadDate, useDetectedDates, detectedDates){
    let i = 0;
    let committedCount = 0;
    showUploadProcessing(0, files.length);

    function processNext(){
        if(i >= files.length){
            addXP(5 * committedCount);
            renderHome();
            renderAlbumTab();
            closeOverlay('overlay-upload');
            const label = useDetectedDates ? '사진별 촬영일로' : `${uploadDate.getFullYear()}.${String(uploadDate.getMonth()+1).padStart(2,'0')}.${String(uploadDate.getDate()).padStart(2,'0')}로`;
            if(committedCount > 0){
                showToast(`${committedCount}장이 ${label} 올라갔어요! 🏷️`, innerWidth/2, innerHeight/2, '#5FA88F');
            }
            if(committedCount < files.length){
                setTimeout(()=>showToast(`${files.length - committedCount}장은 처리에 실패해서 제외됐어요`, innerWidth/2, innerHeight/2, '#FF8A7A'), 1200);
            }
            return;
        }
        const file = files[i];
        resizeImageFile(file).then(src => {
            if(src){
                const finalDate = (useDetectedDates && detectedDates && detectedDates[i]) ? detectedDates[i] : uploadDate;
                UPLOADED_PHOTOS.unshift({ src, tags:[], date: finalDate });
                committedCount++;
            }
        }).catch(()=>{}).finally(() => {
            i++;
            showUploadProcessing(i, files.length);
            /* 곧바로 다음 사진으로 넘어가지 않고 짧게 쉬어서
               브라우저가 방금 쓴 메모리를 정리할 시간을 준다 */
            setTimeout(processNext, 80);
        });
    }
    processNext();
}

/* ================= 사진 태그하기 (업로드 후, 사진 하나씩 개별로) ================= */
let taggingPhotoIdx = null;
let tagPhotoWorkingSet = new Set();
function openTagPhotoModal(idx){
    taggingPhotoIdx = idx;
    const photo = UPLOADED_PHOTOS[idx];
    tagPhotoWorkingSet = new Set(photo.tags);
    document.getElementById('tagPhotoPreview').innerHTML = `<img src="${photo.src}" class="w-full h-full object-cover"/>`;
    renderTagPhotoList();
    openOverlay('overlay-tagphoto');
}
function renderTagPhotoList(){
    const list = document.getElementById('tagPhotoList');
    if(REGISTERED_FAMILY.length === 0){
        list.innerHTML = `<p class="text-xs text-[#C9BFB2] font-bold">아직 가입한 가족이 없어요</p>`;
        return;
    }
    list.innerHTML = REGISTERED_FAMILY.map((m, idx) => `
        <button onclick="toggleTagPhotoPerson(${idx})" data-personidx="${idx}" class="upload-tag-chip px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${tagPhotoWorkingSet.has(idx) ? 'upload-tag-chip-active' : 'bg-[#F6F1E9] text-[#9B8A7C]'}">${m.name}</button>
    `).join('');
}
function toggleTagPhotoPerson(idx){
    if(tagPhotoWorkingSet.has(idx)) tagPhotoWorkingSet.delete(idx);
    else tagPhotoWorkingSet.add(idx);
    document.querySelector(`[data-personidx="${idx}"]`).classList.toggle('upload-tag-chip-active');
}
function saveTagPhoto(){
    const photo = UPLOADED_PHOTOS[taggingPhotoIdx];
    const before = new Set(photo.tags);
    const after = tagPhotoWorkingSet;

    const added = [...after].filter(idx => !before.has(idx));
    const removed = [...before].filter(idx => !after.has(idx));

    const justUnlocked = [];
    added.forEach(idx => {
        const m = REGISTERED_FAMILY[idx];
        if(!m) return;
        const wasLocked = m.photoCount < UNLOCK_THRESHOLD;
        m.photoCount++;
        if(wasLocked && m.photoCount >= UNLOCK_THRESHOLD) justUnlocked.push(m.name);
        if(EXISTING_PROFILES[m.relation]) EXISTING_PROFILES[m.relation].photoCount = m.photoCount;
    });
    removed.forEach(idx => {
        const m = REGISTERED_FAMILY[idx];
        if(!m) return;
        m.photoCount = Math.max(0, m.photoCount - 1);
        if(EXISTING_PROFILES[m.relation]) EXISTING_PROFILES[m.relation].photoCount = m.photoCount;
    });

    photo.tags = [...after];
    renderFamily();
    renderHome();
    renderAlbumTab();
    closeOverlay('overlay-tagphoto');
    showToast('태그를 저장했어요! 🏷️', innerWidth/2, innerHeight/2, '#5FA88F');

    justUnlocked.forEach((name, i) => {
        setTimeout(()=>{
            const modal = document.createElement("div");
            modal.className = "levelup-modal";
            modal.innerHTML = `<div class="card p-6 text-center pop-in" style="max-width:300px;">
                <p class="text-3xl mb-2">🎉</p>
                <p class="font-display text-lg text-[#3A2E27] mb-2">${name}님의 앨범이 열렸어요!</p>
                <p class="text-sm text-[#9B8A7C] leading-relaxed">소이와 함께한 사진이 10장이 모여서<br/>이제 전체 사진을 모아볼 수 있어요 🔓</p>
                <button onclick="this.closest('.levelup-modal').remove()" class="mt-4 bg-[#FF8A7A] text-white text-sm font-bold px-5 py-2 rounded-full">확인</button>
            </div>`;
            document.body.appendChild(modal);
        }, 400 + i*200);
    });
}

/* ================= 소이 타임캡슐 ================= */
let TIME_CAPSULES = [
    { title:"돌잔치에 열어본 편지", targetDate:new Date(2026,4,15), message:"소이야 돌잔치 축하해! 건강하게 자라줘서 고마워 ❤️", sealedBy:"엄마" },
    { title:"어린이날에 열어볼 편지", targetDate:new Date(2027,4,5), message:"소이야 어린이날 축하해! 언제나 밝고 건강하게 자라렴 🎈", sealedBy:"아빠" },
    { title:"두돌에 열어볼 편지", targetDate:new Date(2027,4,15), message:"소이야 두 살 생일 축하해! 할머니가 늘 응원할게 💐", sealedBy:"할머니" },
];

function renderTimeCapsules(){
    const list = document.getElementById('timeCapsuleList');
    if(TIME_CAPSULES.length === 0){
        list.innerHTML = `<p class="text-center text-xs text-[#C9BFB2] font-bold py-6">아직 만들어진 타임캡슐이 없어요</p>`;
        return;
    }
    list.innerHTML = TIME_CAPSULES.map((c, idx) => {
        const opened = TODAY >= c.targetDate;
        const dateStr = `${c.targetDate.getFullYear()}.${String(c.targetDate.getMonth()+1).padStart(2,'0')}.${String(c.targetDate.getDate()).padStart(2,'0')}`;
        if(!opened){
            return `<button onclick="openLockedCapsuleModal(${idx})" class="w-full card p-4 text-left flex items-center gap-3" style="background:#F6F1E9;">
                <span class="text-2xl">🔒</span>
                <div class="flex-1">
                    <p class="font-display text-sm text-[#3A2E27]">${c.title}</p>
                    <p class="text-[11px] text-[#9B8A7C] font-bold">[D-DAY] ${dateStr}에 열립니다</p>
                </div>
            </button>`;
        }
        return `<button onclick="openUnlockedCapsuleModal(${idx})" class="w-full card p-4 text-left flex items-center gap-3" style="background:#FFF8EE;">
            <span class="text-2xl">🎉</span>
            <div class="flex-1">
                <p class="font-display text-sm text-[#3A2E27]">${c.title}</p>
                <p class="text-[11px] text-[#C99A2B] font-bold">${dateStr}에 열렸어요 · ${c.sealedBy} 남김</p>
            </div>
        </button>`;
    }).join('');
}
function openTimeCapsule(){
    renderTimeCapsules();
    openOverlay('overlay-timecapsule');
}
function toggleTimeCapsuleForm(){
    const form = document.getElementById('timeCapsuleForm');
    form.classList.toggle('hidden');
}
let pickedCapsuleDate = null;
function pickCapsuleDate(type){
    document.querySelectorAll('.tc-date-btn').forEach(el=>el.classList.remove('tc-date-btn-active'));
    const label = document.getElementById('capsuleDateLabel');
    const customInput = document.getElementById('customCapsuleDate');
    if(type === '1year'){
        pickedCapsuleDate = new Date(TODAY.getFullYear()+1, TODAY.getMonth(), TODAY.getDate());
        document.querySelector('[data-preset="1year"]').classList.add('tc-date-btn-active');
        customInput.value = '';
    } else if(type === 'dol'){
        pickedCapsuleDate = new Date(2027,0,15);
        document.querySelector('[data-preset="dol"]').classList.add('tc-date-btn-active');
        customInput.value = '';
    } else if(type === 'adult'){
        pickedCapsuleDate = new Date(TODAY.getFullYear()+19, TODAY.getMonth(), TODAY.getDate());
        document.querySelector('[data-preset="adult"]').classList.add('tc-date-btn-active');
        customInput.value = '';
    } else if(type === 'custom'){
        if(customInput.value) pickedCapsuleDate = new Date(customInput.value);
    }
    if(pickedCapsuleDate){
        const d = pickedCapsuleDate;
        label.textContent = `📅 ${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}에 열려요`;
        label.classList.remove('hidden');
    }
}
function submitTimeCapsule(){
    const message = document.getElementById('capsuleMessage').value.trim();
    if(!pickedCapsuleDate){
        showToast('열어볼 날짜를 선택해주세요!', innerWidth/2, innerHeight/2, '#FF8A7A');
        return;
    }
    if(!message){
        showToast('내용을 적어주세요!', innerWidth/2, innerHeight/2, '#FF8A7A');
        return;
    }
    const authorName = (typeof onboardState !== 'undefined' && onboardState.name) ? onboardState.name : '가족';
    TIME_CAPSULES.unshift({
        title: `${authorName}가 남긴 편지`,
        targetDate: pickedCapsuleDate,
        message,
        sealedBy: authorName
    });
    document.getElementById('capsuleMessage').value = '';
    pickedCapsuleDate = null;
    document.getElementById('capsuleDateLabel').classList.add('hidden');
    document.getElementById('timeCapsuleForm').classList.add('hidden');
    renderTimeCapsules();
    showToast('타임캡슐이 봉인됐어요! 🔒', innerWidth/2, innerHeight/2, '#5FA88F');
}
function openLockedCapsuleModal(idx){
    const c = TIME_CAPSULES[idx];
    const dateStr = `${c.targetDate.getFullYear()}년 ${c.targetDate.getMonth()+1}월 ${c.targetDate.getDate()}일`;
    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 text-center pop-in" style="max-width:300px;">
        <p class="text-3xl mb-2">🔒</p>
        <p class="font-display text-lg text-[#3A2E27] mb-2">${c.title}</p>
        <p class="text-sm text-[#9B8A7C] leading-relaxed"><b>${dateStr}</b>에 열립니다.<br/>그날까지 비공개로 안전하게<br/>보관될 거예요 📦</p>
        <button onclick="this.closest('.levelup-modal').remove()" class="mt-4 bg-[#FF8A7A] text-white text-sm font-bold px-5 py-2 rounded-full">확인</button>
    </div>`;
    document.body.appendChild(modal);
}
function openUnlockedCapsuleModal(idx){
    const c = TIME_CAPSULES[idx];
    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 text-center pop-in" style="max-width:300px;">
        <p class="text-3xl mb-2">🎉</p>
        <p class="font-display text-lg text-[#3A2E27] mb-3">${c.title}</p>
        <p class="text-sm text-[#3A2E27] leading-relaxed bg-[#FFF0F3] rounded-2xl p-4">${c.message}</p>
        <p class="text-xs text-[#C9BFB2] font-bold mt-3">- ${c.sealedBy} 씀</p>
        <button onclick="this.closest('.levelup-modal').remove()" class="mt-4 bg-[#FF8A7A] text-white text-sm font-bold px-5 py-2 rounded-full">닫기</button>
    </div>`;
    document.body.appendChild(modal);
}

/* ================= OS 감지 & 알림 받기 온보딩 ================= */
function detectOS(){
    const ua = navigator.userAgent || '';
    if(/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if(/android/i.test(ua)) return 'android';
    return 'android';
}
function isStandalonePWA(){
    return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}
function openNotificationOnboarding(){
    setNotifOS(detectOS());
    openOverlay('overlay-notif');
}
function setNotifOS(os){
    document.getElementById('osBtnIOS').classList.toggle('os-btn-active', os==='ios');
    document.getElementById('osBtnAndroid').classList.toggle('os-btn-active', os==='android');
    const content = document.getElementById('notifContent');

    if(os === 'android'){
        content.innerHTML = `
            <div class="card p-5 text-center">
                <p class="text-3xl mb-2">🔔</p>
                <p class="font-display text-base text-[#3A2E27] mb-2">알림을 받아보세요!</p>
                <p class="text-xs text-[#9B8A7C] leading-relaxed mb-4">소이의 새 사진, 댓글, 좋아요 소식을<br/>바로 알림으로 받아볼 수 있어요.</p>
                <button onclick="requestNotifPermission()" class="w-full bg-[#FF8A7A] text-white font-bold py-3 rounded-2xl text-sm">알림 허용하기</button>
            </div>`;
    } else {
        if(isStandalonePWA()){
            content.innerHTML = `
                <div class="card p-5 text-center">
                    <p class="text-3xl mb-2">🔔</p>
                    <p class="font-display text-base text-[#3A2E27] mb-2">알림을 받아보세요!</p>
                    <p class="text-xs text-[#9B8A7C] leading-relaxed mb-4">소이의 새 사진, 댓글, 좋아요 소식을<br/>바로 알림으로 받아볼 수 있어요.</p>
                    <button onclick="requestNotifPermission()" class="w-full bg-[#FF8A7A] text-white font-bold py-3 rounded-2xl text-sm">알림 허용하기</button>
                </div>`;
        } else {
            content.innerHTML = `
                <div class="card p-5" style="background:#FFF0F3;">
                    <p class="text-center font-display text-base text-[#3A2E27] mb-3">홈 화면에 추가해야<br/>알림을 받을 수 있어요!</p>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 bg-white rounded-2xl p-3">
                            <span class="w-8 h-8 rounded-full bg-[#F6F1E9] flex items-center justify-center font-bold text-sm">1</span>
                            <p class="text-xs text-[#3A2E27]">Safari 하단의 공유 버튼 <b>⎋</b>을 눌러주세요</p>
                        </div>
                        <div class="flex items-center gap-3 bg-white rounded-2xl p-3">
                            <span class="w-8 h-8 rounded-full bg-[#F6F1E9] flex items-center justify-center font-bold text-sm">2</span>
                            <p class="text-xs text-[#3A2E27]"><b>"홈 화면에 추가"</b> <span style="color:#FF8A7A;">➕</span> 를 선택해주세요</p>
                        </div>
                        <div class="flex items-center gap-3 bg-white rounded-2xl p-3">
                            <span class="w-8 h-8 rounded-full bg-[#F6F1E9] flex items-center justify-center font-bold text-sm">3</span>
                            <p class="text-xs text-[#3A2E27]">홈 화면 아이콘으로 다시 접속하면<br/>알림을 설정할 수 있어요</p>
                        </div>
                    </div>
                </div>`;
        }
    }
}
function requestNotifPermission(){
    if(!('Notification' in window)){
        showToast('이 브라우저는 알림을 지원하지 않아요', innerWidth/2, innerHeight/2, '#FF8A7A');
        return;
    }
    Notification.requestPermission().then(permission => {
        if(permission === 'granted'){
            showToast('소이의 소식을 받아볼 준비가 되었습니다! 🎉', innerWidth/2, innerHeight/2, '#5FA88F');
            closeOverlay('overlay-notif');
        } else {
            showToast('알림이 거부되었어요. 설정에서 다시 허용할 수 있어요', innerWidth/2, innerHeight/2, '#FF8A7A');
        }
    });
}

/* ================= 홈화면에 추가 (PWA 설치) ================= */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
});
function handleAddToHomeScreen(){
    if(deferredInstallPrompt){
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.finally(() => { deferredInstallPrompt = null; });
        return;
    }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 text-center pop-in" style="max-width:300px;">
        <p class="text-3xl mb-2">📲</p>
        <p class="font-display text-lg text-[#3A2E27] mb-3">홈 화면에 추가하기</p>
        ${isIOS ? `
        <p class="text-sm text-[#9B8A7C] leading-relaxed">Safari 하단의 <b>공유 버튼</b>(⬆️)을 누른 뒤<br/>"<b>홈 화면에 추가</b>"를 선택해주세요.</p>
        ` : `
        <p class="text-sm text-[#9B8A7C] leading-relaxed">브라우저 메뉴(⋮)를 누른 뒤<br/>"<b>홈 화면에 추가</b>" 또는 "<b>앱 설치</b>"를 선택해주세요.</p>
        `}
        <button onclick="this.closest('.levelup-modal').remove()" class="mt-4 bg-[#FF8A7A] text-white text-sm font-bold px-5 py-2 rounded-full">확인</button>
    </div>`;
    document.body.appendChild(modal);
}

/* ================= 인터랙션 ================= */
function showToast(text, x, y, color){
    const t = document.createElement("div");
    t.className = "xp-float";
    t.style.left = x+"px"; t.style.top = y+"px"; t.style.color = color;
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 1000);
}
function showLevelUp(newLevel){
    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 text-center pop-in">
        <p class="text-4xl mb-2">🎉</p>
        <p class="font-display text-2xl text-[#3A2E27]">레벨업!</p>
        <p class="font-display text-xl text-[#FF8A7A]">Lv. ${newLevel}</p>
        <button onclick="this.closest('.levelup-modal').remove()" class="mt-3 bg-[#FF8A7A] text-white text-sm font-bold px-4 py-2 rounded-full">닫기</button>
    </div>`;
    document.body.appendChild(modal);
}
function addXP(amount, evt){
    const before = getLevel(state.totalXP);
    const beforeUnlocked = getUnlocked(state.totalXP);
    state.totalXP += amount;
    const after = getLevel(state.totalXP);
    const afterUnlocked = getUnlocked(state.totalXP);
    if(evt) showToast(`+${amount} XP`, evt.clientX, evt.clientY, amount>=10?'#5FA88F':'#FF8A7A');
    renderMy(); renderHome();
    if(after > before) setTimeout(()=>showLevelUp(after), 300);
    const newly = afterUnlocked.filter(i=>!beforeUnlocked.includes(i));
    if(newly.length && after<=before){
        const item = ITEMS.find(i=>i.id===newly[0]);
        setTimeout(()=>showToast(`${item.icon} ${item.name} 획득!`, innerWidth/2, innerHeight/2, '#F2A65A'), 300);
    }
}
function doComment(evt){
    state.totalComments++;
    addXP(10, evt);
    pushActivity({ type:"comment", name:"나", emoji:"👩", text:"소이 오늘도 최고야 ❤️", photoSeed: Math.floor(Math.random()*80), date:new Date(TODAY) });
}
function doLike(evt){
    state.totalLikes++;
    addXP(5, evt);
    pushActivity({ type:"like", name:"나", emoji:"👩", count:1, date:new Date(TODAY) });
}

/* ================= 탭 전환 로딩 (신생아→걸음마 성장 애니메이션) ================= */
function playTabLoader(){
    const loader = document.getElementById('tabLoader');
    const char = document.getElementById('loaderChar');
    loader.style.display = 'flex';
    requestAnimationFrame(()=>{ loader.style.opacity = '1'; });

    const growSeq = [
        {pose:poseLie, dress:C.lightBlue, size:24},
        {pose:poseRoll, dress:C.red, size:32},
        {pose:poseSitChair, dress:C.yellow, size:40},
        {pose:poseCrawl, dress:C.blue, size:48},
        {pose:poseStand, dress:C.pink, size:56},
        {pose:poseWalk, dress:C.yellow, size:66},
    ];
    const stepTime = 90;
    let i = 0;
    function step(){
        if(i < growSeq.length){
            const g = growSeq[i];
            char.innerHTML = svgFromRects(g.pose(g.dress), g.size);
            i++;
            setTimeout(step, stepTime);
        }
    }
    step();

    setTimeout(()=>{
        loader.style.opacity = '0';
        setTimeout(()=>{ loader.style.display = 'none'; }, 260);
    }, growSeq.length*stepTime + 220);
}

/* ================= 탭별 첫 방문 안내 ================= */
let visitedTabIntro = new Set();
const TAB_INTROS = {
    home: {
        title: "🌟 소이의 성장 일기",
        body: "날짜별, 개월수별로 자라나는 소이의 사진과 일기를 한눈에 모아볼 수 있어요.<br/><br/>'자라나는 소이'에서는 소이의 실제 발달 단계와 성장 타임라인을 함께 확인할 수 있어요."
    },
    album: {
        title: "📸 사진 모아보기",
        body: "날짜별로 소이의 매일매일을 기록한 사진들을 한눈에 모아볼 수 있어요.<br/><br/>올라온 사진에 ❤️ '좋아요'를 누르고 💬 '댓글'을 남겨 함께 소통해보세요!"
    },
    family: {
        title: "📸 인물별 가족 앨범",
        body: "가입 후 소이와 함께 찍은 사진을 개인별로 자동 분류해 드려요!<br/><br/>소이와 찍은 사진이 10장 이상 모이면 나만의 전용 앨범이 짜잔! 하고 오픈됩니다.<br/><br/>소이를 자주 만나러 오셔서 예쁜 추억을 많이 남겨주세요 💖"
    },
    my: {
        title: "🎮 소이 키우기",
        body: "가족들이 댓글을 달거나 좋아요를 누르면 경험치(XP)가 쌓여요!<br/>💬 댓글 1개 = +10 XP · ❤️ 좋아요 1개 = +5 XP<br/><br/>가족들의 응원과 사랑이 더해질수록 소이 캐릭터가 레벨업하고 새로운 성장 모습이 열려요. 함께 소이를 키워주세요! 🌱✨<br/><br/>내가 좋아요·댓글 남긴 사진도 여기서 모아볼 수 있고, 📲 '홈화면에 추가'로 앱처럼 편하게 접속할 수도 있어요!"
    }
};
function showTabIntro(name){
    if(visitedTabIntro.has(name)) return;
    visitedTabIntro.add(name);
    const info = TAB_INTROS[name];
    if(!info) return;
    const modal = document.createElement("div");
    modal.className = "levelup-modal";
    modal.innerHTML = `<div class="card p-6 pop-in" style="max-width:300px;">
        <p class="font-display text-lg text-[#3A2E27] mb-3 text-center">${info.title}</p>
        <p class="text-sm text-[#9B8A7C] leading-relaxed">${info.body}</p>
        <button onclick="this.closest('.levelup-modal').remove()" class="mt-4 w-full bg-[#FF8A7A] text-white text-sm font-bold py-2.5 rounded-full">확인했어요</button>
    </div>`;
    document.body.appendChild(modal);
}

/* ================= 탭 전환 ================= */
let albumBuilt = false;
function switchTab(name, evt){
    playTabLoader();
    document.querySelectorAll(".tab-content").forEach(el=>el.classList.remove("active"));
    document.getElementById(`tab-${name}`).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(el=>el.classList.remove("active"));
    if(evt && evt.currentTarget) evt.currentTarget.classList.add("active");
    else {
        const idx = ['home','album','family','my'].indexOf(name);
        document.querySelectorAll('.nav-btn')[idx]?.classList.add('active');
    }
    document.getElementById("headerDefault").classList.toggle("hidden", name==="album");
    document.getElementById("headerAlbum").classList.toggle("hidden", name!=="album");
    document.getElementById("scrollArea").scrollTop = 0;

    if(name==="album" && !albumBuilt){ renderAlbumTab(); albumBuilt = true; }

    setTimeout(()=>showTabIntro(name), 1100);
}

/* ================= 온보딩(간편 프로필 설정) ================= */
const RELATIONS = {
    paternal: ["아빠","할머니","할아버지","고모","고모부","큰이모할머니","작은이모할머니","기타"],
    maternal: ["엄마","외할아버지","외증조할머니","외증조할아버지","외삼촌","외숙모","기타"]
};
let onboardState = { side:null, relation:null, photo:null, name:null };
let isFirstTimeMember = false;

function closeWelcomeNotice(){
    document.getElementById('welcomeNotice').style.display = 'none';
    document.getElementById('onboardingGate').style.display = 'flex';
}

function selectFamilySide(side){
    onboardState.side = side;
    onboardState.relation = null;
    document.getElementById('sideBtnPaternal').classList.toggle('side-btn-active', side==='paternal');
    document.getElementById('sideBtnMaternal').classList.toggle('side-btn-active', side==='maternal');
    renderRelationGrid();
}
function renderRelationGrid(){
    const grid = document.getElementById('relationGrid');
    if(!onboardState.side){ grid.innerHTML=''; return; }
    grid.innerHTML = RELATIONS[onboardState.side].map(r => `
        <button onclick="selectRelation('${r}')" class="relation-chip px-3 py-1.5 rounded-full text-xs font-bold bg-[#F6F1E9] text-[#9B8A7C] transition-colors" data-relation="${r}">${r}</button>
    `).join('');
    document.getElementById('recognizedInfo').classList.add('hidden');
    document.getElementById('customRelationInput').classList.add('hidden');
}

let nameManuallyEdited = false;
function onNameManualEdit(){ nameManuallyEdited = true; }

function selectRelation(r){
    onboardState.relation = r;
    document.querySelectorAll('.relation-chip').forEach(el=>{
        el.classList.toggle('relation-chip-active', el.dataset.relation===r);
    });

    const existing = EXISTING_PROFILES[r];
    const info = document.getElementById('recognizedInfo');
    const nameInput = document.getElementById('onboardName');
    const photoPreview = document.getElementById('onboardPhotoPreview');
    const customInput = document.getElementById('customRelationInput');

    if(r === '기타'){
        onboardState.relation = '';
        customInput.value = '';
        customInput.classList.remove('hidden');
        customInput.focus();
        if(!nameManuallyEdited) nameInput.value = '';
        onboardState.photo = null;
        photoPreview.innerHTML = `<span class="text-2xl">📷</span>`;
        info.classList.add('hidden');
        return;
    }
    customInput.classList.add('hidden');

    if(existing){
        if(!nameManuallyEdited) nameInput.value = existing.name;
        onboardState.photo = photoUrl(existing.photoSeed);
        photoPreview.innerHTML = `<img src="${onboardState.photo}" class="w-full h-full object-cover"/>`;
        info.classList.remove('hidden');
        info.innerHTML = `<p class="text-xs font-bold text-[#2E7A63]">✨ 이미 등록된 ${r}예요! 정보를 불러왔어요</p>
            <p class="text-[11px] text-[#5FA88F] mt-0.5">댓글 ${existing.comments}개 · 좋아요 ${existing.likes}개 남겼어요</p>`;
    } else {
        if(!nameManuallyEdited) nameInput.value = r;
        onboardState.photo = null;
        photoPreview.innerHTML = `<span class="text-2xl">📷</span>`;
        info.classList.remove('hidden');
        info.innerHTML = `<p class="text-xs font-bold text-[#C99A2B]">🎉 "${r}"(으)로 프로필이 자동 생성돼요!</p>
            <p class="text-[11px] text-[#9B8A7C] mt-0.5">닉네임은 자유롭게 바꿔서 쓸 수 있어요</p>`;
    }
}
function onCustomRelationInput(value){
    onboardState.relation = value.trim();
    const nameInput = document.getElementById('onboardName');
    if(!nameManuallyEdited) nameInput.value = value.trim();
}
function handleOnboardPhoto(evt){
    const file = evt.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        onboardState.photo = e.target.result;
        document.getElementById('onboardPhotoPreview').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover"/>`;
    };
    reader.readAsDataURL(file);
}
function completeOnboarding(){
    if(!onboardState.relation || !onboardState.relation.trim()){
        showToast('소이와의 관계를 선택해 주세요!', innerWidth/2, innerHeight/2, '#FF8A7A');
        const section = document.getElementById('relationGrid').parentElement;
        section.classList.remove('shake-anim');
        void section.offsetWidth;
        section.classList.add('shake-anim');
        return;
    }
    const nameInput = document.getElementById('onboardName').value.trim();
    onboardState.name = nameInput || onboardState.relation || '소이맘';

    document.getElementById('myProfileName').textContent = onboardState.name;
    document.getElementById('myProfileRelation').textContent = onboardState.relation
        ? `${onboardState.relation} · soi.diary 멤버`
        : '가족 · soi.diary 멤버';
    if(onboardState.photo) document.getElementById('myProfileImg').src = onboardState.photo;

    const existing = EXISTING_PROFILES[onboardState.relation];
    if(existing){
        isFirstTimeMember = false;
        state.totalComments = existing.comments;
        state.totalLikes = existing.likes;
    } else {
        isFirstTimeMember = true;
        state.totalComments = 0;
        state.totalLikes = 0;
        state.totalXP = 0;

        const alreadyRegistered = REGISTERED_FAMILY.some(m => m.relation === onboardState.relation);
        if(onboardState.relation && !alreadyRegistered){
            const newSeed = nextFamilySeed++;
            REGISTERED_FAMILY.push({
                relation: onboardState.relation,
                name: onboardState.name,
                seed: newSeed,
                comments: 0,
                likes: 0,
                photoCount: 0
            });
            /* 이 관계로 다음에 다시 들어와도(로그아웃/기기변경 등) 닉네임·사진을 불러올 수 있도록
               "가입된 프로필" 목록에도 등록해둔다. (지금은 브라우저 세션 내에서만 유지되고,
               실제로 폰을 바꿔도 유지되려면 서버/DB 연동이 필요함) */
            EXISTING_PROFILES[onboardState.relation] = {
                name: onboardState.name,
                photoSeed: newSeed,
                comments: 0,
                likes: 0,
                photoCount: 0
            };
        }
    }
    renderMy();
    renderFamily();

    document.getElementById('onboardingGate').style.display = 'none';
    setTimeout(()=>showTabIntro('home'), 500);
}

/* ================= 테스트용 로그아웃 (다시 관계 선택 화면으로) ================= */
function logoutTest(){
    onboardState = { side:null, relation:null, photo:null, name:null };
    nameManuallyEdited = false;
    document.getElementById('onboardName').value = '';
    document.getElementById('sideBtnPaternal').classList.remove('side-btn-active');
    document.getElementById('sideBtnMaternal').classList.remove('side-btn-active');
    document.getElementById('relationGrid').innerHTML = '';
    document.getElementById('recognizedInfo').classList.add('hidden');
    document.getElementById('customRelationInput').classList.add('hidden');
    document.getElementById('onboardPhotoPreview').innerHTML = `<span class="text-2xl">📷</span>`;
    document.getElementById('onboardingGate').style.display = 'flex';
    showToast('로그아웃 됐어요. 관계를 다시 선택해보세요!', innerWidth/2, innerHeight/2, '#9B8A7C');
}

/* ================= 초기화 ================= */
document.getElementById('navIconHome').innerHTML = svgIcon(ICON_LION, 21, 14);
document.getElementById('navIconAlbum').innerHTML = svgIcon(ICON_CAT, 21, 14);
document.getElementById('navIconFamily').innerHTML = svgIcon(ICON_TEDDY, 21, 14);
document.getElementById('navIconMy').innerHTML = svgIcon(ICON_RABBIT, 21, 14);

renderHome();
renderFamily();
renderMy();
renderGrowthTimeline();
  const firebaseConfig = {
    apiKey: "AIzaSyD0RUOS6jXOMkQ6WqVfkS9_6fgi0YjXbco",
    authDomain: "soi-diary.firebaseapp.com",
    projectId: "soi-diary",
    storageBucket: "soi-diary.appspot.com", 
    appId: "1:1039495628882:web:1fa0925a5f916fa643378b"
  };

  // 파이어베이스 중복 초기화 방지 및 안전한 연결
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const storage = firebase.storage();

  // 환영 공지 닫기 함수
  function closeWelcomeNotice() {
    const notice = document.getElementById('welcomeNotice');
    if (notice) {
      notice.style.display = 'none';
    } else {
      const gate = document.querySelector('.onboarding-gate');
      if (gate) gate.style.display = 'none';
    }
  }

/* ================= 사진 상세 페이지 (새 탭 방식) ================= */
/* ================= 사진 상세 페이지: 범용 리스트 컨텍스트 ================= */
let detailPhotoList = [];      // 현재 넘겨보는 사진 src 목록
let detailDates = [];          // 목록과 같은 순서의 날짜
let detailEditableMap = [];    // 각 위치가 실제 UPLOADED_PHOTOS의 몇 번 인덱스인지 (null = 편집 불가한 샘플)
let detailPhotoIndex = -1;

function buildUploadedDetailContext(startIdx){
    return {
        list: UPLOADED_PHOTOS.map(p => p.src),
        dates: UPLOADED_PHOTOS.map(p => p.date || TODAY),
        editableMap: UPLOADED_PHOTOS.map((_, i) => i),
        start: startIdx
    };
}
function buildSingleDemoContext(src){
    return { list: [src], dates: [TODAY], editableMap: [null], start: 0 };
}
function buildFamilyDetailContext(memberIdx, startIdx){
    const m = REGISTERED_FAMILY[memberIdx];
    const list = [];
    for(let i=0;i<m.photoCount;i++) list.push(photoUrl(m.seed*50+i));
    return { list, dates: list.map(()=>TODAY), editableMap: list.map(()=>null), start: startIdx };
}

function openPhotoDetailCtx(ctx){
    detailPhotoList = ctx.list;
    detailDates = ctx.dates;
    detailEditableMap = ctx.editableMap;
    detailPhotoIndex = ctx.start;
    document.getElementById('tab-photo-detail').classList.add('active');
    renderPhotoDetail();
}

/* 기존 호출부(photoCard, uploadedPhotoCard 등)와 호환되는 진입점 */
function openPhotoDetail(photoUrl, idx) {
    if (idx >= 0 && UPLOADED_PHOTOS[idx]) {
        openPhotoDetailCtx(buildUploadedDetailContext(idx));
    } else {
        openPhotoDetailCtx(buildSingleDemoContext(photoUrl));
    }
}

/* 가족 구성원 그리드에서만 넘겨보는 진입점 */
function openFamilyPhotoDetail(memberIdx, idx){
    openPhotoDetailCtx(buildFamilyDetailContext(memberIdx, idx));
}

function goBackToAlbum() {
    document.getElementById('tab-photo-detail').classList.remove('active');
}

function renderPhotoDetail() {
    const src = detailPhotoList[detailPhotoIndex];
    const d = detailDates[detailPhotoIndex] || TODAY;
    const realIdx = detailEditableMap[detailPhotoIndex];
    const isEditable = realIdx !== null && realIdx !== undefined && !!UPLOADED_PHOTOS[realIdx];
    const hasMultiple = detailPhotoList.length > 1;

    document.getElementById('detailPhotoImg').src = src;
    document.getElementById('detailDays').textContent = `D+${dDay(d)}`;
    document.getElementById('detailDate').textContent = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}.`;

    document.getElementById('detailPrevArrow').style.display = hasMultiple ? '' : 'none';
    document.getElementById('detailNextArrow').style.display = hasMultiple ? '' : 'none';
    document.getElementById('detailDeleteBtn').style.display = isEditable ? '' : 'none';

    const tagsWrap = document.getElementById('detailTags');
    const tags = isEditable ? UPLOADED_PHOTOS[realIdx].tags : null;
    if (tags && tags.length) {
        tagsWrap.innerHTML = tags.map(t => `<span class="chip" style="background:#FFF0F3;color:#FF8A7A;display:inline-block;margin:0 6px 6px 0;">${t}</span>`).join('');
    } else {
        tagsWrap.innerHTML = `<span style="font-size:12px;color:#C9BFB2;">${isEditable ? '태그 없음' : '😊 샘플 사진입니다'}</span>`;
    }

    document.getElementById('detailViewers').innerHTML = ['👨','👩','👵','👴'].map(e =>
        `<span style="width:22px;height:22px;border-radius:50%;background:#F6F1E9;display:flex;align-items:center;justify-content:center;font-size:12px;">${e}</span>`
    ).join('');

    document.getElementById('detailComments').innerHTML = `
        <div style="background:#F6F1E9;padding:9px 11px;border-radius:12px;margin-bottom:8px;font-size:12px;">
            <b style="color:#3A2E27;">할머니</b>
            <p style="color:#3A2E27;margin-top:3px;line-height:1.4;">와! 우리 소이 정말 크네요 ❤️</p>
            <span style="font-size:10px;color:#C9BFB2;">2시간 전</span>
        </div>
        <div style="background:#F6F1E9;padding:9px 11px;border-radius:12px;margin-bottom:8px;font-size:12px;">
            <b style="color:#3A2E27;">엄마</b>
            <p style="color:#3A2E27;margin-top:3px;line-height:1.4;">오늘 유독 잘 웃네요 😄</p>
            <span style="font-size:10px;color:#C9BFB2;">1일 전</span>
        </div>
    `;
}

function detailNextPhoto() {
    if (detailPhotoList.length <= 1) return;
    detailPhotoIndex = (detailPhotoIndex + 1) % detailPhotoList.length;
    renderPhotoDetail();
}

function detailPrevPhoto() {
    if (detailPhotoList.length <= 1) return;
    detailPhotoIndex = (detailPhotoIndex - 1 + detailPhotoList.length) % detailPhotoList.length;
    renderPhotoDetail();
}

function shareDetailPhoto() {
    showToast('공유 기능은 준비 중이에요', innerWidth/2, innerHeight/2, '#FF8A7A');
}

function deleteDetailPhoto() {
    const realIdx = detailEditableMap[detailPhotoIndex];
    if (realIdx === null || realIdx === undefined) return;
    if (!confirm('이 사진을 삭제하시겠습니까?')) return;
    UPLOADED_PHOTOS.splice(realIdx, 1);
    renderAlbumTab();
    renderHome();
    renderFamily();
    if (UPLOADED_PHOTOS.length === 0) {
        goBackToAlbum();
        return;
    }
    const nextIdx = Math.min(realIdx, UPLOADED_PHOTOS.length - 1);
    openPhotoDetailCtx(buildUploadedDetailContext(nextIdx));
}

function addDetailComment() {
    const input = document.getElementById('detailCommentInput');
    const text = input.value.trim();
    if (!text) return;
    const wrap = document.getElementById('detailComments');
    const div = document.createElement('div');
    div.style.cssText = 'background:#F6F1E9;padding:9px 11px;border-radius:12px;margin-bottom:8px;font-size:12px;';
    div.innerHTML = `<b style="color:#3A2E27;">나</b><p style="color:#3A2E27;margin-top:3px;line-height:1.4;">${text}</p><span style="font-size:10px;color:#C9BFB2;">방금 전</span>`;
    wrap.insertBefore(div, wrap.firstChild);
    input.value = '';
}

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('tab-photo-detail').classList.contains('active')) return;
    if (e.key === 'ArrowLeft') detailPrevPhoto();
    if (e.key === 'ArrowRight') detailNextPhoto();
    if (e.key === 'Escape') goBackToAlbum();
});

/* 좌우 스와이프(터치)로 사진 넘기기 */
(function(){
    let touchStartX = null;
    let touchStartY = null;
    const viewer = document.getElementById('detailPhotoViewer');
    viewer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    viewer.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) detailNextPhoto(); else detailPrevPhoto();
        }
        touchStartX = null; touchStartY = null;
    }, { passive: true });
})();

/* ================= 앨범: 사진 선택(다중 삭제) 모드 ================= */
function togglePhotoSelectionMode() {
    photoSelectionMode = !photoSelectionMode;
    selectedPhotoIndexes.clear();
    document.getElementById('albumSelectBar').style.display = photoSelectionMode ? 'flex' : 'none';
    renderAlbumTab();
}

function toggleSelectAllPhotos() {
    if (selectedPhotoIndexes.size === UPLOADED_PHOTOS.length) {
        selectedPhotoIndexes.clear();
    } else {
        UPLOADED_PHOTOS.forEach((_, i) => selectedPhotoIndexes.add(i));
    }
    renderAlbumTab();
}

function togglePhotoCheckboxFromCard(idx) {
    if (selectedPhotoIndexes.has(idx)) selectedPhotoIndexes.delete(idx);
    else selectedPhotoIndexes.add(idx);
    renderAlbumTab();
}

function deleteSelectedPhotos() {
    if (selectedPhotoIndexes.size === 0) {
        showToast('삭제할 사진을 선택해주세요', innerWidth/2, innerHeight/2, '#D9534F');
        return;
    }
    const count = selectedPhotoIndexes.size;
    if (!confirm(`${count}개의 사진을 삭제하시겠습니까?`)) return;
    Array.from(selectedPhotoIndexes).sort((a,b)=>b-a).forEach(i => UPLOADED_PHOTOS.splice(i, 1));
    selectedPhotoIndexes.clear();
    photoSelectionMode = false;
    document.getElementById('albumSelectBar').style.display = 'none';
    renderAlbumTab();
    renderHome();
    renderFamily();
}

