const Web = require("./modules/web/web");
const Git = require("./modules/repo/git");

new class Publisher {
    constructor () {
        this.argument = this.getArguments();
        this.workingDir = this.argument.dir;
        this.categories = this.argument.categories;
        this.name = this.categories.join("-");

        this.gitRepo();
        this.webUpdate();

        console.log("Done.")
    }

    getArguments () {
        let args = process.argv.slice(2);
        return {dir : args.shift(), categories : args};
    }

    gitRepo () {
        console.log("Syncing project git repo.");

        this.gitRepo = new Git(this.workingDir, this.name);

        if (!this.gitRepo.repoHere(this.workingDir)) this.gitRepo.init();
        this.gitRepo.push();
    }

    webUpdate () {
        console.log("Syncing website.");

        this.webRepo = new Web(this.workingDir, this.categories, this.name);

        this.webRepo.addToSave();
        this.webRepo.regen();
    }
}