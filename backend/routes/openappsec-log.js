import express from "express";
import internalOpenappsecLog from "../internal/openappsec-log.js";
import jwtdecode from "../lib/express/jwt-decode.js";

const router = express.Router({
	caseSensitive: true,
	strict: true,
	mergeParams: true,
});

/**
 * /api/openappsec-log
 */
router
	.route("/")
	.options((_, res) => {
		res.sendStatus(204);
	})
	.all(jwtdecode())

	/**
	 * GET /api/openappsec-log
	 *
	 * Retrieve all logs
	 */
	.get((req, res, next) => {
		return internalOpenappsecLog.getAll(res.locals.access)
			.then((policy) => {
				res.status(200).send(policy);
			})
			.catch(next);
	});

export default router;
