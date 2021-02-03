const ageApi = "https://proxy-civ.vercel.app/proxy";
const unitsList = document.querySelector(".units_list");
const unitsInfo = document.querySelector(".units_info");

let units = null;

async function getUnits() {
  const promise = await fetch(ageApi + "/units");
  const dataUnits = await promise.json();
  return dataUnits;
}

export async function getAndSetUnits() {
  const reponse = await getUnits();
  units = reponse.units;
}

export function showUnitsList(div) {
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const div = document.createElement("div");
    div.innerText = unit.name;
    div.classList.add("units_item");
    div.addEventListener("mouseover", () => showUnitsInfo(unit));
    unitsList.appendChild(div);
  }
}

async function showUnitsInfo(unit) {
  const keysToHide = ["id", "created_in", "name"];
  const listUnit = Object.keys(unit)
    .filter((key) => !keysToHide.includes(key))
    .map((key) => {
      let val = unit[key];
      if (typeof val === "object") {
        val = Object.values(val).join("/"); // 750/45
      }
      return `
          <li class= "capitalize unit_text">
            <strong>${key.replace("_", " ")}: </strong> ${
        val || "<em>No info</em>"
      }
          </li>
        `;
    })
    .join("");

  unitsInfo.innerHTML = `<span id="title_units_info">${unit.name}</span><ul>
        ${listUnit}
        </ul>
      `;
}
