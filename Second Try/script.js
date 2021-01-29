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

async function init() {
  let civilizations = null;

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

  async function getCivilizations() {
    const promise = await fetch(ageApi + "/civilizations");
    const data = await promise.json();
    // ignorar
    data.civilizations.forEach((civ) => {
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
    console.log(data);
    return data;
  }

  // async function getUnits() {
  //   const units = await fetch(ageApi + "/units");
  //   return units.json();
  // }

  // async function getStructures() {
  //   const structures = await fetch(ageApi + "/structures");
  //   return structures.json();
  // }

  // async function getTechnologies() {
  //   const technologies = await fetch(ageApi + "/technologies");
  //   return technologies.json();
  // }

  async function getAndSetCivilizations() {
    loading.style.display = "block";
    const response = await getCivilizations();
    civilizations = response.civilizations;
    loading.style.display = "none";
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

  async function showCivInfo(civ) {
    if (civ.unique_tech) {
      const uniTechApi = await fetch(civ.unique_tech);
      const uniTech = await uniTechApi.json();

      const keysToHide = ["id", "develops_in", "applies_to"];

      const list = Object.keys(uniTech)
        .filter((key) => !keysToHide.includes(key))
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

      infoCivUniqueTech.innerHTML = `<ul>
        ${list}
        </ul>
      `;
    }

    infoCivName.innerHTML = civ.name;
    infoCivArmyType.innerHTML = `<strong>Army Type:</strong> ${civ.army_type}`;
    infoCivTeamBonus.innerHTML = `<strong>Team Bonus:</strong> ${civ.team_bonus}`;
    infoCivCivBonus.innerHTML = `<strong>Civilization Bonus:</strong> ${civ.civilization_bonus}`;
    infoCivUniqueUnit.innerHTML = `<strong>Unique Unit: </strong>${civ.unique_unit}`;
  }
}

init();

// {
//   "id": 121,
//   "name": "Yeomen",
//   "description": "Foot archers and skirmishers +1 range +1 line of sight and Towers +2 attack",
//   "expansion": "Age of Kings",
//   "age": "Imperial",
//   "develops_in": "https://age-of-empires-2-api.herokuapp.com/api/v1/structure/castle",
//   "cost": {
//     "Food": 750,
//     "Gold": 450
//   },
//   "build_time": 60,
//   "applies_to": [
//     "https://age-of-empires-2-api.herokuapp.com/api/v1/civilization/britons",
//     "Foot Archer",
//     "https://age-of-empires-2-api.herokuapp.com/api/v1/unit/skirmisher",
//     "Tower"
//   ]
// }
