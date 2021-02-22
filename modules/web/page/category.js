const HTMLGen = require("html-creator");
const pretty = require("pretty");
const base = require("./baseHTML");

module.exports = class {
    constructor (name, obj, parents) {
        this.obj = obj;
        this.name = name;
        this.parents = parents;
    }

    html () {
        let htmlInstance = new HTMLGen([
            base.header(this.name, "category.css"),
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
                style : "box-sizing: border-box; background-color: lightblue; padding: 10px; padding-left: 20px"
            },
            content : [
                {
                    type : "h2",
                    content : "Category: " + this.name
                }
            ]
        }
    }

    _main () {
        return {
            type : "main",
            attributes : {
                style : "padding-left: 10px; margin-bottom: 40px;"
            },
            content : [
                {
                    type : "section",
                    content : this._metaSection()
                },
                {
                    type : "section",
                    content : [
                        {
                            type : "p",
                            content: "Currently available sub-categories and projects:"
                        },
                        ...this._buttons()
                    ]
                }
            ]
        }
    }

    _metaSection () {
        let pathAccumulator = [];
        let parentLinks = this.parents.slice(0, -1).map(cat => {
            pathAccumulator.push(cat);
            return `<a href="${"/" + pathAccumulator.join("/")}">${cat}</a>`
        });

        return [
            {
                type : "p",
                content : `<i>Last modified on ${new Date(this.obj._updatedAt).toLocaleString()}</i><br/>
(Note: Categories are abstract concepts, no repositories exist.)<br/>
Parent categories: ${parentLinks.length > 0 ? parentLinks.join(" -> ") : "<i>None. (Top level category)</i>"}`
            },
            {
                type : "hr",
                attributes : {
                    style : "margin-right: 10px;"
                }
            }
        ]
    }

    _buttons () {
        let keys = Object.keys(this.obj).filter(key => !key.startsWith("_"));

        return keys.map(key => {
            return {
                type : "a",
                attributes : {
                    class : "button",
                    href : "/" + this.parents.join("/") + "/" + key,
                    style : "display: block; float: left; clear: left; margin-bottom: 10px;"
                },
                content : `<b>-></b> ${key}  <i>(${"_isProject" in this.obj[key] ? "Project" : "Category"}, last updated ${new Date(this.obj[key]._updatedAt).toLocaleString()})</i>`
            }
        })
    }

    _footer () {
        return {
            type : "footer",
            attributes : {
                style : "position: absolute; right: 0; bottom: 0; left: 0;" +
                    "background-color: lightblue; text-align: center; width: 100%;" +
                    "padding-top: 5px; padding-bottom: 5px;"
            },
            content : [
                {
                    type : "p",
                    content : "Category-explorer and documentation automatically generated from source."
                },
                {
                    type : "i",
                    content : "By 0x81, aka Ulrich Barnstedt - <a href='https://github.com/ulrich-barnstedt'>[Github]</a>"
                }
            ]
        }
    }
}