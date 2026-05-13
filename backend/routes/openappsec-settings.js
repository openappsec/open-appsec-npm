import express from "express";
import internalOpenappsecSetting from "../internal/setting-openappsec.js";
import jwtdecode from "../lib/express/jwt-decode.js";

const router = express.Router({
	caseSensitive: true,
	strict: true,
	mergeParams: true,
});

/**
 * /api/openappsec-settings
 */
router
	.route("/")
	.options((_, res) => {
		res.sendStatus(204);
	})
	.all(jwtdecode())

	/**
	 * GET /api/openappsec-settings
	 *
	 * Retrieve the open-appsec local policy.
	 */
	.get((req, res, next) => {
		return internalOpenappsecSetting.getLocalPolicy(res.locals.access)
			.then((policy) => {
				res.status(200).send(policy);
			})
			.catch(next);
	})

	/**
	 * PUT /api/openappsec-settings
	 *
	 * Update the open-appsec local policy.
	 */
	.put((req, res, next) => {
		return internalOpenappsecSetting.updateLocalPolicy(res.locals.access, req.body)
			.then((result) => {
				res.status(200).send(result);
			})
			.catch(next);
	});

export default router;
