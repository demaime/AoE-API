const ageApi = "https://proxy-civ.vercel.app/proxy";
const techContainer = document.querySelector(".tech_container");
const techInfo = document.querySelector(".tech_info");

let techs = null;

async function getTechnologies() {
  const promise = await fetch(ageApi + "/technologies");
  const dataTechs = await promise.json();
  return dataTechs;
}

export async function getAndSetTechnologies() {
  const reponse = await getTechnologies();
  techs = reponse.technologies;
}

export function showTechsList(div) {
  for (let i = 0; i < techs.length; i++) {
    const tech = techs[i];
    const div = document.createElement("div");
    div.innerText = tech.name;
    div.classList.add("tech_item");
    div.addEventListener("click", () => showTechsInfo(tech));
    techContainer.appendChild(div);
  }
}

async function showTechsInfo(tech) {
  const keysToHide = ["id", "develops_in", "name", "applies_to"];
  const techList = Object.keys(tech)
    .filter((key) => !keysToHide.includes(key))
    .map((key) => {
      let val = tech[key];
      if (typeof val === "object") {
        val = Object.values(val).join("/"); // 750/45
      }
      return `
            <li class= "capitalize tech_text">
              <strong>${key.replace("_", " ")}: </strong> ${
        val || "<em>No info</em>"
      }
            </li>
          `;
    })
    .join("");

  techInfo.innerHTML = `<span id="title_tech_info">${tech.name}</span><span class="quit_tech">✖</span><ul>
            ${techList}
            </ul>
          `;
  techInfo.style.display = "flex";
  techContainer.style.display = "none";
  const close = document.querySelector(".quit_tech");
  close.addEventListener("click", closeWindow);
}

function closeWindow() {
  techInfo.style.display = "none";
  techContainer.style.display = "grid";
}
