import { CostObserver } from "./CostObserver.js";

export class DataStorage {
  #keyLs = "Costs Observers";
  costsObservers;

  constructor() {
    this.costsObservers = [];
    if (!localStorage.getItem(this.#keyLs)) {
      this.setCostsObservers();
    } else {
      this.receiveSavedCostsObservers();
    }
  }

  setCostsObservers() {
    localStorage.setItem(this.#keyLs, JSON.stringify(this.costsObservers));
  }
  receiveSavedCostsObservers() {
    const data = JSON.parse(localStorage.getItem(this.#keyLs));
    data.map((obj) => {
      const costsObserver = new CostObserver(obj);
      this.costsObservers.push(costsObserver);
    });
    this.setCostsObservers();
  }

  getCostsObserver(costsObserverElement) {
    const costsObserver = this.costsObservers.find(
      (observer) => observer.id === costsObserverElement.dataset.id
    );
    return costsObserver;
  }
  addCostsObserver(costsObserver) {
    this.costsObservers.push(costsObserver);
    this.setCostsObservers();
  }
  removeCostsObserver(costsObserverElement) {
    const index = this.costsObservers.findIndex(
      (observer) => observer.id === costsObserverElement.dataset.id
    );
    this.costsObservers.splice(index, 1);
    this.setCostsObservers();
  }
  removeAllCostsObservers() {
    this.costsObservers = [];
    this.setCostsObservers();
  }
}
