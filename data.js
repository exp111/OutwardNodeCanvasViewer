async function loadJson(path) {
    let response = await fetch("data/" + path).then(response => {
        if (!response.ok)
            return null;

        return response.text();
    });
    let lines = response.split("\n");
    lines.splice(0,3); // invalid yaml so just remove the first 3 lines lmao
    response = lines.join("\n");

    console.log("Loaded file " + path + "!");

    let obj = await jsyaml.load(response);
    console.log(obj);
    let ret = JSON.parse(obj.MonoBehaviour._serializedGraph);
    console.log(ret);
    return ret;
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