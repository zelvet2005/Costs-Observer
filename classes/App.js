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

    this.boundCloseDialogHandler = this.closeManageDialogHandler.bind(this);
    this.boundSaveInfoHandler = this.saveInfoHandler.bind(this);
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
    this.dataStorage.costsObservers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.updateUI();
    this.dataStorage.setCostsObservers();
  }
  ascSortCostsObserversHandler() {
    this.dataStorage.costsObservers.sort(
      (a, b) =>
        this.convertToHryvnia(a.currentBalance, a.currency) -
        this.convertToHryvnia(b.currentBalance, b.currency)
    );
    this.updateUI();
    this.dataStorage.setCostsObservers();
  }
  descSortCostsObserversHandler() {
    this.dataStorage.costsObservers.sort(
      (a, b) =>
        this.convertToHryvnia(b.currentBalance, b.currency) -
        this.convertToHryvnia(a.currentBalance, a.currency)
    );
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
    this.dataStorage.setCostsObservers();
    this.updateUI();
  }

  addCostsObserverHandler() {
    manageObserverDialog.showModal();
    manageDialogCloseBtn.addEventListener(
      "click",
      this.boundCloseDialogHandler,
      { once: true }
    );
    form.addEventListener("submit", this.boundSaveInfoHandler, { once: true });
  }
  closeManageDialogHandler() {
    this.clearForm();
    form.removeEventListener("submit", this.boundSaveInfoHandler);
    manageObserverDialog.close();
  }
  saveInfoHandler(event) {
    event.preventDefault();

    const name = nameInput.value;
    const frequency = frequencyInput.value;
    const limit = limitInput.value;
    const currency = currencyOption.value;
    const id = `${name}-${this.dataStorage.costsObservers.length}`;
    const costsObserver = new CostObserver({
      name,
      frequency,
      limit,
      currency,
      id,
    });

    costsObserversContainer.insertAdjacentHTML(
      "beforeend",
      costsObserver.render()
    );
    this.dataStorage.addCostsObserver(costsObserver);

    this.clearForm();
    manageDialogCloseBtn.removeEventListener(
      "click",
      this.boundCloseDialogHandler
    );
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
      const costsObserver = event.target.closest(".costs-observer");
      const index = this.dataStorage.costsObservers.findIndex(
        (observer) => observer.id === costsObserver.dataset.id
      );
      this.dataStorage.costsObservers.splice(index, 1);
      this.updateUI();
      this.dataStorage.setCostsObservers();
    }
  }
  changeInfoHanlder() {}
}

const app = new App();
