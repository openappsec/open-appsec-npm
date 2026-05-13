import { migrate as logger } from "../logger.js";

const migrateName = "open_appsec";

/**
 * Migrate
 *
 * @see http://knexjs.org/#Schema
 *
 * @param   {Object} knex
 * @returns {Promise}
 */
const up = function (knex) {
    logger.info(`[${migrateName}] Migrating Up...`);

    return knex.schema
        .alterTable('proxy_host', (table) => {
            table.boolean('use_openappsec').notNull().defaultTo(false);
            table.string('minimum_confidence').notNull().defaultTo('high');
            table.string('openappsec_mode').notNull().defaultTo('detect-learn');
        })
        .then(() => {
            logger.info(`[${migrateName}] proxy_host Table altered`);
        });
};

/**
 * Undo Migrate
 *
 * @param   {Object} knex
 * @returns {Promise}
 */
const down = function (knex) {
    logger.info(`[${migrateName}] Migrating Down...`);

    return knex.schema
        .alterTable('proxy_host', (table) => {
            table.dropColumn('use_openappsec');
            table.dropColumn('minimum_confidence');
            table.dropColumn('openappsec_mode');
        })
        .then(() => {
            logger.info(`[${migrateName}] proxy_host Table altered`);
        });
};

export { up, down };
