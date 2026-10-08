// =========================
// ORICA STUDIO
// =========================

const STORAGE_KEY = "oricaStudioCards";

let cards = [];
let editingCardId = null;

let isTwinpact = false;
let isSpecial = false;
let specialType = null;
// "dragheart" / "psychic"

let specialMode = null;
// "double" / "3d"

// ドラグハート / サイキックで
// 両面・3Dの選択状態を別々に記憶
let dragHeartMode = "double";
let psychicMode = "double";


// =========================
// 初期化
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCards();

        bindEvents();

        updateSpecialModeUI();
        updateTwinpactUI();
        updateSearchCivilizationUI();

        renderCardList();

        showCreateSection();

    }
);


// =========================
// DOM取得
// =========================

function $(id) {
    return document.getElementById(id);
}


// =========================
// localStorage
// =========================

function loadCards() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {

            cards = [];

            return;

        }

        const parsed =
            JSON.parse(saved);

        cards =
            Array.isArray(parsed)
                ? parsed
                : [];

    } catch (error) {

        console.error(
            "カードデータの読み込みに失敗しました。",
            error
        );

        cards = [];

    }

}


function saveCards() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cards)
        );

    } catch (error) {

        console.error(
            "カードデータの保存に失敗しました。",
            error
        );

        alert(
            "カードデータの保存に失敗しました。"
        );

    }

}


// =========================
// イベント登録
// =========================

function bindEvents() {

    // -------------------------
    // 文明ボタン
    // -------------------------

    setupCivilizationButtons(
        "civilizationButtons"
    );

    setupCivilizationButtons(
        "bottomCivilizationButtons"
    );


    // -------------------------
    // 上部メニュー
    // -------------------------

    $("createTabButton")?.addEventListener(
        "click",
        () => {

            showCreateSection();

        }
    );


    $("listTabButton")?.addEventListener(
        "click",
        () => {

            showListSection();

        }
    );


    // -------------------------
    // ツインパクト
    // -------------------------

    $("twinpactButton")?.addEventListener(
        "click",
        () => {

            if (isTwinpact) {

                isTwinpact = false;

            } else {

                isTwinpact = true;

                isSpecial = false;
                specialType = null;
                specialMode = null;

            }

            updateSpecialModeUI();
            updateTwinpactUI();

        }
    );


    // -------------------------
    // ドラグハート
    // -------------------------

    $("dragHeartButton")?.addEventListener(
        "click",
        () => {

            if (
                isSpecial &&
                specialType === "dragheart"
            ) {

                isSpecial = false;
                specialType = null;
                specialMode = null;

            } else {

                isTwinpact = false;

                isSpecial = true;
                specialType = "dragheart";

                specialMode =
                    dragHeartMode;

            }

            updateSpecialModeUI();
            updateTwinpactUI();

        }
    );


    // -------------------------
    // サイキック
    // -------------------------

    $("psychicButton")?.addEventListener(
        "click",
        () => {

            if (
                isSpecial &&
                specialType === "psychic"
            ) {

                isSpecial = false;
                specialType = null;
                specialMode = null;

            } else {

                isTwinpact = false;

                isSpecial = true;
                specialType = "psychic";

                specialMode =
                    psychicMode;

            }

            updateSpecialModeUI();
            updateTwinpactUI();

        }
    );


    // -------------------------
    // 両面
    // -------------------------

    $("doubleFaceButton")?.addEventListener(
        "click",
        () => {

            if (!isSpecial) {
                return;
            }

            saveCurrentSpecialFaces();

            specialMode = "double";

            if (
                specialType === "dragheart"
            ) {

                dragHeartMode = "double";

            }

            if (
                specialType === "psychic"
            ) {

                psychicMode = "double";

            }

            renderSpecialFaces();

            updateSpecialModeUI();

        }
    );


    // -------------------------
    // 3D
    // -------------------------

    $("tripleFaceButton")?.addEventListener(
        "click",
        () => {

            if (!isSpecial) {
                return;
            }

            saveCurrentSpecialFaces();

            specialMode = "3d";

            if (
                specialType === "dragheart"
            ) {

                dragHeartMode = "3d";

            }

            if (
                specialType === "psychic"
            ) {

                psychicMode = "3d";

            }

            renderSpecialFaces();

            updateSpecialModeUI();

        }
    );


    // -------------------------
    // 保存
    // -------------------------

    $("saveButton")?.addEventListener(
        "click",
        saveCard
    );


    // -------------------------
    // リセット
    // -------------------------

    $("resetButton")?.addEventListener(
        "click",
        resetForm
    );


    // -------------------------
    // 種族 /
    // -------------------------

    $("raceSlashButton")?.addEventListener(
        "click",
        () => {

            insertSlash("race");

        }
    );


    $("bottomRaceSlashButton")?.addEventListener(
        "click",
        () => {

            insertSlash(
                "bottomRace"
            );

        }
    );


    // -------------------------
    // 能力欄
    // -------------------------

    setupAbilityInput(
        "ability"
    );

    setupAbilityInput(
        "bottomAbility"
    );


    // -------------------------
    // 検索表示
    // -------------------------

    $("searchToggleButton")?.addEventListener(
        "click",
        () => {

            $("searchPanel")
                ?.classList.toggle(
                    "hidden"
                );

        }
    );


    // -------------------------
    // 検索
    // -------------------------

    const searchInputs = [

        "searchKeyword",
        "searchCostMin",
        "searchCostMax",
        "searchPowerMin",
        "searchPowerMax",
        "searchCardType"

    ];


    searchInputs.forEach(
        id => {

            $(id)?.addEventListener(
                "input",
                () => {

                    renderCardList();

                }
            );

        }
    );


    $("favoritesOnly")?.addEventListener(
        "change",
        renderCardList
    );


    // -------------------------
    // 条件クリア
    // -------------------------

    $("clearSearchButton")?.addEventListener(
        "click",
        clearSearchConditions
    );


    // -------------------------
    // 文明検索
    // -------------------------

    $("searchSingleColorButton")
        ?.addEventListener(
            "click",
            () => {

                setSearchCivilizationMode(
                    "single"
                );

            }
        );


    $("searchMultiColorButton")
        ?.addEventListener(
            "click",
            () => {

                setSearchCivilizationMode(
                    "multi"
                );

            }
        );


    $("searchExactMatchButton")
        ?.addEventListener(
            "click",
            () => {

                if (
                    searchCivilizationMode !==
                    "multi"
                ) {

                    return;

                }

                searchExactMatch =
                    !searchExactMatch;

                updateSearchCivilizationUI();

                renderCardList();

            }
        );


    setupSearchCivilizationButtons();


    // -------------------------
    // 一覧へ戻る
    // -------------------------

    $("backToListButton")
        ?.addEventListener(
            "click",
            () => {

                showListSection();

            }
        );

}


// =========================
// 検索条件クリア
// =========================

function clearSearchConditions() {

    // -------------------------
    // テキスト検索
    // -------------------------

    const searchKeyword =
        $("searchKeyword");

    if (searchKeyword) {

        searchKeyword.value = "";

    }


    // -------------------------
    // コスト
    // -------------------------

    const searchCostMin =
        $("searchCostMin");

    if (searchCostMin) {

        searchCostMin.value = "";

    }


    const searchCostMax =
        $("searchCostMax");

    if (searchCostMax) {

        searchCostMax.value = "";

    }


    // -------------------------
    // パワー
    // -------------------------

    const searchPowerMin =
        $("searchPowerMin");

    if (searchPowerMin) {

        searchPowerMin.value = "";

    }


    const searchPowerMax =
        $("searchPowerMax");

    if (searchPowerMax) {

        searchPowerMax.value = "";

    }


    // -------------------------
    // カードタイプ
    // -------------------------

    const searchCardType =
        $("searchCardType");

    if (searchCardType) {

        searchCardType.value = "";

    }


    // -------------------------
    // お気に入り
    // -------------------------

    const favoritesOnly =
        $("favoritesOnly");

    if (favoritesOnly) {

        favoritesOnly.checked = false;

    }


    // -------------------------
    // 文明検索
    // -------------------------

    searchCivilizationMode = null;
    searchExactMatch = false;


    const civilizationButtons =
        $("searchCivilizationButtons");

    if (civilizationButtons) {

        civilizationButtons
            .querySelectorAll(
                ".search-civilization-button.selected"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "selected"
                    );

                }
            );

    }


    // 文明検索UIを初期状態へ
    updateSearchCivilizationUI();


    // 一覧を更新
    renderCardList();

}


// =========================
// セクション
// =========================

function showCreateSection() {

    $("createSection")
        ?.classList.remove(
            "hidden"
        );

    $("listSection")
        ?.classList.add(
            "hidden"
        );

    $("detailSection")
        ?.classList.add(
            "hidden"
        );


    $("createTabButton")
        ?.classList.add(
            "active"
        );

    $("listTabButton")
        ?.classList.remove(
            "active"
        );

}


function showListSection() {

    $("createSection")
        ?.classList.add(
            "hidden"
        );

    $("listSection")
        ?.classList.remove(
            "hidden"
        );

    $("detailSection")
        ?.classList.add(
            "hidden"
        );


    $("createTabButton")
        ?.classList.remove(
            "active"
        );

    $("listTabButton")
        ?.classList.add(
            "active"
        );


    renderCardList();

}


// =========================
// 文明ボタン
// =========================

function setupCivilizationButtons(
    containerId
) {

    const container =
        $(containerId);

    if (!container) {
        return;
    }


    container
        .querySelectorAll(
            ".civilization-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "selected"
                        );

                    }
                );

            }
        );

}


function getCivilizationArray(
    containerId
) {

    const container =
        $(containerId);

    if (!container) {
        return [];
    }


    return [
        ...container.querySelectorAll(
            ".civilization-button.selected"
        )
    ]
        .map(
            button =>
                button.dataset.civilization
        )
        .filter(Boolean);

}


function setCivilizationButtons(
    containerId,
    civilizations
) {

    const container =
        $(containerId);

    if (!container) {
        return;
    }


    const set =
        new Set(
            civilizations || []
        );


    container
        .querySelectorAll(
            ".civilization-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "selected",
                    set.has(
                        button.dataset.civilization
                    )
                );

            }
        );

}


// =========================
// カード文明取得
// =========================

function getCardCivilizations(
    card
) {

    const result = [];


    // -------------------------
    // 通常カード
    // -------------------------

    if (
        Array.isArray(
            card.civilizations
        )
    ) {

        result.push(
            ...card.civilizations
        );

    }


    if (card.civilization) {

        result.push(
            ...splitCivilizations(
                card.civilization
            )
        );

    }


    // -------------------------
    // ツインパクト
    // -------------------------

    if (
        card.isTwinpact
    ) {

        if (
            Array.isArray(
                card.bottomCivilizations
            )
        ) {

            result.push(
                ...card.bottomCivilizations
            );

        }


        if (
            card.bottomCivilization
        ) {

            result.push(
                ...splitCivilizations(
                    card.bottomCivilization
                )
            );

        }

    }


    // -------------------------
    // ドラグハート / サイキック
    // -------------------------

    if (
        card.isSpecial &&
        Array.isArray(
            card.faces
        )
    ) {

        card.faces.forEach(
            face => {

                if (
                    Array.isArray(
                        face.civilizations
                    )
                ) {

                    result.push(
                        ...face.civilizations
                    );

                }


                if (
                    face.civilization
                ) {

                    result.push(
                        ...splitCivilizations(
                            face.civilization
                        )
                    );

                }

            }
        );

    }


    return [
        ...new Set(
            result.filter(Boolean)
        )
    ];

}


function splitCivilizations(
    value
) {

    return String(value)
        .split(
            /[・,、\s]+/
        )
        .map(
            value =>
                value.trim()
        )
        .filter(Boolean);

}


function getColoredCivilizations(
    card
) {

    return getCardCivilizations(
        card
    )
        .filter(
            civilization =>
                civilization !== "無色"
        );

}


function isCardMulticolor(
    card
) {

    return (
        getColoredCivilizations(
            card
        ).length >= 2
    );

}


function isCardSingleColor(
    card
) {

    return (
        getColoredCivilizations(
            card
        ).length <= 1
    );

}


// =========================
// モードUI
// =========================

function updateSpecialModeUI() {

    const twinpactButton =
        $("twinpactButton");

    const dragHeartButton =
        $("dragHeartButton");

    const psychicButton =
        $("psychicButton");


    // -------------------------
    // ツインパクト
    // -------------------------

    if (twinpactButton) {

        twinpactButton.textContent =
            isTwinpact
                ? "ツインパクト解除"
                : "ツインパクト";


        twinpactButton.classList.toggle(
            "selected",
            isTwinpact
        );

    }


    // -------------------------
    // ドラグハート
    // -------------------------

    if (dragHeartButton) {

        const selected =
            isSpecial &&
            specialType ===
                "dragheart";


        dragHeartButton.textContent =
            selected
                ? "ドラグハート解除"
                : "ドラグハート";


        dragHeartButton.classList.toggle(
            "selected",
            selected
        );

    }


    // -------------------------
    // サイキック
    // -------------------------

    if (psychicButton) {

        const selected =
            isSpecial &&
            specialType ===
                "psychic";


        psychicButton.textContent =
            selected
                ? "サイキック解除"
                : "サイキック";


        psychicButton.classList.toggle(
            "selected",
            selected
        );

    }


    // -------------------------
    // 通常入力
    // -------------------------

    const normalFields =
        $("normalCardFields");

    const normalAbility =
        $("normalAbilityField");


    // -------------------------
    // 特殊入力
    // -------------------------

    const multiFacePanel =
        $("multiFacePanel");

    const multiFaceModePanel =
        $("multiFaceModePanel");


    if (isSpecial) {

        normalFields
            ?.classList.add(
                "hidden"
            );

        normalAbility
            ?.classList.add(
                "hidden"
            );


        multiFacePanel
            ?.classList.remove(
                "hidden"
            );

        multiFaceModePanel
            ?.classList.remove(
                "hidden"
            );


        if (!specialMode) {

            specialMode =
                specialType ===
                    "dragheart"
                    ? dragHeartMode
                    : psychicMode;

        }


        if (
            specialType ===
            "dragheart"
        ) {

            dragHeartMode =
                specialMode;

        }


        if (
            specialType ===
            "psychic"
        ) {

            psychicMode =
                specialMode;

        }


        $("doubleFaceButton")
            ?.classList.toggle(
                "selected",
                specialMode ===
                    "double"
            );


        $("tripleFaceButton")
            ?.classList.toggle(
                "selected",
                specialMode ===
                    "3d"
            );


        const container =
            $("multiFaceInputs");


        if (
            container &&
            container.children.length === 0
        ) {

            renderSpecialFaces();

        }

    } else {

        normalFields
            ?.classList.remove(
                "hidden"
            );

        normalAbility
            ?.classList.remove(
                "hidden"
            );


        multiFacePanel
            ?.classList.add(
                "hidden"
            );

        multiFaceModePanel
            ?.classList.add(
                "hidden"
            );

    }

}


// =========================
// ツインパクトUI
// =========================

function updateTwinpactUI() {

    const panel =
        $("twinpactPanel");

    if (!panel) {
        return;
    }


    panel.classList.toggle(
        "hidden",
        !isTwinpact
    );

}


// =========================
// 特殊面の一時保存
// =========================

let temporarySpecialFaces = [];


function saveCurrentSpecialFaces() {

    const container =
        $("multiFaceInputs");

    if (!container) {
        return;
    }


    if (
        container.children.length > 0
    ) {

        temporarySpecialFaces =
            getSpecialFaceData();

    }

}


// =========================
// 特殊面生成
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

        <h3>
            第${index}面
        </h3>


        <div class="form-group">

            <label>
                名前
            </label>

            <input
                type="text"
                class="special-name"
            >

        </div>


        <div class="form-group">

            <label>
                読み方
            </label>

            <input
                type="text"
                class="special-reading"
            >

        </div>


        <div class="form-group">

            <label>
                文明
            </label>

            <div class="civilization-buttons special-civilizations">

                <button
                    type="button"
                    class="civilization-button"
                    data-civilization="光"
                >
                    光
                </button>

                <button
                    type="button"
                    class="civilization-button"
                    data-civilization="水"
                >
                    水
                </button>

                <button
                    type="button"
                    class="civilization-button"
                    data-civilization="闇"
                >
                    闇
                </button>

                <button
                    type="button"
                    class="civilization-button"
                    data-civilization="火"
                >
                    火
                </button>

                <button
                    type="button"
                    class="civilization-button"
                    data-civilization="自然"
                >
                    自然
                </button>

                <button
                    type="button"
                    class="civilization-button"
                    data-civilization="無色"
                >
                    無色
                </button>

            </div>

        </div>


        <div class="form-group">

            <label>
                種族
            </label>

            <input
                type="text"
                class="special-race"
            >

        </div>


        <div class="form-row">

            <div class="form-group">

                <label>
                    コスト
                </label>

                <input
                    type="text"
                    class="special-cost"
                >

            </div>


            <div class="form-group">

                <label>
                    パワー
                </label>

                <input
                    type="text"
                    class="special-power"
                >

            </div>

        </div>


        <div class="form-group">

            <label>
                カードタイプ
            </label>

            <input
                type="text"
                class="special-card-type"
            >

        </div>


        <div class="form-group">

            <label>
                能力
            </label>

            <textarea
                class="special-ability"
            ></textarea>

        </div>

    `;


    wrapper
        .querySelectorAll(
            ".civilization-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "selected"
                        );

                    }
                );

            }
        );


    const ability =
        wrapper.querySelector(
            ".special-ability"
        );


    if (ability) {

        setupSpecialAbilityInput(
            ability
        );

    }


    return wrapper;

}


// =========================
// 特殊能力欄
// =========================

function setupSpecialAbilityInput(
    textarea
) {

    textarea.addEventListener(
        "focus",
        () => {

            if (
                textarea.value === ""
            ) {

                textarea.value =
                    "■ ";

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


            event.preventDefault();


            const position =
                before.length + 3;


            textarea.selectionStart =
                position;

            textarea.selectionEnd =
                position;

        }
    );

}


// =========================
// 特殊面描画
// =========================

function renderSpecialFaces() {

    const container =
        $("multiFaceInputs");

    if (!container) {
        return;
    }


    let oldFaces = [];


    if (
        temporarySpecialFaces.length > 0
    ) {

        oldFaces =
            JSON.parse(
                JSON.stringify(
                    temporarySpecialFaces
                )
            );

    } else {

        oldFaces =
            getSpecialFaceData();

    }


    container.innerHTML = "";


    const count =
        specialMode === "3d"
            ? 3
            : 2;


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const face =
            createSpecialFace(i);


        container.appendChild(
            face
        );


        if (
            oldFaces[i - 1]
        ) {

            setSpecialFaceData(
                face,
                oldFaces[i - 1]
            );

        }

    }


    temporarySpecialFaces =
        getSpecialFaceData();


    updateSpecialModeUIWithoutRender();

}


// =========================
// 特殊面UIだけ更新
// =========================

function updateSpecialModeUIWithoutRender() {

    $("doubleFaceButton")
        ?.classList.toggle(
            "selected",
            specialMode ===
                "double"
        );


    $("tripleFaceButton")
        ?.classList.toggle(
            "selected",
            specialMode ===
                "3d"
        );

}


// =========================
// 特殊面データ取得
// =========================

function getSpecialFaceData() {

    const container =
        $("multiFaceInputs");

    if (!container) {
        return [];
    }


    const result = [];


    container
        .querySelectorAll(
            ".special-face"
        )
        .forEach(
            face => {

                const civilizations =
                    [
                        ...face.querySelectorAll(
                            ".civilization-button.selected"
                        )
                    ]
                        .map(
                            button =>
                                button.dataset
                                    .civilization
                        )
                        .filter(Boolean);


                result.push({

                    name:
                        face.querySelector(
                            ".special-name"
                        )?.value ||
                        "",

                    reading:
                        face.querySelector(
                            ".special-reading"
                        )?.value ||
                        "",

                    civilizations,

                    civilization:
                        civilizations.join(
                            "・"
                        ),

                    race:
                        face.querySelector(
                            ".special-race"
                        )?.value ||
                        "",

                    cost:
                        face.querySelector(
                            ".special-cost"
                        )?.value ||
                        "",

                    power:
                        face.querySelector(
                            ".special-power"
                        )?.value ||
                        "",

                    cardType:
                        face.querySelector(
                            ".special-card-type"
                        )?.value ||
                        "",

                    ability:
                        face.querySelector(
                            ".special-ability"
                        )?.value ||
                        ""

                });

            }
        );


    return result;

}


// =========================
// 特殊面データ設定
// =========================

function setSpecialFaceData(
    face,
    data
) {

    if (!face || !data) {
        return;
    }


    face.querySelector(
        ".special-name"
    ).value =
        data.name ||
        "";


    face.querySelector(
        ".special-reading"
    ).value =
        data.reading ||
        "";


    face.querySelector(
        ".special-race"
    ).value =
        data.race ||
        "";


    face.querySelector(
        ".special-cost"
    ).value =
        data.cost ??
        "";


    face.querySelector(
        ".special-power"
    ).value =
        data.power ??
        "";


    face.querySelector(
        ".special-card-type"
    ).value =
        data.cardType ||
        "";


    face.querySelector(
        ".special-ability"
    ).value =
        data.ability ||
        "";


    const civilizations =
        Array.isArray(
            data.civilizations
        )
            ? data.civilizations
            : splitCivilizations(
                data.civilization ||
                ""
            );


    face
        .querySelectorAll(
            ".civilization-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "selected",
                    civilizations.includes(
                        button.dataset
                            .civilization
                    )
                );

            }
        );

}


// =========================
// 能力欄
// =========================

function setupAbilityInput(
    id
) {

    const textarea =
        $(id);

    if (!textarea) {
        return;
    }


    textarea.addEventListener(
        "focus",
        () => {

            if (
                textarea.value === ""
            ) {

                textarea.value =
                    "■ ";

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


            event.preventDefault();


            const position =
                before.length + 3;


            textarea.selectionStart =
                position;

            textarea.selectionEnd =
                position;

        }
    );

}


// =========================
// / 挿入
// =========================

function insertSlash(
    id
) {

    const input =
        $(id);

    if (!input) {
        return;
    }


    const start =
        input.selectionStart;

    const end =
        input.selectionEnd;


    input.value =
        input.value.slice(
            0,
            start
        ) +
        "/" +
        input.value.slice(
            end
        );


    input.focus();


    input.selectionStart =
        start + 1;

    input.selectionEnd =
        start + 1;

}


// =========================
// 検索文明
// =========================

let searchCivilizationMode = null;
// null / "single" / "multi"

let searchExactMatch = false;


function setupSearchCivilizationButtons() {

    const container =
        $("searchCivilizationButtons");

    if (!container) {
        return;
    }


    container
        .querySelectorAll(
            ".search-civilization-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "selected"
                        );

                        renderCardList();

                    }
                );

            }
        );

}


function setSearchCivilizationMode(
    mode
) {

    searchCivilizationMode =
        mode;


    if (
        mode !== "multi"
    ) {

        searchExactMatch =
            false;

    }


    updateSearchCivilizationUI();

    renderCardList();

}


function updateSearchCivilizationUI() {

    const buttons =
        $("searchCivilizationButtons");

    const exactButton =
        $("searchExactMatchButton");

    const singleButton =
        $("searchSingleColorButton");

    const multiButton =
        $("searchMultiColorButton");


    if (!buttons) {
        return;
    }


    singleButton
        ?.classList.toggle(
            "selected",
            searchCivilizationMode ===
                "single"
        );


    multiButton
        ?.classList.toggle(
            "selected",
            searchCivilizationMode ===
                "multi"
        );


    if (
        searchCivilizationMode ===
        null
    ) {

        buttons.classList.add(
            "hidden"
        );

        exactButton
            ?.classList.add(
                "hidden"
            );

        return;

    }


    buttons.classList.remove(
        "hidden"
    );


    if (
        searchCivilizationMode ===
        "multi"
    ) {

        exactButton
            ?.classList.remove(
                "hidden"
            );

        exactButton
            ?.classList.toggle(
                "selected",
                searchExactMatch
            );

    } else {

        exactButton
            ?.classList.add(
                "hidden"
            );

    }

}


// =========================
// 文明検索判定
// =========================

function matchesCivilizationFilter(
    card
) {

    if (
        searchCivilizationMode ===
        null
    ) {

        return true;

    }


    const selected =
        [
            ...(
                $("searchCivilizationButtons")
                    ?.querySelectorAll(
                        ".search-civilization-button.selected"
                    ) ||
                []
            )
        ]
            .map(
                button =>
                    button.dataset
                        .civilization
            )
            .filter(Boolean);


    const cardCivilizations =
        getCardCivilizations(
            card
        );


    const coloredCardCivilizations =
        cardCivilizations.filter(
            civ =>
                civ !== "無色"
        );


    // -------------------------
    // 単色
    // -------------------------

    if (
        searchCivilizationMode ===
        "single"
    ) {

        if (
            coloredCardCivilizations.length >=
            2
        ) {

            return false;

        }


        if (
            selected.length === 0
        ) {

            return true;

        }


        return selected.some(
            civ =>
                cardCivilizations.includes(
                    civ
                )
        );

    }


    // -------------------------
    // 多色
    // -------------------------

    if (
        searchCivilizationMode ===
        "multi"
    ) {

        if (
            coloredCardCivilizations.length <
            2
        ) {

            return false;

        }


        if (
            selected.length === 0
        ) {

            return true;

        }


        // 完全一致ON

        if (
            searchExactMatch
        ) {

            const cardSet =
                new Set(
                    coloredCardCivilizations
                );


            const selectedSet =
                new Set(
                    selected.filter(
                        civ =>
                            civ !==
                            "無色"
                    )
                );


            if (
                cardSet.size !==
                selectedSet.size
            ) {

                return false;

            }


            return [
                ...selectedSet
            ].every(
                civ =>
                    cardSet.has(civ)
            );

        }


        // 完全一致OFF

        return selected.some(
            civ =>
                cardCivilizations.includes(
                    civ
                )
        );

    }


    return true;

}


// =========================
// キーワード検索
// =========================

function matchesKeywordFilter(
    card
) {

    const keyword =
        $("searchKeyword")
            ?.value
            .trim()
            .toLowerCase();


    if (!keyword) {
        return true;
    }


    const values = [];


    values.push(
        card.name ||
        ""
    );

    values.push(
        card.reading ||
        ""
    );

    values.push(
        card.race ||
        ""
    );

    values.push(
        card.cardType ||
        ""
    );

    values.push(
        card.ability ||
        ""
    );


    if (
        card.isTwinpact
    ) {

        values.push(
            card.bottomName ||
            ""
        );

        values.push(
            card.bottomReading ||
            ""
        );

        values.push(
            card.bottomRace ||
            ""
        );

        values.push(
            card.bottomCardType ||
            ""
        );

        values.push(
            card.bottomAbility ||
            ""
        );

    }


    if (
        card.isSpecial &&
        Array.isArray(
            card.faces
        )
    ) {

        card.faces.forEach(
            face => {

                values.push(
                    face.name ||
                    ""
                );

                values.push(
                    face.reading ||
                    ""
                );

                values.push(
                    face.race ||
                    ""
                );

                values.push(
                    face.cardType ||
                    ""
                );

                values.push(
                    face.ability ||
                    ""
                );

            }
        );

    }


    return values.some(
        value =>
            String(value)
                .toLowerCase()
                .includes(
                    keyword
                )
    );

}


// =========================
// カードタイプ検索
// =========================

function matchesCardTypeFilter(
    card
) {

    const keyword =
        $("searchCardType")
            ?.value
            .trim()
            .toLowerCase();


    if (!keyword) {
        return true;
    }


    // -------------------------
    // ツインパクト
    // -------------------------

    if (
        keyword ===
        "ツインパクト"
    ) {

        return (
            card.isTwinpact ===
            true
        );

    }


    // -------------------------
    // 特殊カード
    // -------------------------

    if (
        card.isSpecial
    ) {

        if (
            !Array.isArray(
                card.faces
            )
        ) {

            return false;

        }


        return card.faces.some(
            face =>
                String(
                    face.cardType ||
                    ""
                )
                    .toLowerCase()
                    .includes(
                        keyword
                    )
        );

    }


    // -------------------------
    // 通常カード
    // -------------------------

    if (
        card.isTwinpact
    ) {

        return false;

    }


    return String(
        card.cardType ||
        ""
    )
        .toLowerCase()
        .includes(
            keyword
        );

}


// =========================
// コスト検索
// =========================

function parseNumericValue(
    value
) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {

        return null;

    }


    const text =
        String(value)
            .trim();


    const match =
        text.match(
            /-?\d+(?:\.\d+)?/
        );


    if (!match) {
        return null;
    }


    return Number(
        match[0]
    );

}


function matchesCostFilter(
    card
) {

    const min =
        parseNumericValue(
            $("searchCostMin")?.value
        );


    const max =
        parseNumericValue(
            $("searchCostMax")?.value
        );


    if (
        min === null &&
        max === null
    ) {

        return true;

    }


    const costs = [];


    const mainCost =
        parseNumericValue(
            card.cost
        );


    if (
        mainCost !== null
    ) {

        costs.push(
            mainCost
        );

    }


    if (
        card.isTwinpact
    ) {

        const bottomCost =
            parseNumericValue(
                card.bottomCost
            );


        if (
            bottomCost !== null
        ) {

            costs.push(
                bottomCost
            );

        }

    }


    if (
        card.isSpecial &&
        Array.isArray(
            card.faces
        )
    ) {

        card.faces.forEach(
            face => {

                const value =
                    parseNumericValue(
                        face.cost
                    );


                if (
                    value !== null
                ) {

                    costs.push(
                        value
                    );

                }

            }
        );

    }


    if (
        costs.length === 0
    ) {

        return false;

    }


    return costs.some(
        cost => {

            if (
                min !== null &&
                cost < min
            ) {

                return false;

            }


            if (
                max !== null &&
                cost > max
            ) {

                return false;

            }


            return true;

        }
    );

}


// =========================
// パワー検索
// =========================

function powerToNumber(
    value
) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {

        return null;

    }


    const text =
        String(value)
            .trim()
            .replace(
                /,/g,
                ""
            );


    if (
        text === "∞"
    ) {

        return Infinity;

    }


    const match =
        text.match(
            /-?\d+/
        );


    if (!match) {
        return null;
    }


    return Number(
        match[0]
    );

}


function matchesPowerFilter(
    card
) {

    const min =
        powerToNumber(
            $("searchPowerMin")?.value
        );


    const max =
        powerToNumber(
            $("searchPowerMax")?.value
        );


    if (
        min === null &&
        max === null
    ) {

        return true;

    }


    const powers = [];


    const mainPower =
        powerToNumber(
            card.power
        );


    if (
        mainPower !== null
    ) {

        powers.push(
            mainPower
        );

    }


    if (
        card.isSpecial &&
        Array.isArray(
            card.faces
        )
    ) {

        card.faces.forEach(
            face => {

                const power =
                    powerToNumber(
                        face.power
                    );


                if (
                    power !== null
                ) {

                    powers.push(
                        power
                    );

                }

            }
        );

    }


    if (
        powers.length === 0
    ) {

        return false;

    }


    return powers.some(
        power => {

            if (
                min !== null &&
                power < min
            ) {

                return false;

            }


            if (
                max !== null &&
                power > max
            ) {

                return false;

            }


            return true;

        }
    );

}


// =========================
// お気に入り検索
// =========================

function matchesFavoriteFilter(
    card
) {

    if (
        !$("favoritesOnly")?.checked
    ) {

        return true;

    }


    return (
        card.favorite ===
        true
    );

}


// =========================
// カード一覧
// =========================

function renderCardList() {

    const container =
        $("cardList");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const filteredCards =
        cards.filter(
            card => {

                return (

                    matchesKeywordFilter(
                        card
                    ) &&

                    matchesCostFilter(
                        card
                    ) &&

                    matchesPowerFilter(
                        card
                    ) &&

                    matchesCardTypeFilter(
                        card
                    ) &&

                    matchesCivilizationFilter(
                        card
                    ) &&

                    matchesFavoriteFilter(
                        card
                    )

                );

            }
        );


    if (
        filteredCards.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                カードがありません。
            </p>
        `;

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


            // -------------------------
            // テキスト
            // -------------------------

            const text =
                document.createElement(
                    "div"
                );


            text.className =
                "card-list-text";


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "card-list-name";


            name.textContent =
                card.name ||
                "名前未設定";


            const type =
                document.createElement(
                    "div"
                );


            type.className =
                "card-list-type";


            if (
                card.isTwinpact
            ) {

                type.textContent =
                    "ツインパクト";

            } else if (
                card.isSpecial
            ) {

                type.textContent =
                    card.specialType ===
                        "psychic"
                        ? "サイキック"
                        : "ドラグハート";

            } else {

                type.textContent =
                    card.cardType ||
                    "カードタイプ未設定";

            }


            text.appendChild(
                name
            );

            text.appendChild(
                type
            );


            // -------------------------
            // お気に入り
            // -------------------------

            const favorite =
                document.createElement(
                    "button"
                );


            favorite.type =
                "button";


            favorite.className =
                "favorite-button";


            favorite.textContent =
                card.favorite
                    ? "★"
                    : "☆";


            favorite.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFavorite(
                        card.id
                    );

                }
            );


            // -------------------------
            // 一覧アイテム
            // -------------------------

            item.appendChild(
                text
            );

            item.appendChild(
                favorite
            );


            item.addEventListener(
                "click",
                () => {

                    showCardDetail(
                        card.id
                    );

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


// =========================
// お気に入り
// =========================

function toggleFavorite(
    id
) {

    const card =
        cards.find(
            card =>
                card.id ===
                id
        );

    if (!card) {
        return;
    }


    card.favorite =
        !card.favorite;


    saveCards();

    renderCardList();

}


// =========================
// ID
// =========================

function createId() {

    return (
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


// =========================
// 編集
// =========================

function editCard(
    id
) {

    const card =
        cards.find(
            card =>
                card.id ===
                id
        );


    if (!card) {
        return;
    }


    editingCardId =
        id;


    // =========================
    // 特殊カード
    // =========================

    if (
        card.isSpecial
    ) {

        isTwinpact = false;

        isSpecial = true;


        specialType =
            card.specialType ||
            "dragheart";


        specialMode =
            card.specialMode ||
            (
                Array.isArray(
                    card.faces
                ) &&
                card.faces.length === 3
                    ? "3d"
                    : "double"
            );


        if (
            specialType ===
            "dragheart"
        ) {

            dragHeartMode =
                specialMode;

        }


        if (
            specialType ===
            "psychic"
        ) {

            psychicMode =
                specialMode;

        }


        temporarySpecialFaces =
            Array.isArray(
                card.faces
            )
                ? JSON.parse(
                    JSON.stringify(
                        card.faces
                    )
                )
                : [];


        const container =
            $("multiFaceInputs");


        if (container) {

            container.innerHTML =
                "";

        }


        updateSpecialModeUI();

        updateTwinpactUI();


        $("saveButton")
            .textContent =
            "更新";


        showCreateSection();

        return;

    }


    // =========================
    // 通常 / ツインパクト
    // =========================

    isSpecial = false;

    specialType = null;
    specialMode = null;


    isTwinpact =
        card.isTwinpact ===
        true;


    $("cardName").value =
        card.name ||
        "";


    $("reading").value =
        card.reading ||
        "";


    $("cost").value =
        card.cost ??
        "";


    $("power").value =
        card.power ??
        "";


    $("race").value =
        card.race ||
        "";


    $("cardType").value =
        card.cardType ||
        "";


    $("ability").value =
        card.ability ||
        "";


    setCivilizationButtons(
        "civilizationButtons",
        card.civilizations ||
        splitCivilizations(
            card.civilization ||
            ""
        )
    );


    // -------------------------
    // ツインパクト下面
    // -------------------------

    $("bottomCardName").value =
        card.bottomName ||
        "";


    $("bottomReading").value =
        card.bottomReading ||
        "";


    $("bottomCost").value =
        card.bottomCost ??
        "";


    $("bottomRace").value =
        card.bottomRace ||
        "";


    $("bottomCardType").value =
        card.bottomCardType ||
        "呪文";


    $("bottomAbility").value =
        card.bottomAbility ||
        "";


    setCivilizationButtons(
        "bottomCivilizationButtons",
        card.bottomCivilizations ||
        splitCivilizations(
            card.bottomCivilization ||
            ""
        )
    );


    updateSpecialModeUI();
    updateTwinpactUI();


    $("saveButton")
        .textContent =
        "更新";


    showCreateSection();

}


// =========================
// 既存お気に入り
// =========================

function getExistingFavorite() {

    if (!editingCardId) {
        return false;
    }


    const oldCard =
        cards.find(
            card =>
                card.id ===
                editingCardId
        );


    return (
        oldCard?.favorite ===
        true
    );

}


// =========================
// 特殊文明合算
// =========================

function getCombinedSpecialCivilizations(
    faces
) {

    const result = [];


    faces.forEach(
        face => {

            if (
                Array.isArray(
                    face.civilizations
                )
            ) {

                result.push(
                    ...face.civilizations
                );

            } else if (
                face.civilization
            ) {

                result.push(
                    ...splitCivilizations(
                        face.civilization
                    )
                );

            }

        }
    );


    return [
        ...new Set(
            result.filter(Boolean)
        )
    ];

}


// =========================
// 保存
// =========================

function saveCard() {

    let cardData;


    // =========================
    // 特殊カード
    // =========================

    if (isSpecial) {

        saveCurrentSpecialFaces();


        const faces =
            getSpecialFaceData();


        if (
            faces.length === 0
        ) {

            alert(
                "面を入力してください。"
            );

            return;

        }


        const civilizations =
            getCombinedSpecialCivilizations(
                faces
            );


        const first =
            faces[0];


        cardData = {

            id:
                editingCardId ||
                createId(),

            name:
                first.name,

            reading:
                first.reading,

            civilizations,

            civilization:
                civilizations.join(
                    "・"
                ),

            cost:
                first.cost,

            power:
                first.power,

            race:
                first.race,

            cardType:
                first.cardType,

            ability:
                first.ability,

            isTwinpact:
                false,

            isSpecial:
                true,

            specialType:
                specialType ||
                "dragheart",

            specialMode:
                specialMode ||
                "double",

            faces,

            favorite:
                getExistingFavorite()

        };

    }


    // =========================
    // 通常 / ツインパクト
    // =========================

    else {

        const civilizations =
            getCivilizationArray(
                "civilizationButtons"
            );


        const bottomCivilizations =
            getCivilizationArray(
                "bottomCivilizationButtons"
            );


        cardData = {

            id:
                editingCardId ||
                createId(),

            name:
                $("cardName")
                    ?.value
                    .trim() ||
                "",

            reading:
                $("reading")
                    ?.value
                    .trim() ||
                "",

            civilizations,

            civilization:
                civilizations.join(
                    "・"
                ),

            cost:
                $("cost")
                    ?.value
                    .trim() ||
                "",

            power:
                $("power")
                    ?.value
                    .trim() ||
                "",

            race:
                $("race")
                    ?.value
                    .trim() ||
                "",

            cardType:
                $("cardType")
                    ?.value
                    .trim() ||
                "",

            ability:
                $("ability")
                    ?.value ||
                "",

            isTwinpact:
                isTwinpact,

            isSpecial:
                false,

            specialType:
                null,

            specialMode:
                null,

            bottomName:
                $("bottomCardName")
                    ?.value
                    .trim() ||
                "",

            bottomReading:
                $("bottomReading")
                    ?.value
                    .trim() ||
                "",

            bottomCivilizations,

            bottomCivilization:
                bottomCivilizations.join(
                    "・"
                ),

            bottomCost:
                $("bottomCost")
                    ?.value
                    .trim() ||
                "",

            bottomRace:
                $("bottomRace")
                    ?.value
                    .trim() ||
                "",

            bottomCardType:
                $("bottomCardType")
                    ?.value
                    .trim() ||
                "呪文",

            bottomAbility:
                $("bottomAbility")
                    ?.value ||
                "",

            favorite:
                getExistingFavorite()

        };

    }


    // =========================
    // 保存 / 更新
    // =========================

    if (
        editingCardId
    ) {

        const index =
            cards.findIndex(
                card =>
                    card.id ===
                    editingCardId
            );


        if (
            index !== -1
        ) {

            cards[index] =
                cardData;

        }

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

    renderCardList();

}


// =========================
// リセット
// =========================

function resetForm() {

    editingCardId = null;

    isTwinpact = false;

    isSpecial = false;

    specialType = null;

    specialMode = null;

    temporarySpecialFaces = [];


    const ids = [

        "cardName",
        "reading",
        "cost",
        "power",
        "race",
        "cardType",
        "ability",

        "bottomCardName",
        "bottomReading",
        "bottomCost",
        "bottomRace",
        "bottomCardType",
        "bottomAbility"

    ];


    ids.forEach(
        id => {

            const element =
                $(id);

            if (!element) {
                return;
            }


            element.value = "";

        }
    );


    $("bottomCardType") &&
        (
            $("bottomCardType").value =
                "呪文"
        );


    setCivilizationButtons(
        "civilizationButtons",
        []
    );


    setCivilizationButtons(
        "bottomCivilizationButtons",
        []
    );


    const specialContainer =
        $("multiFaceInputs");


    if (specialContainer) {

        specialContainer.innerHTML =
            "";

    }


    $("saveButton") &&
        (
            $("saveButton").textContent =
                "保存"
        );


    updateSpecialModeUI();

    updateTwinpactUI();

}


// =========================
// 削除
// =========================

function deleteCard(
    id
) {

    const card =
        cards.find(
            card =>
                card.id ===
                id
        );


    if (!card) {
        return;
    }


    const confirmed =
        confirm(
            `「${card.name || "名前未設定"}」を削除しますか？`
        );


    if (!confirmed) {
        return;
    }


    cards =
        cards.filter(
            card =>
                card.id !== id
        );


    saveCards();

    showListSection();

    renderCardList();

}


// =========================
// 詳細表示
// =========================

function showCardDetail(
    id
) {

    const card =
        cards.find(
            card =>
                card.id ===
                id
        );


    if (!card) {
        return;
    }


    $("createSection")
        ?.classList.add(
            "hidden"
        );

    $("listSection")
        ?.classList.add(
            "hidden"
        );

    $("detailSection")
        ?.classList.remove(
            "hidden"
        );


    const container =
        $("cardDetail");


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        card.name ||
        "名前未設定";


    container.appendChild(
        title
    );


    if (
        card.isSpecial
    ) {

        renderSpecialDetail(
            container,
            card
        );

    } else {

        renderNormalDetail(
            container,
            card
        );

    }


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "detail-actions";


    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";

    editButton.className =
        "small-button";

    editButton.textContent =
        "編集";


    editButton.addEventListener(
        "click",
        () => {

            editCard(
                card.id
            );

        }
    );


    const copyButton =
        document.createElement(
            "button"
        );


    copyButton.type =
        "button";

    copyButton.className =
        "small-button";

    copyButton.textContent =
        "テンプレコピー";


    copyButton.addEventListener(
        "click",
        () => {

            copyTemplate(
                card.id
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";

    deleteButton.className =
        "small-button";

    deleteButton.textContent =
        "削除";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteCard(
                card.id
            );

        }
    );


    actions.appendChild(
        editButton
    );

    actions.appendChild(
        copyButton
    );

    actions.appendChild(
        deleteButton
    );


    container.appendChild(
        actions
    );

}


// =========================
// 通常詳細
// =========================

function renderNormalDetail(
    container,
    card
) {

    const data = {

        "名前":
            card.name,

        "読み方":
            card.reading,

        "文明":
            getCardCivilizations(
                card
            ).join("・"),

        "種族":
            card.race,

        "コスト":
            card.cost,

        "パワー":
            card.power,

        "カードタイプ":
            card.cardType,

        "能力":
            card.ability

    };


    Object.entries(
        data
    ).forEach(
        ([label, value]) => {

            appendDetailRow(
                container,
                label,
                value
            );

        }
    );


    // -------------------------
    // ツインパクト下面
    // -------------------------

    if (
        card.isTwinpact
    ) {

        const heading =
            document.createElement(
                "h4"
            );


        heading.textContent =
            "ツインパクト下面";


        container.appendChild(
            heading
        );


        const bottomData = {

            "名前":
                card.bottomName,

            "読み方":
                card.bottomReading,

            "文明":
                (
                    card.bottomCivilizations ||
                    splitCivilizations(
                        card.bottomCivilization ||
                        ""
                    )
                ).join("・"),

            "種族":
                card.bottomRace,

            "コスト":
                card.bottomCost,

            "カードタイプ":
                card.bottomCardType,

            "能力":
                card.bottomAbility

        };


        Object.entries(
            bottomData
        ).forEach(
            ([label, value]) => {

                appendDetailRow(
                    container,
                    label,
                    value
                );

            }
        );

    }

}


// =========================
// 特殊詳細
// =========================

function renderSpecialDetail(
    container,
    card
) {

    const mode =
        document.createElement(
            "p"
        );


    mode.innerHTML =
        `<strong>モード：</strong> ${
            escapeHTML(
                card.specialType ===
                    "psychic"
                    ? "サイキック"
                    : "ドラグハート"
            )
        }`;


    container.appendChild(
        mode
    );


    if (
        !Array.isArray(
            card.faces
        )
    ) {

        return;

    }


    card.faces.forEach(
        (face, index) => {

            const heading =
                document.createElement(
                    "h4"
                );


            heading.textContent =
                `第${index + 1}面`;


            container.appendChild(
                heading
            );


            const data = {

                "名前":
                    face.name,

                "読み方":
                    face.reading,

                "文明":
                    (
                        face.civilizations ||
                        splitCivilizations(
                            face.civilization ||
                            ""
                        )
                    ).join("・"),

                "種族":
                    face.race,

                "コスト":
                    face.cost,

                "パワー":
                    face.power,

                "カードタイプ":
                    face.cardType,

                "能力":
                    face.ability

            };


            Object.entries(
                data
            ).forEach(
                ([label, value]) => {

                    appendDetailRow(
                        container,
                        label,
                        value
                    );

                }
            );

        }
    );

}


// =========================
// 詳細行
// =========================

function appendDetailRow(
    container,
    label,
    value
) {

    const p =
        document.createElement(
            "p"
        );


    const strong =
        document.createElement(
            "strong"
        );


    strong.textContent =
        `${label}：`;


    p.appendChild(
        strong
    );


    // 能力欄は「能力：」の直後で必ず改行し、
    // 入力時の改行も維持する
    if (
        label === "能力"
    ) {

        const ability =
            String(
                value ?? ""
            ).trim();


        if (!ability) {

            p.appendChild(
                document.createTextNode(
                    "-"
                )
            );

        } else {

            // 「能力：」と最初の能力行を必ず別行にする
            p.appendChild(
                document.createElement(
                    "br"
                )
            );


            const lines =
                ability.split(/\r?\n/);


            lines.forEach(
                (line, index) => {

                    if (index > 0) {

                        p.appendChild(
                            document.createElement(
                                "br"
                            )
                        );

                    }


                    p.appendChild(
                        document.createTextNode(
                            line
                        )
                    );

                }
            );

        }

    } else {

        p.appendChild(
            document.createTextNode(
                String(
                    value ?? ""
                ).trim() || "-"
            )
        );

    }


    container.appendChild(
        p
    );

}


// =========================
// テンプレコピー
// =========================

function formatAbilityForCopy(
    ability
) {

    const value =
        String(
            ability ?? ""
        ).trim();


    return value || "-";

}


function formatCivilizationsForCopy(
    card,
    bottom = false
) {

    const civilizations =
        bottom
            ? (
                Array.isArray(
                    card.bottomCivilizations
                )
                    ? card.bottomCivilizations
                    : splitCivilizations(
                        card.bottomCivilization || ""
                    )
            )
            : (
                Array.isArray(
                    card.civilizations
                )
                    ? card.civilizations
                    : splitCivilizations(
                        card.civilization || ""
                    )
            );


    return (
        civilizations.join("・") || "-"
    );

}


function getDisplayValue(
    value
) {

    return (
        String(
            value ?? ""
        ).trim() || "-"
    );

}


function buildCardCopyText(
    card,
    title = "",
    cardTypeOverride = null
) {

    const lines = [];


    if (title) {

        lines.push(title);

    }


    lines.push(
        `名前：${getDisplayValue(card.name)}`,
        `読み方：${getDisplayValue(card.reading)}`,
        `文明：${formatCivilizationsForCopy(card)}`,
        `種族：${getDisplayValue(card.race)}`,
        `コスト：${getDisplayValue(card.cost)}`,
        `パワー：${getDisplayValue(card.power)}`,
        `カードタイプ：${getDisplayValue(
            cardTypeOverride ?? card.cardType
        )}`,
        `能力：`,
        formatAbilityForCopy(card.ability)
    );


    return lines.join("\n");

}


async function copyTemplate(
    id
) {

    const card =
        cards.find(
            card =>
                card.id ===
                id
        );


    if (!card) {
        return;
    }


    let template = "";


    // =========================
    // ドラグハート / サイキック
    // =========================

    if (
        card.isSpecial
    ) {

        const faces =
            Array.isArray(
                card.faces
            )
                ? card.faces
                : [];


        template =
            faces.map(
                (face, index) =>
                    buildCardCopyText(
                        {
                            name: face.name,
                            reading: face.reading,
                            civilizations: face.civilizations,
                            civilization: face.civilization,
                            race: face.race,
                            cost: face.cost,
                            power: face.power,
                            cardType: face.cardType,
                            ability: face.ability
                        },
                        `【第${index + 1}面】`
                    )
            ).join(
                "\n\n--------------------\n\n"
            );

    }


    // =========================
    // ツインパクト
    // =========================

    else if (
        card.isTwinpact
    ) {

        const top =
            buildCardCopyText(
                {
                    name: card.name,
                    reading: card.reading,
                    civilizations: card.civilizations,
                    civilization: card.civilization,
                    race: card.race,
                    cost: card.cost,
                    power: card.power,
                    cardType: card.cardType,
                    ability: card.ability
                },
                "【上面】"
            );


        const bottom =
            [
                "【下面】",
                `名前：${getDisplayValue(card.bottomName)}`,
                `読み方：${getDisplayValue(card.bottomReading)}`,
                `文明：${formatCivilizationsForCopy(card, true)}`,
                `種族：${getDisplayValue(card.bottomRace)}`,
                `コスト：${getDisplayValue(card.bottomCost)}`,
                `カードタイプ：${getDisplayValue(card.bottomCardType)}`,
                "能力：",
                formatAbilityForCopy(card.bottomAbility)
            ].join("\n");


        template =
            `${top}\n\n--------------------\n\n${bottom}`;

    }


    // =========================
    // 通常
    // =========================

    else {

        template =
            buildCardCopyText(card);

    }


    try {

        await navigator.clipboard.writeText(
            template
        );


        alert(
            "カード情報をコピーしました。"
        );


    } catch (error) {

        console.error(
            "コピー失敗:",
            error
        );


        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            template;


        document.body.appendChild(
            textarea
        );


        textarea.select();


        try {

            document.execCommand(
                "copy"
            );

            alert(
                "カード情報をコピーしました。"
            );

        } catch {

            alert(
                "コピーに失敗しました。"
            );

        }


        textarea.remove();

    }

}


// =========================
// HTMLエスケープ
// =========================

function escapeHTML(
    value
) {

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
