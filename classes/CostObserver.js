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
    this.updateAfter = updateAfter ?? this.computeUpdateAfter();
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
        <time class="history-date">${historyObj.date}</time>
        <span class="history-expenditure">${historyObj.expenditure}</span> 
        <span class="history-currency">${historyObj.currency}</span>
      </li>
    `;
  }

  computeUpdateAfter() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.frequency);
    return currentDate.toLocaleDateString();
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
}

// 12/04/2024 - 19/04/2024
// 760 / 1000
// $
