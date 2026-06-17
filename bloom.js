const DB_CAPACITY = 50;
const BIT_SIZE = 500;
const NUM_HASHES = Math.log(2)*(BIT_SIZE/DB_CAPACITY);
const bits = new Array(BIT_SIZE).fill(0);

// DJB2
function djb2(str) {
    let hash = 5381;

    for (const ch of str) {
        hash = ((hash << 5) + hash) + ch.charCodeAt(0);
    }

    return hash>>>0;
}

// FNV-1a
function fnv1a(str) {
    let hash = 2166136261;

    for (const ch of str) {
        hash ^= ch.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }

    return hash>>>0;
}

// Generate k hashes
function getHashes(str) {
    const h1 = djb2(str);
    const h2 = fnv1a(str);

    const indices = [];

    for (let i = 0; i < NUM_HASHES; i++) {
        indices.push((h1 + i * h2) % BIT_SIZE);
    }

    return indices;
}

// Insert
function add(str) {
    const indices = getHashes(str);

    for (const idx of indices) {
        bits[idx] = 1;
    }
}

// Search
function contains(str) {
    const indices = getHashes(str);

    for (const idx of indices) {
        if (bits[idx] === 0) {
            return false;
        }
    }

    return true;
}

const words = ["kikinagu", "keerthikaoffl", "nkeerthika", "kikii", "kikinagu09", "prethika", "notafamousperson", "sandhiyag"]
for(const w of words){
    add(w);
}

const word = "kikiii";
if(contains(word)){
    console.log("Username may be already taken :(");
}
else{
    console.log("Username available :)")
}
