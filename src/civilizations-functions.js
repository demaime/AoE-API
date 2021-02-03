const ageApi = "https://proxy-civ.vercel.app/proxy";
const civList = document.querySelector(".civ_list");
const infoCivName = document.querySelector(".name_civ");
const infoCivArmyType = document.querySelector(".army_type");
const infoCivTeamBonus = document.querySelector(".team_bonus");
const infoCivCivBonus = document.querySelector(".civ_bonus");
const infoCivUniqueUnit = document.querySelector(".uniq_unit");
const infoCivUniqueTech = document.querySelector(".uniq_tech");
let civilizations = null;
const loading = document.querySelector("#loading");

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

export async function getAndSetCivilizations() {
  loading.style.display = "block";
  const response = await getCivilizations();
  civilizations = response.civilizations;
  loading.style.display = "none";
}

export async function showCivList() {
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
