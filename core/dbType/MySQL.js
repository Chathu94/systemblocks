import path from 'path';
import MySQL from 'dot-mysql';
import * as Blocks from '../class';
const config = require(`${path.dirname(require.main.filename)}/config`);
const debug = require('debug')('SB: MySQL');

export default class sql {

  constructor({ structure, application }) {
    this.structure = structure;
    this.application = application;
    const { type, ...configs } = config.database;
    MySQL.configs = configs;
  }

  async create({ values, disableHooks }) {
    if (!disableHooks) await this.beforeCreateHandler({ query: values });
    console.log(values);
    if (!disableHooks) await this.afterCreateHandler({ query: values, data: {} });
  }

  static initialize() {
    // Check for modal name overlapping
    const modalNames = [];
    Object.keys(_block.modals).map(k => {
      const m = _block.modals[k];
      if (modalNames.indexOf(m.constructor.name) > -1) {
        throw new Blocks.SBError(`Modal name '${m.constructor.name}' is duplicated.`);
      } else {
        modalNames.push(m.constructor.name);
      }
    });
    const createTableQ = Object.keys(_block.modals).map(k => _block.modals[k].generateCreateTable());
    const genQuery = sql => MySQL.execute({ sql });
    return createTableQ.reduce((p, item) => {
      return p.then(() => {
        return genQuery(item).then((r) => {
          return r;
        }).catch(e => debug('Initializing modal error', e));
      });
    }, Promise.resolve());
  }

  generateCreateTable(structure) {
    if (!structure || structure === undefined || structure === null) structure = this.structure;
    const columns = Object.keys(structure).map(key => this.generateColumn(key, structure[key])).join(',\n');
    const keys = Object.keys(structure).filter(key => (structure[key].unique || structure[key].primary || structure[key].type === 'auto')).map(key => `\t${(structure[key].primary || structure[key].type === 'auto') ? 'PRIMARY' : 'UNIQUE'} KEY (\`${key}\`)`).join(',\n');
    return `CREATE TABLE IF NOT EXISTS \`${this.constructor.name}\` (\n${columns}${keys && keys !== '' ? `,\n${keys}` : ''}\n) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
  }

  generateColumn(key, data) {
    if (!/^[A-Za-z0-9][A-Za-z0-9_]*$/i.test(key)) {
      throw new SBError('Column name must match (/^[A-Za-z0-9][A-Za-z0-9_]*$/).');
    }
    const dataTypes = {
      "string": data.max && data.max > 255 ? "TEXT" : `VARCHAR(${data.max || 255})`,
      "number": data.decimalPlaces ? `DECIMAL(${data.max ? data.max + data.decimalPlaces : data.decimalPlaces}, ${data.decimalPlaces})` : data.max < 127 ? `TINYINT(${data.max})` : data.max < 32767 ? `SMALLINT(${data.max})` : data.max < 8388607 ? `MEDIUMINT(${data.max})` : `BIGINT${data.max ? `(${data.max})` : ''}`,
      "date": "DATE",
      "time": "TIME",
      "datetime": "DATETIME"
    };
    return `\t\`${key}\` ${data.type === 'auto' ? 'INTEGER(11)' : dataTypes[data.type]}${data.type === 'auto' ? ' AUTO_INCREMENT' : ''} ${data.required ? 'NOT NULL' : 'NULL'}`;
  }
}
