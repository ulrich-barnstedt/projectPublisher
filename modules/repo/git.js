const {spawnSync} = require("child_process");
const config = require("./git.config.json");
const fs = require("fs");

module.exports = class {
    constructor (workingDir, name) {
        this.workingDir = workingDir;
        this.name = name;
    }

    init () {
        console.log("Initializing a new repository in working directory.");

        this._copy();
        this._localCreate();
        this._ghCreate();
    }

    _spawnGit (args) {
        //console.log(spawnSync("git", args, {cwd : this.workingDir}).stderr.toString());
        spawnSync("git", args, {cwd : this.workingDir})
    }

    _spawnGH (args) {
        //console.log(spawnSync("gh", args, {cwd : this.workingDir}).stderr.toString());
        spawnSync("gh", args, {cwd : this.workingDir})
    }

    _copy () {
        for (let key in config.copy) {
            fs.writeFileSync(this.workingDir + "/" + config.copy[key], fs.readFileSync(config.copyPrefix + config.copy[key]))
        }
    }

    _ghCreate () {
        this._spawnGH(["repo", "create", config.orgPrefix + this.name, "--public", "-y"]);
    }

    _localCreate () {
        this._spawnGit(["init"]);
    }

    push () {
        this._spawnGit(["add", "."]);
        this._spawnGit(["commit", "-am", config.commitMessage]);
        this._spawnGit(["push", "origin", "master"]);
    }

    repoHere () {
        return fs.existsSync(this.workingDir + "/.git");
    }
}