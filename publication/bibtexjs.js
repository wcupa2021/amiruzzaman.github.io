var txt = "@inproceedings{Carrel2005, \n" +
    "    title      = {{Algorithm} for near-optimal autonomous resource management}, \n" +
    "    author     = {Carrel, Ândrew and Palmer, Phil}, \n" +
    "    notes      = nonote ,\n" +
    "    booktitle  = {8th International Symposium on Artificial Intelligence, \n" +
    "                  Robotics and Automation in Space}, \n" +
    "    year       = {2005} \n" +
    "		 doi =	{https://doi.org/10.3390/xxxxx}\n"+
    "    blahblah   = error,\n}";


function parseBibTexLine (text) {
    var m = text.match(/^\s*(\S+)\s*=\s*/);
    if (!m) {
        console.log('line: "' + text + '"');
        throw new Error('Unrecogonised line format');
    }
    var name = m[1];
    var search = text.slice(m[0].length);
    var re = /[\n\r,{}]/g;
    var braceCount = 0;
    var length = m[0].length;
    do {
        m = re.exec(search);
        if (m[0] === '{') {
            braceCount++;
        } else if (m[0] === '}') {
            if (braceCount ===  0) {
                throw new Error('Unexpected closing brace: "}"');
            }
            braceCount--;
        }
    } while (braceCount > 0);
    return {
        field:name,
        value: search.slice(0, re.lastIndex),
        length:length + re.lastIndex + m[0].length
    };
}

function parseBibTex (text) {
    var m = text.match(/^\s*@([^{]+){([^,\n]+)[,\n]/);
    if (!m) {
        throw new Error('Unrecogonised header format');
    }
    var result = {
        typeName: m[1].trim(),
        citationKey: m[2].trim()
    }
    text = text.slice(m[0].length).trim();
    while (text[0] !== '}') {
        var pair = parseBibTexLine(text);
        result[pair.field] = pair.value;
        text = text.slice(pair.length).trim();
    }
    return result;
}

console.log(parseBibTex(txt));
