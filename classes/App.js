import { DataStorage } from "./DataStorage.js";
import { CostObserver } from "./CostObserver.js";

const costsObserversContainer = document.querySelector(
  ".costs-observers-container"
);

const addObserverBtn = document.querySelector(".add-btn");
const deleteAllObserversBtn = document.querySelector(".delete-all-btn");

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

  clearForm() {
    nameInput.value = "";
    frequencyInput.value = "";
    limitInput.value = "";
    currencyOption.value = "₴";
  }

  deleteAllCostsObserversHandler() {
    this.dataStorage.removeAllCostsObservers();
    this.dataStorage.setCostsObservers();
    this.updateUI();
  }

  alphabetSortCostsObserversHandler() {}
  descSortCostsObserversHandler() {}
  ascSortCostsObserversHandler() {}

  deleteCostsObserverHandler() {}

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
    const costsObserver = new CostObserver(name, frequency, limit, currency);

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
}

const app = new App();
