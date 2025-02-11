import { DataStorage } from "./DataStorage.js";
import { CostObserver } from "./CostObserver.js";

const costsObserversContainer = document.querySelector(
  ".costs-observers-container"
);

const addObserverBtn = document.querySelector(".add-btn");
const deleteAllObserversBtn = document.querySelector(".delete-all-btn");
const alphabetSortBtn = document.querySelector(".alphabet-sort-btn");
const descSortBtn = document.querySelector(".desc-sort-btn");
const ascSortBtn = document.querySelector(".asc-sort-btn");

const manageObserverDialog = document.querySelector(".manage-observer-dialog");
const manageDialogCloseBtn = manageObserverDialog.querySelector(".close-btn");
const form = manageObserverDialog.querySelector(".manage-form");
const nameInput = document.querySelector("#name");
const frequencyInput = document.querySelector("#frequency");
const limitInput = document.querySelector("#limit");
const currencyOption = document.querySelector("#currency");

const historyDialog = document.querySelector(".history-dialog");
const historyDialogCloseBtn = historyDialog.querySelector(".close-btn");

class App {
  dataStorage;

  #eventListeners = [];

  constructor() {
    this.dataStorage = new DataStorage();
    this.updateUI();

    addObserverBtn.addEventListener(
      "click",
      this.addCostsObserverHandler.bind(this)
    );
    deleteAllObserversBtn.addEventListener(
      "click",
      this.deleteAllCostsObserversHandler.bind(this)
    );
    alphabetSortBtn.addEventListener(
      "click",
      this.alphabetSortCostsObserversHandler.bind(this)
    );
    descSortBtn.addEventListener(
      "click",
      this.descSortCostsObserversHandler.bind(this)
    );
    ascSortBtn.addEventListener(
      "click",
      this.ascSortCostsObserversHandler.bind(this)
    );

    costsObserversContainer.addEventListener(
      "click",
      this.deleteCostsObserverHandler.bind(this)
    );
    costsObserversContainer.addEventListener(
      "click",
      this.changeInfoHanlder.bind(this)
    );
    costsObserversContainer.addEventListener(
      "change",
      this.changeCurrentBalanceHandler.bind(this)
    );
    costsObserversContainer.addEventListener(
      "click",
      this.checkCostsHistoryHandler.bind(this)
    );
  }

  fillEventListeners(...handlers) {
    handlers.forEach((handler) => {
      this.#eventListeners.push(handler);
    });
  }
  clearEventListeners() {
    this.#eventListeners.forEach((handler) => {
      const { element, type, name } = handler;
      element.removeEventListener(type, name);
    });
    this.#eventListeners = [];
  }

  updateUI() {
    costsObserversContainer.innerHTML = "";
    this.dataStorage.costsObservers?.map((costsObserver) =>
      costsObserversContainer.insertAdjacentHTML(
        "beforeend",
        costsObserver.render()
      )
    );
  }

  alphabetSortCostsObserversHandler() {
    this.sortCostsObserver((a, b) => a.name.localeCompare(b.name));
  }
  ascSortCostsObserversHandler() {
    this.sortCostsObserver(
      (a, b) =>
        this.convertToHryvnia(a.currentBalance, a.currency) -
        this.convertToHryvnia(b.currentBalance, b.currency)
    );
  }
  descSortCostsObserversHandler() {
    this.sortCostsObserver(
      (a, b) =>
        this.convertToHryvnia(b.currentBalance, b.currency) -
        this.convertToHryvnia(a.currentBalance, a.currency)
    );
  }
  sortCostsObserver(sortFunc) {
    this.dataStorage.costsObservers.sort(sortFunc);
    this.updateUI();
    this.dataStorage.setCostsObservers();
  }
  convertToHryvnia(sum, currencyType) {
    switch (currencyType) {
      case "$":
        return sum * 42;
      case "€":
        return sum * 43;
      case "¥":
        return sum * 0.3;
      case "£":
        return sum * 52;
      default:
        return sum;
    }
  }

  deleteAllCostsObserversHandler() {
    this.dataStorage.removeAllCostsObservers();
    this.updateUI();
  }

  addCostsObserverHandler() {
    manageObserverDialog.showModal();

    const boundCloseDialogHandler = this.closeManageDialogHandler.bind(this);
    const boundSaveInfoHandler = this.saveInfoHandler.bind(this);

    manageDialogCloseBtn.addEventListener("click", boundCloseDialogHandler);
    form.addEventListener("submit", boundSaveInfoHandler);

    this.fillEventListeners(
      {
        element: manageDialogCloseBtn,
        type: "click",
        name: boundCloseDialogHandler,
      },
      {
        element: form,
        type: "submit",
        name: boundSaveInfoHandler,
      }
    );
  }
  saveInfoHandler(event) {
    event.preventDefault();

    const name = nameInput.value;
    const frequency = frequencyInput.value;
    const limit = limitInput.value;
    const currency = currencyOption.value;
    const costsObserver = new CostObserver({
      name,
      frequency,
      limit,
      currency,
    });

    costsObserversContainer.insertAdjacentHTML(
      "beforeend",
      costsObserver.render()
    );
    this.dataStorage.addCostsObserver(costsObserver);

    this.clearForm();
    this.clearEventListeners();
    manageObserverDialog.close();
  }

  changeInfoHanlder(event) {
    if (
      event.target.classList.contains("edit-btn") ||
      event.target.parentElement.classList.contains("edit-btn")
    ) {
      const costsObserverElement = event.target.closest(".costs-observer");
      const costsObserver =
        this.dataStorage.getCostsObserver(costsObserverElement);

      nameInput.value = costsObserver.name;
      frequencyInput.value = costsObserver.frequency;
      limitInput.value = costsObserver.limit;
      currencyOption.value = costsObserver.currency;
      manageObserverDialog.showModal();

      const boundCloseDialogHandler = this.closeManageDialogHandler.bind(this);
      const boundEditObserverHandler = this.editObserverHandler.bind(
        this,
        costsObserver
      );

      manageDialogCloseBtn.addEventListener("click", boundCloseDialogHandler);
      form.addEventListener("submit", boundEditObserverHandler);

      this.fillEventListeners(
        {
          element: manageDialogCloseBtn,
          type: "click",
          name: boundCloseDialogHandler,
        },
        {
          element: form,
          type: "submit",
          name: boundEditObserverHandler,
        }
      );
    }
  }
  editObserverHandler(costsObserver, event) {
    event.preventDefault();

    costsObserver.name = nameInput.value;
    costsObserver.currency = currencyOption.value;
    if (costsObserver.limit !== +limitInput.value) {
      costsObserver.limit = +limitInput.value;
      if (costsObserver.currentBalance > costsObserver.limit) {
        costsObserver.currentBalance = costsObserver.limit;
      }
      costsObserver.computeFrameColor();
    }
    if (costsObserver.frequency !== +frequencyInput.value) {
      costsObserver.frequency = +frequencyInput.value;
      costsObserver.updateAfter = costsObserver.computeUpdateAfter();
    }

    this.updateUI();
    this.dataStorage.setCostsObservers();

    this.clearForm();
    this.clearEventListeners();
    manageObserverDialog.close();
  }

  closeManageDialogHandler() {
    this.clearForm();
    this.clearEventListeners();
    manageObserverDialog.close();
  }
  clearForm() {
    nameInput.value = "";
    frequencyInput.value = "";
    limitInput.value = "";
    currencyOption.value = "₴";
  }

  deleteCostsObserverHandler(event) {
    if (
      event.target.classList.contains("delete-btn") ||
      event.target.parentElement.classList.contains("delete-btn")
    ) {
      const costsObserverElement = event.target.closest(".costs-observer");
      this.dataStorage.removeCostsObserver(costsObserverElement);
      this.updateUI();
    }
  }

  changeCurrentBalanceHandler(event) {
    const costsObserverElement = event.target.closest(".costs-observer");
    const balanceInput = costsObserverElement.querySelector(".balance");
    const costsObserver =
      this.dataStorage.getCostsObserver(costsObserverElement);
    const updatedBalance = +event.target.value;

    if (updatedBalance < 0) {
      costsObserver.currentBalance = 0;
      balanceInput.value = 0;
    } else if (updatedBalance <= costsObserver.limit) {
      costsObserver.currentBalance = updatedBalance;
    } else {
      costsObserver.currentBalance = costsObserver.limit;
      balanceInput.value = costsObserver.limit;
    }

    costsObserver.computeFrameColor();
    this.dataStorage.setCostsObservers();

    balanceInput.addEventListener("blur", this.updateUI.bind(this), {
      once: true,
    });
  }

  checkCostsHistoryHandler(event) {
    if (event.target.classList.contains("history")) {
      historyDialog.showModal();

      historyDialogCloseBtn.addEventListener(
        "click",
        this.closeHistoryDialogHandler,
        { once: true }
      );

      const costsObserverElement = event.target.closest(".costs-observer");
      const costsObserver =
        this.dataStorage.getCostsObserver(costsObserverElement);

      if (costsObserver.history.length > 0) {
        historyDialog.insertAdjacentHTML(
          "beforeend",
          costsObserver.renderHistory()
        );
      } else {
        historyDialog.insertAdjacentHTML(
          "beforeend",
          costsObserver.renderEmptyHistory()
        );
      }
    }
  }
  closeHistoryDialogHandler() {
    historyDialog.close();
    historyDialog.lastElementChild.remove();
  }
}

const app = new App();
