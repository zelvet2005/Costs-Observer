export class CostObserver {
  name;
  frequency;
  limit;
  currency;
  currentBalance;
  updateAfter;
  history;
  id;
  frameColor;

  #maxHistoryLength = 7;

  colors = {
    green: "rgb(72, 222, 12)",
    orange: "orange",
    red: "red",
  };

  constructor({
    name,
    frequency,
    limit,
    currency,
    currentBalance = limit,
    history = [],
    frameColor = this.colors.green,
    id = null,
    updateAfter = null,
  }) {
    this.name = name;
    this.frequency = +frequency;
    this.limit = +limit;
    this.currency = currency;
    this.currentBalance = +currentBalance;
    this.history = history;
    this.frameColor = frameColor;
    this.id = id ?? this.generateId();
    this.updateAfter = this.setUpdateAfter(updateAfter);
  }

  setUpdateAfter(updateAfter) {
    const currTime = new Date().getTime();
    const convertedUpdateAfter = new Date(updateAfter).getTime();

    if (updateAfter === null) {
      return this.computeUpdateAfter();
    } else if (currTime >= convertedUpdateAfter) {
      this.refreshCostsObserver(updateAfter);
      return this.computeUpdateAfter();
    } else {
      return updateAfter;
    }
  }
  refreshCostsObserver(updateAfter) {
    if (this.history.length === this.#maxHistoryLength) {
      this.history.splice(0, 1);
    }

    const startSince = new Date(new Date(updateAfter) - this.frequency);
    const formattedStartSince = startSince.toLocaleDateString("en-US");
    const dateRange = `${formattedStartSince} - ${updateAfter}`;
    const expenditure = `${this.currentBalance} / ${this.limit}`;
    this.history.push({
      dateRange,
      expenditure,
      currency: this.currency,
    });
    this.currentBalance = this.limit;
    this.frameColor = this.colors.green;
  }

  computeUpdateAfter() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.frequency);
    return currentDate.toLocaleDateString("en-US");
  }
  generateId() {
    const randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    return `${this.name}-${randomNumber}`;
  }
  computeFrameColor() {
    const fraction = this.currentBalance / this.limit;
    if (fraction > 0.66) {
      this.frameColor = this.colors.green;
    } else if (fraction > 0.33) {
      this.frameColor = this.colors.orange;
    } else {
      this.frameColor = this.colors.red;
    }
  }

  render() {
    return `
        <div class="costs-observer" data-id="${this.id}">
          <span class="date-label">Update after <i>${this.updateAfter}</i></span>
          <div class="costs-observer-btns-panel">
            <button class="edit-btn">
              <img src="./images/pencil.svg" role="img" alt="pencil" draggable="false" />
            </button>
            <button class="delete-btn">
              <img src="./images/trashbucket.svg" role="img" alt="trash bucket" draggable="false" />
            </button>
          </div>
          <h2>${this.name}</h2>
          <div class="balance-container" style="border-color: ${this.frameColor}">
            <div class="balance-limit">
              <input
                class="balance"
                type="number"
                value="${this.currentBalance}"
                min="0" max="${this.limit}" />
              <b>/</b>
              <input disabled value="${this.limit}" class="limit" />
            </div>
            <span class="currency">${this.currency}</span>
          </div>
          <div class="history-container">
            <button class="history">History</button>
          </div>
        </div>
    `;
  }
  renderEmptyHistory() {
    return `
      <div class="empty-history">
        <p>History is empty</p>
      </div>
    `;
  }
  renderHistory() {
    return `
      <ul class="costs-history">
        ${this.history
          .map((historyObj) => this.renderHistoryElement(historyObj))
          .join("")}
      </ul>
    `;
  }
  renderHistoryElement(historyObj) {
    return `
      <li>
        <time class="history-date">${historyObj.dateRange}</time>
        <span class="history-expenditure">${historyObj.expenditure}</span> 
        <span class="history-currency">${historyObj.currency}</span>
      </li>
    `;
  }
}
