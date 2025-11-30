/**
 * @import { KikuPlugin } from "#/plugins/pluginTypes";
 */

/**
 * @type { KikuPlugin }
 */
export const plugin = {
  onSettingsMount: () => {
    sessionStorage.setItem("settings-mounted", "true");
  },
};
