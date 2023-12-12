const fs = require('fs');
const path = require('path');
const util = require('util');
const error = require('../lib/error');
const { APPSEC_LOG_DIR } = require('../lib/constants');

const internalOpenappsecLog = {

	/**
	 * All logs
	 *
	 * @param   {Access}  access
	 * @param   {Array}   [expand]
	 * @param   {String}  [search_query]
	 * @returns {Promise}
	 */
	getAllold: (access, expand, search_query) => {
		return access.can('auditlog:list')
			.then(() => {

				const directoryPath = APPSEC_LOG_DIR;
			
				const readdir = util.promisify(fs.readdir);
				const readFile = util.promisify(fs.readFile);

				async function listLogFiles(dir) {
					const files = await readdir(dir);
					const logFiles = files.filter(file => path.extname(file).startsWith('.log'));

					const sortedLogFiles = logFiles.sort((a, b) => {
						const baseA = path.basename(a, path.extname(a));
						const baseB = path.basename(b, path.extname(b));

						if (baseA < baseB) return -1;
						if (baseA > baseB) return 1;

						return path.extname(a).localeCompare(path.extname(b));
					});

					// Group the log files by their base name
					const groupedFiles = sortedLogFiles.reduce((groups, file) => {
						const fileName = path.basename(file, path.extname(file));
						if (!groups[fileName]) {
							groups[fileName] = [];
						}
						groups[fileName].push(file);
						return groups;
					}, {});

					const wrappedObjects = [];

					for (const [groupName, files] of Object.entries(groupedFiles)) {
						for (const file of files) {
							try {
								const content = await readFile(path.join(dir, file), 'utf8');
								const lines = content.split('\n');
								for (const line of lines) {
									try {
										const json = JSON.parse(line);
										const wrappedObject = {
											source: groupName,
											meta: json,
											serviceName: json.eventSource.serviceName,
											eventPriority: json.eventPriority,
											eventSeverity: json.eventSeverity,
											eventLevel: json.eventLevel,
											eventTime: json.eventTime,
											eventName: json.eventName
										};
										wrappedObjects.push(wrappedObject);
									} catch (err) {
										// Ignore lines that don't contain JSON data
									}
								}
							} catch (err) {
								console.error(`Failed to read file ${file}: ${err.message}`);
							}
						}
					}
					wrappedObjects.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));
					return wrappedObjects;
				}

				let groupedFiles = listLogFiles(directoryPath).catch(console.error);
				return groupedFiles;
			});
	},

	countTotalLines: async function (directoryPath) {
		const files = await fs.promises.readdir(directoryPath);
		const logFiles = files.filter(file => path.extname(file).startsWith('.log'));

		let totalLineCount = 0;

		for (const file of logFiles) {
			const filePath = path.join(directoryPath, file);

			// Read only the first line of the file
			const readStream = fs.createReadStream(filePath);
			const rl = readline.createInterface({ input: readStream });
			const firstLine = await new Promise(resolve => {
				rl.on('line', line => {
					rl.close();
					resolve(line);
				});
			});

			// Check if the first line is a non-data line
			try {
				JSON.parse(firstLine);
			} catch (err) {
				continue; // Skip this file if the first line is a non-data line
			}

			// If the first line is a data line, read the rest of the file
			const content = await fs.promises.readFile(filePath, 'utf8');
			const lines = content.split('\n');
			totalLineCount += lines.length;
		}

		return totalLineCount;
	},

	processFile: async function (filePath) {
		const content = await fs.promises.readFile(filePath, 'utf8');
		const lines = content.split('\n');
		const dataLines = [];

		for (const line of lines) {
			try {
				const json = JSON.parse(line);
				const groupName = path.basename(filePath, path.extname(filePath));
				const wrappedObject = {
					source: groupName,
					meta: json,
					serviceName: json.eventSource.serviceName,
					eventPriority: json.eventPriority,
					eventSeverity: json.eventSeverity,
					eventLevel: json.eventLevel,
					eventTime: json.eventTime,
					eventName: json.eventName
				};
				dataLines.push(wrappedObject);
			} catch (err) {
				// Ignore lines that don't contain JSON data
			}
		}

		return dataLines;
	},


	getAll: function (access, expand, search_query) {
		return access.can('auditlog:list')
			.then(async () => {
				const directoryPath = '/app/openappsec_files/logs';
				const files = await fs.promises.readdir(directoryPath);
				const logFiles = files.filter(file => path.extname(file).startsWith('.log'));

				// Sort the logFiles array
				logFiles.sort((a, b) => {
					const baseA = path.basename(a, path.extname(a));
					const baseB = path.basename(b, path.extname(b));
					return baseA.localeCompare(baseB, undefined, { numeric: true, sensitivity: 'base' });
				});

				const wrappedObjects = [];
				for (const file of logFiles) {
					const filePath = path.join(directoryPath, file);
					const dataLines = await this.processFile(filePath);
					wrappedObjects.push(...dataLines);
				}

				return wrappedObjects;
			});
	},


	getPage: function (access, expand, search_query, page, perPage) {
		return access.can('auditlog:list')
			.then(async () => {
				const directoryPath = '/app/openappsec_files/logs';

				let totalDataLines = await this.countTotalLines(directoryPath);
				console.log("totalLineCount: " + totalDataLines);

				const files = await fs.promises.readdir(directoryPath);
				const logFiles = files.filter(file => path.extname(file).startsWith('.log'));

				// Sort the logFiles array
				logFiles.sort((a, b) => {
					const baseA = path.basename(a, path.extname(a));
					const baseB = path.basename(b, path.extname(b));
					return baseA.localeCompare(baseB, undefined, { numeric: true, sensitivity: 'base' });
				});

				const wrappedObjects = [];
				let lineCount = 0;
				let start = (page - 1) * perPage;
				let end = page * perPage;

				for (const file of logFiles) {
					if (lineCount >= end) {
						break;
					}

					const filePath = path.join(directoryPath, file);
					const dataLines = await this.processFile(filePath);
					const pageDataLines = dataLines.slice(start - lineCount, end - lineCount);
					wrappedObjects.push(...pageDataLines);
					lineCount += pageDataLines.length;
				}

				return {
					data: wrappedObjects,
					totalDataLines: totalDataLines,
				};
			});
	},
};

module.exports = internalOpenappsecLog;
