import { env } from '@/config/env';

const loadGlobals = async () => {
  try {
    const response = await fetch(`${env.API}/admin/ops`);
    const data = await response.json();
    const { globalHeadScripts, globalBodyScripts } = data.data;

    const bodyScripts = globalBodyScripts[0]?.split('||')?.map((script: string) => script.trim());
    const headScripts = globalHeadScripts[0]?.split('||')?.map((script: string) => script.trim());
    console.log('Head Scripts:', headScripts);

    // Add scripts to the head
    if (headScripts && Array.isArray(headScripts)) {
      headScripts.forEach((script) => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        scriptElement.async = true;
        document.head.appendChild(scriptElement);
      });
    }

    // Add scripts to the body
    if (bodyScripts && Array.isArray(bodyScripts)) {
      bodyScripts.forEach((script) => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      });
    }
  } catch (error) {
    console.error('Error loading global scripts:', error);
  }
};

export default loadGlobals;