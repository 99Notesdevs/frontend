import { api } from "./api/route";

const loadGlobals = async () => {
  try {
    const response = (await api.get(`/admin/ops`)) as {
      success: boolean;
      data: any;
    };
    const data = await response.data;
    const {
      globalHeadScripts,
      globalBodyScripts,
      globalCss,
      practiceQuestions,
    } = data;

    const bodyScripts = globalBodyScripts[0]
      ?.split("||")
      ?.map((script: string) => script.trim());
    const headScripts = globalHeadScripts[0]
      ?.split("||")
      ?.map((script: string) => script.trim());
    localStorage.setItem("practiceQuestions", practiceQuestions);
    console.log(data.data);

    // Add scripts to the head
    if (headScripts && Array.isArray(headScripts)) {
      headScripts.forEach((script) => {
        const scriptElement = document.createElement("script");
        scriptElement.src = script;
        scriptElement.async = true;
        document.head.appendChild(scriptElement);
      });
    }

    // Add scripts to the body
    if (bodyScripts && Array.isArray(bodyScripts)) {
      bodyScripts.forEach((script) => {
        const scriptElement = document.createElement("script");
        scriptElement.src = script;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      });
    }

    const cssVars = Object.entries(JSON.parse(globalCss))
      .map(([key, value]) => `--${key}: ${value};`)
      .join("\n");
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `:root {\n${cssVars}\n}`;
    document.head.appendChild(styleElement);
  } catch (error) {
    console.error("Error loading global scripts:", error);
  }
};

export default loadGlobals;
