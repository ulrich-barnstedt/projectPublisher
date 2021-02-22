const Base = new class {
    pre (title, css, preTags) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="/css/${css}">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    ${preTags ? preTags : ""}
</head>
<body>`
    }

    post () {
        return `</body>
</html>`
    }
}

class Category {
    constructor (obj, name) {
        this.obj = obj;
        this.name = name;
    }

    html () {
        return `${Base.pre(this.name, "category.css")}
${this._genContent()}
${Base.post()}`
    }

    _genContent () {

    }
}

class Project {
    constructor (obj, name) {
        this.obj = obj;
        this.name = name;
    }

    html () {
        return `${Base.pre(this.name + "Project", "project.css")}
${this._genContent()}
${Base.post()}`
    }

    _genContent () {
        return `${this._meta()}
${this._genTable()}`
    }

    _meta () {
        return `<h1>Project: ${this.name}</h1>
<p>Source: <a href="">Github</a></p>`
    }

    _genTable () {
        const recurseFn = (obj) => {
            return Object.entries(obj).map (([key, data]) => {
                if (key === "_content") {
                    if (data.length === 0) {
                        return this._emptyElement();
                    }

                    return data.map(file => {
                        return this._li(file);
                    }).join("\n");
                }

                return `${this._container(recurseFn(obj[key]), key)}`
            }).join ("\n")
        }

        return `<ul>
${recurseFn(this.obj._files)}   
</ul>`
    }

    _emptyElement () {
        return `<li class="empty"><p>empty</p></li>`
    }

    _container (liArray, name) {
        return `<li class="container"><p>${name}</p>
<ul>
${liArray}
</ul>
</li>`
    }

    _li (url) {
        return `<li><p>${url}</p></li>`
    }
}

module.exports = new class {
    get Category () {
        return Category;
    }

    get Project () {
        return Project;
    }
}
