export class GifImage {
    static get toolbox() {
        return {
            title: "Gif",
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        };
    }
    constructor({ data }) {
        this.data = data;
        this.wrapper = undefined;
        this.loadingSpinner = undefined;
        this.modalElem = undefined;
        this.rating = "g";
        this.limit = 9;
        this.offset = 0;
        this.lang = "en";
        this.q = "";
        this.provider = process.env.MIX_GIF_PROVIDER;
        this.apiKey =
            this.provider === "giphy"
                ? process.env.MIX_GIPHY_API_KEY
                : process.env.MIX_TENOR_API_KEY;
        this.gifApiEndpoint =
            this.provider === "giphy"
                ? "https://api.giphy.com/v1/gifs"
                : "https://tenor.googleapis.com/v2";
        this.trendingEndpoint =
            this.provider === "giphy"
                ? `${this.gifApiEndpoint}/trending?api_key=${this.apiKey}&limit=${this.limit}&rating=${this.rating}`
                : `${this.gifApiEndpoint}/featured?key=${this.apiKey}&limit=${this.limit}`;
        this.searchEndpoint =
            this.provider === "giphy"
                ? `${this.gifApiEndpoint}/search?api_key=${this.apiKey}&q=${this.q}&offset=${this.offset}&limit=${this.limit}&rating=${this.rating}`
                : `${this.gifApiEndpoint}/search?key=${this.apiKey}&q=${this.q}&limit=${this.limit}`;

        console.log({
            git: this.constructor,
            data: this.data,
            provider: this.provider,
            key: this.apiKey,
            trending: this.trendingEndpoint,
            searchEndpoint: this.searchEndpoint,
            paste: this.constructor.pasteConfig,
        });
    }

    render() {
        console.log("rendering");
        this.wrapper = document.createElement("div");
        this.modalElem = document.getElementById("myModal");
        this.modalBs = new bootstrap.Modal(this.modalElem);

        const modalTitle = this.modalElem.querySelector(".modal-title");
        modalTitle.innerText = "Please choose a gif";
        const modalBody = this.modalElem.querySelector(".modal-body");

        const gifSelector = document.createElement("div");
        gifSelector.classList.add(
            "gif-selector",
            "d-flex",
            "flex-column",
            "align-items-center",
            "border"
        );

        // add input element for searching with classes for styling
        const input = document.createElement("input");
        input.classList.add("form-control", "w-50", "my-3");
        input.placeholder =
            this.provider === "giphy" ? "Search via giphy" : "Search via tenor";

        // add div element for the loading spinner when request is fetching
        this.loadingSpinner = document.createElement("div");
        this.loadingSpinner.classList.add("lds-hourglass");

        // if there is old data
        // (when having block that contain gif and leaving title empty and pressing add new article)
        if (this.data && this.data.url) {
            this._selectImage(this.data.url);
            return this.wrapper;
        }

        gifSelector.appendChild(input);
        gifSelector.appendChild(this.loadingSpinner);
        modalBody.appendChild(gifSelector);

        // show the modal
        this.modalBs.show();

        // fetching trending gifs when render is running for the first time
        this._fetchAndCreateImages(this._getTrendingData.bind(this));

        // when user search listener
        input.addEventListener(
            "keyup",
            _.debounce(async (event) => {
                // removing old results
                this.modalElem.querySelector(".gifs-wrapper").remove();
                // making the spinner visible
                this.loadingSpinner.toggleAttribute("hidden");

                //setting q query param
                this.q = event.target.value;
                this._updateSearchEndpoint();

                console.log(this.q);
                // render trending when no q value
                this.q
                    ? this._fetchAndCreateImages(this._getSearchData.bind(this))
                    : this._fetchAndCreateImages(
                          this._getTrendingData.bind(this)
                      );
            }, 500)
        );

        return this.wrapper;
    }

    // when q change
    _updateSearchEndpoint() {
        this.searchEndpoint =
            this.provider === "giphy"
                ? `${this.gifApiEndpoint}/search?api_key=${this.apiKey}&q=${this.q}&offset=${this.offset}&limit=${this.limit}&rating=${this.rating}`
                : `${this.gifApiEndpoint}/search?key=${this.apiKey}&q=${this.q}&limit=${this.limit}`;
    }

    // use one of the fetch functions (tranding or search) and create thier
    _fetchAndCreateImages(fetchFunction) {
        fetchFunction()
            .then((data) => {
                console.log(data);
                let providerData =
                    this.provider === "giphy" ? data.data : data.results;
                const urls = providerData.reduce((acc, obj) => {
                    let url =
                        this.provider === "giphy"
                            ? obj.images.fixed_height_downsampled.url
                            : obj.media_formats.tinygif.url;
                    acc.push(url);
                    return acc;
                }, []);
                this._createImages(urls);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.loadingSpinner.toggleAttribute("hidden");
            });
    }

    async _getTrendingData() {
        try {
            let res = await fetch(this.trendingEndpoint);
            return res.json();
        } catch (error) {
            console.error(error);
        }
    }

    async _getSearchData() {
        try {
            let res = await fetch(this.searchEndpoint);
            return res.json();
        } catch (error) {
            console.error(error);
        }
    }

    //not used anymore
    _wrapWithRowCol(element, colWidth) {
        const row = document.createElement("div");
        row.classList.add("row");

        const col = document.createElement("div");
        col.classList.add(colWidth ? "col-" + colWidth : "col");

        col.appendChild(element);
        row.appendChild(col);
        return row;
    }

    //not used anymore
    _createImage(url, captionText) {
        const image = document.createElement("img");
        const caption = document.createElement("div");

        image.src = url;
        caption.contentEditable = true;
        caption.innerHTML = captionText || "";

        this.wrapper.innerHTML = "";
        this.wrapper.appendChild(image);
        this.wrapper.appendChild(caption);
    }

    //used when pressing an image and when there is old data and validation failed
    _selectImage(url) {
        console.log("_selectImage", url);
        const image = document.createElement("img");
        image.classList.add("my-3");
        image.src = url;

        this.wrapper.innerHTML = "";
        this.wrapper.appendChild(image);
        this.modalBs.hide();
    }

    // use array of urls to create gifs grid to choose from
    _createImages(urls) {
        const row = document.createElement("div");
        row.classList.add("gifs-wrapper","row");
        // row.classList.add("row", "g-2");

        const colsArray = [];
        for (let i = 0; i < 3; i++) {
            const col = document.createElement("div");
            col.classList.add("col-sm-4");
            colsArray.push(col);
        }

        urls.forEach((url, index) => {
       

            const image = document.createElement("img");
            image.classList.add("w-100","mb-4");
            image.src = url;
            image.toggleAttribute("hidden");

            const placeholder = document.createElement("img");
            placeholder.classList.add("w-100","mb-4");
            placeholder.src = "/images/loader.svg";

            image.addEventListener(
                "click",
                function (event) {
                    this._selectImage(event.target.src);
                }.bind(this)
            );

            image.addEventListener(
                "load",
                function (event) {
                    placeholder.toggleAttribute("hidden");
                    image.toggleAttribute("hidden");
                }.bind(this)
            );

            let choosenColumn = colsArray[Math.floor(index / colsArray.length)];
            choosenColumn.appendChild(placeholder);
            choosenColumn.appendChild(image);
        });
        colsArray.forEach((col) => {
            row.appendChild(col);
        });

        this.modalElem.querySelector(".gif-selector").appendChild(row);
    }

    save(blockContent) {
        const img = blockContent.querySelector("img");
        return {
            url: img ? img.src : "",
        };
    }

    validate(savedData) {
        if (!savedData.url.trim()) {
            return false;
        }
        return true;
    }

    // onPaste(event) {
    //     console.log(event);
    //     switch (event.type) {
    //         // ... case 'tag'
    //         // ... case 'file'
    //         case "pattern":
    //             const src = event.detail.data;

    //             const image = document.createElement("img");
    //             image.classList.add("my-3");
    //             image.src = src;

    //             this.wrapper.innerHTML = "";
    //             this.wrapper.appendChild(image);
    //             break;
    //     }
    // }
}
