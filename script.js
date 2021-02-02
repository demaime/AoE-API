const panels = Array.from(document.querySelectorAll(".panel"));
const barItems = Array.from(document.querySelectorAll(".bar_item"));
const civList = document.querySelector(".civ_list");
const ageApi = "https://proxy-civ.vercel.app/proxy";
const infoCivName = document.querySelector(".name_civ");
const infoCivArmyType = document.querySelector(".army_type");
const infoCivTeamBonus = document.querySelector(".team_bonus");
const infoCivCivBonus = document.querySelector(".civ_bonus");
const infoCivUniqueUnit = document.querySelector(".uniq_unit");
const infoCivUniqueTech = document.querySelector(".uniq_tech");
const loading = document.querySelector("#loading");
const unitsList = document.querySelector(".units_list");
const unitsInfo = document.querySelector(".units_info");
const structuresList = document.querySelector(".structures_container");

async function init() {
  let civilizations = null;
  let units = null;
  let structures = null;

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

  async function getCivilizations() {
    const promise = await fetch(ageApi + "/civilizations");
    const dataCivs = await promise.json();
    // ignorar
    dataCivs.civilizations.forEach((civ) => {
      civ.unique_unit = civ.unique_unit[0]
        ? civ.unique_unit[0].replace(
            "https://age-of-empires-2-api.herokuapp.com/api/v1",
            ageApi
          )
        : null;

      civ.unique_tech = civ.unique_tech[0]
        ? civ.unique_tech[0].replace(
            "https://age-of-empires-2-api.herokuapp.com/api/v1",
            ageApi
          )
        : null;
    });
    return dataCivs;
  }

  async function getUnits() {
    const promise = await fetch(ageApi + "/units");
    const dataUnits = await promise.json();
    return dataUnits;
  }

  async function getStructures() {
    const promise = await fetch(ageApi + "/structures");
    const dataStruc = await promise.json();
    return dataStruc;
  }

  async function getAndSetCivilizations() {
    loading.style.display = "block";
    const response = await getCivilizations();
    civilizations = response.civilizations;
    loading.style.display = "none";
  }

  async function getAndSetUnits() {
    const reponse = await getUnits();
    units = reponse.units;
  }

  async function getAndSetStructures() {
    const response = await getStructures();
    structures = response.structures;
  }

  async function showCivList() {
    for (let i = 0; i < civilizations.length; i++) {
      const civ = civilizations[i];
      let li = document.createElement("li");
      li.classList.add("civLi");
      li.innerText = civ.name;
      li.addEventListener("click", () => showCivInfo(civ));
      civList.appendChild(li);
    }
  }
  function showUnitsList(div) {
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const div = document.createElement("div");
      div.innerText = unit.name;
      div.classList.add("units_item");
      div.addEventListener("mouseover", () => showUnitsInfo(unit));
      unitsList.appendChild(div);
    }
  }

  function showStructuresList() {
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

  // async function getTechnologies() {
  //   const technologies = await fetch(ageApi + "/technologies");
  //   return technologies.json();
  // }

  async function showCivInfo(civ) {
    if (civ.unique_tech) {
      const uniTechApi = await fetch(civ.unique_tech);
      const uniTech = await uniTechApi.json();

      const keysToHideTech = ["id", "develops_in", "applies_to"];

      const listTech = Object.keys(uniTech)
        .filter((key) => !keysToHideTech.includes(key))
        .map((key) => {
          let val = uniTech[key];
          if (typeof val === "object") {
            val = Object.values(val).join("/"); // 750/450,
          }
          return `
          <li class= "capitalize">
            <strong>${key.replace("_", " ")}: </strong> ${
            val || "<em>No info</em>"
          }
          </li>
        `;
        })
        .join("");

      infoCivUniqueTech.innerHTML = `<strong>Unique Tecnology:</strong><ul>
        ${listTech}
        </ul>
      `;
    } else {
      infoCivUniqueTech.innerHTML = `<em>No info<em>`;
    }
    if (civ.unique_unit) {
      const uniUnitApi = await fetch(civ.unique_unit);
      const uniUnit = await uniUnitApi.json();

      const keysToHideUnit = ["id", "created_in", "applies_to"];

      const listUnit = Object.keys(uniUnit)
        .filter((key) => !keysToHideUnit.includes(key))
        .map((key) => {
          let val = uniUnit[key];
          if (typeof val === "object") {
            val = Object.values(val).join("/"); // 750/45
          }
          return `
          <li class= "capitalize">
            <strong>${key.replace("_", " ")}: </strong> ${
            val || "<em>No info</em>"
          }
          </li>
        `;
        })
        .join("");

      infoCivUniqueUnit.innerHTML = `<strong>Unique Unit:</strong><ul>
        ${listUnit}
        </ul>
      `;
    } else {
      infoCivUniqueUnit.innerHTML = `<em>No info<em>`;
    }
    infoCivName.innerHTML = civ.name;
    infoCivArmyType.innerHTML = `<strong>Army Type:</strong> ${civ.army_type}`;
    infoCivTeamBonus.innerHTML = `<strong>Team Bonus:</strong> ${civ.team_bonus}`;
    infoCivCivBonus.innerHTML = `<strong>Civilization Bonus:</strong> ${civ.civilization_bonus}`;
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
  async function showStructuresInfo(structureInfo) {
    const notShown = [...document.querySelectorAll(".structure_info")];
    notShown.forEach((struc) => struc.classList.add("hidden"));
    structureInfo.classList.remove("hidden");
  }
}

init();
