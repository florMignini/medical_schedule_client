/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Abre un Radix Select disparando el trigger con data-testid y selecciona
       * una opción cuyo texto cumpla con el regex dado.
       */
      radixSelectByText(triggerTestId: string, textRegex: RegExp): Chainable<void>;
    }
  }
}

export {};

