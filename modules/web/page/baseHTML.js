module.exports = class {
    static header (title, cssFile, other) {
        if (!other) other = [];

        return {
            type : "head",
            content : [
                {
                    type : "meta",
                    attributes : { charset : "UTF-8" }
                },
                {
                    type : "title",
                    content : title
                },
                {
                    type : "link",
                    attributes : {
                        rel : "stylesheet",
                        href : "/css/" + cssFile
                    }
                },
                {
                    type : "link",
                    attributes: {
                        rel : "stylesheet",
                        href : "/css/page.css"
                    }
                },
                {
                    type : "link",
                    attributes: {
                        rel : "preconnect",
                        href : "https://fonts.gstatic.com"
                    }
                },
                {
                    type : "link",
                    attributes : {
                        href : "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
                        rel : "stylesheet"
                    }
                },
                ...other
            ]
        }
    }
}