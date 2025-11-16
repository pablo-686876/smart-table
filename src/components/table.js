import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
  before.reverse().forEach((row) => {
    root[row] = cloneTemplate(row);
    root.container.prepend(root[row].container);
  });
  after.forEach((row) => {
    root[row] = cloneTemplate(row);
    root.container.append(root[row].container);
  });

  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener("change", () => onAction());
  root.container.addEventListener("reset", () => setTimeout(onAction));
  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        const element = row.elements[key];
        if (
          key in row.elements &&
          element.tagName !== "SELECT" &&
          element.tagName !== "INPUT"
        ) {
          element.textContent = item[key];
        } else if (
          key in row.elements &&
          (element.tagName === "SELECT" || element.tagName === "INPUT")
        ) {
          element.value = item[key];
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
