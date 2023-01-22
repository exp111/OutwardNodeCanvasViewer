async function loadJson(path) {
    let response = await fetch("data/" + path).then(response => {
        if (!response.ok)
            return null;

        return response.json();
    });

    console.log("Loaded file " + path + "!");
    console.log(response);
    return response;
}

var indexPath = "data/index.json"

async function loadFiles() {
    let response = await fetch(indexPath).then(response => {
        if (!response.ok)
            return null;

        return response;
    });

    console.log("Loaded files from " + indexPath + "!");
    let json = await response.json();
    console.log(json);
    return json;
}