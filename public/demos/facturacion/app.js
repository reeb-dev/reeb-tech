(function () {
  const examples = seed();

  function byType(type) {
    return examples.find((item) => item.type === type && item.cae) || examples.find((item) => item.type === type);
  }

  const hero = document.getElementById("heroStack");
  if (hero) {
    const stack = ["Factura A", "Factura B", "Nota de crédito"]
      .map((type) => byType(type))
      .filter(Boolean);
    hero.innerHTML = stack.map((item, index) => `
      <div class="stack-item stack-${index}">${renderComprobante(item, { compact: true })}</div>
    `).join("");
  }

  const tabs = document.getElementById("typeTabs");
  const stage = document.getElementById("typeStage");
  let currentType = "Factura A";

  function renderType() {
    const item = byType(currentType);
    if (!item || !stage) return;
    const copy = {
      "Factura A": "Para responsable inscripto. Muestra neto e IVA 21%. Código 01.",
      "Factura B": "Para consumidor final o monotributo. IVA incluido. Código 06.",
      "Nota de crédito": "Anula o descuenta un comprobante anterior. Código 03."
    };
    stage.innerHTML = `
      <div class="type-copy">
        <p class="kicker">${esc(item.type)}</p>
        <h3>${esc(item.receptor)}</h3>
        <p>${esc(copy[item.type] || "")}</p>
        <ul>
          <li>CUIT ${esc(item.cuit)}</li>
          <li>${esc(item.ivaCond)}</li>
          <li>Vence ${esc(formatDue(item.due))}</li>
          <li>CAE ${esc(item.cae || "pendiente")}</li>
        </ul>
        <a class="btn" href="panel.html">Editar en el libro</a>
      </div>
      ${renderComprobante(item)}
    `;
  }

  if (tabs) {
    tabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        currentType = button.dataset.type;
        tabs.querySelectorAll("button").forEach((node) => node.classList.toggle("on", node === button));
        renderType();
      });
    });
    renderType();
  }

  const dueList = document.getElementById("dueList");
  if (dueList) {
    const dueItems = examples
      .filter((item) => item.due && item.status !== "cobrado")
      .sort((a, b) => String(a.due).localeCompare(String(b.due)));
    dueList.innerHTML = dueItems.map((item) => `
      <article class="due-card ${isOverdue(item) ? "late" : ""}">
        <p class="due-when">${isOverdue(item) ? "Vencido" : "Vence"} ${esc(formatDue(item.due))}</p>
        <h3>${esc(item.type)} ${esc(item.number)}</h3>
        <p>${esc(item.receptor)}</p>
        <p class="num">${esc(money(item.amount))}</p>
        <p class="due-note">${esc(item.aviso)}</p>
      </article>
    `).join("");
  }

  const arca = document.getElementById("arcaCard");
  if (arca) {
    const issued = examples.find((item) => item.cae && item.type === "Factura A") || examples.find((item) => item.cae);
    if (issued) arca.innerHTML = renderComprobante(issued);
  }

  const preview = document.getElementById("preview");
  if (preview) {
    preview.innerHTML = examples.map((item) => `
      <tr class="${isOverdue(item) ? "late" : ""}">
        <td>${esc(item.type)}</td>
        <td class="num">${esc(item.number)}</td>
        <td>${esc(item.receptor)}</td>
        <td class="num">${esc(item.cuit)}</td>
        <td class="amount">${esc(money(item.amount))}</td>
        <td>${esc(formatDue(item.due))}</td>
        <td class="num">${esc(item.cae || "—")}</td>
        <td><span class="state ${esc(item.status)}">${esc(label(item.status))}</span></td>
      </tr>
    `).join("");
  }
})();
