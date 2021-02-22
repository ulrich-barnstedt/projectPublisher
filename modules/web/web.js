const config = require("./web.config.json");
const fs = require("fs");
const ignoreList = require("./ignore.crawler.config.json");
const Category = require("./page/category");
const Project = require("./page/project");
const {spawnSync} = require("child_process");
let tree = require(config.treeJS);

module.exports = class {
    constructor (workingDir, categories, name) {
        this.workingDir = workingDir;
        this.categories = categories;
        this.name = name;
    }

    addToSave () {
        this._addAndUpdate();
        this._saveTree();
    }

    _addAndUpdate () {
        //crawl directory
        const recurseDirectory = (fsPath) => {
            let obj = {
                _content : []
            };

            fs.readdirSync(this.workingDir + fsPath, {withFileTypes : true}).forEach(file => {
                if (ignoreList.find(str => str.toLowerCase() === file.name.toLowerCase()) !== undefined) return;

                if (file.isDirectory()) {
                    obj[file.name] = recurseDirectory(fsPath + file.name + "/");
                    return;
                }

                obj._content.push(file.name);
            })

            return obj;
        }
        let files = recurseDirectory("/");

        let project = {
            _isProject : true,
            _updatedAt : new Date(),
            _files : files
        }

        //crawl categories
        let index = -1;
        const categoryRecurse = (obj) => {
            if (index >= this.categories.length - 1) {
                return project;
            }
            index++;

            if (obj === undefined) {
                return {
                    _updatedAt: new Date(),
                    [this.categories[index]] : categoryRecurse(obj)
                }
            }

            return {
                ...obj,
                _updatedAt: new Date(),
                [this.categories[index]]: categoryRecurse (obj[this.categories[index]]),

            }
        }

        tree = categoryRecurse(tree);
    }

    _saveTree () {
        fs.writeFileSync(config.treeFS, JSON.stringify(tree, null, 2))
    }

    regen () {
        let recurseFn = (obj, path) => {
            //gen if project
            if ("_isProject" in obj) {
                let htmlInstance = new Project(obj, path.slice(-1), path);

                fs.mkdirSync("./webRepo/0x81-sh.github.io/" + path.join("/"), {recursive : true});
                fs.writeFileSync("./webRepo/0x81-sh.github.io/" + path.join("/")
                    + "/" + "index.html", htmlInstance.html());

                return;
            }

            //gen if category
            let htmlInstance = new Category(path.slice(-1), obj, path);
            fs.mkdirSync("./webRepo/0x81-sh.github.io/" + path.join("/"), {recursive : true});
            fs.writeFileSync("./webRepo/0x81-sh.github.io/" + path.join("/")
                + "/" + "index.html", htmlInstance.html());

            //spawn new categories
            for (let key in obj) {
                if (key.startsWith("_")) continue;

                recurseFn(obj[key], [...path, key]);
            }
        }

        recurseFn(tree, ["content"]);

        //commit
        spawnSync("git", ["add", "."], {cwd : "./webRepo/0x81-sh.github.io/"});
        spawnSync("git", ["commit", "-am", "Update"], {cwd : "./webRepo/0x81-sh.github.io/"});
        spawnSync("git", ["push", "origin", "master"], {cwd : "./webRepo/0x81-sh.github.io/"});
    }
}