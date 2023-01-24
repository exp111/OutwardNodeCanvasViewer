async function loadJsonFile(path)
{
    let response = await fetch(path).then(response => {
        if (!response.ok)
            return null;

        return response.json();
    }).catch((reason) => 
    {
        console.error("Exception during loadJsonFile(" + path + ")");
        console.error(reason);
        return null;
    });

    console.debug("Loaded json file from " + path + "!");
    console.debug(response);
    return response;
}

// Loads a json file from data
var Paths = {
    "dataPath": "data/",
};
async function loadJson(path) {
    return loadJsonFile(Paths.dataPath + path);
}

// Loads the file index
Paths.indexPath = Paths.dataPath + "index.json";
async function loadFiles() {
    return loadJsonFile(Paths.indexPath);
}

// Loads the quest events
Paths.eventPath = Paths.dataPath + "QuestEvents.json";
async function loadEvents() {
    return loadJsonFile(Paths.eventPath);
}

// Loads the quest event index
Paths.eventIndex = Paths.dataPath + "eventIndex.json";
async function loadEventIndex() {
    return loadJsonFile(Paths.eventIndex);
}