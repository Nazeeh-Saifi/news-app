import { createEl } from "./editorJsUtils";
export class GifImage {
    static get toolbox() {
        return {
            title: "Gif",
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        };
    }
    static get pasteConfig() {
        return {
            patterns: {
                image: /https?:\/\/\S+\.(gif)$/i,
            },
        };
    }
    constructor({ data }) {
        this.data = data;
        this.wrapper = undefined;
        this.loadingSpinner = undefined;
        this.modalElem = document.getElementById("myModal");
        this.modalBs = new bootstrap.Modal(this.modalElem);

        /**
         * GIF endpoints related variables
         */
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
    }

    render() {
        this.wrapper = createEl("div");

        // if there is old data
        // (when having block that contain gif and leaving title empty and pressing add new article)
        if (this.data && this.data.url) {
            this._selectImage(this.data.url);
            return this.wrapper;
        }

        const modalTitle = this.modalElem.querySelector(".modal-title");
        modalTitle.innerText = "Please choose a gif";
        const modalBody = this.modalElem.querySelector(".modal-body");

        const gifSelector = createEl("div", {
            classList: ["gif-selector", "container", "border"],
        });

        const inputWrapper = createEl("div", {
            classList: ["row", "my-3"],
        });

        const col1 = createEl("div", {
            classList: ["col-10"],
        });

        // add input element for searching with classes for styling
        const input = createEl("input", {
            classList: ["form-control"],
            placeholder:
                this.provider === "giphy"
                    ? "Search via giphy"
                    : "Search via tenor",
        });

        const col2 = createEl("div", {
            classList: ["col-sm-2"],
        });

        const button = createEl("button", {
            type: "button",
            classList: ["btn", "btn-primary"],
            innerText: "insert",
        });

        /**
         * when clicking the insert button all the urls in window.selectedImagesUrls
         * will be created as blocks using the core block api (window.editorJs.blocks)
         */
        button.addEventListener(
            "click",
            function () {
                if (window.selectedImagesUrls.length > 0) {
                    window.selectedImagesUrls.forEach((url) => {
                        window.editorJs.blocks.insert("image", { url });
                        window.editorJs.caret.setToLastBlock()
                        window.selectedImagesUrls = [];
                        this.modalBs.hide();
                    });
                }
            }.bind(this)
        );

        const loadingSpinnerWrapper = createEl("div", {
            classList: ["row", "my-3", "justify-content-center"],
        });

        // add div element for the loading spinner when request is fetching
        this.loadingSpinner = createEl("div", {
            classList: ["lds-hourglass"],
        });

        col2.appendChild(button);
        col1.appendChild(input);
        inputWrapper.appendChild(col1);
        inputWrapper.appendChild(col2);
        loadingSpinnerWrapper.appendChild(this.loadingSpinner);
        gifSelector.appendChild(inputWrapper);
        gifSelector.appendChild(loadingSpinnerWrapper);
        modalBody.appendChild(gifSelector);

        // show the modal
        this.modalBs.show();

        // fetching trending gifs when render is running for the first time
        this._fetchAndCreateImages(
            this._getData.bind(this),
            this.trendingEndpoint
        );

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

                // render trending when no q value
                this.q
                    ? this._fetchAndCreateImages(
                          this._getData.bind(this),
                          this.searchEndpoint
                      )
                    : this._fetchAndCreateImages(
                          this._getData.bind(this),
                          this.trendingEndpoint
                      );
            }, 500)
        );

        return this.wrapper;
    }

    // when q change endpoint need to be updated
    _updateSearchEndpoint() {
        this.searchEndpoint =
            this.provider === "giphy"
                ? `${this.gifApiEndpoint}/search?api_key=${this.apiKey}&q=${this.q}&offset=${this.offset}&limit=${this.limit}&rating=${this.rating}`
                : `${this.gifApiEndpoint}/search?key=${this.apiKey}&q=${this.q}&limit=${this.limit}`;
    }

    // use one of the fetch functions (tranding or search) and create thier
    _fetchAndCreateImages(fetchFunction, url) {
        fetchFunction(url)
            .then((data) => {
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

    async _getData(url) {
        try {
            let res = await fetch(url);
            return res.json();
        } catch (error) {
            console.error(error);
        }
    }

    //used when there is old data and validation failed
    _selectImage(url) {
        const image = document.createElement("img");
        image.classList.add("my-3");
        image.src = url;

        this.wrapper.innerHTML = "";
        this.wrapper.appendChild(image);
        this.modalBs.hide();
    }

    // use array of urls to create gifs grid to choose from
    _createImages(urls) {
        const row = createEl("div", {
            classList: ["gifs-wrapper", "row"],
        });

        const colsArray = [];
        for (let i = 0; i < 3; i++) {
            const col = createEl("div", {
                classList: ["col-sm-4"],
            });
            colsArray.push(col);
        }

        urls.forEach((url, index) => {
            const imageWrapper = createEl("div", {
                classList: [
                    "d-flex",
                    "justify-content-center",
                    "align-items-center",
                    "position-relative",
                ],
            });

            // the gif images
            const image = createEl("img", {
                classList: ["w-100", "mb-4"],
                src: url,
            });
            image.toggleAttribute("hidden");
            image.style.zIndex = "1";

            // the loader shown while images loading
            const placeholder = createEl("img", {
                classList: ["w-100", "mb-4"],
                src: "/images/loader.svg",
            });

            // the checkmark on top of images
            const selectOverlay = createEl("img", {
                classList: ["w-25", "mb-4", "position-absolute"],
                src: "/images/checkmark.svg",
            });
            selectOverlay.toggleAttribute("hidden");

            /**
             * when clicking the image dim the image and view the
             * checkmark and add the url of the image to window.selectedImagesUls
             */
            image.addEventListener(
                "click",
                function (event) {
                    if (image.style.opacity === "0.2") {
                        image.style.opacity = "1";
                        selectOverlay.toggleAttribute("hidden");
                        let index = window.selectedImagesUrls.indexOf(
                            event.target.src
                        );
                        if (index >= 0) {
                            window.selectedImagesUrls.splice(index, 1);
                        }
                    } else {
                        image.style.opacity = "0.2";
                        selectOverlay.toggleAttribute("hidden");
                        window.selectedImagesUrls.push(event.target.src);
                    }
                }.bind(this)
            );

            // viewing the placeholder while the images finish loading
            image.addEventListener("load", function (event) {
                placeholder.toggleAttribute("hidden");
                image.toggleAttribute("hidden");
            });

            let choosenColumn = colsArray[Math.floor(index / colsArray.length)];
            imageWrapper.appendChild(placeholder);
            imageWrapper.appendChild(selectOverlay);
            imageWrapper.appendChild(image);
            choosenColumn.appendChild(imageWrapper);
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

    /**
     *
     * on paste the render function is called
     * that will make the modal appear
     * so i added an event listener once to close it
     * and after that creating an image using the pasted url
     */
    onPaste(event) {
        this.modalElem.addEventListener(
            "shown.bs.modal",
            function () {
                this.modalBs.hide();
            }.bind(this),
            { once: true }
        );
        switch (event.type) {
            case "pattern":
                const src = event.detail.data;

                const image = document.createElement("img");
                image.classList.add("my-3");
                image.src = src;

                this.wrapper.innerHTML = "";
                this.wrapper.appendChild(image);
                break;
        }
    }
}
