import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";

/**
 * Helper para Radix Select: abre el trigger por testid, y elige opción por texto.
 * Normaliza espacios/acentos por si el texto está dividido en nodos.
 */
Cypress.Commands.add("radixSelectByText", (triggerTestId: string, textRegex: RegExp) => {
  cy.findByTestId(triggerTestId).click();

  // listbox del Radix Select
  cy.findByRole("listbox").within(() => {
    // Buscar opciones y matchear por textContent normalizado
    cy.get("[role='option']").then($options => {
      const opt = Array.from($options).find(el => {
        const content = (el.textContent || "").replace(/\s+/g, " ").trim();
        return textRegex.test(content);
      });
      expect(opt, "Opción buscada exista").to.exist;
      cy.wrap(opt!).click();
    });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Selecciona una opción en Radix Select buscando por texto dentro del contenido de la opción.
       * @param triggerTestId data-testid en el SelectTrigger (ej: "patient-select")
       * @param textRegex regex para el texto (ej: /mar[ií]a.*fern[aá]ndez/i)
       */
      radixSelectByText(triggerTestId: string, textRegex: RegExp): Chainable<void>;
    }
  }
}
