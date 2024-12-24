import { CostObserver } from "./CostObserver.js";

export class DataStorage {
  #keyLs = "Costs Observers";
  costsObservers;

  constructor() {
    this.costsObservers = [];
    if (!localStorage.getItem(this.#keyLs)) {
      this.setCostsObservers();
    } else {
      this.getCostsObservers();
    }
  }

  setCostsObservers() {
    localStorage.setItem(this.#keyLs, JSON.stringify(this.costsObservers));
  }
  getCostsObservers() {
    const data = JSON.parse(localStorage.getItem(this.#keyLs));
    data.map((obj) => {
      const costsObserver = new CostObserver(obj);
      this.costsObservers.push(costsObserver);
    });
  }

  addCostsObserver(costsObserver) {
    this.costsObservers.push(costsObserver);
    this.setCostsObservers();
  }
  removeCostsObserver() {}
  removeAllCostsObservers() {
    this.costsObservers = [];
  }
}
