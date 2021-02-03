import { getAndSetCivilizations } from "./civilizations-functions.js";
import { showCivList } from "./civilizations-functions.js";
import { getAndSetUnits } from "./units-functions.js";
import { showUnitsList } from "./units-functions.js";
import { getAndSetStructures } from "./structures-functions.js";
import { showStructuresList } from "./structures-functions.js";
import { getAndSetTechnologies } from "./technologies-functions.js";
import { showTechsList } from "./technologies-functions.js";

const panels = Array.from(document.querySelectorAll(".panel"));
const barItems = Array.from(document.querySelectorAll(".bar_item"));

async function init() {
  barItems.forEach((itemClickeado) => {
    const dataitem = itemClickeado.dataset.item;
    itemClickeado.addEventListener("click", () => {
      panels.forEach((panel) => {
        if (panel.classList.contains(dataitem)) {
          panel.classList.add("open");
        } else {
          panel.classList.remove("open");
        }
      });
    });
  });

  await getAndSetCivilizations();
  showCivList();
  await getAndSetUnits();
  showUnitsList();
  await getAndSetStructures();
  showStructuresList();
  await getAndSetTechnologies();
  showTechsList();
}

init();
