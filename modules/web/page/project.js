const HTMLGen = require("html-creator");
const pretty = require("pretty");
const base = require("./baseHTML");

module.exports = class {
    constructor (obj, name, categories) {
        this.obj = obj;
        this.name = name;
        this.categories = categories;
    }

    html () {
        let htmlInstance = new HTMLGen([
            base.header(this.name, "project.css"),
            {
                type : "body",
                attributes : {
                    style : "margin: 0 0 0 0;"
                },
                content : [
                    this._header(),
                    this._main(),
                    this._footer()
                ]
            }
        ]);

        return pretty(htmlInstance.renderHTML(), {ocd : true});
    }

    _header () {
        return {
            type : "header",
            attributes : {
                style : "box-sizing: border-box; background-color: lightgreen; padding: 10px; padding-left: 20px"
            },
            content : [
                {
                    type : "h2",
                    content : "Project: " + this.name
                }
            ]
        }
    }

    _main () {
        return {
            type : "main",
            content : [
                this._meta(),
                this._graph(),
            ]
        }
    }

    _meta () {
        let pathAccumulator = [];
        let categoryLinks = this.categories.slice(0, -1).map(cat => {
            pathAccumulator.push(cat);
            return `<a href="${"/" + pathAccumulator.join("/")}">${cat}</a>`
        });


        return {
            type : "section",
            attributes : {
                style : "padding-left: 10px;"
            },
            content : [
                {
                    type : "p",
                    content : `<i>Last modified on ${new Date(this.obj._updatedAt).toLocaleString()}</i><br/>
Project under: ${categoryLinks.join(" -> ")}<br/>
Sourced from: <a href="https://github.com/0x81-sh/${this.categories.slice(1).join("-")}">Github Repository</a>`
                },
                {
                    type : "a",
                    attributes : {
                        href : `https://github.com/0x81-sh/${this.categories.slice(1).join("-")}/archive/master.zip`,
                        style : "appearance: button; text-decoration: none; color: initial; background-color: lightgray; padding: 10px 20px;"
                    },
                    content : "Download project"
                },
                {
                    type : "hr",
                    attributes : {
                        style : "margin-right: 10px;"
                    }
                }
            ]
        }
    }

    _graph () {
        const recurseDirs = (obj, pathHere) => {
            let elements = [];

            for (let key in obj) {
                let data = obj[key];

                if (key === "_content") {
                    if (data.length === 0) {
                        elements.push({
                            type : "li",
                            attributes : {
                                class : "empty"
                            },
                            content : [
                                {
                                    type : "p",
                                    content : "empty"
                                }
                            ]
                        })

                        continue;
                    }

                    elements = [...elements, ...data.map(file => {
                        return {
                            type : "li",
                            content : [
                                {
                                    type : "p",
                                    content : [
                                        {
                                            type : "a",
                                            attributes : {
                                                href : `https://raw.githubusercontent.com/0x81-sh/${this.categories.slice(1).join("-")}/master/${pathHere.join("/")}${pathHere.length > 0 ? "/" : ""}${file}`,
                                                style : "color: initial;"
                                            },
                                            content : file
                                        }
                                    ]
                                }
                            ]
                        }
                    })]
                    continue;
                }

                elements.push({
                    type : "li",
                    attributes : {
                        class : "container"
                    },
                    content : [
                        {
                            type : "p",
                            content : key
                        },
                        {
                            type : "ul",
                            content : recurseDirs(data, [...pathHere, key])
                        }
                    ]
                })
            }

            return elements;
        }

        return {
            type : "section",
            attributes : {
                style : "padding-left: 10px; margin-bottom: 40px;"
            },
            content : [
                {
                    type : "p",
                    content : "Project files:<br/><i>(Click to view file)</i>"
                },
                {
                    type : "ul",
                    content : recurseDirs(this.obj._files, [])
                }
            ]
        }
    }

    _footer () {
        return {
            type : "footer",
            attributes : {
                style : "position: absolute; right: 0; bottom: 0; left: 0;" +
                "background-color: lightgreen; text-align: center; width: 100%;" +
                "padding-top: 5px; padding-bottom: 5px;"
            },
            content : [
                {
                    type : "p",
                    content : "Project documentation and repository automatically generated."
                },
                {
                    type : "i",
                    content : "By 0x81, aka Ulrich Barnstedt - <a href='https://github.com/ulrich-barnstedt'>[Github]</a>"
                }
            ]
        }
    }
}