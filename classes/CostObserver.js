export class CostObserver {
  name;
  frequency;
  limit;
  currency;
  currentBalance;
  updateAfter;
  history;
  id;

  constructor({
    name,
    frequency,
    limit,
    currency,
    id,
    currentBalance = limit,
    history = [],
    updateAfter = null,
  }) {
    this.name = name;
    this.frequency = +frequency;
    this.limit = +limit;
    this.currency = currency;
    this.id = id;
    this.currentBalance = +currentBalance;
    this.history = history;
    this.updateAfter = updateAfter ?? this.computeUpdateAfter();
  }

  render() {
    return `
        <div class="costs-observer" data-id="${this.id}">
          <span class="date-label">Update after <i>${this.updateAfter}</i></span>
          <div class="costs-observer-btns-panel">
            <button class="delete-btn">
              <img src="./images/trashbucket.svg" role="img" alt="trash bucket" draggable="false" />
            </button>
            <button class="edit-btn">
              <img src="./images/pencil.svg" role="img" alt="pencil" draggable="false" />
            </button>
          </div>
          <h2>${this.name}</h2>
          <div class="balance-container">
            <div class="balance-limit">
              <input
                class="balance"
                type="number"
                value="${this.currentBalance}"
                min="1" max="99999" />
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

  computeUpdateAfter() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.frequency);
    return currentDate.toLocaleDateString();
  }

  changeCurrentBalanceHandler() {}
  checkCostsHistoryHandler() {}
  changeInfoHanlder() {}
}
