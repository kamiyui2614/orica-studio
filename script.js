// =========================
// ORICA STUDIO
// =========================

const STORAGE_KEY = "oricaStudioCards";

let cards =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

let editingCardId = null;
let isTwinpact = false;
let isSpecial = false;
let specialMode = null;


// =========================
// DOM
// =========================

const createSection =
    document.getElementById("createSection");

const listSection =
    document.getElementById("listSection");

const detailSection =
    document.getElementById("detailSection");

const createTabButton =
    document.getElementById("createTabButton");

const listTabButton =
    document.getElementById("listTabButton");

const cardList =
    document.getElementById("cardList");

const cardDetail =
    document.getElementById("cardDetail");

const backToListButton =
    document.getElementById("backToListButton");

const saveButton =
    document.getElementById("saveButton");

const resetButton =
    document.getElementById("resetButton");

const normalCardPanel =
    document.getElementById("normalCardPanel");

const normalCardFields =
    document.getElementById("normalCardFields");

const normalAbilityField =
    document.getElementById("normalAbilityField");

const twinpactPanel =
    document.getElementById("twinpactPanel");

const specialPanel =
    document.getElementById("multiFacePanel");

const specialFaceContainer =
    document.getElementById("multiFaceInputs");

const twinpactButton =
    document.getElementById("twinpactButton");

const specialModeButton =
    document.getElementById("multiFaceButton");

const specialModeButtons =
    document.getElementById("multiFaceModePanel");

const doubleSideButton =
    document.getElementById("doubleFaceButton");

const threeDButton =
    document.getElementById("tripleFaceButton");

const cardName =
    document.getElementById("cardName");

const reading =
    document.getElementById("reading");

const cardType =
    document.getElementById("cardType");

const cost =
    document.getElementById("cost");

const power =
    document.getElementById("power");

const race =
    document.getElementById("race");

const ability =
    document.getElementById("ability");

const civilizationButtons =
    document.querySelectorAll(
        "#civilizationButtons .civilization-button"
    );

const raceSlashButton =
    document.getElementById("raceSlashButton");

const bottomCardType =
    document.getElementById("bottomCardType");

const bottomCardName =
    document.getElementById("bottomCardName");

const bottomReading =
    document.getElementById("bottomReading");

const bottomCivilizationButtons =
    document.querySelectorAll(
        "#bottomCivilizationButtons .civilization-button"
    );

const bottomCost =
    document.getElementById("bottomCost");

const bottomRace =
    document.getElementById("bottomRace");

const bottomRaceSlashButton =
    document.getElementById("bottomRaceSlashButton");

const bottomAbility =
    document.getElementById("bottomAbility");

const searchToggleButton =
    document.getElementById("searchToggleButton");

const searchPanel =
    document.getElementById("searchPanel");

const searchKeyword =
    document.getElementById("searchKeyword");

const searchCostMin =
    document.getElementById("searchCostMin");

const searchCostMax =
    document.getElementById("searchCostMax");

const searchPowerMin =
    document.getElementById("searchPowerMin");

const searchPowerMax =
    document.getElementById("searchPowerMax");

const searchCardType =
    document.getElementById("searchCardType");

const searchCivilizationButtons =
    document.querySelectorAll(
        "#searchCivilizationButtons .search-civilization-button"
    );

const searchCivilizationArea =
    document.getElementById(
        "searchCivilizationButtons"
    );

const searchSingleColorButton =
    document.getElementById(
        "searchSingleColorButton"
    );

const searchMultiColorButton =
    document.getElementById(
        "searchMultiColorButton"
    );

const searchExactMatchButton =
    document.getElementById(
        "searchExactMatchButton"
    );

const favoritesOnly =
    document.getElementById(
        "favoritesOnly"
    );

let searchCivilizationMode = null;
let searchCivilizationExact = false;


// =========================
// 保存
// =========================

function saveCards() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cards)
    );
}


// =========================
// タブ
// =========================

function showCreateSection() {

    createSection.classList.remove(
        "hidden"
    );

    listSection.classList.add(
        "hidden"
    );

    detailSection.classList.add(
        "hidden"
    );
}

function showListSection() {

    createSection.classList.add(
        "hidden"
    );

    listSection.classList.remove(
        "hidden"
    );

    detailSection.classList.add(
        "hidden"
    );

    renderCardList();
}

createTabButton.addEventListener(
    "click",
    showCreateSection
);

listTabButton.addEventListener(
    "click",
    showListSection
);


// =========================
// 文明
// =========================

function getSelectedCivilizations(
    buttons
) {

    return Array.from(buttons)
        .filter(
            button =>
                button.classList.contains(
                    "selected"
                )
        )
        .map(
            button =>
                button.dataset.civilization
        );
}

function setSelectedCivilizations(
    buttons,
    civilizations
) {

    const set =
        new Set(
            civilizations || []
        );

    buttons.forEach(button => {

        button.classList.toggle(
            "selected",
            set.has(
                button.dataset.civilization
            )
        );
    });
}

function setupCivilizationButtons(
    buttons
) {

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                button.classList.toggle(
                    "selected"
                );

                renderCardList();
            }
        );
    });
}

setupCivilizationButtons(
    civilizationButtons
);

setupCivilizationButtons(
    bottomCivilizationButtons
);

setupCivilizationButtons(
    searchCivilizationButtons
);


// =========================
// 文明配列
// =========================

function getCivilizationArray(
    civilization
) {

    if (
        civilization === null ||
        civilization === undefined
    ) {
        return [];
    }

    return String(civilization)
        .split(/[・/,、\s]+/)
        .map(
            value =>
                value.trim()
        )
        .filter(Boolean);
}


// =========================
// カード全体の文明
// =========================

function getCardCivilizations(
    card
) {

    const civilizations = [];

    function addCivilizations(
        value
    ) {

        getCivilizationArray(
            value
        ).forEach(
            civilization => {

                if (
                    !civilizations.includes(
                        civilization
                    )
                ) {
                    civilizations.push(
                        civilization
                    );
                }
            }
        );
    }

    addCivilizations(
        card.civilization
    );

    if (
        card.isTwinpact &&
        card.bottomCard
    ) {

        addCivilizations(
            card.bottomCard.civilization
        );
    }

    if (
        card.isSpecial &&
        Array.isArray(card.faces)
    ) {

        card.faces.forEach(
            face => {

                addCivilizations(
                    face.civilization
                );
            }
        );
    }

    return civilizations;
}

function isCardMulticolor(card) {

    const colored =
        getCardCivilizations(card)
            .filter(
                civilization =>
                    civilization !== "無色"
            );

    return colored.length >= 2;
}

function isCardSingleColor(card) {

    return !isCardMulticolor(card);
}


// =========================
// 検索文明UI
// =========================

function updateSearchCivilizationModeUI() {

    searchSingleColorButton.classList.toggle(
        "selected",
        searchCivilizationMode === "single"
    );

    searchMultiColorButton.classList.toggle(
        "selected",
        searchCivilizationMode === "multi"
    );

    searchExactMatchButton.classList.toggle(
        "selected",
        searchCivilizationExact
    );

    searchExactMatchButton.classList.toggle(
        "hidden",
        searchCivilizationMode !== "multi"
    );

    searchCivilizationArea.classList.toggle(
        "hidden",
        searchCivilizationMode === null
    );
}

searchSingleColorButton.addEventListener(
    "click",
    () => {

        searchCivilizationMode =
            searchCivilizationMode === "single"
                ? null
                : "single";

        searchCivilizationExact = false;

        updateSearchCivilizationModeUI();
        renderCardList();
    }
);

searchMultiColorButton.addEventListener(
    "click",
    () => {

        searchCivilizationMode =
            searchCivilizationMode === "multi"
                ? null
                : "multi";

        searchCivilizationExact = false;

        updateSearchCivilizationModeUI();
        renderCardList();
    }
);

searchExactMatchButton.addEventListener(
    "click",
    () => {

        if (
            searchCivilizationMode !==
            "multi"
        ) {
            return;
        }

        searchCivilizationExact =
            !searchCivilizationExact;

        updateSearchCivilizationModeUI();
        renderCardList();
    }
);


// =========================
// 検索文明判定
// =========================

function matchesCivilizationFilter(
    card
) {

    const selected =
        getSelectedCivilizations(
            searchCivilizationButtons
        );

    const cardCivilizations =
        getCardCivilizations(card);


    if (
        searchCivilizationMode ===
        "single"
    ) {

        if (
            !isCardSingleColor(card)
        ) {
            return false;
        }

        if (
            selected.length === 0
        ) {
            return true;
        }

        return selected.some(
            civilization =>
                cardCivilizations.includes(
                    civilization
                )
        );
    }


    if (
        searchCivilizationMode ===
        "multi"
    ) {

        if (
            !isCardMulticolor(card)
        ) {
            return false;
        }

        if (
            selected.length === 0
        ) {
            return true;
        }


        if (
            searchCivilizationExact
        ) {

            const selectedColored =
                selected.filter(
                    civilization =>
                        civilization !==
                        "無色"
                );

            const cardColored =
                cardCivilizations.filter(
                    civilization =>
                        civilization !==
                        "無色"
                );


            if (
                cardColored.length !==
                selectedColored.length
            ) {
                return false;
            }


            return selectedColored.every(
                civilization =>
                    cardColored.includes(
                        civilization
                    )
            );
        }


        return selected.some(
            civilization =>
                cardCivilizations.includes(
                    civilization
                )
        );
    }


    if (
        selected.length === 0
    ) {
        return true;
    }


    return selected.every(
        civilization =>
            cardCivilizations.includes(
                civilization
            )
    );
}


// =========================
// 検索パネル
// =========================

searchToggleButton.addEventListener(
    "click",
    () => {

        searchPanel.classList.toggle(
            "hidden"
        );

        searchToggleButton.textContent =
            searchPanel.classList.contains(
                "hidden"
            )
                ? "検索"
                : "検索を閉じる";
    }
);


// =========================
// 能力入力
// =========================

function setupAbilityInput(
    textarea
) {

    textarea.addEventListener(
        "focus",
        () => {

            if (
                textarea.value.trim() === ""
            ) {
                textarea.value = "■ ";
            }
        }
    );

    textarea.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }

            event.preventDefault();

            const start =
                textarea.selectionStart;

            const end =
                textarea.selectionEnd;

            const before =
                textarea.value.slice(
                    0,
                    start
                );

            const after =
                textarea.value.slice(
                    end
                );

            textarea.value =
                before +
                "\n■ " +
                after;

            textarea.selectionStart =
                textarea.selectionEnd =
                    start + 3;
        }
    );
}

setupAbilityInput(ability);
setupAbilityInput(bottomAbility);


// =========================
// 種族「/」
// =========================

function setupRaceSlash(
    input,
    button
) {

    button.addEventListener(
        "click",
        () => {

            const position =
                input.selectionStart;

            const before =
                input.value.slice(
                    0,
                    position
                );

            const after =
                input.value.slice(
                    position
                );

            input.value =
                before +
                "/" +
                after;

            input.focus();

            input.selectionStart =
                input.selectionEnd =
                    position + 1;
        }
    );
}

setupRaceSlash(
    race,
    raceSlashButton
);

setupRaceSlash(
    bottomRace,
    bottomRaceSlashButton
);


// =========================
// 特殊カード面
// =========================

function createSpecialFace(
    index
) {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "special-face";

    wrapper.innerHTML = `
        <h4>第${index + 1}面</h4>

        <div class="form-group">
            <label>名前</label>
            <input type="text" data-field="name">
        </div>

        <div class="form-group">
            <label>読み方</label>
            <input type="text" data-field="reading">
        </div>

        <div class="form-group">
            <label>文明</label>
            <div class="civilization-buttons" data-civilizations>
                <button type="button" class="civilization-button" data-civilization="光">光</button>
                <button type="button" class="civilization-button" data-civilization="水">水</button>
                <button type="button" class="civilization-button" data-civilization="闇">闇</button>
                <button type="button" class="civilization-button" data-civilization="火">火</button>
                <button type="button" class="civilization-button" data-civilization="自然">自然</button>
                <button type="button" class="civilization-button" data-civilization="無色">無色</button>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>コスト</label>
                <input type="text" data-field="cost">
            </div>

            <div class="form-group">
                <label>パワー</label>
                <input type="text" data-field="power">
            </div>
        </div>

        <div class="form-group">
            <label>種族</label>
            <div class="input-with-button">
                <input type="text" data-field="race">
                <button
                    type="button"
                    class="small-button slash-button"
                    data-slash
                >
                    /
                </button>
            </div>
        </div>

        <div class="form-group">
            <label>カードタイプ</label>
            <input type="text" data-field="cardType">
        </div>

        <div class="form-group">
            <label>能力</label>
            <textarea data-field="ability"></textarea>
        </div>
    `;

    const buttons =
        wrapper.querySelectorAll(
            ".civilization-button"
        );

    setupCivilizationButtons(
        buttons
    );

    const slash =
        wrapper.querySelector(
            "[data-slash]"
        );

    const raceInput =
        wrapper.querySelector(
            '[data-field="race"]'
        );

    setupRaceSlash(
        raceInput,
        slash
    );

    const abilityInput =
        wrapper.querySelector(
            '[data-field="ability"]'
        );

    setupAbilityInput(
        abilityInput
    );

    return wrapper;
}

function renderSpecialFaces() {

    specialFaceContainer.innerHTML =
        "";

    const count =
        specialMode === "3d"
            ? 3
            : 2;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        specialFaceContainer.appendChild(
            createSpecialFace(i)
        );

        if (
            i < count - 1
        ) {

            const separator =
                document.createElement(
                    "hr"
                );

            separator.className =
                "special-face-separator";

            specialFaceContainer.appendChild(
                separator
            );
        }
    }
}

function getSpecialFaceData() {

    const faces =
        Array.from(
            specialFaceContainer.querySelectorAll(
                ".special-face"
            )
        );

    return faces.map(face => {

        const get =
            field =>
                face.querySelector(
                    `[data-field="${field}"]`
                );

        const civilizationButtons =
            face.querySelectorAll(
                ".civilization-button"
            );

        return {
            name:
                get("name").value,

            reading:
                get("reading").value,

            civilization:
                getSelectedCivilizations(
                    civilizationButtons
                ).join("・"),

            race:
                get("race").value,

            cost:
                get("cost").value,

            power:
                get("power").value,

            cardType:
                get("cardType").value,

            ability:
                get("ability").value
        };
    });
}

function setSpecialFaceData(
    faces
) {

    const faceElements =
        specialFaceContainer.querySelectorAll(
            ".special-face"
        );

    faceElements.forEach(
        (faceElement, index) => {

            const data =
                faces[index];

            if (!data) {
                return;
            }

            const get =
                field =>
                    faceElement.querySelector(
                        `[data-field="${field}"]`
                    );

            get("name").value =
                data.name || "";

            get("reading").value =
                data.reading || "";

            get("race").value =
                data.race || "";

            get("cost").value =
                data.cost || "";

            get("power").value =
                data.power || "";

            get("cardType").value =
                data.cardType || "";

            get("ability").value =
                data.ability || "";

            setSelectedCivilizations(
                faceElement.querySelectorAll(
                    ".civilization-button"
                ),
                getCivilizationArray(
                    data.civilization
                )
            );
        }
    );
}


// =========================
// モードUI
// =========================

function updateSpecialModeUI() {

    specialModeButton.classList.toggle(
        "selected",
        isSpecial
    );

    specialModeButton.textContent =
        isSpecial
            ? "ドラグハート・サイキック解除"
            : "ドラグハート・サイキック";

    twinpactButton.classList.toggle(
        "selected",
        isTwinpact
    );

    twinpactButton.textContent =
        isTwinpact
            ? "ツインパクト解除"
            : "ツインパクト";


    if (isSpecial) {

        specialModeButtons.classList.remove(
            "hidden"
        );

        normalCardPanel.classList.remove(
            "hidden"
        );

        /*
         * ここが今回の重要部分。
         *
         * カードタイプは normalCardFields の中にあるので、
         * 特殊モードでは normalCardFields ごと隠す。
         *
         * これによって、
         * 「カードタイプ」だけが名前より上に残る問題を防ぐ。
         */

        normalCardFields.classList.add(
            "hidden"
        );

        normalAbilityField.classList.add(
            "hidden"
        );

        twinpactPanel.classList.add(
            "hidden"
        );

        specialPanel.classList.remove(
            "hidden"
        );

        if (!specialMode) {
            specialMode = "double";
        }

        doubleSideButton.classList.toggle(
            "selected",
            specialMode === "double"
        );

        threeDButton.classList.toggle(
            "selected",
            specialMode === "3d"
        );

        return;
    }


    specialModeButtons.classList.add(
        "hidden"
    );

    specialPanel.classList.add(
        "hidden"
    );

    normalCardPanel.classList.remove(
        "hidden"
    );

    normalCardFields.classList.remove(
        "hidden"
    );

    normalAbilityField.classList.remove(
        "hidden"
    );

    if (isTwinpact) {

        twinpactPanel.classList.remove(
            "hidden"
        );

    } else {

        twinpactPanel.classList.add(
            "hidden"
        );
    }
}

function updateTwinpactUI() {

    twinpactButton.classList.toggle(
        "selected",
        isTwinpact
    );

    twinpactButton.textContent =
        isTwinpact
            ? "ツインパクト解除"
            : "ツインパクト";

    if (isSpecial) {

        twinpactPanel.classList.add(
            "hidden"
        );

        return;
    }

    twinpactPanel.classList.toggle(
        "hidden",
        !isTwinpact
    );
}


// =========================
// モードボタン
// =========================

twinpactButton.addEventListener(
    "click",
    () => {

        if (isTwinpact) {

            isTwinpact = false;

        } else {

            isTwinpact = true;
            isSpecial = false;
            specialMode = null;
        }

        updateSpecialModeUI();
        updateTwinpactUI();
    }
);

specialModeButton.addEventListener(
    "click",
    () => {

        if (isSpecial) {

            isSpecial = false;
            specialMode = null;

        } else {

            isSpecial = true;
            isTwinpact = false;
            specialMode = "double";

            renderSpecialFaces();
        }

        updateSpecialModeUI();
        updateTwinpactUI();
    }
);

doubleSideButton.addEventListener(
    "click",
    () => {

        if (!isSpecial) {
            return;
        }

        specialMode = "double";
        renderSpecialFaces();

        updateSpecialModeUI();
    }
);

threeDButton.addEventListener(
    "click",
    () => {

        if (!isSpecial) {
            return;
        }

        specialMode = "3d";
        renderSpecialFaces();

        updateSpecialModeUI();
    }
);


// =========================
// リセット
// =========================

function resetForm() {

    editingCardId = null;

    isTwinpact = false;
    isSpecial = false;
    specialMode = null;

    cardName.value = "";
    reading.value = "";
    cardType.value = "";
    cost.value = "";
    power.value = "";
    race.value = "";
    ability.value = "";

    setSelectedCivilizations(
        civilizationButtons,
        []
    );

    bottomCardType.value = "呪文";
    bottomCardName.value = "";
    bottomReading.value = "";
    bottomCost.value = "";
    bottomRace.value = "";
    bottomAbility.value = "";

    setSelectedCivilizations(
        bottomCivilizationButtons,
        []
    );

    specialFaceContainer.innerHTML =
        "";

    saveButton.textContent =
        "保存";

    updateSpecialModeUI();
    updateTwinpactUI();
}

resetButton.addEventListener(
    "click",
    resetForm
);


// =========================
// 数値取得
// =========================

function parseNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    const match =
        String(value).match(
            /-?\d+/
        );

    if (!match) {
        return null;
    }

    return Number(
        match[0]
    );
}

function parsePower(value) {

    return parseNumber(value);
}


// =========================
// 特殊カード検索対象
// =========================

function getSearchableFaces(card) {

    if (
        card.isSpecial &&
        Array.isArray(card.faces)
    ) {
        return card.faces;
    }

    return [card];
}


// =========================
// カード一覧
// =========================

function renderCardList() {

    cardList.innerHTML = "";

    const keyword =
        searchKeyword.value
            .trim()
            .toLowerCase();

    const costMin =
        parseNumber(
            searchCostMin.value
        );

    const costMax =
        parseNumber(
            searchCostMax.value
        );

    const powerMin =
        parsePower(
            searchPowerMin.value
        );

    const powerMax =
        parsePower(
            searchPowerMax.value
        );

    const typeKeyword =
        searchCardType.value
            .trim()
            .toLowerCase();


    const filteredCards =
        cards.filter(card => {

            const searchableFaces =
                getSearchableFaces(card);


            // =====================
            // キーワード
            // =====================

            if (keyword) {

                const texts = [];

                searchableFaces.forEach(
                    face => {

                        texts.push(
                            face.name,
                            face.reading,
                            face.civilization,
                            face.race,
                            face.cost,
                            face.power,
                            face.cardType,
                            face.ability
                        );
                    }
                );

                texts.push(
                    card.name,
                    card.reading,
                    card.civilization,
                    card.race,
                    card.cost,
                    card.power,
                    card.cardType,
                    card.ability
                );

                if (
                    card.bottomCard
                ) {

                    texts.push(
                        card.bottomCard.name,
                        card.bottomCard.reading,
                        card.bottomCard.civilization,
                        card.bottomCard.race,
                        card.bottomCard.cost,
                        card.bottomCard.cardType,
                        card.bottomCard.ability
                    );
                }

                const text =
                    texts
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                if (
                    !text.includes(
                        keyword
                    )
                ) {
                    return false;
                }
            }


            // =====================
            // コスト
            // =====================

            if (
                costMin !== null ||
                costMax !== null
            ) {

                const costMatch =
                    searchableFaces.some(
                        face => {

                            const faceCost =
                                parseNumber(
                                    face.cost
                                );

                            if (
                                faceCost === null
                            ) {
                                return false;
                            }

                            if (
                                costMin !== null &&
                                faceCost < costMin
                            ) {
                                return false;
                            }

                            if (
                                costMax !== null &&
                                faceCost > costMax
                            ) {
                                return false;
                            }

                            return true;
                        }
                    );

                if (!costMatch) {
                    return false;
                }
            }


            // =====================
            // パワー
            // =====================

            if (
                powerMin !== null ||
                powerMax !== null
            ) {

                const powerMatch =
                    searchableFaces.some(
                        face => {

                            const facePower =
                                parsePower(
                                    face.power
                                );

                            if (
                                facePower === null
                            ) {
                                return false;
                            }

                            if (
                                powerMin !== null &&
                                facePower < powerMin
                            ) {
                                return false;
                            }

                            if (
                                powerMax !== null &&
                                facePower > powerMax
                            ) {
                                return false;
                            }

                            return true;
                        }
                    );

                if (!powerMatch) {
                    return false;
                }
            }


            // =====================
            // カードタイプ
            // =====================

            if (typeKeyword) {

                if (
                    typeKeyword ===
                    "ツインパクト"
                ) {

                    if (!card.isTwinpact) {
                        return false;
                    }

                } else if (
                    typeKeyword ===
                    "ドラグハート・サイキック"
                ) {

                    if (!card.isSpecial) {
                        return false;
                    }

                } else {

                    if (
                        card.isTwinpact ||
                        card.isSpecial
                    ) {
                        return false;
                    }

                    const type =
                        String(
                            card.cardType || ""
                        ).toLowerCase();

                    if (
                        !type.includes(
                            typeKeyword
                        )
                    ) {

                        return false;
                    }
                }
            }


            // =====================
            // 文明
            // =====================

            if (
                !matchesCivilizationFilter(
                    card
                )
            ) {
                return false;
            }


            // =====================
            // お気に入り
            // =====================

            if (
                favoritesOnly.checked &&
                !card.favorite
            ) {
                return false;
            }

            return true;
        });


    if (
        filteredCards.length === 0
    ) {

        cardList.innerHTML =
            `<p class="empty-message">
                カードが見つかりません。
            </p>`;

        return;
    }


    filteredCards.forEach(
        card => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "card-list-item";

            item.addEventListener(
                "click",
                () => {

                    showCardDetail(
                        card.id
                    );
                }
            );


            const nameArea =
                document.createElement(
                    "div"
                );

            nameArea.className =
                "card-list-name-area";


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "card-list-name";

            name.textContent =
                card.name ||
                (
                    card.isSpecial &&
                    card.faces &&
                    card.faces[0]
                        ? card.faces[0].name
                        : "名前なし"
                ) ||
                "名前なし";


            const type =
                document.createElement(
                    "div"
                );

            type.className =
                "card-list-type";

            if (card.isTwinpact) {

                type.textContent =
                    "ツインパクト";

            } else if (card.isSpecial) {

                type.textContent =
                    "ドラグハート・サイキック";

            } else {

                type.textContent =
                    card.cardType ||
                    "カードタイプ未設定";
            }


            nameArea.appendChild(
                name
            );

            nameArea.appendChild(
                type
            );


            const favoriteButton =
                document.createElement(
                    "button"
                );

            favoriteButton.type =
                "button";

            favoriteButton.className =
                "favorite-button";

            favoriteButton.textContent =
                card.favorite
                    ? "★"
                    : "☆";

            favoriteButton.title =
                card.favorite
                    ? "お気に入りを解除"
                    : "お気に入りに追加";

            favoriteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    card.favorite =
                        !card.favorite;

                    saveCards();
                    renderCardList();
                }
            );


            item.appendChild(
                nameArea
            );

            item.appendChild(
                favoriteButton
            );

            cardList.appendChild(
                item
            );
        }
    );
}


// =========================
// 検索入力イベント
// =========================

[
    searchKeyword,
    searchCostMin,
    searchCostMax,
    searchPowerMin,
    searchPowerMax,
    searchCardType
].forEach(input => {

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        renderCardList
    );
});

if (favoritesOnly) {

    favoritesOnly.addEventListener(
        "change",
        renderCardList
    );
}


// =========================
// HTMLエスケープ
// =========================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =========================
// 詳細：通常
// =========================

function createNormalDetailHTML(
    card
) {

    return `
        <div class="detail-content">

            <p>
                <strong>読み方：</strong>
                ${escapeHTML(
                    card.reading || "〇〇"
                )}
            </p>

            <p>
                <strong>文明：</strong>
                ${escapeHTML(
                    card.civilization || "〇〇"
                )}
            </p>

            <p>
                <strong>種族：</strong>
                ${escapeHTML(
                    card.race || "〇〇"
                )}
            </p>

            <p>
                <strong>コスト：</strong>
                ${escapeHTML(
                    card.cost || "〇〇"
                )}
            </p>

            <p>
                <strong>パワー：</strong>
                ${escapeHTML(
                    card.power || "〇〇"
                )}
            </p>

            <p>
                <strong>カードタイプ：</strong>
                ${escapeHTML(
                    card.cardType || "〇〇"
                )}
            </p>

            <div class="detail-ability">
                <strong>能力：</strong>
                <pre>${escapeHTML(
                    String(
                        card.ability || "〇〇"
                    ).trim()
                )}</pre>
            </div>

        </div>
    `;
}


// =========================
// 詳細：特殊
// =========================

function createSpecialDetailHTML(
    card
) {

    let html =
        `<div class="special-detail">`;

    const faces =
        Array.isArray(card.faces)
            ? card.faces
            : [];

    faces.forEach(
        (face, index) => {

            html += `
                <div class="special-detail-face">

                    <h3>
                        第${index + 1}面
                    </h3>

                    <div class="detail-content">

                        <p>
                            <strong>名前：</strong>
                            ${escapeHTML(
                                face.name || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>読み方：</strong>
                            ${escapeHTML(
                                face.reading || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>文明：</strong>
                            ${escapeHTML(
                                face.civilization || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>種族：</strong>
                            ${escapeHTML(
                                face.race || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>コスト：</strong>
                            ${escapeHTML(
                                face.cost || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>パワー：</strong>
                            ${escapeHTML(
                                face.power || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>カードタイプ：</strong>
                            ${escapeHTML(
                                face.cardType || "〇〇"
                            )}
                        </p>

                        <div class="detail-ability">
                            <strong>能力：</strong>
                            <pre>${escapeHTML(
                                String(
                                    face.ability || "〇〇"
                                ).trim()
                            )}</pre>
                        </div>

                    </div>

                </div>
            `;
        }
    );

    html +=
        `</div>`;

    return html;
}


// =========================
// 詳細
// =========================

function showCardDetail(id) {

    const card =
        cards.find(
            item =>
                item.id === id
        );

    if (!card) {
        return;
    }

    createSection.classList.add(
        "hidden"
    );

    listSection.classList.add(
        "hidden"
    );

    detailSection.classList.remove(
        "hidden"
    );


    let html = `
        <div class="detail-card">

            <div class="detail-header">

                <h2>
                    ${escapeHTML(
                        card.name ||
                        (
                            card.isSpecial &&
                            card.faces &&
                            card.faces[0]
                                ? card.faces[0].name
                                : "名前なし"
                        ) ||
                        "名前なし"
                    )}
                </h2>

                <button
                    type="button"
                    class="favorite-button detail-favorite"
                    onclick="toggleFavorite('${card.id}')"
                >
                    ${
                        card.favorite
                            ? "★"
                            : "☆"
                    }
                </button>

            </div>
    `;


    if (card.isSpecial) {

        html +=
            createSpecialDetailHTML(
                card
            );

    } else {

        html +=
            createNormalDetailHTML(
                card
            );


        if (
            card.isTwinpact &&
            card.bottomCard
        ) {

            const bottom =
                card.bottomCard;

            html += `
                <div class="twinpact-detail">

                    <div class="twinpact-label">
                        ツインパクト下面
                    </div>

                    <div class="detail-content">

                        <p>
                            <strong>名前：</strong>
                            ${escapeHTML(
                                bottom.name || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>読み方：</strong>
                            ${escapeHTML(
                                bottom.reading || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>文明：</strong>
                            ${escapeHTML(
                                bottom.civilization || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>種族：</strong>
                            ${escapeHTML(
                                bottom.race || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>コスト：</strong>
                            ${escapeHTML(
                                bottom.cost || "〇〇"
                            )}
                        </p>

                        <p>
                            <strong>カードタイプ：</strong>
                            ${escapeHTML(
                                bottom.cardType || "呪文"
                            )}
                        </p>

                        <div class="detail-ability">
                            <strong>能力：</strong>
                            <pre>${escapeHTML(
                                String(
                                    bottom.ability || "〇〇"
                                ).trim()
                            )}</pre>
                        </div>

                    </div>

                </div>
            `;
        }
    }


    html += `
            <div class="detail-actions">

                <button
                    type="button"
                    onclick="editCard('${card.id}')"
                >
                    編集
                </button>

                <button
                    type="button"
                    onclick="copyTemplate('${card.id}')"
                >
                    テンプレコピー
                </button>

                <button
                    type="button"
                    class="delete-button"
                    onclick="deleteCard('${card.id}')"
                >
                    削除
                </button>

            </div>

        </div>
    `;

    cardDetail.innerHTML =
        html;
}


// =========================
// お気に入り
// =========================

function toggleFavorite(id) {

    const card =
        cards.find(
            item =>
                item.id === id
        );

    if (!card) {
        return;
    }

    card.favorite =
        !card.favorite;

    saveCards();

    showCardDetail(id);
    renderCardList();
}


// =========================
// ID
// =========================

function createId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}


// =========================
// 編集
// =========================

function editCard(id) {

    const card =
        cards.find(
            item =>
                item.id === id
        );

    if (!card) {
        return;
    }

    editingCardId =
        id;


    // =====================
    // 特殊カード
    // =====================

    if (card.isSpecial) {

        isSpecial = true;
        isTwinpact = false;

        specialMode =
            card.specialMode ||
            (
                Array.isArray(card.faces) &&
                card.faces.length === 3
                    ? "3d"
                    : "double"
            );

        renderSpecialFaces();

        setSpecialFaceData(
            Array.isArray(card.faces)
                ? card.faces
                : []
        );

        updateSpecialModeUI();
        updateTwinpactUI();

        saveButton.textContent =
            "更新";

        showCreateSection();

        return;
    }


    // =====================
    // 通常カード
    // =====================

    isSpecial = false;
    specialMode = null;

    cardName.value =
        card.name || "";

    reading.value =
        card.reading || "";

    cardType.value =
        card.cardType || "";

    cost.value =
        card.cost || "";

    power.value =
        card.power || "";

    race.value =
        card.race || "";

    ability.value =
        card.ability || "";

    setSelectedCivilizations(
        civilizationButtons,
        getCivilizationArray(
            card.civilization
        )
    );


    // =====================
    // ツインパクト
    // =====================

    isTwinpact =
        !!card.isTwinpact;


    if (
        isTwinpact &&
        card.bottomCard
    ) {

        const bottom =
            card.bottomCard;

        bottomCardType.value =
            bottom.cardType ||
            "呪文";

        bottomCardName.value =
            bottom.name ||
            "";

        bottomReading.value =
            bottom.reading ||
            "";

        bottomCost.value =
            bottom.cost ||
            "";

        bottomRace.value =
            bottom.race ||
            "";

        bottomAbility.value =
            bottom.ability ||
            "";

        setSelectedCivilizations(
            bottomCivilizationButtons,
            getCivilizationArray(
                bottom.civilization
            )
        );

    } else {

        bottomCardType.value =
            "呪文";

        bottomCardName.value =
            "";

        bottomReading.value =
            "";

        bottomCost.value =
            "";

        bottomRace.value =
            "";

        bottomAbility.value =
            "";

        setSelectedCivilizations(
            bottomCivilizationButtons,
            []
        );
    }

    updateSpecialModeUI();
    updateTwinpactUI();

    saveButton.textContent =
        "更新";

    showCreateSection();
}


// =========================
// 保存
// =========================

saveButton.addEventListener(
    "click",
    () => {

        // =====================
        // 特殊カード
        // =====================

        if (isSpecial) {

            const faces =
                getSpecialFaceData();

            if (
                faces.length === 0
            ) {
                alert(
                    "面の情報を入力してください。"
                );
                return;
            }

            const first =
                faces[0];

            if (
                !first.name.trim()
            ) {
                alert(
                    "第1面の名前を入力してください。"
                );
                return;
            }

            const cardData = {
                id:
                    editingCardId ||
                    createId(),

                name:
                    first.name,

                reading:
                    first.reading,

                civilization:
                    first.civilization,

                race:
                    first.race,

                cost:
                    first.cost,

                power:
                    first.power,

                cardType:
                    "ドラグハート・サイキック",

                ability:
                    first.ability,

                isTwinpact:
                    false,

                isSpecial:
                    true,

                specialMode:
                    specialMode || "double",

                faces,

                favorite:
                    editingCardId
                        ? (
                            cards.find(
                                item =>
                                    item.id ===
                                    editingCardId
                            )?.favorite ||
                            false
                        )
                        : false
            };

            if (editingCardId) {

                cards =
                    cards.map(
                        card =>
                            card.id ===
                            editingCardId
                                ? cardData
                                : card
                    );

            } else {

                cards.push(
                    cardData
                );
            }

            saveCards();

            alert(
                editingCardId
                    ? "カードを更新しました。"
                    : "カードを保存しました。"
            );

            resetForm();
            showListSection();

            return;
        }


        // =====================
        // 通常カード
        // =====================

        if (
            !cardName.value.trim()
        ) {

            alert(
                "名前を入力してください。"
            );

            return;
        }


        const topCivilization =
            getSelectedCivilizations(
                civilizationButtons
            ).join("・");


        const bottomCivilization =
            getSelectedCivilizations(
                bottomCivilizationButtons
            ).join("・");


        const cardData = {

            id:
                editingCardId ||
                createId(),

            name:
                cardName.value,

            reading:
                reading.value,

            civilization:
                topCivilization,

            race:
                race.value,

            cost:
                cost.value,

            power:
                power.value,

            cardType:
                cardType.value,

            ability:
                ability.value,

            isTwinpact:
                isTwinpact,

            isSpecial:
                false,

            favorite:
                editingCardId
                    ? (
                        cards.find(
                            item =>
                                item.id ===
                                editingCardId
                        )?.favorite ||
                        false
                    )
                    : false
        };


        if (isTwinpact) {

            cardData.bottomCard = {

                name:
                    bottomCardName.value,

                reading:
                    bottomReading.value,

                civilization:
                    bottomCivilization,

                race:
                    bottomRace.value,

                cost:
                    bottomCost.value,

                cardType:
                    bottomCardType.value ||
                    "呪文",

                ability:
                    bottomAbility.value
            };
        }


        if (editingCardId) {

            cards =
                cards.map(
                    card =>
                        card.id ===
                        editingCardId
                            ? cardData
                            : card
                );

        } else {

            cards.push(
                cardData
            );
        }


        saveCards();

        alert(
            editingCardId
                ? "カードを更新しました。"
                : "カードを保存しました。"
        );

        resetForm();
        showListSection();
    }
);


// =========================
// 削除
// =========================

function deleteCard(id) {

    const card =
        cards.find(
            item =>
                item.id === id
        );

    if (!card) {
        return;
    }

    const confirmed =
        confirm(
            `「${
                card.name ||
                (
                    card.isSpecial &&
                    card.faces &&
                    card.faces[0]
                        ? card.faces[0].name
                        : "名前なし"
                ) ||
                "名前なし"
            }」を削除しますか？`
        );

    if (!confirmed) {
        return;
    }

    cards =
        cards.filter(
            item =>
                item.id !== id
        );

    saveCards();

    showListSection();
}


// =========================
// テンプレ用文明
// =========================

function getTemplateCivilization(
    civilization
) {

    return getCivilizationArray(
        civilization
    ).join("/");
}


// =========================
// テンプレコピー
// =========================

function copyTemplate(id) {

    const card =
        cards.find(
            item =>
                item.id === id
        );

    if (!card) {
        return;
    }

    let template = "";


    // =====================
    // 特殊カード
    // =====================

    if (card.isSpecial) {

        const faces =
            Array.isArray(card.faces)
                ? card.faces
                : [];

        faces.forEach(
            (face, index) => {

                if (index > 0) {

                    template +=
                        "\n\n--------------------\n\n";
                }

                template +=
`【第${index + 1}面】
名前：${face.name || "〇〇"}
読み方：${face.reading || "〇〇"}
文明：${getTemplateCivilization(face.civilization) || "〇〇"}
種族：${face.race || "〇〇"}
コスト：${face.cost || "〇〇"}
パワー：${face.power || "〇〇"}
カードタイプ：${face.cardType || "〇〇"}
能力：
${String(
    face.ability ||
    "〇〇"
).trim()}`;
            }
        );


    // =====================
    // 通常・ツインパクト
    // =====================

    } else {

        const civilization =
            getTemplateCivilization(
                card.civilization
            );

        template =
`名前：${card.name || "〇〇"}
読み方：${card.reading || "〇〇"}
文明：${civilization || "〇〇"}
種族：${card.race || "〇〇"}
コスト：${card.cost || "〇〇"}
パワー：${card.power || "〇〇"}
カードタイプ：${card.isTwinpact ? "ツインパクト" : (card.cardType || "〇〇")}
能力：
${String(
    card.ability ||
    "〇〇"
).trim()}`;


        if (
            card.isTwinpact &&
            card.bottomCard
        ) {

            const bottom =
                card.bottomCard;

            const bottomCivilization =
                getTemplateCivilization(
                    bottom.civilization
                );

            template +=
`
--------------------

【ツインパクト下面】

名前：${bottom.name || "〇〇"}
読み方：${bottom.reading || "〇〇"}
文明：${bottomCivilization || "〇〇"}
種族：${bottom.race || "〇〇"}
コスト：${bottom.cost || "〇〇"}
カードタイプ：${bottom.cardType || "呪文"}
能力：
${String(
    bottom.ability ||
    "〇〇"
).trim()}`;
        }
    }


    navigator.clipboard
        .writeText(template)
        .then(() => {

            alert(
                "テンプレートをコピーしました。"
            );

        })
        .catch(() => {

            alert(
                "コピーに失敗しました。"
            );
        });
}


// =========================
// 詳細 → 一覧
// =========================

backToListButton.addEventListener(
    "click",
    showListSection
);


// =========================
// 初期化
// =========================

updateSpecialModeUI();
updateTwinpactUI();

updateSearchCivilizationModeUI();

renderCardList();

showCreateSection();