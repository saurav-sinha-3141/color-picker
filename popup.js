const button = document.querySelector(".pick-color-btn");
const colorGrid = document.querySelector(".color-grid");
const colorValue = document.querySelector(".color-value");

button.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      if (data.result) {
        const color = data.result.sRGBHex;
        colorGrid.style.backgroundColor = color;
        colorValue.innerText = color;

        try {
          await navigator.clipboard.writeText(color);
        } catch (error) {
          console.error(error);
        }
      }
    }
  );
});

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (error) {
    console.error(error);
  }
}
