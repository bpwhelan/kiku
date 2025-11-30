/**
 * @import { KikuPlugin } from "#/plugins/pluginTypes";
 */

/**
 * @type { KikuPlugin }
 */
export const plugin = {
  onSettingsMount: ({ ctx }) => {
    sessionStorage.setItem("kiku-settings-mounted", "true");
  },
};
