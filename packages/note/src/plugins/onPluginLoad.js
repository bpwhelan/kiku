/**
 * @import { KikuPlugin } from "#/plugins/pluginTypes";
 */

/**
 * @type { KikuPlugin }
 */
export const plugin = {
  onPluginLoad: ({ ctx }) => {
    const [$config, $setConfig] = ctx.useConfigContext();
    $setConfig("blurNsfw", false);
  },
};
