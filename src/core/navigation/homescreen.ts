export const HOMESCREEN_CUBED_KEY = "myndos.sidebar.homescreenCubed.v1";

export const getHomescreenCubed = () => {
  try {
    return JSON.parse(localStorage.getItem(HOMESCREEN_CUBED_KEY) || "false") === true;
  } catch {
    return false;
  }
};

export const setHomescreenCubed = (value: boolean) => {
  try {
    localStorage.setItem(HOMESCREEN_CUBED_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent("homescreen-cubed-change", { detail: { value } }));
};
