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
  closeManageDialogHandler() {
    this.clearForm();
    this.clearEventListeners();
    manageObserverDialog.close();
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
  changeInfoHanlder() {}
}

const app = new App();
