const ageApi = "https://proxy-civ.vercel.app/proxy";
const structuresList = document.querySelector(".structures_container");
let structures = null;

async function getStructures() {
  const promise = await fetch(ageApi + "/structures");
  const dataStruc = await promise.json();
  return dataStruc;
}

export async function getAndSetStructures() {
  const response = await getStructures();
  structures = response.structures;
}

export function showStructuresList() {
  for (let i = 0; i < structures.length; i++) {
    const structure = structures[i];
    const structureName = document.createElement("div");
    const structureInfo = document.createElement("div");
    structureName.innerText = structure.name;
    const keysToHide = ["id", "name"];
    structureInfo.innerHTML = Object.keys(structure)
      .filter((key) => !keysToHide.includes(key))
      .map((key) => {
        let val = structure[key];
        if (typeof val === "object") {
          val = Object.values(val).join("/");
        }
        return `
        <li class= "capitalize structure_text">
          <strong>${key.replace("_", " ")}: </strong> ${
          val || "<em>No info</em>"
        }
        </li>
      `;
      })
      .join("");
    structureName.classList.add("structure_item");
    structureInfo.classList.add("structure_info");
    structureInfo.classList.add("hidden");
    structureName.addEventListener("click", () =>
      showStructuresInfo(structureInfo)
    );
    structuresList.appendChild(structureName);
    structureName.appendChild(structureInfo);
  }
}
async function showStructuresInfo(structureInfo) {
  const notShown = [...document.querySelectorAll(".structure_info")];
  notShown.forEach((struc) => struc.classList.add("hidden"));
  structureInfo.classList.remove("hidden");
}
