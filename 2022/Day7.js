const fs = require('fs');
const readline = require('readline');
const { rootCertificates } = require('tls');

class Node {
    parentNode;
    subNodes = [];
    name = '';
    size = 0;
    isFile;
    constructor(name, size, parentNode, isFile) {
        this.name = name;
        this.size = size;
        this.parentNode = parentNode;
        this.isFile = isFile;
    }

    getSubFolder(folderName) {
        return this.getSubNode(folderName, true);
    }

    getSubFile(fileName) {
        return this.getSubNode(fileName, true);
    }

    addSubNode(node) {
        this.subNodes.push(node);
    }
    
    hasSubNodes() {
        return this.subNodes.length > 0;
    }

    getSubNode(name, isFile) {
        return this.subNodes.find(n => isFile && n.name === name);
    }

    getTotalSize() {
        if (this.size) {
            return this.size;
        } else {
            const total = this.subNodes.reduce((sum, curr) => {
                return sum + +curr.getTotalSize();
            }, 0);
            this.size = total; // a stupid way to save on calculation but doing it because this function is only ever called at the end
            return total;
        }
    }
}

const printFileStructure = (node, numTabs = 0) => {
    let currNode = node;
    const spacing = Array(numTabs).fill('--').join('');
    console.log(`${spacing}${node.name} (${node.isFile ? 'file' : 'dir'}) (${node.getTotalSize()})`);
    currNode.subNodes.forEach(n => {
        printFileStructure(n, numTabs + 1);
    })
}

const createNewSubNode = (name, size, parentNode, isFile) => {
    const subNode = new Node(name, size, parentNode, isFile);
    parentNode.addSubNode(subNode);
    return subNode;
}

const parseLsResult = (line, currNode) => {
    const dirRegex = /^dir (.*)/m;
    const dirMatch = dirRegex.exec(line);
    const fileRegex = /^(\d+) (.*)/m;
    const fileMatch = fileRegex.exec(line);
    if (dirMatch) {
        const dirName = dirMatch[1];
        if (!currNode.getSubFolder(dirName)) {
            createNewSubNode(dirName, null, currNode, false);
        }
    } else if (fileMatch) {
        const fileSize = fileMatch[1];
        const fileName = fileMatch[2];
        if (!currNode.getSubFile(fileName)) {
            createNewSubNode(fileName, fileSize, currNode, true);
        }
    }
}

const getAllDirectoriesWithTotalSizeAtMost= (maxSize, currNode, allDirs) => {
    if (!currNode.isFile && currNode.getTotalSize() <= maxSize) {
        allDirs.push(currNode);
    }
    currNode.subNodes.forEach(n => getAllDirectoriesWithTotalSizeAtMost(maxSize, n, allDirs));
}

//#region Part 2

const part2 = (fileReader) => {
    const cdRegex = /^\$ cd (.*)/m;
    let rootNode = new Node('/', null, null, false);
    let currNode = null;
    let waitForNextCommand = false; // for use with ls
    fileReader.on('line', (line) => {
        const cdMatch = cdRegex.exec(line);
        if (line.startsWith('$')) {
            waitForNextCommand = false;
        }

        if (cdMatch) {
            const folderName = cdMatch[1];
            if (folderName === '/') {
                currNode = rootNode;
            } else if (folderName === '..') {
                // move one dir up
                currNode = currNode.parentNode;
            } else {
                // move into a sub directory. If that doesn't exist yet, then make a node for it
                let subFolder = currNode.getSubFolder(folderName);
                if (!subFolder) {
                    subFolder = createNewSubNode(folderName, null, currNode, false);
                }
                currNode = subFolder;
            }
        } else if (line.startsWith('$ ls')) {
            waitForNextCommand = true;
        } else if (waitForNextCommand) {
            parseLsResult(line, currNode);
        }
    });
    fileReader.on('close', () => {
        const needToFreeUp = 30000000 - (70000000 - rootNode.getTotalSize());
        let dirsMatchingCriteria = [];
        getAllDirectoriesWithTotalSizeAtMost(70000000, rootNode, dirsMatchingCriteria);
        dirsMatchingCriteria = dirsMatchingCriteria.filter(d => d.getTotalSize() >= needToFreeUp);
        console.log(Math.min(...dirsMatchingCriteria.map(d => d.getTotalSize())));
    });
}

//#endregion

//#region Part 1

const part1 = (fileReader) => {
    const cdRegex = /^\$ cd (.*)/m;
    let rootNode = new Node('/', null, null, false);
    let currNode = null;
    let waitForNextCommand = false; // for use with ls
    fileReader.on('line', (line) => {
        const cdMatch = cdRegex.exec(line);
        if (line.startsWith('$')) {
            waitForNextCommand = false;
        }

        if (cdMatch) {
            const folderName = cdMatch[1];
            if (folderName === '/') {
                currNode = rootNode;
            } else if (folderName === '..') {
                // move one dir up
                currNode = currNode.parentNode;
            } else {
                // move into a sub directory. If that doesn't exist yet, then make a node for it
                let subFolder = currNode.getSubFolder(folderName);
                if (!subFolder) {
                    subFolder = createNewSubNode(folderName, null, currNode, false);
                }
                currNode = subFolder;
            }
        } else if (line.startsWith('$ ls')) {
            waitForNextCommand = true;
        } else if (waitForNextCommand) {
            parseLsResult(line, currNode);
        }
    });
    fileReader.on('close', () => {
        const dirsMatchingCriteria = [];
        getAllDirectoriesWithTotalSizeAtMost(100000, rootNode, dirsMatchingCriteria);
        const sum = dirsMatchingCriteria.reduce((total, curr) => {
            return total + curr.getTotalSize();
        }, 0)
        console.log(sum);
    });
}

//#endregion

try {
    var fileReader = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    part1(fileReader);
    part2(fileReader);
} catch (err) {
    console.error(err);
}