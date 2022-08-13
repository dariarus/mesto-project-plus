class CardOwnerError extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 403;
  }

  static get DEFAULT_MESSAGE() {
    return 'Нельзя удалять чужие карточки';
  }

  constructor(message = CardOwnerError.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = CardOwnerError.DEFAULT_STATUS_CODE;
  }
}

export default CardOwnerError;
