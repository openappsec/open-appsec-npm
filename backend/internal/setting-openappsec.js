import fs from "node:fs";
import path from "node:path";
import constants from "../lib/constants.js";
import errs from "../lib/error.js";
import { nginx as logger } from "../logger.js";

const internalOpenappsecSetting = {
	configFilePath: path.join(constants.APPSEC_EXT_DIR, constants.APPSEC_CONFIG_FILE_NAME),

	/**
	 * @param  {Access}   access
	 * @return {Promise}
	 */
	getLocalPolicy: (access) => {
		return access.can("settings:list")
			.then(() => {
				try {
					const filePath = internalOpenappsecSetting.configFilePath;
					if (!fs.existsSync(filePath)) {
						return;
					}
					const fileContent = fs.readFileSync(filePath, "utf8");
					const jsonStr = JSON.stringify(fileContent);
					return jsonStr;

				} catch (err) {
					logger.error(err);
				}
			});
	},

	/**
	 * @param  {Access}   access
	 * @param  {Object}   data
	 * @return {Promise}
	 */
	updateLocalPolicy: (access, data) => {
		return access.can("settings:list")
			.then(() => {
				const filePath = internalOpenappsecSetting.configFilePath;
				const yamlStr = data.local_policy;
				fs.writeFileSync(filePath, yamlStr, { encoding: "utf8" });
				return true;
			})
			.catch((err) => {
				logger.error(err);
				throw new errs.ConfigurationError(err.message);
			});
	}
};

export default internalOpenappsecSetting;
